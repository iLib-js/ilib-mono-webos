---
"ilib-loctool-webos-dist": patch
---

ilib-loctool-webos-rust
- Convert the Rust unicode escapes (`\u{XXXX}`) to the JS style escapes (`\uXXXX`).
- Extract the string literals that have a line continuation.
- Fix the handling of the line comments on the last line and in files with CRLF line endings.
