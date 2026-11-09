/*
 * RSFileType.js - Represents a collection of Rust files
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

var fs = require("fs");
var path = require("path");
var mm = require("micromatch");
var Locale = require("ilib/lib/Locale.js");
var RSFile = require("./RSFile.js");
var JsonResourceFileType = require("ilib-loctool-webos-json-resource");
var Utils = require("loctool/lib/utils.js")
var { utils: pluginUtils, translationResolver, pseudoWriter, generateModeWriter } = require("ilib-loctool-webos-common");
var buildResolver = translationResolver.buildResolver;
var resolveTranslation = translationResolver.resolveTranslation;
var writePseudoResources = pseudoWriter.writePseudoResources;
var writeGenerateModeResources = generateModeWriter.writeGenerateModeResources;

var RSFileType = function(project) {
    this.type = "rs";
    this.datatype = "rs";
    this.resourceType = "json";
    this.project = project;
    this.API = project.getAPI();
    this.extensions = [ ".rs"];
    this.extracted = this.API.newTranslationSet(project.getSourceLocale());
    this.newres = this.API.newTranslationSet(project.getSourceLocale());
    this.pseudo = this.API.newTranslationSet(project.getSourceLocale());
    this.logger = this.API.getLogger("loctool.plugin.webOSRSFileType");

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
 * The locale whose resources are written at the root of the
 * [localeDir] path (i.e. [localeDir] is replaced with an empty string).
 * @private
 */
var rootLocale = "en-US";

/**
 * The default mappings used when the project does not configure
 * `settings.rs.mappings` in its project.json file.
 * @private
 */
var defaultMappings = {
    "**/*.rs": {
        "template": "[resourceDir]/[localeDir]/rsstrings.json"
    }
};

/**
 * Return the mappings configured for this project, or the default
 * mappings if none are configured.
 * @private
 * @returns {Object} the mappings object keyed by glob pattern
 */
RSFileType.prototype._getMappings = function() {
    var rsSettings = this.project.settings && this.project.settings.rs;
    return (rsSettings && rsSettings.mappings) ? rsSettings.mappings : defaultMappings;
};

/**
 * Return the mapping corresponding to this path.
 * @param {String} pathName the path to check
 * @returns {Object} the mapping object corresponding to the
 * path or undefined if none of the mappings match
 */
RSFileType.prototype.getMapping = function(pathName) {
    if (typeof(pathName) === "undefined") {
        return undefined;
    }
    var mappings = this._getMappings();
    var patterns = Object.keys(mappings);

    var match = patterns.find(function(pattern) {
        return mm.isMatch(pathName, pattern);
    });

    return match && mappings[match];
};

/**
 * Return the mapping used when there is no source file to match
 * against, such as in generate mode where the resources come from
 * the translation files rather than from the Rust source files.
 * This is the first configured mapping, or the default mapping.
 * @returns {Object} the mapping object
 */
RSFileType.prototype.getDefaultMapping = function() {
    var mappings = this._getMappings();
    var patterns = Object.keys(mappings);
    return patterns.length ? mappings[patterns[0]] : defaultMappings["**/*.rs"];
};

/**
 * Return the location on disk where the resource file for the given
 * locale should be written. The path is built from the template of the
 * mapping. In addition to the substitutions supported by loctool's
 * formatPath (eg. [dir], [resourceDir], [locale], [language],
 * [localeUnder]), the [localeDir] keyword follows the webOS resource
 * directory layout:
 * <ul>
 * <li>en-US is written at the root (eg. resources/rsstrings.json)
 * <li>a language default locale uses the language only
 *     (eg. ko-KR -> resources/ko/rsstrings.json)
 * <li>other locales use the full locale as directories
 *     (eg. en-GB -> resources/en/GB/rsstrings.json)
 * </ul>
 *
 * @param {Object|undefined} mapping the mapping for the source file.
 * If undefined, it is looked up from the pathname.
 * @param {String|undefined} pathname path to the source file relative
 * to the project root
 * @param {String} locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
RSFileType.prototype.getLocalizedPath = function(mapping, pathname, locale) {
    if (!mapping) {
        mapping = this.getMapping(pathname);
    }

    var template = mapping && mapping.template;
    if (!template) {
        template = defaultMappings["**/*.rs"].template;
    }

    var loc = new Locale(locale);
    var isBaseLocale = Utils.isBaseLocale(locale);
    var lo = isBaseLocale ? loc.getLanguage() : loc.getSpec();
    var localeDir = "";

    if (isBaseLocale) {
        if (loc.getSpec() !== rootLocale) {
            localeDir = loc.getLanguage();
        }
    } else {
        localeDir = loc.getSpec().replace(/-/g, "/");
    }

    var resourceDir = this.project.getResourceDirs(this.resourceType)[0] || "resources";
    var output = Utils.formatPath(template.replace(/\[localeDir\]/g, localeDir), {
        sourcepath: pathname,
        locale: lo,
        resourceDir: resourceDir
    });

    return path.join(this.project.target, output);
};

