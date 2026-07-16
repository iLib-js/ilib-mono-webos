# webOS XLIFF Script Patterns

This document captures the common patterns applied across `xliff_compare`, `xliff_delete_units`, and `xliff_split_merge`. Use it as a reference when writing new loctool-based scripts. It is self-contained — everything needed to write a new script is here.

---

## 1. loctool Core Commands

loctool is the localization CLI tool from the iLib-js project. Commands used in webOS scripts:

> **Key concept — these scripts are directory-level wrappers around file-level loctool commands.**
> Every loctool command below operates on **individual XLIFF files** (its arguments are
> file paths, not directories). The scripts in this repo exist precisely to add the
> **directory dimension**: they walk a tree of `<projectId>/<locale>.xliff` files, invoke
> the file-level loctool command once per file (or per matched set), and reassemble the
> results into an output tree. When writing a new script, the loctool call is the inner
> step; the surrounding file traversal (§6) and output-tree assembly are what the script
> contributes.

| Command | loctool operates on | Script applies it over | Used in |
|---------|--------------------|------------------------|---------|
| `merge <output> <file1> <file2> ...` | N input files → 1 output file | files grouped by locale / rel-path across a dir tree | xliff_split_merge (merge, merge_language), xliff_select_merge |
| `compare <from> <to> <outdir>` | 2 files → modified/added/deleted.xliff | every `<rel-path>.xliff` present in the from/to trees | xliff_compare |
| `select <criteria> <input> <output>` | 1 file (keep only matches) | each `.xliff` under each projectId dir | xliff_select_merge |
| `select <criteria> <input> <output> --prune` | 1 file (remove matches) | each `.xliff` under each projectId dir | xliff_delete_units |
| `split project <file> --target <outdir>` | 1 merged file → per-project files | each flat `.xliff` in the input dir | xliff_split_merge (split_component) |

### webOS XLIFF Style Flags

Always append to every loctool invocation:

```bash
XLIFF_STYLE=(-2 --xliffStyle webOS)
# Usage: run_loctool merge "$OUTPUT" "${INPUTS[@]}" "${XLIFF_STYLE[@]}"
```

- `-2`: XLIFF 2.x format
- `--xliffStyle webOS`: preserve webOS platform-specific extension attributes

---

## 2. loctool Discovery Pattern

The path to loctool differs depending on the runtime environment (npm standalone install vs. pnpm workspace). Abstract it behind a `run_loctool()` function so the rest of the script is path-agnostic.

### Standard: 2-tier discovery

All scripts use the same 2-tier discovery: npm standalone install first, then pnpm
workspace. The sibling ilib-mono dev path is **not** included in the shipped scripts —
it is a dev-only convenience (see the note below).

```bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ -f "$SCRIPT_DIR/node_modules/.bin/loctool" ]; then
    # 1. npm standalone install
    LOCTOOL_BIN="$SCRIPT_DIR/node_modules/.bin/loctool"
    run_loctool() { "$LOCTOOL_BIN" "$@"; }
    echo "LOCTOOL: $LOCTOOL_BIN"
else
    # 2. pnpm workspace (search in .pnpm cache)
    LOCTOOL_JS=$(find "$SCRIPT_DIR/../../node_modules/.pnpm" -type f -path "*/loctool.js" | grep "/loctool@" | head -n 1)
    if [ -z "$LOCTOOL_JS" ] || [ ! -f "$LOCTOOL_JS" ]; then
        echo "Error: loctool not found. Please run pnpm install from the repo root."
        exit 1
    fi
    run_loctool() { node "$LOCTOOL_JS" "$@"; }
    echo "LOCTOOL: $LOCTOOL_JS"
fi
```

> **Dev-only: sibling ilib-mono path.** When actively modifying loctool itself and
> testing against the local source, temporarily add an `elif` branch pointing at the
> sibling checkout, between the two branches above. Do **not** commit this — it is a
> local convenience only.
>
> ```bash
> elif [ -f "$SCRIPT_DIR/../../../ilib-mono/packages/loctool/loctool.js" ]; then
>     # sibling ilib-mono dev environment (relative to loctool_utils/ root)
>     LOCTOOL_JS="$SCRIPT_DIR/../../../ilib-mono/packages/loctool/loctool.js"
>     run_loctool() { node "$LOCTOOL_JS" "$@"; }
>     echo "LOCTOOL (dev/local): $LOCTOOL_JS"
> ```

