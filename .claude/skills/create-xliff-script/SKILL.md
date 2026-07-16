---
description: Create a new loctool-based webOS XLIFF shell script from the established patterns. Use when the user asks to write, create, or scaffold a new xliff_* script that wraps loctool commands.
argument-hint: [script-name]
disable-model-invocation: true
allowed-tools: Bash Read Write Edit
---

Create a new loctool-based webOS XLIFF shell script following the patterns in `scripts/loctool-script-patterns.md`.

**Core concept:** loctool commands operate on **individual files**. These scripts are
**directory-level wrappers** — they walk a tree of `<projectId>/<locale>.xliff` files,
call the file-level loctool command once per file (or per matched set), and reassemble
the results into an output tree. The loctool call is the inner step; the file traversal
and output-tree assembly are what the script adds.

## Steps

1. **Determine the script name and target directory.** If `$ARGUMENTS` is given, use it as the script name. Otherwise ask the user. The script goes under `scripts/<script-name>/`.

2. **Gather requirements by asking the user:**
   - Which loctool command does this script wrap? (`merge`, `compare`, `select`, `split`, or combination)
   - What are the required CLI options (name, short form, description)?
   - Are any options mutually exclusive?
   - Does the script need `--dry-run` support?
   - Standard discovery is 2-tier (npm standalone → pnpm workspace). Only add the
     dev-only sibling ilib-mono `elif` when actively testing local loctool source
     (never committed).

3. **Read the reference document** at `scripts/loctool-script-patterns.md` for the exact code patterns to use.

4. **Generate the script file** (`<script-name>.sh`) applying ALL of the following:
   - File header: `# <filename> - <one-line description>` on line after shebang
   - `set -euo pipefail` immediately after the header
   - `show_help()` / `usage()` function with "Options support both formats: --option value, --option=value, and short forms"
   - No-args → `show_help; exit 0`
   - `--help` / `-h` → `show_help; exit 0`
   - `require_value()` helper (rejects empty and flag-like `-`-prefixed values)
   - `while [ "$#" -gt 0 ]` case statement with all four formats per option; every
     value-taking option calls `require_value` before consuming its value. Space form
     passes `"${2:-}"` (safe under `set -u`); equals form guards with `${1%%=*}`.
     This closes the infinite-loop / `unbound variable` bug when a value is missing,
     and rejects flag-as-value (`--from --to ./x`).
   - Individual validation for each required option (error message includes option name)
   - Directory existence check → `.xliff` file existence check (in that order); keep
     `find … | grep -q .` **inside `if !`** so `set -e` doesn't abort on no-match
   - Mutual exclusion validation if applicable
   - `SCRIPT_DIR` + loctool discovery (2-tier: npm standalone → pnpm workspace). The
     sibling ilib-mono dev path is a dev-only `elif` — add it only when testing local
     loctool source; do NOT commit it.
   - `XLIFF_STYLE=(-2 --xliffStyle webOS)`
   - `run_loctool()` abstraction; check its exit status where a temp dir needs cleanup
     (`if ! run_loctool …; then rm -rf "$TEMP_DIR"; exit 1; fi`)
   - Clear script-owned output subdirs before the run (`rm -rf "$OUT/modified" …`),
     never `rm -rf` the whole output dir
   - Exit code 0 for success/help, 1 for all errors

5. **After writing the script**, suggest running `/create-xliff-bats <script-name>` to generate the companion bats test file.
