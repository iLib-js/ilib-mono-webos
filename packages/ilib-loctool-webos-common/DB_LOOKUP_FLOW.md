# DB Lookup Flow in `write()` Localize Mode

Documents the translation DB lookup chain used by each webOS loctool plugin
during `localize` mode. Describes both the shared policy engine provided by
this package and the per-plugin differences.

## Plugins covered

- `ilib-loctool-webos-javascript` — JavaScriptFileType
- `ilib-loctool-webos-c` — CFileType
- `ilib-loctool-webos-cpp` — CppFileType
- `ilib-loctool-webos-dart` — DartFileType

---

## 1. Shared lookup engine (`lookupByPolicy.js`)

All four plugins now delegate common-project DB lookups to the helpers in
this package instead of building keys inline.

### Call sequence inside `write()`

```
detectCommonData(this, translations)          // populates commonPrjName/commonPrjType
policy = buildPolicy()
makeLookupParams = createLookupParams(this, db, policy)

// per resource, per locale:
db.getResourceByCleanHashKey(res.cleanHashKeyForTranslation(locale), ...)
  hit  → use translated directly
  miss → lookupByPolicy(makeLookupParams(res, locale), callback)
```

### `buildPolicy()` — current policy array

| Step | project | keyType  | datatype |
|------|---------|----------|----------|
| 0    | common  | hashKey  | common   |

`buildKey` returns `undefined` when `commonPrjName`/`commonPrjType` are
absent (i.e. no common project was detected), causing that step to be
skipped automatically — no separate flag needed.

### `detectCommonData(fileType, translations)`

Inspects the translations set for a `"common"` project entry. On detection,
sets `fileType.commonPrjName` and `fileType.commonPrjType`. No-ops when
common data is absent or `translations` is undefined.

### `createLookupParams(fileType, db, policy)`

Returns a `makeLookupParams(resource, locale)` factory. Captures `db` and
`policy` once; reads `commonPrjName`/`commonPrjType` lazily from `fileType`
on every call so values populated by `detectCommonData` are reflected.

---

## 2. Full lookup chain per plugin

### 2-1. JS / C / Cpp (identical structure)

```
Step 0  locale direct
        key: res.cleanHashKeyForTranslation(locale)
        hit  → [D]
        miss → Step 1

Step 1  common project (locale)
        key: ResourceString.hashKey(commonPrjName, locale, key, commonPrjType, flavor)
        skipped when commonPrjName/commonPrjType absent
        hit  + baseTranslation ≠ target → addResource
        miss → Step 2

Step 2  customInherit direct
        key: res.cleanHashKeyForTranslation(customInheritLocale)
        skipped when customInheritLocale absent
        hit  + baseTranslation ≠ target → addResource
        hit  + baseTranslation = target → addNewResource
        miss → Step 3

Step 3  customInherit common
        key: ResourceString.hashKey(commonPrjName, customInheritLocale, ...)
        skipped when commonPrjName/commonPrjType absent
        hit  + baseTranslation ≠ target → addResource
        hit  + baseTranslation = target → addNewResource
        miss                            → addNewResource

[D] locale direct hit
        source mismatch → addNewResource
        reskey mismatch → clone, overwrite reskey
        baseTranslation ≠ target → addResource
        else (same as base) → skip (dedup)
```

**baseTranslation resolution** in shared `writeTranslatedResource`:
1. If `baseTranslation` is explicitly passed: use it as-is.
2. Else if `dedupByBaseTranslation=true` and `translationLocales` is provided:
   - derive `langDefaultLocale` (`en-US` for base locales)
   - direct lookup on `langDefaultLocale`, then policy fallback
3. Else if `dedupByBaseTranslation=true`: use `res.getSource()` as fallback base.

### 2-2. Dart (differs from JS/C/Cpp)

```
Step 0  locale direct
        key: res.cleanHashKeyForTranslation(locale)
        hit  → [D]
        miss → Step 1

Step 1  common project (locale)
        key: ResourceString.hashKey(commonPrjName, locale, key, commonPrjType, flavor)
        skipped when commonPrjName/commonPrjType absent
        hit  → addResource(resPath)        ← no baseTranslation comparison
        miss → Step 2

Step 2  customInherit direct
        key: res.cleanHashKeyForTranslation(customInheritLocale)
        skipped when customInheritLocale absent
        hit  → addResource(resPath)        ← no baseTranslation comparison
        miss → Step 3

Step 3  customInherit common
        key: ResourceString.hashKey(commonPrjName, customInheritLocale, ...)
        skipped when commonPrjName/commonPrjType absent
        hit  → addResource(resPath) / miss → addNewResource

[D] locale direct hit
        source mismatch → addNewResource
        hit: set translated.target via getTarget(translated, deviceType)
             addResource(resPath)          ← no baseTranslation comparison
```

`dedupByBaseTranslation` is set to `false` for Dart, so base-translation
comparison is intentionally disabled. Dart preserves locale entries even when
translation text matches parent/base locale.

---

## 3. Comparison table

| Feature | JS | C | Cpp | Dart |
|---------|----|----|-----|------|
| Step 0: locale direct | ✅ | ✅ | ✅ | ✅ |
| Step 1: common (locale) | ✅ | ✅ | ✅ | ✅ |
| Step 2: customInherit direct | ✅ | ✅ | ✅ | ✅ |
| Step 3: customInherit common | ✅ | ✅ | ✅ | ✅ |
| baseTranslation computation | ✅ | ✅ | ✅ | ❌ |
| baseTranslation dedup check | ✅ | ✅ | ✅ | ❌ |
| resPath passed to addResource | ❌ (undefined) | ❌ | ❌ | ✅ |
| metadata→target on direct hit | ❌ | ❌ | ❌ | ✅ |

---

## 4. Key builder reference

| Lookup target | Function | Notes |
|---------------|----------|-------|
| locale direct | `res.cleanHashKeyForTranslation(locale)` | Normalizes whitespace (cleanHashKey) |
| common project | `ResourceString.hashKey(commonPrjName, locale, key, commonPrjType, flavor)` | No whitespace normalization |

`cleanHashKey` (multi-space normalized) vs `hashKey` (raw): direct lookups
use the clean variant; common lookups use the raw variant.

---

## 5. Policy notes

### Common step gating

The `isCommonDataLoaded` flag has been removed. `buildKey` returns
`undefined` when `commonPrjName`/`commonPrjType` are absent, which is only
the case when `detectCommonData` found no common project — equivalent guard,
no extra flag.

### Dart baseTranslation policy (intentional)

Dart does not compute `baseTranslation` / `langDefaultLocale`. This is an
intentional policy difference: Dart preserves a locale-specific entry in the
output even when the translation matches the parent locale. The other three
plugins skip such entries as duplicates.

### Async ordering note

`writeTranslatedResource` resolves dedup base translation first and only then
starts locale-direct/policy/inherit lookup. This removes the earlier
call-site ordering dependency where base resolution and main lookup were
interleaved across callbacks.
