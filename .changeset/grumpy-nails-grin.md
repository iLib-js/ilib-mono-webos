---
"ilib-loctool-webos-javascript": patch
"ilib-loctool-webos-common": patch
"ilib-loctool-webos-dart": patch
"ilib-loctool-webos-cpp": patch
"ilib-loctool-webos-c": patch
---

Centralize common DB lookup logic from FileType.write()
- Replace per-plugin ResourceString.hashKey manual lookups with a shared lookupByPolicy engine in ilib-loctool-webos-common
