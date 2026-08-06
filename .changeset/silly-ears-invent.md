---
"ilib-loctool-webos-javascript": patch
"ilib-loctool-webos-common": patch
"ilib-loctool-webos-dart": patch
"ilib-loctool-webos-cpp": patch
"ilib-loctool-webos-c": patch
---

- Fix generate mode to only output resources for the plugin's own project and datatype, no longer leaking resources from other datatypes.
- Apply localize mode's datatype priority (self datatype over universal) to generate mode. Shared generate-mode write() logic extracted into generateModeWriter in ilib-loctool-webos-common.
