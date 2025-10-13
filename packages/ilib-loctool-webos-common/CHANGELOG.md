# ilib-loctool-webos-common

## 1.2.1

### Patch Changes

- fce7199: Update dependencies. (loctool: 2.31.3)

## 1.2.0

### Minor Changes

- 850a0f7: - Updated dependencies. (loctool: 2.31.1)
  - Updated to correctly generate resources even when XLIFF files include metadata, using the new APIs (`getDeviceType()`, `getTarget()`) from `ilib-loctool-webos-common`
    - If the webOS XLIFF file contains metadata and a device‑type value is specified—such as `device‑type=Monitor`— the tool now correctly generates the appropriate target entries and produces the corresponding resources.
- 8f3072b: - Added new APIs to use across webOS plugins
  - `getDeviceType()`
  - `getTarget()`

### Patch Changes

- 7ea2310: Updated dependencies. (loctool: 2.31.0)

## 1.1.1

### Patch Changes

- e244b3a: Fix the broken documentation links after each plugin is published to npm
- 7163edd: Updated dependencies. (loctool: 2.30.0)

## 1.1.0

### Minor Changes

- 10d6351: Add new methods: `isValidPath()`, `loadData()`, `isExistKey()`

## 1.0.0

### Major Changes

- 2bd79c9: Initial release:
  - This is a package that contains functions commonly used in the plugin.
  - The `addResource()` and `addNewResource()` functions have been added for the first time.
