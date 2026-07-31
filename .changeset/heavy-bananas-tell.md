---
"ilib-loctool-webos-javascript": patch
"ilib-loctool-webos-dart": patch
"ilib-loctool-webos-cpp": patch
"ilib-loctool-webos-c": patch
---

Add universal datatype fallback in policy-based translation lookup (self type → universal → common)
- Enable `includeUniversal` option in each FileType.js to allow datatype-independent project-level fallback before common pool
- Universal translations are shared across all file type handlers within the same project, unlike common which pulls from a separate shared project pool

