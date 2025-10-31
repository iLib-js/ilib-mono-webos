# ilib-lint-webos

## 1.1.0

### Minor Changes

- 2907ec5: Implement the new `webOSJsonFormatter` to format results in JSON format.

### Patch Changes

- 5505aa4: - Refactor the part that constructs tags to generate HTML output.
  - Add section IDs so that the Jest's `toMatchSnapshot()` snapshots capture only the detailed descriptions section, excluding the total summary.
  - Add test cases to verify the `format()` and `formatOutput()` methods of the HtmlFormatter class.

## 1.0.3

### Patch Changes

- fce7199: Update dependencies.
  - "ilib-lint": "^2.19.0",
  - "ilib-lint-common": "^3.6.0,
  - "jest": "^30.2.0"

## 1.0.2

### Patch Changes

- e244b3a: Fix the broken documentation links after each plugin is published to npm
- 7163edd: Updated dependencies. (loctool: 2.30.0)

## v1.0.1

- Add the missing `log4js` to the dependencies in the `package.son` file.

## v1.0.0

- Implement the HtmlFormatter to write the output into a html file.
