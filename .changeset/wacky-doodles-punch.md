---
"ilib-loctool-webos-dist": patch
---

ilib-loctool-webos-javascript
ilib-loctool-webos-common
ilib-loctool-webos-dart
ilib-loctool-webos-cpp
ilib-loctool-webos-c
- Fix generate mode to only output resources for the plugin's own project and datatype, no longer leaking resources from other datatypes.
- Apply localize mode's datatype priority (self datatype over universal) to generate mode. Shared generate-mode write() logic extracted into generateWriter in ilib-loctool-webos-common.