---

## 3. webOS XLIFF Directory Structure

```
<baseDir>/
  <projectId>/            # one directory per app / component
    ko-KR.xliff
    en-US.xliff
    af-ZA.xliff
    und.xliff             # language-unspecified (skip in most operations)
    ...
```

Expected input layout per command:

| Command | Input layout | Notes |
|---------|-------------|-------|
| `merge` | `<baseDir>/<projectId>/<locale>.xliff` | both `current` and `input` dirs use the same layout |
| `merge_language` | `<baseDir>/<projectId>/<locale>.xliff` | merges across apps into one file per locale |
| `select` (delete-units) | `<baseDir>/<projectId>/<locale>.xliff` | criteria matched per projectId |
| `select + merge` (select_merge) | inputPath: `<sourceApp>/<locale>.xliff`, mergeTarget: `<targetApp>/<locale>.xliff` | cross-app: source ≠ target, matched by locale filename |
| `split project` | `<baseDir>/<locale>.xliff` (flat) | re-splits merge_language output back by project |
| `compare` | `<baseDir>/<projectId>/<locale>.xliff` | `from` and `to` dirs share the same layout |

---

## 4. Shell CLI Design Patterns

The CLI conventions applied across all loctool scripts.

### File Header and Strict Mode

Line immediately after the shebang, then enable strict mode:

```bash
#!/bin/bash
# xliff-delete-units.sh - Delete translation units from webOS XLIFF files using loctool select criteria

set -euo pipefail
```

- `-e`: exit on any unhandled command failure (stops silent partial output when
  `mkdir`/`cp`/`mv` fails after the validation phase).
- `-u`: error on unset variables. **Requires** the `require_value` guard below —
  otherwise a missing option value hits a bare `$2` reference and crashes with a
  raw `unbound variable` message instead of a clear error.
- `pipefail`: a pipeline fails if **any** stage fails, not just the last.

Strict-mode compatibility notes (verified across all scripts):

- `find … | grep -q .` existence checks are safe **only inside `if !`** — that
  condition context is exempt from `-e`. Do not use a bare `grep -q` outside a
  conditional.
- `LOCTOOL_JS=$(find … | grep … | head -n 1)`: with `pipefail`, no match makes
  the command substitution exit non-zero, but the following `[ -z "$LOCTOOL_JS" ]`
  check still catches it (assignment sets the empty string first).
- Array expansion `"${ARR[@]}"` is safe under `-u` on bash 4.4+.
- Glob loops `for f in "$DIR"/*.xliff` that don't match yield the literal pattern;
  guard the body with `[ -f "$f" ]`.

### `show_help()` / `usage()` Function

Always define as a function and call it from both "no args" and `--help`/`-h`:

```bash
show_help() {
    echo "Usage: $0 --from <FROM_DIR> --to <TO_DIR> --output <OUTPUT_DIR>"
    echo ""
    echo "Options support both formats: --option value, --option=value, and short forms"
    echo ""
    echo "Options:"
    echo "  --from, -f <DIR>    ..."
    echo ""
    echo "Example:"
    echo "  $0 --from ./v1 --to ./v2 --output ./changes"
}

if [ "$#" -lt 1 ]; then show_help; exit 0; fi
```

### Argument Parsing

Support all four formats. **Every value-taking option must validate its value
with `require_value` before consuming it** — this closes two bugs at once:

- **Infinite loop**: when a space-form flag is the last argument (`--from` with no
  value), `shift 2` is a no-op — only one positional remains — so `$1` stays
  unchanged and the same `case` re-matches forever. Under `set -u` this surfaces
  as an `unbound variable` crash instead, which is why the guard is mandatory.
- **Flag-as-value**: `--from --to ./x` would otherwise assign `FROM_DIR=--to`.

