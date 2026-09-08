---
"ilib-loctool-webos-javascript": patch
"ilib-loctool-webos-cpp": patch
"ilib-loctool-webos-c": patch
---

Fix string extraction when extra whitespace surrounds argument separators:
- (js) `$L({ value : 'text', key : 'id' })` with a space before the
  colon or comma is now extracted correctly.
- (c/cpp) `getLocString("text", "key" )` with a space before the closing
  parenthesis is now extracted correctly, matching the single-argument form.
