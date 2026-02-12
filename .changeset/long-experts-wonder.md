---
"ilib-xliff-webos": patch
---

Fixed XLIFF 2.0 serialization to generate self-closing `<target/>` tags when target values are empty or undefined, instead of omitting the target element entirely.