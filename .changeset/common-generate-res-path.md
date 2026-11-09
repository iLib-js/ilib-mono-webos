---
"ilib-loctool-webos-common": minor
---

Add an optional `resPathFn` parameter to `writeGenerateModeResources()` so that plugins whose resource path is configured via mappings (e.g. Rust) can decide the output path in generate mode.
