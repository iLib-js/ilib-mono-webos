---
"ilib-loctool-webos-rust": major
---

Initial release: new plugin to extract and localize strings from Rust (`.rs`) source files for the webOS platform. It extracts the string literals passed to the `get_loc_string()` and `get_loc_string_with_key()` method calls on the resource bundle (e.g. `bundle.get_loc_string("Yes")`). The output path of the JSON resource files is configured with `settings.rust.mappings` in `project.json`, similar to the mappings of the Dart plugin. Only the Rust files that match one of the mappings are extracted.
