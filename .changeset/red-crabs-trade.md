---
"ilib-loctool-webos-dist": minor
---

ilib-loctool-webos-webos-c:  
ilib-loctool-webos-webos-cpp:  
ilib-loctool-webos-javascript:  
ilib-loctool-webos-webos-qml:  
ilib-loctool-webos-webos-dart:  
 - Updated to correctly generate resources even when XLIFF files include metadata, using the new APIs (`getDeviceType()`, `getTarget()`) from `ilib-loctool-webos-common`
  - If the webOS XLIFF file contains metadata and a device‑type value is specified—such as `device‑type=Monitor`— the tool now correctly generates the appropriate target entries and produces the corresponding resources.
