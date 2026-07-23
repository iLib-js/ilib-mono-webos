/*
 * lookupByPolicy.js - Policy-based DB translation lookup for webOS loctool plugins
 *
 * Copyright (c) 2026 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var ResourceString = require("loctool/lib/ResourceString.js");
var Utils = require("loctool/lib/utils.js");

/**
 * Build the DB key for a given resource, locale, and policy entry.
 * Returns undefined if the key cannot be built (e.g. missing project name).
 *
 * @param {Resource} resource
 * @param {string} locale
 * @param {Object} entry - policy entry
 * @param {string} [commonPrjName]
 * @param {string} [commonPrjType]
 * @returns {string|undefined}
 */
function buildKey(resource, locale, entry, commonPrjName, commonPrjType) {

    if (entry.project === "common") {
        if (!commonPrjName || !commonPrjType) return undefined;
        return ResourceString.hashKey(commonPrjName, locale, resource.getKey(), commonPrjType, resource.getFlavor());
    }

    return undefined;
}

/**
 * Build a LOOKUP_POLICY array for a plugin.
 *
 * Step 0 (locale direct via cleanHashKeyForTranslation) is NOT included here —
 * callers perform that lookup themselves, then call lookupByPolicy on miss.
 *
 * @param {Object} [options]
 * @returns {Array<{keyType: string, project: string, datatype: string}>}
 */
function buildPolicy(options) {
    var policy = [];

    policy.push({
        keyType: "hashKey",
        project: "common",
        datatype: "common"
    });

    return policy;
}

/**
 * Detect whether common project data is present in a translations set and
 * populate the shared common-project fields on the FileType instance.
 *
 * Call once at the top of write(), before any DB lookups.
 *
 * @param {Object} fileType     - the plugin FileType instance (mutated in place)
 * @param {Object} translations - the translations set passed to write()
 */
function detectCommonData(fileType, translations) {
    if (
        typeof translations === "undefined" ||
        typeof translations.getProjects() === "undefined" ||
        translations.getProjects().indexOf("common") === -1
    ) {
        return;
    }

    var commonts = translations.getBy({ project: "common" });
    if (commonts.length > 0) {
        fileType.commonPrjName = "common";
        fileType.commonPrjType = commonts[0].getDataType();
    }
}

/**
 * Create a factory that builds params objects for {@link lookupByPolicy}.
 *
 * Plugins call this once in write() and reuse the returned function per
 * (resource, locale) lookup, so the shared context (db, policy, common
 * project info) is captured once instead of being reassembled at each call
 * site. The common project fields are read lazily from `fileType` on every
 * invocation so that changes made during write() (e.g. commonPrjName /
 * commonPrjType being populated after common data is detected) are reflected.
 *
 * @param {Object} fileType - the plugin FileType instance (provides
 *   commonPrjName, commonPrjType — read lazily on each call)
 * @param {Object} db - project.db handle
 * @param {Array}  policy - policy array from {@link buildPolicy}
 * @returns {function(Resource, string): Object} makeLookupParams(resource, locale)
 */
function createLookupParams(fileType, db, policy) {
    return function(resource, locale) {
        return {
            db: db,
            resource: resource,
            locale: locale,
            policy: policy,
            commonPrjName: fileType.commonPrjName,
            commonPrjType: fileType.commonPrjType
        };
    };
}

/**
 * Walk a policy array performing successive DB lookups until a translation is found.
 *
 * The direct-key lookup (step 0: cleanHashKeyForTranslation) is NOT included;
 * callers do that themselves, then call this on miss.
 *
 * @param {Object} params
 * @param {Object}   params.db                 - project.db handle
 * @param {Resource} params.resource            - source resource being looked up
 * @param {string}   params.locale              - target locale
 * @param {Array}    params.policy              - policy array from buildPolicy()
 * @param {string}   [params.commonPrjName]     - common project name (e.g. "common")
 * @param {string}   [params.commonPrjType]     - common project datatype
 * @param {number}   [params.startIndex=0]      - internal recursion index; callers omit this
 * @param {function(Resource|undefined): void} callback
 */
function lookupByPolicy(params, callback) {
    var step = typeof params.startIndex === "number" ? params.startIndex : 0;
    var policy = params.policy;

    if (step >= policy.length) {
        callback(undefined);
        return;
    }

    var entry = policy[step];

    var key = buildKey(params.resource, params.locale, entry, params.commonPrjName, params.commonPrjType);
    if (!key) {
        lookupByPolicy(Object.assign({}, params, { startIndex: step + 1 }), callback);
        return;
    }

    params.db.getResourceByCleanHashKey(key, function(err, translated) {
        if (translated) {
            callback(translated);
        } else {
            lookupByPolicy(Object.assign({}, params, { startIndex: step + 1 }), callback);
        }
    });
}

/**
 * Perform the locale-direct DB lookup and the full fallback chain
 * (policy → customInherit direct → customInherit policy), then add the
 * appropriate resource to resFileType or newres.
 *
 * JS / C / Cpp pass a computed baseTranslation so that translations
 * identical to the parent-locale string are skipped (dedup).  Dart passes
 * baseTranslation as undefined, which disables the dedup check and always
 * writes the resource.
 *
 * @param {Object}   params
 * @param {Object}   params.db
 * @param {Object}   params.resFileType
 * @param {Object}   params.newres
 * @param {Resource} params.res                  - source resource
 * @param {string}   params.locale               - target locale
 * @param {string}   [params.customInheritLocale]
 * @param {string}   [params.baseTranslation]    - caller-provided comparison base
 * @param {boolean}  [params.dedupByBaseTranslation] - true to skip writes identical to base translation
 * @param {Array<string>} [params.translationLocales]
 *   when provided and no explicit baseTranslation is given, lang-default lookup is used as comparison base
 * @param {string}   [params.resPath]            - undefined for JS/C/Cpp
 * @param {string}   [params.deviceType]
 * @param {Object}   params.API                  - loctool API (for cleanString)
 * @param {function} params.makeLookupParams
 *
 * Dedup modes:
 * - Dart-style write-through: { dedupByBaseTranslation: false }
 * - Legacy explicit base compare: { baseTranslation: "..." } or { dedupByBaseTranslation: true, baseTranslation: "..." }
 * - Lang-default compare (C/Cpp/JS): { dedupByBaseTranslation: true, translationLocales: [...] }
 */
