/*
 * DartFileType.js - Represents a collection of Dart files
 *
 * Copyright (c) 2023-2024, JEDLSoft
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
var Utils = require("loctool/lib/utils.js")
var ResourceString = require("loctool/lib/ResourceString.js");
var DartFile = require("./DartFile.js");
var JsonResourceFileType = require("ilib-loctool-webos-json-resource");

var DartFileType = function(project) {
    this.type = "x-dart";
    this.datatype = "x-dart";
    this.resourceType = "json";
    this.extensions = [".dart"];
    this.isloadCommonData = false;
    this.project = project;
    this.API = project.getAPI();
    this.extracted = this.API.newTranslationSet(project.getSourceLocale());
    this.newres = this.API.newTranslationSet(project.getSourceLocale());
    this.pseudo = this.API.newTranslationSet(project.getSourceLocale());
    this.logger = this.API.getLogger("loctool.plugin.webOSJSFileType");
    if (project.pseudoLocale && typeof project.pseudoLocale === "string") {
        project.pseudoLocale = [project.pseudoLocale];
    }
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
    // for use with missing strings
    if (!project.settings.nopseudo) {
        this.missingPseudo = this.API.getPseudoBundle(project.pseudoLocale, this, project);
    }

    if (project.settings.webos && project.settings.webos["commonXliff"]){
        this.commonPath = project.settings.webos["commonXliff"];
    }

    if (Object.keys(project.localeMap).length > 0){
        Utils.setBaseLocale(project.localeMap);
    }
};

var defaultMappings = {
    "**/*.dart": {
        "template": "[dir]/assets/i18n/[localeUnder].json"
    }
}

/**
 * Return the mapping corresponding to this path.
 * @param {String} pathName the path to check
 * @returns {Object} the mapping object corresponding to the
 * path or undefined if none of the mappings match
 */
DartFileType.prototype.getMapping = function(pathName) {
    if (typeof(pathName) === "undefined") {
        return undefined;
    }
    var dartSettings = this.project.settings.dart;
    var mappings = (dartSettings && dartSettings.mappings) ? dartSettings.mappings : defaultMappings;
    var patterns = Object.keys(mappings);

    var match = patterns.find(function(pattern) {
        return mm.isMatch(pathName, pattern);
    });

    return match && mappings[match];
}

/**
 * Return true if the given path is a Dart file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a Dart file, or false
 * otherwise
 */
DartFileType.prototype.handles = function(pathName) {
    this.logger.debug("DartFileType handles " + pathName + "?");
    var ret = false;
    if ((pathName.length > 3  && pathName.substring(pathName.length - 5) === ".dart")) {
        ret = true;
    }
    this.logger.debug(ret ? "Yes" : "No");
    return ret;
};

DartFileType.prototype.name = function() {
    return "Dart File Type";
};

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 * @param {String} template template for the output file
 * @param {String} pathname path to the source file
 * @param {String} locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
DartFileType.prototype.getLocalizedPath = function(mapping, pathname, locale) {
    if (!mapping) {
        mapping = this.getMapping(pathname);
    }

    var template = mapping && mapping.template;
    if (!template) {
        template = defaultMappings["**/*.dart"].template;
    }
    var isBaseLocale = Utils.isBaseLocale(locale);
    var loc = new Locale(locale);
    var lo = loc.getSpec();

    if (isBaseLocale) {
        lo = loc.getLanguage();
    }

    var path = Utils.formatPath(template, {
        locale: lo
    });
    return path;
};

