/*
 * QMLFileType.js - Represents a collection of QML files
 *
 * Copyright © 2020, JEDLSoft
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
var log4js = require("log4js");
var QMLFile = require("./QMLFile.js");
var TSResourceFileType = require("ilib-loctool-webos-ts-resource");
var logger = log4js.getLogger("loctool.plugin.QMLFileType");

var QMLFileType = function(project) {
    this.type = "x-qml";
    this.datatype = "x-qml";
    this.resourceType = "ts";

    this.project = project;
    this.API = project.getAPI();

    this.extensions = [ ".qml"];

    this.extracted = this.API.newTranslationSet(project.getSourceLocale());
    this.newres = this.API.newTranslationSet(project.getSourceLocale());
    this.pseudo = this.API.newTranslationSet(project.getSourceLocale());
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
    logger.debug("QMLFileType handles " + pathName + "?");
    var ret = false;
    if ((pathName.length > 4 && pathName.substring(pathName.length - 4) === ".qml") ||
        (pathName.length > 3 && pathName.substring(pathName.length - 3) === ".js")) {
        ret = true;
    } 

    logger.debug(ret ? "Yes" : "No");
    return ret;
};

QMLFileType.prototype.name = function() {
    return "QML File Type";
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

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];

        // for each extracted string, write out the translations of it
        translationLocales.forEach(function(locale) {
            logger.trace("Localizing QML strings to " + locale);

            db.getResourceByCleanHashKey(res.cleanHashKeyForTranslation(locale), function(err, translated) {
                var r = translated;
                if (!translated || ( this.API.utils.cleanString(res.getSource()) !== this.API.utils.cleanString(r.getSource()) &&
                    this.API.utils.cleanString(res.getSource()) !== this.API.utils.cleanString(r.getKey()))) {
                    if (r) {
                        logger.trace("extracted   source: " + this.API.utils.cleanString(res.getSource()));
                        logger.trace("translation source: " + this.API.utils.cleanString(r.getSource()));
                    }
                    var note = r && 'The source string has changed. Please update the translation to match if necessary. Previous source: "' + r.getSource() + '"';
                    var newres = res.clone();
                    newres.setTargetLocale(locale);
                    newres.setTarget((r && r.getTarget()) || res.getSource());
                    newres.setState("new");
                    newres.setComment(note);

                    this.newres.add(newres);

                    logger.trace("No translation for " + res.reskey + " to " + locale);
                } else {
                    if (res.reskey != r.reskey) {
                        // if reskeys don't match, we matched on cleaned string.
                        //so we need to overwrite reskey of the translated resource to match
                        r = r.clone();
                        r.reskey = res.reskey;
                    }

                    file = resFileType.getResourceFile(locale);
                    file.addResource(r);
                    logger.trace("Added " + r.reskey + " to " + file.pathName);
                }
            }.bind(this));
        }.bind(this));
    }

    resources = this.pseudo.getAll().filter(function(resource) {
        return resource.datatype === this.datatype;
    }.bind(this));

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        if (res.getTargetLocale() !== this.project.sourceLocale && res.getSource() !== res.getTarget()) {
            file = resFileType.getResourceFile(res.getTargetLocale());
            file.addResource(res);
            logger.trace("Added " + res.reskey + " to " + file.pathName);
        }
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
    return {};
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