/**
 * Return true if the given path is a Rust file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a Rust file, or false
 * otherwise
 */
RSFileType.prototype.handles = function(pathName) {
    this.logger.debug("RSFileType handles " + pathName + "?");
    var ret = false;
    if (pathName.length > 3 && pathName.substring(pathName.length - 3) === ".rs") {
        ret = true;
    }

    this.logger.debug(ret ? "Yes" : "No");
    return ret;
};

RSFileType.prototype.name = function() {
    return "Rust File Type";
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
RSFileType.prototype.write = function(translations, locales) {
    // distribute all the resources to their resource files
    // and then let them write themselves out

    var resFileType = this.project.getResourceFileType(this.resourceType);
    var mode = this.project.settings.mode;
    var deviceType = pluginUtils.getDeviceType(this.project.settings);
    var customInheritLocale;
    var res, resPath,
        resources = this.extracted.getAll(),
        db = this.project.db,
        translationLocales = locales.filter(function(locale) {
            return locale !== this.project.sourceLocale && locale !== this.project.pseudoLocale;
        }.bind(this));

    if (mode === "localize") {
        // Build resolver: detects common project data and prepares policy-based lookup.
        var resolver = buildResolver(db, translations, this.project.getProjectId(), { includeUniversal: true });
        for (var i = 0; i < resources.length; i++) {
            res = resources[i];
            // for each extracted string, write out the translations of it
            translationLocales.forEach(function(locale) {
                this.logger.trace("Localizing Rust strings to " + locale);
                resPath = this.getLocalizedPath(res.mapping, res.getPath(), locale);

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
                    resPath: resPath,
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
            deviceType: deviceType,
            resPathFn: function(res) { return this.getLocalizedPath(res.mapping, res.getPath(), res.getTargetLocale()); }.bind(this)
        });
    } else {
        // generate mode
        writeGenerateModeResources({
            project: this.project,
            translationLocales: translationLocales,
            resources: this.project.getTranslations(translationLocales),
            selfDatatype: this.datatype,
            resFileType: resFileType,
            db: db,
            deviceType: deviceType,
            dedupByBaseTranslation: true,
            includeUniversal: true,
            // generate mode has no source files to match, so use the default mapping
            resPathFn: function(res) { return this.getLocalizedPath(this.getDefaultMapping(), undefined, res.getTargetLocale()); }.bind(this)
        });
    }
};

RSFileType.prototype.newFile = function(path) {
    return new RSFile({
        project: this.project,
        pathName: path,
        type: this
    });
};

RSFileType.prototype.getDataType = function() {
    return this.datatype;
};

RSFileType.prototype.getResourceTypes = function() {
    return {};
};

/**
 * Return the name of the node module that implements the resource file type, or
 * the path to a Rust file that implements the resource filetype.
 * @returns {Function|undefined} node module name or path, or undefined if this file type does not
 * need resource files
 */
RSFileType.prototype.getResourceFileType = function() {
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
RSFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Ensure that all resources collected so far have a pseudo translation.
 */
RSFileType.prototype.generatePseudo = function(locale, pb) {
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
RSFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
RSFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
RSFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
RSFileType.prototype.getExtensions = function() {
    return this.extensions;
};

module.exports = RSFileType;