DartFileType.prototype._addResource = function(resFileType, translated, res, locale) {
    var file;

    // if reskeys don't match, we matched on cleaned string.
    // so we need to overwrite reskey of the translated resource to match
    if (translated.reskey !== res.reskey) {
        translated.reskey = res.reskey;
    }
    var resource = translated.clone();
    resource.project = res.getProject();
    resource.datatype = res.getDataType();
    resource.setTargetLocale(locale);
    resource.pathName = res.getPath();
    file = resFileType.getResourceFile(locale, this.getLocalizedPath(res.mapping, res.getPath(), locale))
    file.addResource(resource);
}

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
DartFileType.prototype.write = function(translations, locales) {
    // distribute all the resources to their resource files
    // and then let them write themselves out

    var resFileType = this.project.getResourceFileType(this.resourceType);
    var customInheritLocale;
    var res, file,
        resources = this.extracted.getAll(),
        db = this.project.db,
        translationLocales = locales.filter(function(locale) {
            return locale !== this.project.sourceLocale && locale !== this.project.pseudoLocale;
        }.bind(this));

    if ((typeof(translations) !== 'undefined') && (typeof(translations.getProjects()) !== 'undefined') && (translations.getProjects().indexOf("common") !== -1)) {
        this.isloadCommonData = true;
    }
    if (this.commonPath) {
        if (!this.isloadCommonData) {
            this._loadCommonXliff();
            this.isloadCommonData = true;
        } else {
            this._addComonDatatoTranslationSet(translations);
        }
    }

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        // for each extracted string, write out the translations of it
        translationLocales.forEach(function(locale) {
            this.logger.trace("Localizing Dart strings to " + locale);
            customInheritLocale = this.project.getLocaleInherit(locale);

            db.getResourceByCleanHashKey(res.cleanHashKeyForTranslation(locale), function(err, translated) {
                var r = translated;
                if (!translated) {
                    db.getResourceByCleanHashKey(res.cleanHashKeyForTranslation(locale), function(err, translated) {
                    var r = translated;

                    if (!translated && this.isloadCommonData) {
                        var manipulateKey = ResourceString.hashKey(this.commonPrjName, locale, res.getKey(), this.commonPrjType, res.getFlavor());
                        db.getResourceByCleanHashKey(manipulateKey, function(err, translated) {
                            if (translated) {
                                this._addResource(resFileType, translated, res, locale);
                            } else if(!translated && customInheritLocale){
                                db.getResourceByCleanHashKey(res.cleanHashKeyForTranslation(customInheritLocale), function(err, translated) {
                                    if (!translated){
                                        var manipulateKey = ResourceString.hashKey(this.commonPrjName, customInheritLocale, res.getKey(), this.commonPrjType, res.getFlavor());
                                        db.getResourceByCleanHashKey(manipulateKey, function(err, translated) {
                                            if (translated){
                                                this._addResource(resFileType, translated, res, locale);
                                            } else {
                                                var newres = res.clone();
                                                newres.setTargetLocale(locale);
                                                newres.setTarget((r && r.getTarget()) || res.getSource());
                                                newres.setState("new");
                                                newres.setComment(note);
                                                this.newres.add(newres);
                                                this.logger.trace("No translation for " + res.reskey + " to " + locale);
                                            }
                                        }.bind(this));
                                    } else {
                                        this._addResource(resFileType, translated, res, locale);
                                    }
                                }.bind(this));
                            } else {
                                var newres = res.clone();
                                newres.setTargetLocale(locale);
                                newres.setTarget((r && r.getTarget()) || res.getSource());
                                newres.setState("new");
                                newres.setComment(note);
                                this.newres.add(newres);
                                this.logger.trace("No translation for " + res.reskey + " to " + locale);
                            }
                        }.bind(this));
                    } else if (!translated && customInheritLocale) {
                        db.getResourceByCleanHashKey(res.cleanHashKeyForTranslation(customInheritLocale), function(err, translated) {
                            var r = translated;
                            if (translated){
                                this._addResource(resFileType, translated, res, locale);
                            } else {
                                var newres = res.clone();
                                newres.setTargetLocale(locale);
                                newres.setTarget((r && r.getTarget()) || res.getSource());
                                newres.setState("new");
                                this.newres.add(newres);
                                this.logger.trace("No translation for " + res.reskey + " to " + locale);
                            }
                        }.bind(this));
                    } else if (!translated || ( this.API.utils.cleanString(res.getSource()) !== this.API.utils.cleanString(r.getSource()) &&
                        this.API.utils.cleanString(res.getSource()) !== this.API.utils.cleanString(r.getKey()))) {
                        if (r) {
                            this.logger.trace("extracted   source: " + this.API.utils.cleanString(res.getSource()));
                            this.logger.trace("translation source: " + this.API.utils.cleanString(r.getSource()));
                        }
                        var note = r && 'The source string has changed. Please update the translation to match if necessary. Previous source: "' + r.getSource() + '"';
                        var newres = res.clone();
                        newres.setTargetLocale(locale);
                        newres.setTarget((r && r.getTarget()) || res.getSource());
                        newres.setState("new");
                        newres.setComment(note);
                        this.newres.add(newres);
                        this.logger.trace("No translation for " + res.reskey + " to " + locale);
                    } else {
                        this._addResource(resFileType, translated, res, locale);
                    }
                }.bind(this));
                } else {
                    if (( this.API.utils.cleanString(res.getSource()) !== this.API.utils.cleanString(r.getSource()) &&
                            this.API.utils.cleanString(res.getSource()) !== this.API.utils.cleanString(r.getKey()))) {
                            if (r) {
                                this.logger.trace("extracted   source: " + this.API.utils.cleanString(res.getSource()));
                                this.logger.trace("translation source: " + this.API.utils.cleanString(r.getSource()));
                            }
                            var note = r && 'The source string has changed. Please update the translation to match if necessary. Previous source: "' + r.getSource() + '"';
                            var newres = res.clone();
                            newres.setTargetLocale(locale);
                            newres.setTarget((r && r.getTarget()) || res.getSource());
                            newres.setState("new");
                            newres.setComment(note);
                            this.newres.add(newres);
                            this.logger.trace("No translation for " + res.reskey + " to " + locale);
                        } else {
                            this._addResource(resFileType, translated, res, locale);
                        }
                    }
                }.bind(this));
            }.bind(this));
        }
    resources = [];
    var typeValue = this.type.replace("x-", "");
    if (this.project.settings[typeValue] === undefined ||
        (this.project.settings[typeValue] && !(this.project.settings[typeValue].disablePseudo === true))){
        resources = this.pseudo.getAll().filter(function(resource) {
            return resource.datatype === this.datatype;
        }.bind(this));
    }

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        if (res.getTargetLocale() !== this.project.sourceLocale && res.getSource() !== res.getTarget()) {
            file = resFileType.getResourceFile(res.getTargetLocale(), this.getLocalizedPath(res.mapping, res.getPath(), res.getTargetLocale()))
            file.addResource(res);
            this.logger.trace("Added " + res.reskey + " to " + file.pathName);
        }
    }
};

