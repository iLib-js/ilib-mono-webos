---
"ilib-loctool-webos-dist": patch
---

ilib-loctool-webos-common:
- buildPolicy() now accepts options.includeUniversal to prepend a universal lookup step.
- buildKey() handles the new "current" + "universal" entry using cleanHashKey.

ilib-loctool-webos-javascript:
ilib-loctool-webos-dart:
ilib-loctool-webos-cpp:
ilib-loctool-webos-c:
- Enable includeUniversal in each FileType.js.
- Adde integration test data (xliff entries in both javascript/universal groups and common) to verify lookup priority:
    self type > universal > common.


