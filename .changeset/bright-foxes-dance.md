---
"ilib-loctool-webos-c": patch
"ilib-loctool-webos-cpp": patch
"ilib-loctool-webos-dart": patch
"ilib-loctool-webos-qml": patch
---

Fix comment removal to preserve string and character literals:

Strings containing `//` (e.g. URLs like `"https://example.com"`) are no
longer corrupted by having their contents stripped as comments.
