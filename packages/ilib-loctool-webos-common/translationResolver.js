/*
 * translationResolver.js - Translation resolution orchestrator for webOS loctool plugins
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

var Utils = require("loctool/lib/utils.js");
var pluginUtils = require("./utils.js");
var { buildPolicy, lookupByPolicy } = require("./lookupByPolicy.js");

/**
 * Detect common project data from a translations set.
 *
 * @param {Object} translations - the translations set passed to write()
 * @returns {{commonPrjName: (string|undefined), commonPrjType: (string|undefined)}}
 */
function detectCommonData(translations) {
    if (
        typeof translations !== "undefined" &&
        typeof translations.getProjects() !== "undefined" &&
        translations.getProjects().indexOf("common") !== -1
    ) {
        var commonts = translations.getBy({ project: "common" });
        if (commonts.length > 0) {
            return {
                commonPrjName: "common",
                commonPrjType: commonts[0].getDataType()
            };
        }
    }

    return { commonPrjName: undefined, commonPrjType: undefined };
}

/**
 * Create a resolver context that encapsulates common setup logic.
 *
 * Replaces the former pattern of calling detectCommonData + buildPolicy +
 * createLookupParams separately. Plugins call this once in write() and pass
 * the returned object to resolveTranslation().
 *
 * All concrete values (project name, common project data) are resolved at
 * build time and baked into the policy array. lookupByPolicy receives only
 * { db, resource, locale, policy } — the policy entries are self-describing.
 *
 * @param {Object} db             - project.db handle
 * @param {Object} translations   - the translations set passed to write()
 * @param {string} projectName    - current project name (e.g. project.getProjectId())
 * @param {Object} [options]      - options passed to buildPolicy() for plugin-specific
 *   policy configuration (e.g. { includeUniversal: true })
 * @returns {Object} resolver context with { db, policy, makeLookupParams }
 */
function buildResolver(db, translations, projectName, options) {
    var common = detectCommonData(translations);
    var policy = buildPolicy(projectName, common, options);

    // Create lookup params factory
    var makeLookupParams = function(resource, locale) {
        return {
            db: db,
            resource: resource,
            locale: locale,
            policy: policy
        };
    };

    return {
        db: db,
        policy: policy,
        makeLookupParams: makeLookupParams
    };
}

/**
 * Resolve the translation for a single resource+locale by walking the full
 * fallback chain (locale-direct → policy → customInherit direct →
 * customInherit policy), applying dedup logic, and dispatching the result
 * to resFileType or newres.
 *
 * This replaces the former writeTranslatedResource() function with a name
 * that accurately reflects its orchestration responsibility.
 *
 * @param {Object}   params
 * @param {Object}   params.resolver             - resolver context from buildResolver()
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
 * @param {function(): void} [callback] - optional completion callback
 *
 * Dedup modes:
 * - Dart-style write-through: { dedupByBaseTranslation: false }
 * - Legacy explicit base compare: { baseTranslation: "..." } or { dedupByBaseTranslation: true, baseTranslation: "..." }
 * - Lang-default compare (C/Cpp/JS): { dedupByBaseTranslation: true, translationLocales: [...] }
 */
function resolveTranslation(params, callback) {
    var done = typeof callback === "function" ? callback : function() {};
    var resolver = params.resolver;
    var db = resolver.db;
    var makeLookupParams = resolver.makeLookupParams;
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

    // When dedup is enabled without an explicit base translation, compare against source by default.
    if (dedupByBaseTranslation && typeof baseTranslation === "undefined") {
        baseTranslation = res.getSource();
    }

    // ── internal helpers (closures over params) ────────────────────────────────

    // Return true when this candidate should be written for the target locale.
    var differsFromBaseTranslation = function(translated) {
        if (!dedupByBaseTranslation) return true;
        return baseTranslation !== pluginUtils.getTarget(translated, deviceType);
    };

    // Resolve base translation for dedup before entering the main lookup chain.
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
    var resolveFromInheritLocale = function() {
        db.getResourceByCleanHashKey(res.cleanHashKeyForTranslation(customInheritLocale), function(err, inheritTranslated) {
            if (!inheritTranslated) {
                lookupByPolicy(makeLookupParams(res, customInheritLocale), function(inheritPolicyTranslation) {
                    if (inheritPolicyTranslation && differsFromBaseTranslation(inheritPolicyTranslation)) {
                        pluginUtils.addResource(resFileType, inheritPolicyTranslation, res, locale, resPath, deviceType);
                    } else {
                        pluginUtils.addNewResource(newres, res, locale);
                    }
                    done();
                });
            } else if (differsFromBaseTranslation(inheritTranslated)) {
                pluginUtils.addResource(resFileType, inheritTranslated, res, locale, resPath, deviceType);
                done();
            } else {
                pluginUtils.addNewResource(newres, res, locale);
                done();
            }
        });
    };

    // ── execution: main lookup chain ───────────────────────────────────────────

    // Resolve base translation first so dedup comparison is deterministic for all lookup paths.
    resolveBaseTranslation(function() {
        db.getResourceByCleanHashKey(res.cleanHashKeyForTranslation(locale), function(err, translated) {
            var r = translated;
            if (!translated) {
                // Miss on direct locale key: continue with policy fallback.
                lookupByPolicy(makeLookupParams(res, locale), function(policyTranslation) {
                    if (policyTranslation && differsFromBaseTranslation(policyTranslation)) {
                        pluginUtils.addResource(resFileType, policyTranslation, res, locale, resPath, deviceType);
                        done();
                    } else if (!policyTranslation && customInheritLocale) {
                        resolveFromInheritLocale();
                    } else {
                        pluginUtils.addNewResource(newres, res, locale);
                        done();
                    }
                });
            } else if (
                // Key matched but source changed — translation is stale, request new translation.
                API.utils.cleanString(res.getSource()) !== API.utils.cleanString(r.getSource()) &&
                API.utils.cleanString(res.getSource()) !== API.utils.cleanString(r.getKey())
            ) {
                pluginUtils.addNewResource(newres, res, locale);
                done();
            } else {
                // Matched on cleaned string, not exact reskey — align reskey before writing.
                if (res.reskey !== r.reskey) {
                    r = r.clone();
                    r.reskey = res.reskey;
                }
                if (differsFromBaseTranslation(r)) {
                    // Dart path (dedupByBaseTranslation=false): resolve device-specific
                    // target from metadata before writing.
                    if (!dedupByBaseTranslation && translated.metadata) {
                        translated.target = pluginUtils.getTarget(translated, deviceType);
                    }
                    pluginUtils.addResource(resFileType, r, res, locale, resPath, deviceType);
                }
                done();
            }
        });
    });
}

module.exports = {
    buildResolver: buildResolver,
    resolveTranslation: resolveTranslation
};