```bash
# Reject empty or flag-like ("-" prefixed) values.
#   $1 = flag name (for the error message)   $2 = value to check
require_value() {
    if [ -z "$2" ] || [ "${2#-}" != "$2" ]; then
        echo "Error: $1 requires a valid value." >&2
        exit 1
    fi
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --from|-f)        require_value "$1" "${2:-}"; FROM_DIR="${2%/}"; shift 2 ;;
    --from=*|-f=*)    FROM_DIR="${1#*=}"; require_value "${1%%=*}" "$FROM_DIR"; FROM_DIR="${FROM_DIR%/}"; shift ;;
    --help|-h)        show_help; exit 0 ;;
    *)  echo "Error: Unknown option '$1'"; echo "Use --help for usage information."; exit 1 ;;
  esac
done
```

- Space form: pass `"${2:-}"` (not `"$2"`) so `set -u` doesn't crash before the
  guard runs; `require_value`'s `-z` check catches the missing value.
- Equals form: read `${1#*=}` first, then guard with the flag name `${1%%=*}`.
  This also rejects `--from=` (empty) and `--from=-x` (flag-like).

### Required Option Validation

Validate each option **individually** so the error message names the missing option:

```bash
if [ -z "$FROM_DIR" ]; then echo "Error: --from option is required."; exit 1; fi
if [ -z "$TO_DIR" ];   then echo "Error: --to option is required.";   exit 1; fi
```

### Directory + XLIFF File Existence Check

Order: directory exists → `.xliff` files exist

```bash
if [ ! -d "$FROM_DIR" ]; then
    echo "Error: FROM_DIR not found: $FROM_DIR"; exit 1
fi
if ! find "$FROM_DIR" -type f -name "*.xliff" | grep -q .; then
    echo "Error: FROM_DIR has no .xliff files: $FROM_DIR"; exit 1
fi
```

### Mutually Exclusive Options

For options where exactly one must be specified (e.g., `--criteria` vs `--criteriaFile`):

```bash
if [ -n "$CRITERIA" ] && [ -n "$CRITERIA_FILE" ]; then
    echo "Error: --criteria and --criteriaFile are mutually exclusive. Specify only one."
    exit 1
fi
if [ -z "$CRITERIA" ] && [ -z "$CRITERIA_FILE" ]; then
    echo "Error: One of --criteria or --criteriaFile must be specified."
    exit 1
fi
```

### Output Message Conventions

| Situation | Format |
|-----------|--------|
| Error | `Error: <message>` → stdout, exit 1 |
| Info | `[INFO] <message>` |
| Warning | `[WARN] <message>` |
| Dry-run | `[DRY] <command>` |
| Debug | `[DEBUG] <message>` |

Exit codes: success = `0`, all errors = `1`.

---

## 5. bats Test Structure

### File Header and Lifecycle Hooks

```bash
#!/usr/bin/env bats
# test-xliff-compare.bats - Tests for xliff-compare.sh

SCRIPT_DIR="$(cd "$(dirname "$BATS_TEST_FILENAME")" && pwd)"

setup()    { rm -rf "$SCRIPT_DIR"/output_* 2>/dev/null || true; }
teardown() { rm -rf "$SCRIPT_DIR"/output_* 2>/dev/null || true; }
```

### Path Convention

All file and directory references in bats tests must be **`SCRIPT_DIR`-based absolute paths**, not relative paths. This ensures tests produce consistent results regardless of the working directory from which `bats` is invoked.

```bash
# ✅ SCRIPT_DIR-based paths
run "$SCRIPT_DIR/xliff-compare.sh" --from "$SCRIPT_DIR/testfiles/from" --to "$SCRIPT_DIR/testfiles/to"
check_diff "compare" "$SCRIPT_DIR/testfiles/Expected/output/modified.xliff" "$SCRIPT_DIR/output_compare/modified.xliff"

# ❌ Relative paths — breaks when bats is run from a different directory
run ./xliff-compare.sh --from ./testfiles/from --to ./testfiles/to
```

### Three Helper Functions

```bash
check_file_exists() {
  local test_name="$1" filepath="$2"
  if [ ! -f "$filepath" ]; then
    echo "❌ $test_name -- Error: File not found -> $filepath"; return 1
  fi
}

# sed -e '$a\' appends a newline to both files before diff,
# silencing false failures from "\ No newline at end of file" differences.
check_diff() {
  local test_name="$1" file1="$2" file2="$3"
  run diff <(sed -e '$a\' "$file1") <(sed -e '$a\' "$file2")
  if [ "$status" -ne 0 ]; then
    echo "❌ $test_name -- Error: diff failed between $file1 and $file2"; echo "$output"
  fi
  [ "$status" -eq 0 ]
}

check_status() {
  local test_name="$1" status="$2"
  if [ "$status" -ne 0 ]; then
    echo "❌ Error: Failed to run ./script.sh $test_name ..."; echo "$output"
  fi
  [ "$status" -eq 0 ]
}
```

