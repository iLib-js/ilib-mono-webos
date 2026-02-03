# ilib-xliff-webos

## 1.0.8

### Patch Changes

- d95305b: - Ensure the XLIFF metadata namespace is always included, preventing any diffs since it is already present in the current webOS XLIFF files.
  - Add a blank line at the end of the generated XLIFF file to align with the existing webOS XLIFF files.
  - Update to pass `sourceHash` value when parsing XLIFF file.

## 1.0.7

### Patch Changes

- 1196c31: Update the XLIFF header to include `standalone="no"` so that it matches the actual webOS XLIFF files, and modify all sample XLIFF files accordingly.

## 1.0.6

### Patch Changes

- 514bc8d: Updated the XLIFF file so that the encoding declaration is displayed as `UTF-8` instead of `utf-8`

## 1.0.5

### Patch Changes

- 2204f52: Update the XLIFF file deserialization process to exclude position information.
  Update to include datatype information when generating the hash key.

## 1.0.4

### Patch Changes

- c0b9cf6: Add a `target` value to the Babel options in the Gruntfile to make the build more efficient.

## 1.0.3

### Patch Changes

- d9fb65f: Fix a bug where the target is stored incorrectly when the value is empty
- fce7199: Update dependencies.
  - "ilib-lint": "^2.19.0",
  - "ilib-lint-common": "^3.6.0,
  - "jest": "^30.2.0"

## 1.0.2

### Patch Changes

- b266f78: Assign structured unit IDs with group index during xliff serialization

## 1.0.1

### Patch Changes

- 26201ea: Add Gruntfile script to generate output in CommonJS (CJS) format.

## 1.0.0

### Major Changes

- fc3de11: Initial version
