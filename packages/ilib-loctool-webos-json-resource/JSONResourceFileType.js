/*
 * JSONResourceFileType.js - Represents a collection of JSON files
 *
 * Copyright (c) 2019-2022, 2024 JEDLSoft
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

var path = require("path");
var JSONResourceFile = require("./JSONResourceFile.js");

/**
 * @class Manage a collection of JSON resource files.
 *
 * @param {Project} project that this type is in
 */
var JSONResourceFileType = function(project) {
    this.type = "json";
    this.datatype = "json";
    this.extensions = [".json"];
    this.project = project;
    this.resourceFiles = {};
    
    this.API = project.getAPI();
    this.logger = this.API.getLogger("loctool.plugin.webOSJsonResourceFileType");
    this.extracted = this.API.newTranslationSet(project.getSourceLocale());
    this.newres = this.API.newTranslationSet(project.getSourceLocale());
    this.pseudo = this.API.newTranslationSet(project.getSourceLocale());
};

/**
 * Return true if this file type handles the type of file in the
 * given path name.
 * @param {String} pathName the path to check
 * @returns true if this file type handles the given path name, and
 * false otherwise
 */
JSONResourceFileType.prototype.handles = function(pathName) {
    // json resource files are only generated. Existing ones are never read in.
    this.logger.debug("JSONResourceFileType handles " + pathName + "?");
    this.logger.debug("No");
    return false;
};

/**
 * Write out all resources for this file type. For JSON resources, each
 * resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write out.
 */
JSONResourceFileType.prototype.write = function() {
    this.logger.trace("Now writing out " + Object.keys(this.resourceFiles).length + " resource files");
    for (var hash in this.resourceFiles) {
        var file = this.resourceFiles[hash];
        file.write();
    }
};

JSONResourceFileType.prototype.name = function() {
    return "JSON Resource File";
};

/**
 * Return a new file of the current file type using the given
 * path name.
 *
 * @param {String} pathName the path of the resource file
 * @return {JSONResourceFile} a resource file instance for the
 * given path
 */
JSONResourceFileType.prototype.newFile = function(pathName, options) {
    var file = new JSONResourceFile({
        project: this.project,
        pathName: pathName,
        locale: (options && options.locale) || this.project.sourceLocale,
        type: this,
        API: this.API
    });

    var locale = file.getLocale();
    this.resourceFiles[locale] = file;
    return file;
};

/**
 * Find or create the resource file object for the given project, context,
 * and locale.
 *
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @return {JSONResourceFile} the JSON resource file that serves the
 * given project, context, and locale.
 */
JSONResourceFileType.prototype.getResourceFile = function(locale, pathName) {
    var key = locale || this.project.sourceLocale;
    var resfile = this.resourceFiles && this.resourceFiles[key];

    if (!resfile) {
        resfile = this.resourceFiles[key] = new JSONResourceFile({
            project: this.project,
            locale: key,
            pathName: pathName
        });

        this.logger.trace("Defining new resource file");
    }

    return resfile;
};

JSONResourceFileType.prototype.getDataType = function() {
    return this.datatype;
};

JSONResourceFileType.prototype.getResourceTypes = function() {
    return {};
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
JSONResourceFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
JSONResourceFileType.prototype.getExtensions = function() {
    return this.extensions;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
JSONResourceFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
JSONResourceFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
JSONResourceFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

/**
 * Called right before each project is closed
 * Allows the file type class to do any last-minute clean-up or generate any final files
 *
 * Generate manifest file based on created resource files
 */
JSONResourceFileType.prototype.projectClose = function() {
    var resourceRoot = path.join(this.project.target, this.project.getResourceDirs("json")[0] || "resources");
    var manifestFile = new JSONResourceFile({project: this.project});
    manifestFile.writeManifest(resourceRoot);
};
module.exports = JSONResourceFileType;