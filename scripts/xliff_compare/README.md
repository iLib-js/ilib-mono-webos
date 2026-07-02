# xliff-compare.sh

This Bash script compares two webOS XLIFF files logically by translation units and writes the differences to an output directory using loctool.

## Features

- Compares two XLIFF files logically (not line-by-line)
- Generates three output files showing modified, added, and deleted translation units
- Supports both long and short option formats
- Automatic loctool discovery from project dependencies

## Requirements

- Node.js
- loctool.js (automatically located from ../../node_modules/.pnpm or ../../node_modules)

## Usage

```
./xliff-compare.sh [OPTIONS]
```

### Options

- `--from, -f <FILE>` - Path to the source XLIFF file (required)
- `--to, -t <FILE>` - Path to the target XLIFF file (required)
- `--output, -o <DIR>` - Output directory for comparison results (required)
- `--help, -h` - Show help message

Options support both formats: `--option value`, `--option=value`, and short forms.

### Output Files

- `modified.xliff` - Translation units with changes
- `added.xliff` - Translation units only in the target file
- `deleted.xliff` - Translation units only in the source file

A file is only created if there are units of that type.

## Examples

```bash
# Using long options with space
./xliff-compare.sh --from base.xliff --to new.xliff --output ./diff

# Using long options with equals sign
./xliff-compare.sh --from=base.xliff --to=new.xliff --output=./diff

# Using short options
./xliff-compare.sh -f base.xliff -t new.xliff -o ./diff

# Mixed format
./xliff-compare.sh --from base.xliff -t=new.xliff -o ./diff
```

## Testing with Bats

This script can be tested using bats-core, a Bash automated testing system.

### Installation

```bash
npm install -g bats
```

### Running Tests

```bash
bats test-xliff-compare.bats
```

## Notes

- The script validates that both input XLIFF files exist before running the comparison
- The output directory is automatically created if it does not exist
- All file paths can be relative or absolute