DartFileType.prototype.newFile = function(path) {
    return new DartFile({
        project: this.project,
        pathName: path,
        type: this
    });
};

DartFileType.prototype.getDataType = function() {
    return this.datatype;
};

DartFileType.prototype._addComonDatatoTranslationSet = function(tsdata) {
    var prots = this.project.getRepository().getTranslationSet();
    var commonts = tsdata.getBy({project: "common"});
    if (commonts.length > 0){
        this.commonPrjName = commonts[0].getProject();
        this.commonPrjType = commonts[0].getDataType();
        commonts.forEach(function(ts){
            prots.add(ts);
        }.bind(this));
    }
}

DartFileType.prototype._loadCommonXliff = function() {
    if (fs.existsSync(this.commonPath)){
        var list = fs.readdirSync(this.commonPath);
    }
    if (list && list.length !== 0) {
        list.forEach(function(file){
            var commonXliff = this.API.newXliff({
                sourceLocale: this.project.getSourceLocale(),
                project: this.project.getProjectId(),
                path: this.commonPath,
            });
            var pathName = path.join(this.commonPath, file);
            var data = fs.readFileSync(pathName, "utf-8");
            commonXliff.deserialize(data);
            var resources = commonXliff.getResources();
            var localts = this.project.getRepository().getTranslationSet();
            if (resources.length > 0){
                this.commonPrjName = resources[0].getProject();
                this.commonPrjType = resources[0].getDataType();
                resources.forEach(function(res){
                    localts.add(res);
                }.bind(this));
            }
        }.bind(this));
    }
};

DartFileType.prototype.getResourceTypes = function() {
    return {};
};

/**
 * Return the name of the node module that implements the resource file type, or
 * the path to a Dart file that implements the resource filetype.
 * @returns {Function|undefined} node module name or path, or undefined if this file type does not
 * need resource files
 */
DartFileType.prototype.getResourceFileType = function() {
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
DartFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Ensure that all resources collected so far have a pseudo translation.
 */
DartFileType.prototype.generatePseudo = function(locale, pb) {
    var resources = this.extracted.getBy({
        sourceLocale: pb.getSourceLocale()
    });
    this.logger.trace("Found " + resources.length + " source resources for " + pb.getSourceLocale());

    resources.forEach(function(resource) {
        this.logger.trace("Generating pseudo for " + resource.getKey());
        var res = resource.generatePseudo(locale, pb);
        if (res && res.getSource() !== res.getTarget()) {
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
DartFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
DartFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
DartFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
DartFileType.prototype.getExtensions = function() {
    return this.extensions;
};

module.exports = DartFileType;
