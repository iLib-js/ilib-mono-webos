---
"ilib-loctool-webos-rust": patch
---

Convert the Rust unicode escapes (`\u{XXXX}`) in the extracted strings to the JS style escapes (`\uXXXX`), so that the keys match the ones in the existing xliff files and the generated JSON resource files are valid JSON. Code points outside the BMP are converted to a surrogate pair.
