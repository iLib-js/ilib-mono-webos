#!/usr/bin/env bats

# Setup function to prepare test environment
setup() {
  echo "setup"
}

# Cleanup function to remove test artifacts
teardown() {
  rm -rf output_*
  echo "teardown"
}

# Test the 'merge' command
@test "Test - xliff_split_merge.sh merge" {
  # Run the merge command with test directories
  run ./xliff_split_merge.sh merge ./testfiles/merge/input ./output_merge ./testfiles/merge/current
  # Check if the script exited successfully
  [ "$status" -eq 0 ]

  # Check if the output file was created
  [ -f ./output_merge/appA/ko-KR.xliff ]

  # Compare the output file with the testfiles/Expected result
  run diff ./output_merge/appA/ko-KR.xliff ./testfiles/Expected/exp_merge/appA/ko-KR.xliff
  [ "$status" -eq 0 ]
}

# Test the 'merge_language' command with a single file
@test "Test - xliff_split_merge.sh merge_language" {
  run ./xliff_split_merge.sh merge_language ./testfiles/merge_language/locdata ./output_merge_language
#   # Check if the script exited successfully
  [ "$status" -eq 0 ]

  # Check if the output file was created
  [ -f ./output_merge_language/en-US.xliff ]
  [ -f ./output_merge_language/ko-KR.xliff ]

  # Compare the output file with the expected results
  run diff ./output_merge_language/ko-KR.xliff ./testfiles/Expected/exp_merge_language/ko-KR.xliff
  [ "$status" -eq 0 ]
  run diff ./output_merge_language/en-US.xliff ./testfiles/Expected/exp_merge_language/en-US.xliff
  [ "$status" -eq 0 ]
}

# Test the 'split_component' command
# @test "Test - xliff_split_merge.sh split_component" {
#  run ./xliff_split_merge.sh split_component test/input test/output
#  [ "$status" -eq 0 ]
#}
