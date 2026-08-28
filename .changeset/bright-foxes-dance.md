---
"ilib-loctool-webos-c": patch
"ilib-loctool-webos-cpp": patch
"ilib-loctool-webos-dart": patch
"ilib-loctool-webos-qml": patch
---

Fix comment removal to lex string/character literals correctly:

- A string ending in escaped backslash (e.g. `"path\\"`) no longer
  consumes its closing quote, letting a following comment survive.
- (C/C++) A double quote inside a char literal (e.g. `'"'`) no longer
  opens a spurious string region that swallows a following comment.