### Test Categories (recommended order)

```bash
# ── Happy path ────────────────────────────────────────────────────────────────
@test "Test - script.sh <command>" { ... }

# ── Option formats ────────────────────────────────────────────────────────────
@test "Test - equals format (--opt=value)" { ... }
@test "Test - short options (-f -t -o)" { ... }

# ── Help ──────────────────────────────────────────────────────────────────────
@test "Test - no arguments shows help and exits 0" {
  run ./script.sh; [ "$status" -eq 0 ]; [[ "$output" =~ "Usage:" ]]
}
@test "Test - --help shows help and exits 0" { ... }
@test "Test - -h shows help and exits 0" { ... }

# ── Missing required options ──────────────────────────────────────────────────
@test "Test - missing --from exits non-zero" {
  run ./script.sh --to ./dir --output ./out
  [ "$status" -ne 0 ]; [[ "$output" =~ "--from" ]]
}

# ── Invalid input ─────────────────────────────────────────────────────────────
@test "Test - non-existent FROM_DIR exits non-zero" { ... }
@test "Test - FROM_DIR with no .xliff files exits non-zero" {
  mkdir -p /tmp/bats_empty
  run ./script.sh --from /tmp/bats_empty ...
  rmdir /tmp/bats_empty
  [ "$status" -ne 0 ]; [[ "$output" =~ ".xliff" ]]
}
@test "Test - unknown option exits non-zero" {
  run ./script.sh ... --unknown
  [ "$status" -ne 0 ]; [[ "$output" =~ "Unknown" ]]
}

# ── Missing option values ─────────────────────────────────────────────────────
# Regression guards for the infinite-loop / set -u unbound-variable bug.
@test "Test - --from as last argument exits non-zero (no hang / no crash)" {
  run ./script.sh --from
  [ "$status" -ne 0 ]; [[ "$output" =~ "requires a valid value" ]]
}
@test "Test - flag immediately followed by another flag exits non-zero" {
  run ./script.sh --from --to ./x
  [ "$status" -ne 0 ]; [[ "$output" =~ "requires a valid value" ]]
}
@test "Test - empty equals value exits non-zero" {
  run ./script.sh --from=
  [ "$status" -ne 0 ]; [[ "$output" =~ "requires a valid value" ]]
}

# ── Special cases ─────────────────────────────────────────────────────────────
@test "Test - mutual exclusion exits non-zero" { ... }
@test "Test - --dry-run does not modify files" { ... }
```

### Expected Testfile Layout

```
testfiles/
  from/                    # input samples
    appA/ko-KR.xliff
  to/
    appA/ko-KR.xliff
  Expected/                # golden output (used by check_diff)
    output_compare/
      modified/appA/ko-KR.xliff
      added/appA/ko-KR.xliff
      deleted/appA/ko-KR.xliff
```

---

## 6. File Traversal and Temp Directory Patterns

### File Traversal (avoid subshell)

```bash
# ❌ Pipe: while loop runs in a subshell — variables not shared with parent
find "$DIR" -type f -name "*.xliff" | while read -r FILE; do ...

# ✅ Process substitution: runs in the current shell
while IFS= read -r FILE; do
    ...
done < <(find "$DIR" -type f -name "*.xliff" | sort)
```

### Extract Relative Path

```bash
REL_PATH="${FILE#$BASE_DIR/}"   # /base/appA/ko-KR.xliff → appA/ko-KR.xliff
```

### Clear Stale Output Before a Run

The output directory is not cleared automatically, so results from a previous run
(e.g. `deleted/appB/…` for an app since removed from both inputs) leak into the new
output. Clear **only the script-owned category subdirectories** — never `rm -rf`
the whole `OUTPUT_DIR`, which may be a user-supplied path with unrelated content.

```bash
rm -rf "$OUTPUT_DIR/modified" "$OUTPUT_DIR/added" "$OUTPUT_DIR/deleted"
mkdir -p "$OUTPUT_DIR"
```

