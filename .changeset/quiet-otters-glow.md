---
"ilib-loctool-webos-rust": patch
---

Fix the parsing of string literals in Rust files:
- Convert the Rust unicode escapes (`\u{XXXX}`) in the extracted strings to the JS style escapes (`\uXXXX`), so that the keys match the ones in the existing xliff files and the generated JSON resource files are valid JSON. Code points outside the BMP are converted to a surrogate pair.
- Extract the string literals that have a line continuation (a backslash at the end of a line), and remove the line continuation from the key and source in the same way as rustc does.
