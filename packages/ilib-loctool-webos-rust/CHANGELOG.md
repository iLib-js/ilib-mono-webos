# ilib-loctool-webos-rust

## 1.0.0

### Major Changes

- 6a936b1: Initial release: new plugin to extract and localize strings from Rust (`.rs`) source files for the webOS platform. It extracts the string literals passed to the `get_loc_string()` and `get_loc_string_with_key()` method calls on the resource bundle (e.g. `bundle.get_loc_string("Yes")`). The output path of the JSON resource files is configured with `settings.rust.mappings` in `project.json`, similar to the mappings of the Dart plugin. Only the Rust files that match one of the mappings are extracted.

  Rust unicode escapes (`\u{XXXX}`) are converted to the `\uXXXX` form used in the xliff files, and line continuations in string literals are removed in the same way as rustc does.

### Patch Changes

- Updated dependencies [cf383ea]
- Updated dependencies [5875507]
  - ilib-loctool-webos-common@1.3.0
  - ilib-loctool-webos-json-resource@1.7.11
