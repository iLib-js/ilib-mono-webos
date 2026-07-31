---
"ilib-loctool-webos-dist": patch
---

ilib-loctool-webos-common:
- buildPolicy() now accepts options.includeUniversal to prepend a universal lookup step
- buildKey() handles the new "universal" entry

ilib-loctool-webos-javascript:
ilib-loctool-webos-dart:
ilib-loctool-webos-cpp:
ilib-loctool-webos-c:
- Add universal datatype fallback in policy-based translation lookup (self type → universal → common)
  - Enable `includeUniversal` option in each FileType.js to allow datatype-independent project-level fallback before common pool
  - Universal translations are shared across all file type handlers within the same project, unlike common which pulls from a separate shared project pool


