/*
 * QMLFileType.js - Represents a collection of QML files
 *
 * Copyright (c) 2020-2023, 2025 JEDLSoft
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
var QMLFile = require("./QMLFile.js");
var TSResourceFileType = require("ilib-loctool-webos-ts-resource");
var ResourceString = require("loctool/lib/ResourceString.js");
var pluginUtils = require("ilib-loctool-webos-common/utils.js");

var QMLFileType = function(project) {
    this.type = "x-qml";
    this.datatype = "x-qml";
    this.resourceType = "ts";
    this.extensions = [ ".qml", ".js"];
    this.isloadCommonData = false;
    this.project = project;
    this.API = project.getAPI();
    this.extracted = this.API.newTranslationSet(project.getSourceLocale());
    this.newres = this.API.newTranslationSet(project.getSourceLocale());
    this.pseudo = this.API.newTranslationSet(project.getSourceLocale());
    this.logger = this.API.getLogger("loctool.plugin.webOSQmlFileType");
    if (typeof project.pseudoLocale === "string") {
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
};

/**
 * Return true if the given path is a qml or js file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a qml file, or false
 * otherwise
 */
QMLFileType.prototype.handles = function(pathName) {
    this.logger.debug("QMLFileType handles " + pathName + "?");
    var ret = false;
    if ((pathName.length > 4 && pathName.substring(pathName.length - 4) === ".qml") ||
        (pathName.length > 3 && pathName.substring(pathName.length - 3) === ".js")) {
        ret = true;
    } 

    this.logger.debug(ret ? "Yes" : "No");
    return ret;
};

QMLFileType.prototype.name = function() {
    return "QML File Type";
};