function writeTranslatedResource(params) {
    var db = params.db;
    var resFileType = params.resFileType;
    var newres = params.newres;
    var res = params.res;
    var locale = params.locale;
    var customInheritLocale = params.customInheritLocale;
    var baseTranslation = params.baseTranslation;
    var hasExplicitBaseTranslation = typeof params.baseTranslation !== "undefined";
    var dedupByBaseTranslation =
        typeof params.dedupByBaseTranslation === "boolean"
            ? params.dedupByBaseTranslation
            : hasExplicitBaseTranslation;
    var translationLocales = params.translationLocales;
    var resPath = params.resPath;
    var deviceType = params.deviceType;
    var API = params.API;
    var makeLookupParams = params.makeLookupParams;
    var pluginUtils = require("./utils.js");

    // When dedup is enabled without an explicit base translation, compare against source by default.
    if (dedupByBaseTranslation && typeof baseTranslation === "undefined") {
        baseTranslation = res.getSource();
    }

    var differsFromBaseTranslation = function(translated) {
        if (!dedupByBaseTranslation) return true;
        return baseTranslation !== pluginUtils.getTarget(translated, deviceType);
    };

    var resolveBaseTranslation = function(done) {
        if (!dedupByBaseTranslation || hasExplicitBaseTranslation || !Array.isArray(translationLocales)) {
            done();
            return;
        }

        var langDefaultLocale = Utils.getBaseLocale(locale);
        if (Utils.isBaseLocale(locale)) {
            langDefaultLocale = "en-US";
        }

        if (
            locale === "en-US" ||
            translationLocales.indexOf(langDefaultLocale) === -1
        ) {
            // No usable language-default comparison target; keep current base translation.
            done();
            return;
        }

        // Prefer direct lang-default lookup; fall back to policy if direct misses.
        db.getResourceByCleanHashKey(res.cleanHashKeyForTranslation(langDefaultLocale), function(err, translated) {
            if (translated) {
                baseTranslation = pluginUtils.getTarget(translated, deviceType);
                done();
                return;
            }

            lookupByPolicy(makeLookupParams(res, langDefaultLocale), function(policyTranslation) {
                if (policyTranslation) {
                    baseTranslation = pluginUtils.getTarget(policyTranslation, deviceType);
                }
                done();
            });
        });
    };

    // Resolve custom inherit locale only when both locale-direct and policy lookup miss.
    var handleInherit = function() {
        db.getResourceByCleanHashKey(res.cleanHashKeyForTranslation(customInheritLocale), function(err, inheritTranslated) {
            if (!inheritTranslated) {
                lookupByPolicy(makeLookupParams(res, customInheritLocale), function(inheritPolicyTranslation) {
                    if (inheritPolicyTranslation && differsFromBaseTranslation(inheritPolicyTranslation)) {
                        pluginUtils.addResource(resFileType, inheritPolicyTranslation, res, locale, resPath, deviceType);
                    } else {
                        pluginUtils.addNewResource(newres, res, locale);
                    }
                });
            } else if (differsFromBaseTranslation(inheritTranslated)) {
                pluginUtils.addResource(resFileType, inheritTranslated, res, locale, resPath, deviceType);
            } else {
                pluginUtils.addNewResource(newres, res, locale);
            }
        });
    };

    // Resolve base translation first so dedup comparison is deterministic for all lookup paths.
    resolveBaseTranslation(function() {
        db.getResourceByCleanHashKey(res.cleanHashKeyForTranslation(locale), function(err, translated) {
            var r = translated;
            if (!translated) {
                // Miss on direct locale key: continue with policy fallback.
                lookupByPolicy(makeLookupParams(res, locale), function(policyTranslation) {
                    if (policyTranslation && differsFromBaseTranslation(policyTranslation)) {
                        pluginUtils.addResource(resFileType, policyTranslation, res, locale, resPath, deviceType);
                    } else if (!policyTranslation && customInheritLocale) {
                        handleInherit();
                    } else {
                        pluginUtils.addNewResource(newres, res, locale);
                    }
                });
            } else if (
                API.utils.cleanString(res.getSource()) !== API.utils.cleanString(r.getSource()) &&
                API.utils.cleanString(res.getSource()) !== API.utils.cleanString(r.getKey())
            ) {
                pluginUtils.addNewResource(newres, res, locale);
            } else {
                if (res.reskey !== r.reskey) {
                    r = r.clone();
                    r.reskey = res.reskey;
                }
                if (differsFromBaseTranslation(r)) {
                    if (!dedupByBaseTranslation && translated.metadata) {
                        translated.target = pluginUtils.getTarget(translated, deviceType);
                    }
                    pluginUtils.addResource(resFileType, r, res, locale, resPath, deviceType);
                }
            }
        });
    });
}

module.exports = {
    buildPolicy: buildPolicy,
    lookupByPolicy: lookupByPolicy,
    createLookupParams: createLookupParams,
    detectCommonData: detectCommonData,
    writeTranslatedResource: writeTranslatedResource
};
