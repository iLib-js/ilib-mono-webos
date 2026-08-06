# `write()` Mode: Localize and Generate

Documents the translation resolution and resource write logic used by each
webOS loctool plugin in both `localize` and `generate` modes. Describes the
shared utilities provided by this package.

## Plugins covered

- `ilib-loctool-webos-javascript` — JavaScriptFileType
- `ilib-loctool-webos-c` — CFileType
- `ilib-loctool-webos-cpp` — CppFileType
- `ilib-loctool-webos-dart` — DartFileType

---

## 1. Full lookup chain per plugin

> This section describes the original (pre-refactor) lookup behavior as
> implemented in each plugin's `write()` method.

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
resolver = buildResolver(db, translations, projectName, options?)
    → detectCommonData(translations)      // internal, no side effects
    → buildPolicy(projectName, common, options)  // concrete values in entries
    → makeLookupParams factory            // captures db and policy
    → returns { db, policy, makeLookupParams }

// per resource, per locale:
resolveTranslation({ resolver, resFileType, newres, res, locale, ... })
    → resolveBaseTranslation (if dedup enabled)
    → locale-direct lookup
    → lookupByPolicy fallback
    → customInherit fallback (direct + policy)
    → dedup check + dispatch (addResource / addNewResource)
```

### `buildResolver(db, translations, projectName, options?)`

Creates a resolver context with no side effects. Internally:
1. Calls `detectCommonData(translations)` — returns `{ commonPrjName, commonPrjType }`
2. Calls `buildPolicy(projectName, common, options)` — returns the policy array with concrete values
3. Builds a `makeLookupParams(resource, locale)` factory capturing db and policy

### `buildPolicy(projectName, common, options?)` — policy array

Policy entries contain concrete project names and datatypes resolved at
build time. No symbolic values like "self" or "common" — what you see in
the array is exactly what gets queried.

Default (no `includeUniversal`, common data present):

| Step | project | datatype |
|------|---------|----------|
| 0    | (commonPrjName) | (commonPrjType) |

With `options.includeUniversal = true` and common data present:

| Step | project | datatype |
|------|---------|----------|
| 0    | (projectName) | universal |
| 1    | (commonPrjName) | (commonPrjType) |

When common data is absent (`detectCommonData` found nothing), the common
step is omitted entirely — no entry is added to the array.

The `options.includeUniversal` flag prepends a universal (datatype-independent)
lookup step using the provided `projectName` before falling back to common.

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
| universal | `ResourceString.cleanHashKey(projectName, locale, key, "universal", flavor)` | Own project, datatype-independent |
| common | `ResourceString.cleanHashKey(commonPrjName, locale, key, commonPrjType, flavor)` | Shared common project pool |

`buildKey()` has no branching — it always calls `cleanHashKey()` with the
project and datatype stored in the policy entry.

### Why `cleanHashKey` instead of `hashKey`

The original implementation used `ResourceString.hashKey()` for common/policy
lookups. The refactored version uses `cleanHashKey()` uniformly. The
difference is whitespace normalization: `cleanHashKey` collapses consecutive
whitespace into a single space before hashing.

In practice this only matters for JavaScript sources — C, C++, and Dart
extractors preserve whitespace in keys as-is, so `hashKey` and `cleanHashKey`
produce identical results for those languages. Using `cleanHashKey`
consistently eliminates a subtle mismatch where JS source keys with
irregular whitespace could fail to match their DB entries via `hashKey`.

---

## 5. Design notes

### Reskey correction on locale-direct hit

When Step 0 hits and the translated resource's `reskey` differs from the
source resource's `reskey` (matched via cleaned string rather than exact key),
the translated resource is cloned and its `reskey` is overwritten to match
the source before being passed to `addResource`.

### Common step gating

Common step gating happens at `buildPolicy()` time: when `detectCommonData`
returns no common project, no common entry is added to the policy array.
`lookupByPolicy()` simply iterates what it receives — no runtime check needed.

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

To add a new fallback step:
1. Pass the new project/datatype info to `buildResolver()` / `buildPolicy()`
2. Add a new entry with concrete project/datatype values in `buildPolicy()`
3. No changes needed in `buildKey()`, `lookupByPolicy()`, or `resolveTranslation()`

`buildKey()` is a single-line function with no branching — new policy
entries work automatically.

---

## 6. Generate mode

Generate mode does not use DB lookup. Instead, it:
1. Fetches all translated resources for the target locales via `project.getTranslations(locales)`
2. Filters, deduplicates, and writes resources using `writeGenerateModeResources()` in `generateModeWriter.js`

### `writeGenerateModeResources(params)`

A single entry point that handles both filtering and writing:

```
writeGenerateModeResources({
    project,
    translationLocales,
    resources,          // raw result of project.getTranslations()
    selfDatatype,       // plugin's own datatype (e.g. "javascript")
    resFileType,
    db,
    deviceType,
    dedupByBaseTranslation,
    includeUniversal
})
```

#### Internal filter logic

- Excludes resources not belonging to the current project (e.g. `"common"`)
- Deduplicates by `(reskey, locale, flavor)` with priority: self datatype > `"universal"`
- `includeUniversal: true` enables the universal fallback — mirrors `buildPolicy({ includeUniversal: true })` in localize mode

#### Write logic

- Appends cloned resources for `customInherit` locales that have no translations
- Writes each resource to its resource file
- `dedupByBaseTranslation`:
  - `true` (JS/C/Cpp): resolves base translation via DB, skips if target matches base
  - `false` (Dart): write-through, no dedup

### Comparison: localize vs generate

| | Localize mode | Generate mode |
|--|--|--|
| Input | Extracted source resources | Already-translated resources from xliff |
| DB lookup | Yes — `resolveTranslation()` | Minimal — base translation dedup only |
| Priority | Policy array (`buildPolicy`) | `writeGenerateModeResources` internal filter |
| Common project | Included via policy | Excluded |
| Shared utility | `translationResolver.js`, `pseudoWriter.js` | `generateModeWriter.js` |
