/*
 * generateWriter.js - Resource filtering and writing for generate mode
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

/**
 * Filter resources from project.getTranslations() for generate mode.
 *
 * Keeps only resources for the given project, then deduplicates by
 * (reskey, locale, flavor). Self datatype always wins; universal is
 * included as a fallback when options.includeUniversal is true.
 * Resources with other datatypes are discarded.
 *
 * projectName and selfDatatype are always-present filter inputs, so they
 * stay positional. includeUniversal is deliberately wrapped in an options
 * object to mirror the buildPolicy() options pattern used in localize mode
 * (see buildResolver() -> buildPolicy()), keeping the "generate mode" and
 * "localize mode" opt-in flags shaped the same way. Any future opt-in flags
 * should be added to this same options object rather than as new positional
 * args.
 *
 * @param {Array} resources - result of project.getTranslations()
 * @param {string} projectName - current project id (project.getProjectId())
 * @param {string} selfDatatype - plugin's own datatype (e.g. "javascript")
 * @param {Object} [options] - opt-in flags, mirroring buildPolicy() options
 * @param {boolean} [options.includeUniversal] - include "universal" as a fallback datatype
 * @returns {Array} filtered and deduplicated array
 */
function filterGenResources(resources, projectName, selfDatatype, options) {
    var datatypes = [selfDatatype];
    if (options && options.includeUniversal) {
        datatypes.push("universal");
    }

    var best = {};

    resources.forEach(function(res) {
        if (res.getProject() !== projectName) return;

        var priority = datatypes.indexOf(res.getDataType());
        if (priority === -1) return;

        var compositeKey = [res.getKey(), res.getTargetLocale(), res.getFlavor() || ""].join("_");
        var existing = best[compositeKey];
        if (!existing || priority < existing.priority) {
            best[compositeKey] = { priority: priority, resource: res };
        }
    });

    return Object.keys(best).map(function(k) { return best[k].resource; });
}

/**
 * Run generate mode: resolve customInherit clones, then write resources.
 *
 * Handles both dedup-by-base-translation (JS/C/Cpp) and write-through (Dart)
 * via the dedupByBaseTranslation flag — same semantics as resolveTranslation().
 *
 * All inputs are passed as a single params object, matching resolveTranslation()
 * in the localize-mode write family.
 *
 * @param {Object} params
 * @param {Object} params.project - loctool project
 * @param {Array<string>} params.translationLocales - filtered locale list
 * @param {Array} params.genresources - result of filterGenResources()
 * @param {Object} params.resFileType
 * @param {Object} params.db - project.db
 * @param {string} params.deviceType
 * @param {boolean} params.dedupByBaseTranslation - false for Dart, true for JS/C/Cpp
 */
function writeGenResources(params) {
    var project = params.project;
    var translationLocales = params.translationLocales;
    var genresources = params.genresources;
    var resFileType = params.resFileType;
    var db = params.db;
    var deviceType = params.deviceType;
    var dedupByBaseTranslation = params.dedupByBaseTranslation;

    // append cloned resources for customInherit locales that have no translations
    var customInherit = translationLocales.filter(function(locale) {
        return project.getLocaleInherit(locale) !== undefined;
    });

    if (customInherit.length > 0) {
        customInherit.forEach(function(lo) {
            var res = project.getTranslations([lo]);
            if (res.length === 0) {
                var inheritlocale = project.getLocaleInherit(lo);
                project.getTranslations([inheritlocale]).forEach(function(r) {
                    var newres = r.clone();
                    newres.setTargetLocale(lo);
                    genresources.push(newres);
                });
            }
        });
    }

    var baseTranslation, baseLocale, langDefaultLocale;

    for (var i = 0; i < genresources.length; i++) {
        var res = genresources[i];
        var locale = res.getTargetLocale();

        if (!dedupByBaseTranslation) {
            // Dart: write-through, no dedup
            res.setTarget(pluginUtils.getTarget(res, deviceType));
            resFileType.getResourceFile(locale).addResource(res);
            continue;
        }

        // JS/C/Cpp: compare against base translation
        baseLocale = Utils.isBaseLocale(locale);
        langDefaultLocale = Utils.getBaseLocale(locale);
        baseTranslation = res.getSource();

        if (baseLocale) {
            langDefaultLocale = "en-US";
        }

        var langkey = res.cleanHashKeyForTranslation(langDefaultLocale);
        var enUSKey = res.cleanHashKeyForTranslation("en-US");

        db.getResourceByCleanHashKey(langkey, function(err, translated) {
            if (translated) {
                baseTranslation = pluginUtils.getTarget(translated, deviceType);
            } else {
                db.getResourceByCleanHashKey(enUSKey, function(err, translated) {
                    if (translated) {
                        baseTranslation = pluginUtils.getTarget(translated, deviceType);
                    }
                });
            }
        });

        if ((locale === "en-US" && res.getSource() !== pluginUtils.getTarget(res, deviceType)) ||
            (baseTranslation !== pluginUtils.getTarget(res, deviceType))) {
            res.setTarget(pluginUtils.getTarget(res, deviceType));
            resFileType.getResourceFile(locale).addResource(res);
        }
    }
}

module.exports = {
    filterGenResources: filterGenResources,
    writeGenResources: writeGenResources
};
