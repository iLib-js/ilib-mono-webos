# ilib-loctool-webos-dart

## 1.3.2

### Patch Changes

- 1970707: Updated the examples to use the new option `translationDir` instead of the deprecated option `xliffDir`.
- e244b3a: Fix the broken documentation links after each plugin is published to npm
- 7163edd: Updated dependencies. (loctool: 2.30.0)
- Updated dependencies [e244b3a]
- Updated dependencies [7163edd]
  - ilib-loctool-webos-json-resource@1.7.4
  - ilib-loctool-webos-common@1.1.1

## 1.3.1

### Patch Changes

- 96bb38c: Fix extraction issue for localizable strings followed by trailing commas
- 10d6351: Added integration test cases to improve Jest code coverage.
- Updated dependencies [10d6351]
  - ilib-loctool-webos-common@1.1.0

## 1.3.0

### Minor Changes

- 2bd79c9: Created the `ilib-loctool-webos-common` package, which can be commonly used in plugins.
  - Added `addResource()` and `addNewResource()` methods in it. and have also enabled its usage within the plugins.

### Patch Changes

- Updated dependencies [2bd79c9]
- Updated dependencies [1d6b5fb]
- Updated dependencies [57de2c8]
  - ilib-loctool-webos-common@1.0.0
  - ilib-loctool-webos-json-resource@1.7.3

## 1.2.0

### Minor Changes

- ea52d77: Added a feature to enable the Dart filetype to operate in generate mode as well.

### Patch Changes

- 09fe23a: Fix a bug where the string is not extracted when the variable types are defined in args
- 3a33a2a: Updated dependencies. (loctool: 2.28.2, ilib: 14.21.1)
- Updated dependencies [3a33a2a]
  - ilib-loctool-webos-json-resource@1.7.2

## 1.1.1

### Patch Changes

- 079439a: Updated dependencies. (loctool: 2.28.1)
- Updated dependencies [079439a]
  - ilib-loctool-webos-json-resource@1.7.1

## 1.1.0

- Fixed to generate the pseudo localization data correctly.
- Fixed a bug where strings were not extracted when there were spaces between `}` and `)`.

## 1.0.1

- Fixed the filename in the `package.json` to publish files correctly.

## 1.0.0

- initial version
