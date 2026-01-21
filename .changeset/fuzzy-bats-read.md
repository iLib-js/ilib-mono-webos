---
"ilib-xliff-webos": patch
---

- Ensure the XLIFF metadata namespace is always included, preventing any diffs since it is already present in the current webOS XLIFF.
- A blank line is added at the end of the generated XLIFF file to align with the existing webOS XLIFF files.
