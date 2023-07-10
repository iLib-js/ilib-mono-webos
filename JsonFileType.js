/*
 * JSONFileType.js - Represents a collection of json files
 *
 * Copyright (c) 2023 JEDLSoft
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
var mm = require("micromatch");
var JsonFile = require("./JsonFile.js");

var JsonFileType = function(project) {
    this.type = "json";
    this.resourceType = "json";
    this.project = project;
    this.extensions = [".json"];
    this.datatype = "x-json";
    this.names = ["appinfo", "qcardinfo"];

    this.API = project.getAPI();
    this.logger = this.API.getLogger("loctool.plugin.webOSJSONFileType");
    this.extracted = this.API.newTranslationSet(project.getSourceLocale());
    this.newres = this.API.newTranslationSet(project.getSourceLocale());
    this.pseudo = this.API.newTranslationSet(project.getSourceLocale());
};

var defaultMappings = {
    "**/appinfo.json": {
        "template": "[dir]/[resourceDir]/[localeDir]/[filename]"
    }
}
/**
 * Return the mapping corresponding to this path.
 * @param {String} pathName the path to check
 * @returns {Object} the mapping object corresponding to the
 * path or undefined if none of the mappings match
 */
JsonFileType.prototype.getMappings = function(pathName) {
    if (typeof(pathName) === "undefined") {
        return undefined;
    }
    var mappings, match;
    var jsonMapSettings = this.project.settings && this.project.settings.jsonMap;
    if (jsonMapSettings) {
        mappings = jsonMapSettings.mappings || defaultMappings;
        var patterns = Object.keys(mappings);

        if (patterns) {
            match = patterns.find(function(pattern) {
                return mm.isMatch(pathName, pattern);
            });
        }
    }
    return match && mappings[match];
}

JsonFileType.prototype.getDefaultMapping = function() {
    return defaultMappings["**/appinfo.json"];
}

var alreadyLoc = new RegExp(/(^|\/)([a-z][a-z])((\/[A-Z][a-z][a-z][a-z])?)(\/([A-Z][A-Z])?)?\//);

/**
 * Return true if the given path is a appinfo.json or qcardinfo.json file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a appinfo.json or qcardinfo.json file, or false
 * otherwise
 */
JsonFileType.prototype.handles = function(pathName) {
    this.logger.debug("JsonFileTyp handles " + pathName + "?");
    if (!pathName) return false;
    
    var file = path.basename(pathName, ".json");
    ret = (this.names.indexOf(file) !== -1) ? true: false;

    // check if it's an already localized file.
    if (ret) {
        var match = alreadyLoc.exec(pathName);
        if (match && match.length > 2) {
            this.logger.debug("Already localized file");
            ret = false;
        }
    }
    return ret;
};

JsonFileType.prototype.name = function() {
    return "Json File Type";
};

JsonFileType.prototype.getResourceTypes = function() {
    return {};
}

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 */
JsonFileType.prototype.write = function(translations, locales) {
    // templates are localized individually, so we don't have to
    // write out the resources
};

JsonFileType.prototype.newFile = function(path) {
    return new JsonFile({
        project: this.project,
        pathName: path,
        type: this
    });
};

JsonFileType.prototype.getDataType = function() {
    return this.datatype;
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
JsonFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
JsonFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
JsonFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
JsonFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
JsonFileType.prototype.getExtensions = function() {
    return this.extensions;
};

/**
  * Called right before each project is closed
  * Allows the file type class to do any last-minute clean-up or generate any final files
  *
  * Generate manifest file based on created resource files
  */
JsonFileType.prototype.projectClose = function() {
    var resourceRoot = path.join(this.project.root, this.project.getResourceDirs("json")[0] || "resources");
    var manifestFile = new JsonFile({
            project: this.project,
            type: this
        });
    manifestFile.writeManifest(resourceRoot);
};

module.exports = JsonFileType;