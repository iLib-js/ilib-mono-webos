# DB Lookup Flow in `write()` Localize Mode

Documents the translation DB lookup chain used by each webOS loctool plugin
during `localize` mode. Describes both the lookup flow and the shared
resolution engine provided by this package.

## Plugins covered

- `ilib-loctool-webos-javascript` — JavaScriptFileType
- `ilib-loctool-webos-c` — CFileType
- `ilib-loctool-webos-cpp` — CppFileType
- `ilib-loctool-webos-dart` — DartFileType

---

## 1. Full lookup chain per plugin

### 1-1. JS / C / Cpp (identical structure)

```
Step 0  locale direct
        key: res.cleanHashKeyForTranslation(locale)
        hit  + key matched but source mismatched → addNewResource
        hit  + baseTranslation ≠ target       → addResource
        hit  + baseTranslation = target       → skip (dedup)
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
```

### 1-2. Dart (differs from JS/C/Cpp)

```
Step 0  locale direct
        key: res.cleanHashKeyForTranslation(locale)
        hit  + key matched but source mismatched → addNewResource
        hit                                      → addResource(resPath)
        miss → Step 1

Step 1  common project (locale)
        key: ResourceString.hashKey(commonPrjName, locale, key, commonPrjType, flavor)
        skipped when commonPrjName/commonPrjType absent
        hit  → addResource(resPath)
        miss → Step 2

Step 2  customInherit direct
        key: res.cleanHashKeyForTranslation(customInheritLocale)
        skipped when customInheritLocale absent
        hit  → addResource(resPath)
        miss → Step 3

Step 3  customInherit common
        key: ResourceString.hashKey(commonPrjName, customInheritLocale, ...)
        skipped when commonPrjName/commonPrjType absent
        hit  → addResource(resPath)
        miss → addNewResource
```

Dart does not compute `baseTranslation` / `langDefaultLocale`. It preserves
locale entries even when translation text matches parent/base locale.

---

## 2. Shared resolution engine

All four plugins delegate the lookup chain above to two modules in this
package:

- `translationResolver.js` — orchestrator (full fallback chain + dedup + dispatch)
- `lookupByPolicy.js` — lower-level policy-based DB lookup

### Call sequence inside `write()`

```
resolver = buildResolver(db, translations, options?)
    → detectCommonData(translations)      // internal, no side effects
    → buildPolicy(options)                // declarative policy array
    → makeLookupParams factory            // captures db, policy, common data
    → returns { db, policy, makeLookupParams }

// per resource, per locale:
resolveTranslation({ resolver, resFileType, newres, res, locale, ... })
    → resolveBaseTranslation (if dedup enabled)
    → locale-direct lookup
    → lookupByPolicy fallback
    → customInherit fallback (direct + policy)
    → dedup check + dispatch (addResource / addNewResource)
```

### `buildResolver(db, translations, options?)`

Creates a resolver context with no side effects. Internally:
1. Calls `detectCommonData(translations)` — returns `{ commonPrjName, commonPrjType }`
2. Calls `buildPolicy(options)` — returns the policy array
3. Builds a `makeLookupParams(resource, locale)` factory capturing all the above

### `buildPolicy(options?)` — current policy array

| Step | project | keyType  | datatype |
|------|---------|----------|----------|
| 0    | common  | hashKey  | common   |

`buildKey` returns `undefined` when `commonPrjName`/`commonPrjType` are
absent (i.e. no common project was detected), causing that step to be
skipped automatically — no separate flag needed.

The `options` parameter is reserved for plugin-specific policy configuration
(e.g. additional fallback steps). Currently unused.

### `lookupByPolicy(params, callback)`

Walks the policy array, calling `buildKey()` for each entry and querying
the DB. Returns the first hit, or `undefined` if all steps miss.

### `resolveTranslation(params, callback)`

Orchestrates the full lookup chain described in Section 1. Implements every
step (locale-direct → policy → customInherit) and the dedup/dispatch logic
in a single function, so plugins only need one call per resource+locale.

Internal flow:

1. **resolveBaseTranslation** — determines the comparison base for dedup:
   - If `baseTranslation` is explicitly passed: use it as-is.
   - If `dedupByBaseTranslation=true` and `translationLocales` is provided:
     derive `langDefaultLocale`, look up via direct then policy fallback.
   - If `dedupByBaseTranslation=true` with no other info: use `res.getSource()`.
   - If `dedupByBaseTranslation=false` (Dart): skip entirely.

2. **locale-direct lookup** — `db.getResourceByCleanHashKey(res.cleanHashKeyForTranslation(locale))`
   - Hit + key matched but source mismatched → `addNewResource`
   - Hit + reskey mismatch → clone with corrected reskey
   - Hit + differs from base → `addResource`
   - Hit + same as base → skip (dedup)
   - Miss → step 3

3. **policy fallback** — `lookupByPolicy(makeLookupParams(res, locale))`
   - Hit + differs from base → `addResource`
   - Miss + customInheritLocale → step 4
   - Miss + no inherit → `addNewResource`

4. **resolveFromInheritLocale** — customInherit direct, then customInherit policy
   - Hit + differs from base → `addResource`
   - Hit + same as base → `addNewResource`
   - All miss → `addNewResource`

Key params controlling behavior:

| Param | Effect |
|---|---|
| `dedupByBaseTranslation` | `true`: skip writes matching base. `false`: always write (Dart). |
| `translationLocales` | Enables lang-default lookup for base resolution (JS/C/Cpp). |
| `baseTranslation` | Explicit override — skips automatic base resolution. |
| `resPath` | Passed to `addResource` for Dart's per-file output. |
| `customInheritLocale` | Enables inherit fallback steps. |

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

## 5. Design notes

### Reskey correction on locale-direct hit

When Step 0 hits and the translated resource's `reskey` differs from the
source resource's `reskey` (matched via cleaned string rather than exact key),
the translated resource is cloned and its `reskey` is overwritten to match
the source before being passed to `addResource`.

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

`resolveTranslation` resolves dedup base translation first (via
`resolveBaseTranslation`) and only then starts locale-direct/policy/inherit
lookup. This ensures deterministic dedup comparison regardless of which
lookup path produces the final translation.

### Extensibility via policy options

To add a new fallback step (e.g. brand project lookup):
1. Add an entry in `buildPolicy(options)` conditionally based on `options`
2. Add a matching key-building branch in `buildKey()`
3. No changes needed in `lookupByPolicy()` or `resolveTranslation()`
