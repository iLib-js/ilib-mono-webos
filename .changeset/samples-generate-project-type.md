---
"sample-webos-c": patch
"sample-webos-cpp": patch
---

Fix the `loc-generate` scripts so that generate mode writes the resource files. Pass `--projectType`, which keeps the `-l` locales from being dropped, and use the `c`/`cpp` key of `--resourceFileNames`, which is the key the JSON resource file type reads for these project types. Add generate mode tests that run the `loc-generate` script itself.
