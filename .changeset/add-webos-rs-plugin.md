---
"ilib-loctool-webos-rs": minor
---

New plugin to extract and localize strings from Rust (`.rs`) source files for the webOS platform. It extracts `get_loc_string()` and `get_loc_string_with_key()` usages. The output path of the JSON resource files is configured with `settings.rs.mappings` in `project.json`, in the same way as the Dart plugin.
