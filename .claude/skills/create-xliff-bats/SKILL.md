---
description: Create a bats test file for an existing webOS XLIFF shell script. Use when the user asks to write, add, or regenerate tests for an xliff_* script.
argument-hint: [script-path-or-name]
disable-model-invocation: true
allowed-tools: Bash Read Write Edit
---

Create a bats test file for an existing webOS XLIFF shell script following the patterns in `scripts/loctool-script-patterns.md`.

**Core concept:** the script under test is a **directory-level wrapper** around a
**file-level** loctool command — it walks a `<projectId>/<locale>.xliff` tree and
reassembles an output tree. So happy-path tests must supply a **directory of testfiles**
(not a single file) and assert on the **output tree structure** (e.g.
`output/modified/appA/ko-KR.xliff`), not just one output file.

## Steps

1. **Identify the target script.** If `$ARGUMENTS` is given, resolve it to the `.sh` file path. Otherwise ask the user.

2. **Read the script** to extract:
   - All CLI options (required / optional, short and long forms, `--opt=value` variants)
   - Mutually exclusive option pairs
   - Presence of `--dry-run` or similar flags
   - Expected input directory structure (flat `.xliff` or `<projectId>/<locale>.xliff`)
   - Expected output structure

3. **Read the reference document** at `scripts/loctool-script-patterns.md` (§5 bats Test Structure) for exact helper function implementations.

4. **Generate the bats file** (`test-<script-name>.bats`, hyphenated — underscore is legacy) in the same directory as the script, covering ALL eight categories in order:

   ```
   # ── Happy path ────────────────────────────────────────────────────────────────
   # ── Option formats ────────────────────────────────────────────────────────────
   # ── Help ──────────────────────────────────────────────────────────────────────
   # ── Missing required options ──────────────────────────────────────────────────
   # ── Missing option values ─────────────────────────────────────────────────────
   # ── Invalid input ─────────────────────────────────────────────────────────────
   # ── Special cases (mutual exclusion, --dry-run, etc.) ─────────────────────────
   ```

   Rules:
   - File header: `# test-<script-name>.bats - Tests for <script-name>.sh` on line after shebang
   - Set `SCRIPT_DIR="$(cd "$(dirname "$BATS_TEST_FILENAME")" && pwd)"`; all file and
     directory references use `SCRIPT_DIR`-based absolute paths (never relative `./`)
   - `setup()` and `teardown()` both run `rm -rf "${OUTPUT_DIR_BASE}"* 2>/dev/null || true`
     where `OUTPUT_DIR_BASE="$SCRIPT_DIR/output_"`
   - Include all three helper functions (`check_file_exists`, `check_diff` with `sed -e '$a\'`, `check_status`)
   - Each missing-required-option test asserts `[ "$status" -ne 0 ]` AND `[[ "$output" =~ "--option-name" ]]`
   - **Missing option values** (regression for the infinite-loop / `set -u` unbound
     bug): flag as last arg (`--from`), flag-as-value (`--from --to ./x`), empty
     equals (`--from=`). Each asserts `[ "$status" -ne 0 ]` AND
     `[[ "$output" =~ "requires a valid value" ]]`
   - Each invalid-directory test creates a temp dir under `/tmp/bats_*`, runs the script, then removes it
   - Happy path tests use `$SCRIPT_DIR/testfiles/Expected/` as the golden output

5. **Report what testfiles need to be created** under `testfiles/` and `testfiles/Expected/` so the happy path tests will pass, but do NOT create the testfiles — list them for the user to prepare.
