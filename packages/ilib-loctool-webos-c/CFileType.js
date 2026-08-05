/*
 * CFileType.js - Represents a collection of C files
 *
 * Copyright (c) 2019-2023, 2025-2026 JEDLSoft
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

var fs = require("fs");
var path = require("path");
var CFile = require("./CFile.js");
var JsonResourceFileType = require("ilib-loctool-webos-json-resource");
var Utils = require("loctool/lib/utils.js")
var { utils: pluginUtils, translationResolver, pseudoWriter, generateWriter } = require("ilib-loctool-webos-common");
var buildResolver = translationResolver.buildResolver;
var resolveTranslation = translationResolver.resolveTranslation;
var filterGenResources = generateWriter.filterGenResources;
var writePseudoResources = pseudoWriter.writePseudoResources;
var writeGenResources = generateWriter.writeGenResources;

var CFileType = function(project) {
    this.type = "c";
    this.datatype = "c";
    this.resourceType = "json";
    this.project = project;
    this.API = project.getAPI();
    this.extensions = [ ".c"];
    this.extracted = this.API.newTranslationSet(project.getSourceLocale());
    this.newres = this.API.newTranslationSet(project.getSourceLocale());
    this.pseudo = this.API.newTranslationSet(project.getSourceLocale());
    this.logger = this.API.getLogger("loctool.plugin.webOSCFileType");

    // generate all the pseudo bundles we'll need
    if (project.pseudoLocale && Array.isArray(project.pseudoLocale)) {
        this.pseudos = {};
        project.pseudoLocale && project.pseudoLocale.forEach(function(locale) {
            var pseudo = this.API.getPseudoBundle(locale, this, project);
            if (pseudo) {
                this.pseudos[locale] = pseudo;
            }
        }.bind(this));
    }
    if (project.pseudoLocales && typeof project.pseudoLocales == 'object') {
        this.pseudos = {};
        for (locale in project.pseudoLocales) {
            var pseudo = this.API.getPseudoBundle(locale, this, project);
            if (pseudo) {
                this.pseudos[locale] = pseudo;
            }
        }
    }

    if (Object.keys(project.localeMap).length > 0) {
        Utils.setBaseLocale(project.localeMap);
    }
};

/**
 * Return true if the given path is a c file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a C file, or false
 * otherwise
 */
CFileType.prototype.handles = function(pathName) {
    this.logger.debug("CFileType handles " + pathName + "?");
    var ret = false;
    if (pathName.length > 2 && pathName.substring(pathName.length - 2) === ".c") {
        ret = true;
    }

    this.logger.debug(ret ? "Yes" : "No");
    return ret;
};

CFileType.prototype.name = function() {
    return "C File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 * @param {TranslationSet} translations the set of translations from the
 * repository
 * @param {Array.<String>} locales the list of locales to localize to
 */
CFileType.prototype.write = function(translations, locales) {
    // distribute all the resources to their resource files
    // and then let them write themselves out

    var resFileType = this.project.getResourceFileType(this.resourceType);
    var mode = this.project.settings.mode;
    var deviceType = pluginUtils.getDeviceType(this.project.settings);
    var customInheritLocale;
    var res,
        resources = this.extracted.getAll(),
        db = this.project.db,
        translationLocales = locales.filter(function(locale) {
            return locale !== this.project.sourceLocale && locale !== this.project.pseudoLocale;
        }.bind(this));

    // Build resolver: detects common project data and prepares policy-based lookup.
    var resolver = buildResolver(db, translations, this.project.getProjectId(), { includeUniversal: true });

    if (mode === "localize") {
        for (var i = 0; i < resources.length; i++) {
            res = resources[i];
            // for each extracted string, write out the translations of it
            translationLocales.forEach(function(locale) {
                this.logger.trace("Localizing C strings to " + locale);

                customInheritLocale = this.project.getLocaleInherit(locale);
                // Resolve translation via fallback chain (direct → policy → inherit) with dedup.
                resolveTranslation({
                    resolver: resolver,
                    resFileType: resFileType,
                    newres: this.newres,
                    res: res,
                    locale: locale,
                    customInheritLocale: customInheritLocale,
                    dedupByBaseTranslation: true,
                    translationLocales: translationLocales,
                    deviceType: deviceType,
                    API: this.API
                });
            }.bind(this));
        }

        // write pseudo resources
        writePseudoResources({
            pseudo: this.pseudo,
            settings: this.project.settings,
            settingsKey: this.type,
            datatype: this.datatype,
            resFileType: resFileType,
            sourceLocale: this.project.sourceLocale,
            deviceType: deviceType
        });
    } else {
        // generate mode
        this.genresources = filterGenResources(
            this.project.getTranslations(translationLocales),
            this.project.getProjectId(),
            this.datatype,
            { includeUniversal: true }
        );
        writeGenResources({
            project: this.project,
            translationLocales: translationLocales,
            genresources: this.genresources,
            resFileType: resFileType,
            db: db,
            deviceType: deviceType,
            dedupByBaseTranslation: true
        });
    }
};

CFileType.prototype.newFile = function(path) {
    return new CFile({
        project: this.project,
        pathName: path,
        type: this
    });
};

CFileType.prototype.getDataType = function() {
    return this.datatype;
};

CFileType.prototype.getResourceTypes = function() {
    return {};
};

/**
 * Return the name of the node module that implements the resource file type, or
 * the path to a C file that implements the resource filetype.
 * @returns {Function|undefined} node module name or path, or undefined if this file type does not
 * need resource files
 */
CFileType.prototype.getResourceFileType = function() {
    return JsonResourceFileType;
};

/**
 * Return the translation set containing all of the extracted
 * resources for all instances of this type of file. This includes
 * all new strings and all existing strings. If it was extracted
 * from a source file, it should be returned here.
 *
 * @returns {TranslationSet} the set containing all of the
 * extracted resources
 */
CFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Ensure that all resources collected so far have a pseudo translation.
 */
CFileType.prototype.generatePseudo = function(locale, pb) {
    var resources = this.extracted.getBy({
        sourceLocale: pb.getSourceLocale()
    });
    this.logger.trace("Found " + resources.length + " source resources for " + pb.getSourceLocale());
    var deviceType = pluginUtils.getDeviceType(this.project.settings);

    resources.forEach(function(resource) {
        this.logger.trace("Generating pseudo for " + resource.getKey());
        var res = resource.generatePseudo(locale, pb);
        if (res && res.getSource() !== pluginUtils.getTarget(res, deviceType)) {
            this.pseudo.add(res);
        }
    }.bind(this));
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
CFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
CFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
CFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
CFileType.prototype.getExtensions = function() {
    return this.extensions;
};

module.exports = CFileType;
