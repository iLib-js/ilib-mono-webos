/*
 * writeUtils.js - Utilities for write() mode resource handling
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
 * Mirrors the buildPolicy() options pattern used in localize mode.
 *
 * @param {Array} resources - result of project.getTranslations()
 * @param {string} projectName - current project id (project.getProjectId())
 * @param {string} selfDatatype - plugin's own datatype (e.g. "javascript")
 * @param {Object} [options]
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
 * Collect, filter, and write pseudo resources to their resource files in localize mode.
 *
 * Collects pseudo resources from the pseudo bundle, filters by datatype and the
 * disablePseudo setting, then writes each qualifying resource to its resource file.
 *
 * @param {Object} pseudo - plugin's pseudo bundle (this.pseudo)
 * @param {Object} settings - project settings (project.settings)
 * @param {string} settingsKey - key into settings for this plugin type (usually this.type;
 *   for Dart use this.type.replace("x-", ""))
 * @param {string} datatype - plugin's own datatype for filtering (this.datatype)
 * @param {Object} resFileType - resource file type from project.getResourceFileType()
 * @param {string} sourceLocale - project source locale
 * @param {string} deviceType - device type for target resolution
 * @param {Function} [resPathFn] - optional callback(res) returning localized resource path.
 *   Required for plugins where getResourceFile() takes a path argument (e.g. Dart).
 */
function writePseudoResources(pseudo, settings, settingsKey, datatype, resFileType, sourceLocale, deviceType, resPathFn) {
    var pseudoResources = [];
    if (settings[settingsKey] === undefined ||
        (settings[settingsKey] && !(settings[settingsKey].disablePseudo === true))) {
        pseudoResources = pseudo.getAll().filter(function(res) {
            return res.datatype === datatype;
        });
    }

    pseudoResources.forEach(function(res) {
        if (res.getTargetLocale() !== sourceLocale &&
            res.getSource() !== pluginUtils.getTarget(res, deviceType)) {
            var resPath = resPathFn ? resPathFn(res) : undefined;
            res.setTarget(pluginUtils.getTarget(res, deviceType));
            resFileType.getResourceFile(res.getTargetLocale(), resPath).addResource(res);
        }
    });
}

/**
 * Run generate mode: resolve customInherit clones, then write resources.
 *
 * Handles both dedup-by-base-translation (JS/C/Cpp) and write-through (Dart)
 * via the dedupByBaseTranslation flag — same semantics as resolveTranslation().
 *
 * @param {Object} project - loctool project
 * @param {Array<string>} translationLocales - filtered locale list
 * @param {Array} genresources - result of filterGenResources()
 * @param {Object} params
 * @param {Object} params.resFileType
 * @param {Object} params.db - project.db
 * @param {string} params.deviceType
 * @param {boolean} params.dedupByBaseTranslation - false for Dart, true for JS/C/Cpp
 */
function writeGenResources(project, translationLocales, genresources, params) {
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
    writePseudoResources: writePseudoResources,
    writeGenResources: writeGenResources
};
