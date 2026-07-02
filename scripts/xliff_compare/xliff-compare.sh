#!/bin/bash

# xliff-compare.sh - Compare two webOS XLIFF files using loctool

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

# Display help message
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options support both formats: --option value, --option=value, and short forms"
    echo ""
    echo "Options:"
    echo "  --from, -f <FILE>         Path to the source XLIFF file"
    echo "  --to, -t <FILE>           Path to the target XLIFF file"
    echo "  --output, -o <DIR>        Output directory for comparison results"
    echo "  --help, -h                Show this help message"
    echo ""
    echo "Output files:"
    echo "  modified.xliff            Translation units with changes"
    echo "  added.xliff               Translation units only in target file"
    echo "  deleted.xliff             Translation units only in source file"
    echo ""
    echo "Examples:"
    echo "  $0 --from base.xliff --to new.xliff --output ./diff"
    echo "  $0 -f base.xliff -t new.xliff -o ./diff"
}

# Parse command-line options
FROM_FILE=""
TO_FILE=""
OUTPUT_DIR=""

if [ "$#" -eq 0 ]; then
    show_help
    exit 0
fi

while [ "$#" -gt 0 ]; do
    case "$1" in
        --from|-f)
            FROM_FILE="$2"
            shift 2
            ;;
        --from=*|-f=*)
            FROM_FILE="${1#*=}"
            shift
            ;;
        --to|-t)
            TO_FILE="$2"
            shift 2
            ;;
        --to=*|-t=*)
            TO_FILE="${1#*=}"
            shift
            ;;
        --output|-o)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        --output=*|-o=*)
            OUTPUT_DIR="${1#*=}"
            shift
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        *)
            echo "Error: Unknown option '$1'"
            echo "Use --help for usage information."
            exit 1
            ;;
    esac
done

# Validate required options
if [ -z "$FROM_FILE" ]; then
    echo "Error: --from option is required."
    exit 1
fi

if [ -z "$TO_FILE" ]; then
    echo "Error: --to option is required."
    exit 1
fi

if [ -z "$OUTPUT_DIR" ]; then
    echo "Error: --output option is required."
    exit 1
fi

# Validate file existence
if [ ! -f "$FROM_FILE" ]; then
    echo "Error: Source XLIFF file not found: $FROM_FILE"
    exit 1
fi

if [ ! -f "$TO_FILE" ]; then
    echo "Error: Target XLIFF file not found: $TO_FILE"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# The 'compare' command requires loctool 2.33.0 or later.
# Earlier versions (e.g. 2.32.3) do not write out modified/added/deleted files.
LOCTOOL_VERSION="2.33.0"

if ! command -v npx &> /dev/null; then
    echo "Error: npx is required to run loctool. Make sure Node.js is installed."
    exit 1
fi

# Run loctool compare using the pinned version
run_loctool() {
    npx --yes "loctool@${LOCTOOL_VERSION}" compare "$FROM_FILE" "$TO_FILE" "$OUTPUT_DIR"
}

# Execute the comparison
if ! run_loctool; then
    echo "Error: loctool compare command failed."
    exit 1
fi

echo "Comparison completed successfully."
echo "Results saved to: $OUTPUT_DIR"
exit 0
