---
"ilib-loctool-webos-common": patch
---

- buildPolicy() now accepts options.includeUniversal to prepend a universal lookup step.
- buildKey() handles the new "current" + "universal" entry using cleanHashKey.