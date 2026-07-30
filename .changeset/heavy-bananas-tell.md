---
"ilib-loctool-webos-javascript": patch
"ilib-loctool-webos-dart": patch
"ilib-loctool-webos-cpp": patch
"ilib-loctool-webos-c": patch
---

- Enable includeUniversal in each FileType.js.
- Adde integration test data (xliff entries in both javascript/universal groups and common) to verify lookup priority:
    self type > universal > common.

