#!/usr/bin/env bats

# test-xliff-compare.bats - Tests for xliff-compare.sh

# Setup function to prepare test environment
setup() {
  SCRIPT_DIR="$(cd "$(dirname "$BATS_TEST_FILENAME")" && pwd)"
  XLIFF_COMPARE_SH="$SCRIPT_DIR/xliff-compare.sh"
  TESTFILES_DIR="$SCRIPT_DIR/testfiles"
  OUTPUT_DIR_BASE="$SCRIPT_DIR/output_"
  rm -rf ${OUTPUT_DIR_BASE}* 2>/dev/null || true
}

# Cleanup function to remove test artifacts
teardown() {
  rm -rf ${OUTPUT_DIR_BASE}* 2>/dev/null || true
}

check_file_exists() {
  local test_name="$1"
  local filepath="$2"

  if [ ! -f "$filepath" ]; then
    echo "❌ $test_name -- Error: File not found -> $filepath"
    return 1
  fi
}

# Define a helper function to check_diff and print output on failure
# Both files are normalized to always end with a newline before comparison
# to avoid false failures caused by "\ No newline at end of file" differences.
check_diff() {
  local test_name="$1"
  local file1="$2"
  local file2="$3"

  run diff <(sed -e '$a\' "$file1") <(sed -e '$a\' "$file2")
  if [ "$status" -ne 0 ]; then
    echo "❌ $test_name -- Error: diff failed between $file1 and $file2"
    echo "$output"
  fi
  [ "$status" -eq 0 ]
}

check_status() {
  local test_name="$1"
  local status="$2"
  if [ "$status" -ne 0 ]; then
    echo "❌ Error: Failed to run "$XLIFF_COMPARE_SH" $test_name ..."
    echo "$output"
  fi
  [ "$status" -eq 0 ]
}

# ── Happy path ────────────────────────────────────────────────────────────────

@test "Test - xliff-compare.sh basic compare" {
  local test_name="basic_compare"

  run "$XLIFF_COMPARE_SH" --from "$TESTFILES_DIR/webos_from.xliff" --to "$TESTFILES_DIR/webos_to.xliff" --output "${OUTPUT_DIR_BASE}compare"

  check_status $test_name $status
  check_file_exists $test_name "${OUTPUT_DIR_BASE}compare/modified.xliff"
  check_diff $test_name "${OUTPUT_DIR_BASE}compare/modified.xliff" "$TESTFILES_DIR/Expected/modified.xliff"
}

@test "Test - xliff-compare.sh with added units" {
  local test_name="with_added"

  run "$XLIFF_COMPARE_SH" --from "$TESTFILES_DIR/webos_from.xliff" --to "$TESTFILES_DIR/webos_to.xliff" --output "${OUTPUT_DIR_BASE}compare_added"

  check_status $test_name $status
  check_file_exists $test_name "${OUTPUT_DIR_BASE}compare_added/added.xliff"
  check_diff $test_name "${OUTPUT_DIR_BASE}compare_added/added.xliff" "$TESTFILES_DIR/Expected/added.xliff"
}

@test "Test - xliff-compare.sh with deleted units" {
  local test_name="with_deleted"

  run "$XLIFF_COMPARE_SH" --from "$TESTFILES_DIR/webos_from.xliff" --to "$TESTFILES_DIR/webos_to.xliff" --output "${OUTPUT_DIR_BASE}compare_deleted"

  check_status $test_name $status
  check_file_exists $test_name "${OUTPUT_DIR_BASE}compare_deleted/deleted.xliff"
  check_diff $test_name "${OUTPUT_DIR_BASE}compare_deleted/deleted.xliff" "$TESTFILES_DIR/Expected/deleted.xliff"
}

# ── Option formats ────────────────────────────────────────────────────────────

@test "Test - xliff-compare.sh --option=value format" {
  local test_name="option_equals_format"

  run "$XLIFF_COMPARE_SH" --from="$TESTFILES_DIR/webos_from.xliff" --to="$TESTFILES_DIR/webos_to.xliff" --output="${OUTPUT_DIR_BASE}compare_eq"

  check_status $test_name $status
  check_file_exists $test_name "${OUTPUT_DIR_BASE}compare_eq/modified.xliff"
}

@test "Test - xliff-compare.sh short option format" {
  local test_name="short_option_format"

  run "$XLIFF_COMPARE_SH" -f "$TESTFILES_DIR/webos_from.xliff" -t "$TESTFILES_DIR/webos_to.xliff" -o "${OUTPUT_DIR_BASE}compare_short"

  check_status $test_name $status
  check_file_exists $test_name "${OUTPUT_DIR_BASE}compare_short/modified.xliff"
}

@test "Test - xliff-compare.sh mixed option formats" {
  local test_name="mixed_option_format"

  run "$XLIFF_COMPARE_SH" --from="$TESTFILES_DIR/webos_from.xliff" -t "$TESTFILES_DIR/webos_to.xliff" -o="${OUTPUT_DIR_BASE}compare_mixed"

  check_status $test_name $status
  check_file_exists $test_name "${OUTPUT_DIR_BASE}compare_mixed/modified.xliff"
}

# ── Help ──────────────────────────────────────────────────────────────────────

@test "Test - xliff-compare.sh no arguments shows help" {
  local test_name="no_args_help"

  run "$XLIFF_COMPARE_SH"

  [ "$status" -eq 0 ]
  [[ "$output" =~ "Usage:" ]]
  [[ "$output" =~ "--from" ]]
  [[ "$output" =~ "--to" ]]
  [[ "$output" =~ "--output" ]]
}

@test "Test - xliff-compare.sh --help option" {
  local test_name="help_option"

  run "$XLIFF_COMPARE_SH" --help

  [ "$status" -eq 0 ]
  [[ "$output" =~ "Usage:" ]]
  [[ "$output" =~ "Options:" ]]
  [[ "$output" =~ "--from" ]]
  [[ "$output" =~ "--to" ]]
  [[ "$output" =~ "--output" ]]
}

@test "Test - xliff-compare.sh -h option" {
  local test_name="h_option"

  run "$XLIFF_COMPARE_SH" -h

  [ "$status" -eq 0 ]
  [[ "$output" =~ "Usage:" ]]
}

# ── Missing required options ──────────────────────────────────────────────────

@test "Test - xliff-compare.sh missing --from option" {
  local test_name="missing_from"

  run "$XLIFF_COMPARE_SH" --to "$TESTFILES_DIR/webos_to.xliff" --output "${OUTPUT_DIR_BASE}missing_from"

  [ "$status" -ne 0 ]
  [[ "$output" =~ "--from" ]]
}

@test "Test - xliff-compare.sh missing --to option" {
  local test_name="missing_to"

  run "$XLIFF_COMPARE_SH" --from "$TESTFILES_DIR/webos_from.xliff" --output "${OUTPUT_DIR_BASE}missing_to"

  [ "$status" -ne 0 ]
  [[ "$output" =~ "--to" ]]
}

@test "Test - xliff-compare.sh missing --output option" {
  local test_name="missing_output"

  run "$XLIFF_COMPARE_SH" --from "$TESTFILES_DIR/webos_from.xliff" --to "$TESTFILES_DIR/webos_to.xliff"

  [ "$status" -ne 0 ]
  [[ "$output" =~ "--output" ]]
}

# ── Invalid input ─────────────────────────────────────────────────────────────

@test "Test - xliff-compare.sh source file not found" {
  local test_name="source_not_found"

  run "$XLIFF_COMPARE_SH" --from "$TESTFILES_DIR/nonexistent.xliff" --to "$TESTFILES_DIR/webos_to.xliff" --output "${OUTPUT_DIR_BASE}not_found"

  [ "$status" -ne 0 ]
  [[ "$output" =~ "not found" ]] || [[ "$output" =~ "Error" ]]
}

@test "Test - xliff-compare.sh target file not found" {
  local test_name="target_not_found"

  run "$XLIFF_COMPARE_SH" --from "$TESTFILES_DIR/webos_from.xliff" --to "$TESTFILES_DIR/nonexistent.xliff" --output "${OUTPUT_DIR_BASE}not_found"

  [ "$status" -ne 0 ]
  [[ "$output" =~ "not found" ]] || [[ "$output" =~ "Error" ]]
}

@test "Test - xliff-compare.sh unknown option" {
  local test_name="unknown_option"

  run "$XLIFF_COMPARE_SH" --from "$TESTFILES_DIR/webos_from.xliff" --to "$TESTFILES_DIR/webos_to.xliff" --output "${OUTPUT_DIR_BASE}unknown" --unknown-opt "value"

  [ "$status" -ne 0 ]
  [[ "$output" =~ "Unknown option" ]] || [[ "$output" =~ "Error" ]]
}

# ── Special cases ─────────────────────────────────────────────────────────────

@test "Test - xliff-compare.sh output directory creation" {
  local test_name="output_dir_creation"
  local output_dir="${OUTPUT_DIR_BASE}compare_create_dir"

  # Ensure output dir doesn't exist before test
  rm -rf "$output_dir" 2>/dev/null || true

  run "$XLIFF_COMPARE_SH" --from "$TESTFILES_DIR/webos_from.xliff" --to "$TESTFILES_DIR/webos_to.xliff" --output "$output_dir"

  check_status $test_name $status
  [ -d "$output_dir" ]
}

@test "Test - xliff-compare.sh relative paths" {
  local test_name="relative_paths"

  # Change to script directory to test relative paths
  cd "$SCRIPT_DIR"
  run bash ./xliff-compare.sh --from "testfiles/webos_from.xliff" --to "testfiles/webos_to.xliff" --output "output_relative"

  check_status $test_name $status
  check_file_exists $test_name "output_relative/modified.xliff"
}

@test "Test - xliff-compare.sh absolute paths" {
  local test_name="absolute_paths"

  run "$XLIFF_COMPARE_SH" --from "$(cd "$TESTFILES_DIR" && pwd)/webos_from.xliff" --to "$(cd "$TESTFILES_DIR" && pwd)/webos_to.xliff" --output "${OUTPUT_DIR_BASE}compare_absolute"

  check_status $test_name $status
  check_file_exists $test_name "${OUTPUT_DIR_BASE}compare_absolute/modified.xliff"
}