### Fail Fast on loctool Errors

Even with `set -e`, wrap `run_loctool` in an explicit check when a temp dir needs
cleanup — a silently-skipped file otherwise looks like success:

```bash
if ! run_loctool compare "$FROM_FILE" "$TO_FILE" "$TEMP_DIR" "${XLIFF_STYLE[@]}"; then
    echo "Error: loctool compare failed for $REL_PATH" >&2
    rm -rf "$TEMP_DIR"
    exit 1
fi
```

### Temporary Directory

```bash
TEMP_DIR=$(mktemp -d)
# ... processing ...
rm -rf "$TEMP_DIR"
```

Copy-then-process-in-place pattern (used in xliff_delete_units):

```bash
TEMP_DIR=$(mktemp -d "$SCRIPT_DIR/tmp_xliff_delete.XXXXXXXX")
TEMP_INPUT_DIR="$TEMP_DIR/input"
mkdir -p "$TEMP_INPUT_DIR"
cp -r "$INPUT_PATH"/* "$TEMP_INPUT_DIR"
# ... run loctool in-place on TEMP_INPUT_DIR ...
cp -r "$TEMP_INPUT_DIR" "$OUTPUT_PATH"
rm -rf "$TEMP_DIR"
```

### Cross-app Metadata Rewrite (used in xliff_select_merge)

When merging units from one app into another, loctool uses `<file original>` and `<group name>`
to determine file/group identity. Without rewriting, units appear as a separate `<file>` section
instead of being added to the target's existing group.

```bash
# Extract target app's metadata
TARGET_ORIGINAL=$(grep -oP '(?<=original=")[^"]*' "$TARGET_FILE" | head -1)
TARGET_GROUP_NAME=$(grep -oP '<group [^>]*name="\K[^"]*' "$TARGET_FILE" | head -1)

# Rewrite selected file to match target
sed -i "s/original=\"[^\"]*\"/original=\"$TARGET_ORIGINAL\"/g" "$SELECTED_FILE"
sed -i "s/\(<group [^>]*name=\"\)[^\"]*/\1$TARGET_GROUP_NAME/" "$SELECTED_FILE"
```

### Absolute Path Conversion

```bash
DIR_ABS=$(realpath "$DIR")
# or
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
```

---

## 7. Naming Conventions

- **sh / bats filenames**: prefer hyphens (`-`) over underscores (`_`)
  - `xliff-compare.sh`, `test-xliff-compare.bats` ✅
  - `xliff_compare.sh`, `test_xliff_compare.bats` ❌ (legacy — don't introduce new ones)

---

## 8. Checklist for New Scripts

- [ ] Filename uses hyphens (e.g., `xliff-compare.sh`, `test-xliff-compare.bats`)
- [ ] File header: `# <filename> - <one-line description>` on the line after the shebang
- [ ] `set -euo pipefail` immediately after the header
- [ ] Define `show_help()` / `usage()` function
- [ ] No arguments → print help and exit 0
- [ ] `--help` / `-h` → print help and exit 0
- [ ] Argument parsing: support `--opt value`, `--opt=value`, `-o value`, `-o=value`
- [ ] Define `require_value()` and call it in every value-taking option (guards the
      infinite-loop / `set -u` unbound-variable bug and flag-as-value)
- [ ] Validate each required option individually (include option name in error message)
- [ ] Check directory exists, then check `.xliff` files exist
- [ ] If mutually exclusive options exist, validate both directions
- [ ] Set `SCRIPT_DIR` and discover loctool (2-tier: npm standalone → pnpm workspace)
- [ ] Define `XLIFF_STYLE=(-2 --xliffStyle webOS)`
- [ ] Abstract loctool invocation behind `run_loctool()`; check its exit status where
      a temp dir needs cleanup (`if ! run_loctool …`)
- [ ] Clear script-owned output subdirs before the run (never `rm -rf` the whole `OUTPUT_DIR`)
- [ ] bats tests use `SCRIPT_DIR`-based absolute paths (no relative `./` paths)
- [ ] Write bats tests covering all 7 categories above (incl. missing option values)
- [ ] Prepare `testfiles/Expected/` with golden output files
- [ ] Clean up `output_*` in `setup()` and `teardown()`