QMLFileType.prototype._getTranslationWithNewline = function(db, translated, res, locale, isCommon) {
    var newtranslated = translated;

    var newlinerestored = res.getSource().replace(/\n/g, "\\n");
    this.logger.debug("_getTranslationWithNewline: " + newlinerestored);
    var newres = res.clone();
    newres.source = newlinerestored;
    newres.sourcehash = this.API.utils.hashKey(newlinerestored);
    var manipulateKey;
    if (isCommon) {
        manipulateKey = ResourceString.hashKey(this.commonPrjName, locale, res.getKey().replace(/\n/g, "\\n"), this.commonPrjType, res.getFlavor());
    }
    else {
        manipulateKey = newres.cleanHashKeyForTranslation(locale).replace(newres.getContext(), "").replace(/\n/g, "\\n");
    }
    db.getResourceByCleanHashKey(manipulateKey, function(err, translated) {
        if (translated) {
            translated.source = res.source;
            translated.reskey = res.reskey;
            translated.setTarget(translated.getTarget().replace(/\\n/g, "\n"));
            newtranslated = translated;
        }
    }.bind(this));

    return newtranslated;
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
QMLFileType.prototype.write = function(translations, locales) {
    // distribute all the resources to their resource files
    // and then let them write themselves out

    var resFileType = this.project.getResourceFileType(this.resourceType);

    var res, file,
        resources = this.extracted.getAll(),
        db = this.project.db,
        translationLocales = locales.filter(function(locale) {
            return locale !== this.project.sourceLocale && locale !== this.project.pseudoLocale;
        }.bind(this));
    var customInheritLocale;

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
            this.logger.trace("Localizing QML strings to " + locale);
            customInheritLocale = this.project.getLocaleInherit(locale);

            db.getResourceByCleanHashKey(res.cleanHashKeyForTranslation(locale), function(err, translated) {
                var r = translated;
                if (!translated) {
                    var manipulateKey = res.cleanHashKeyForTranslation(locale).replace(res.getContext(), "");
                    db.getResourceByCleanHashKey(manipulateKey, function(err, translated) {
                    var r = translated;

                    if (!translated && res.getSource().includes("\n")) {
                        translated = this._getTranslationWithNewline(db, translated, res, locale, false);
                        r = translated;
                    }

                    if (!translated && this.isloadCommonData) {
                        var manipulateKey = ResourceString.hashKey(this.commonPrjName, locale, res.getKey(), this.commonPrjType, res.getFlavor());
                        db.getResourceByCleanHashKey(manipulateKey, function(err, translated) {
                            if (!translated && res.getSource().includes("\n")) {
                                translated = this._getTranslationWithNewline(db, translated, res, locale, true);
                                r = translated;
                            }
                            if (translated) {
                                pluginUtils.addResource(resFileType, translated, res, locale);
                            } else if(!translated && customInheritLocale){
                                var manipulateKey = res.cleanHashKeyForTranslation(customInheritLocale).replace(res.getContext(), "");
                                db.getResourceByCleanHashKey(manipulateKey, function(err, translated) {
                                    if (!translated && res.getSource().includes("\n")) {
                                        translated = this._getTranslationWithNewline(db, translated, res, customInheritLocale, false);
                                        r = translated;
                                    }

                                    if (!translated){
                                        var manipulateKey = ResourceString.hashKey(this.commonPrjName, customInheritLocale, res.getKey(), this.commonPrjType, res.getFlavor());
                                        db.getResourceByCleanHashKey(manipulateKey, function(err, translated) {
                                            if (!translated && res.getSource().includes("\n")) {
                                                translated = this._getTranslationWithNewline(db, translated, res, customInheritLocale, true);
                                                r = translated;
                                            }

                                            if (translated){
                                                pluginUtils.addResource(resFileType, translated, res, locale);
                                            } else {
                                                pluginUtils.addNewResource(this.newres, res, locale);
                                            }
                                        }.bind(this));
                                    } else {
                                        pluginUtils.addResource(resFileType, translated, res, locale);
                                    }
                                }.bind(this));
                            } else {
                                pluginUtils.addNewResource(this.newres, res, locale);
                            }
                        }.bind(this));
                    } else if (!translated && customInheritLocale) {
                        var manipulateKey = res.cleanHashKeyForTranslation(customInheritLocale).replace(res.getContext(),"");
                        db.getResourceByCleanHashKey(manipulateKey, function(err, translated) {
                            var r = translated;
                            if (!translated && res.getSource().includes("\n")) {
                                translated = this._getTranslationWithNewline(db, translated, res, customInheritLocale, false);
                                r = translated;
                            }
                            if (translated){
                                pluginUtils.addResource(resFileType, translated, res, locale);
                            } else {
                                pluginUtils.addNewResource(this.newres, res, locale);
                            }
                        }.bind(this));
                    } else if (!translated || ( this.API.utils.cleanString(res.getSource()) !== this.API.utils.cleanString(r.getSource()) &&
                        this.API.utils.cleanString(res.getSource()) !== this.API.utils.cleanString(r.getKey()))) {
                        if (r) {
                            this.logger.trace("extracted   source: " + this.API.utils.cleanString(res.getSource()));
                            this.logger.trace("translation source: " + this.API.utils.cleanString(r.getSource()));
                        }
                        pluginUtils.addNewResource(this.newres, res, locale);
                    } else {
                        if (res.reskey != r.reskey) {
                            // if reskeys don't match, we matched on cleaned string.
                            //so we need to overwrite reskey of the translated resource to match
                            r = r.clone();
                            r.reskey = res.reskey;
                        }
                        var storeResource = r.clone();

                        // To keep the extracted source's filename.  If not, xliff file name will be wrote to ts resource file.
                        storeResource.pathName = res.getPath();
                        storeResource.context = res.getContext() || res.getPath().replace(/^.*[\\\/]/, '').replace(/\.(qml|js)/, "");

                        file = resFileType.getResourceFile(locale);
                        file.addResource(storeResource);
                        this.logger.trace("Added " + r.reskey + " to " + file.pathName);
                    }
                }.bind(this));
                } else {
                    if (( this.API.utils.cleanString(res.getSource()) !== this.API.utils.cleanString(r.getSource()) &&
                            this.API.utils.cleanString(res.getSource()) !== this.API.utils.cleanString(r.getKey()))) {
                            if (r) {
                                this.logger.trace("extracted   source: " + this.API.utils.cleanString(res.getSource()));
                                this.logger.trace("translation source: " + this.API.utils.cleanString(r.getSource()));
                            }
                            pluginUtils.addNewResource(this.newres, res, locale);
                        } else {
                            if (res.reskey != r.reskey) {
                                // if reskeys don't match, we matched on cleaned string.
                                //so we need to overwrite reskey of the translated resource to match
                                r = r.clone();
                                r.reskey = res.reskey;
                            }
                            var storeResource = r.clone();

                            // To keep the extracted source's filename.  If not, xliff file name will be wrote to ts resource file.
                            storeResource.pathName = res.getPath();
                            storeResource.context = res.getContext() || res.getPath().replace(/^.*[\\\/]/, '').replace(/\.(qml|js)/, "");

                            file = resFileType.getResourceFile(locale);
                            file.addResource(storeResource);
                            this.logger.trace("Added " + r.reskey + " to " + file.pathName);
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
            file = resFileType.getResourceFile(res.getTargetLocale());
            file.addResource(res);
            this.logger.trace("Added " + res.reskey + " to " + file.pathName);
        }
    }
};

QMLFileType.prototype._addComonDatatoTranslationSet = function(tsdata) {
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

QMLFileType.prototype._loadCommonXliff = function() {
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

QMLFileType.prototype.newFile = function(path) {
    return new QMLFile({
        project: this.project,
        pathName: path,
        type: this
    });
};

QMLFileType.prototype.getDataType = function() {
    return this.datatype;
};

QMLFileType.prototype.getResourceTypes = function() {
    return {
        "string": "SourceContextResourceString"
    };
};

/**
 * Return the name of the node module that implements the resource file type, or
 * the path to a QML file that implements the resource filetype.
 * @returns {Function|undefined} node module name or path, or undefined if this file type does not
 * need resource files
 */
QMLFileType.prototype.getResourceFileType = function() {
    return TSResourceFileType;
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
QMLFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Ensure that all resources collected so far have a pseudo translation.
 */
QMLFileType.prototype.generatePseudo = function(locale, pb) {
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
QMLFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
QMLFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
QMLFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
QMLFileType.prototype.getExtensions = function() {
    return this.extensions;
};

module.exports = QMLFileType;
