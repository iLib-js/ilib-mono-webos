---
"ilib-loctool-webos-javascript": minor
"ilib-loctool-webos-common": minor
"ilib-loctool-webos-dart": minor
"ilib-loctool-webos-cpp": minor
"ilib-loctool-webos-qml": minor
"ilib-loctool-webos-c": minor
---

- Updated dependencies. (loctool: 2.31.1)
- Updated to correctly generate resources even when XLIFF files include metadata, using the new APIs (`getDeviceType()`, `getTarget()`) from `ilib-loctool-webos-common`
   - If the webOS XLIFF file contains metadata and a device‑type value is specified—such as `device‑type=Monitor`— the tool now correctly generates the appropriate target entries and produces the corresponding resources.
