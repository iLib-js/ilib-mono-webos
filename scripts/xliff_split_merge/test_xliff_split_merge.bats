#!/usr/bin/env bats

# Setup function to prepare test environment
setup() {
  echo "setup"
}

# Cleanup function to remove test artifacts
teardown() {
  #rm -rf output_*
  echo "teardown"
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
check_diff() {
  local test_name="$1"
  local file1="$2"
  local file2="$3"

  run diff "$file1" "$file2"
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
    echo "❌ Error: Failed to run ./xliff_split_merge.sh $test_name ..."
    echo "$output"
  fi
  [ "$status" -eq 0 ]
}

# Test the 'merge' command
@test "Test - xliff_split_merge.sh merge" {
  local test_name="merge"

  run ./xliff_split_merge.sh merge ./testfiles/merge/input ./output_merge ./testfiles/merge/current

  # Check if the script exited successfully
  check_status $test_name $status

  # Check if the output file was created
  check_file_exists $test_name ./output_merge/appA/ko-KR.xliff

  # Compare the output file with the testfiles/Expected result
  check_diff $test_name ./output_merge/appA/ko-KR.xliff ./testfiles/Expected/output_merge/appA/ko-KR.xliff
}


# Test the 'merge_language' command with a single file
@test "Test - xliff_split_merge.sh merge_language" {
  local test_name="merge_language"

  run ./xliff_split_merge.sh merge_language ./testfiles/merge_language/locdata ./output_merge_language

  # Check if the script exited successfully
  check_status $test_name $status

  # Check if the output file was created
  check_file_exists $test_name ./output_merge_language/en-US.xliff
  check_file_exists $test_name ./output_merge_language/ko-KR.xliff

  # Compare the output file with the expected results
  check_diff "merge_language" ./output_merge_language/en-US.xliff ./testfiles/Expected/output_merge_language/en-US.xliff
  check_diff "merge_language" ./output_merge_language/ko-KR.xliff ./testfiles/Expected/output_merge_language/ko-KR.xliff
}

# Test the 'split_component' command
@test "Test - xliff_split_merge.sh split_component" {
  local test_name="split_component"

  run ./xliff_split_merge.sh split_component ./testfiles/split_component ./output_split_component

  # Check if the script exited successfully
  check_status $test_name $status

  # Check if the output file was created
  check_file_exists $test_name ./output_split_component/appA/ko-KR.xliff
  check_file_exists $test_name ./output_split_component/appB/ko-KR.xliff
  check_file_exists $test_name ./output_split_component/appC/ko-KR.xliff

  # Compare the output file with the expected results
  check_diff $test_name ./output_split_component/appA/ko-KR.xliff ./testfiles/Expected/output_split_component/appA/ko-KR.xliff
  check_diff $test_name ./output_split_component/appB/ko-KR.xliff ./testfiles/Expected/output_split_component/appB/ko-KR.xliff
  check_diff $test_name ./output_split_component/appC/ko-KR.xliff ./testfiles/Expected/output_split_component/appC/ko-KR.xliff
}
