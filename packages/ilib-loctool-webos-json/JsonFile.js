/*
 * JsonFile.js - plugin to extract resources from a json code file
 *
 * Copyright (c) 2023,2025 JEDLSoft
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
var Utils = require("loctool/lib/utils.js");
var ResourceString = require("loctool/lib/ResourceString.js");
var PseudoFactory = require("loctool/lib/PseudoFactory.js");
var Locale = require("ilib/lib/Locale");
var pluginUtils = require("ilib-loctool-webos-common/utils.js");

/**
 * Create a new json file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project file
 * @param {FileType} type the file type of this instance
 */
var JsonFile = function(props) {
    this.project = props.project;
    this.pathName = props.pathName;
    this.datatype = "x-json";
    this.API = props.project.getAPI();

    if (Object.keys(this.project.localeMap).length > 0) {
        Utils.setBaseLocale(this.project.localeMap);
    }
    this.baseLocale = Utils.isBaseLocale(props.locale);
    this.type = props.type;
    this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
    this.logger = this.API.getLogger("loctool.plugin.webOSJSONFile");
    this.mapping = this.type.getMappings(this.pathName);

    if (props.project.settings.webos && props.project.settings.webos["commonXliff"]){
        this.commonPath = props.project.settings.webos["commonXliff"];
    }
};

/**
 * Unescape the string to make the same string that would be
 * in memory in the target programming language.
 *
 * @static
 * @param {String} string the string to unescape
 * @returns {String} the unescaped string
 */
JsonFile.unescapeString = function(string) {
    var unescaped = string;

    unescaped = unescaped.
        replace(/\\\\n/g, "").                // line continuation
        replace(/\\\n/g, "").                // line continuation
        replace(/^\\\\/, "\\").             // unescape backslashes
        replace(/([^\\])\\\\/g, "$1\\").
        replace(/^\\'/, "'").               // unescape quotes
        replace(/([^\\])\\'/g, "$1'").
        replace(/^\\"/, '"').
        replace(/([^\\])\\"/g, '$1"');

    return unescaped;
};

/**
 * Clean the string to make a resource name string. This means
 * removing leading and trailing white space, compressing
 * whitespaces, and unescaping characters. This changes
 * the string from what it looks like in the source
 * code but increases matching.
 *
 * @static
 * @param {String} string the string to clean
 * @returns {String} the cleaned string
 */
JsonFile.cleanString = function(string) {
    var unescaped = JsonFile.unescapeString(string);

    unescaped = unescaped.
        replace(/\\[btnfr]/g, " ").
        replace(/[ \n\t\r\f]+/g, " ").
        trim();

    return unescaped;
};

/**
 * Make a new key for the given string. This must correspond
 * exactly with the code in file so that the
 * resources match up. See the class IResourceBundle in
 * this project under the directory for the corresponding
 * code.
 *
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique key for this string
 */
JsonFile.prototype.makeKey = function(source) {
    return JsonFile.unescapeString(source);
};

JsonFile.prototype.loadSchema = function(source) {
    var localizeProperties = {}, schemaFilePath;
    var filename = path.basename(this.pathName || "", ".json");
    var filedir= path.dirname(this.pathName || "");

    if (this.project.schema) {
        schemaFilePath = path.join(process.env.PWD, this.project.schema);
    } else if (filename == "appinfo") {
        schemaFilePath = path.join(__dirname, "schema/appinfo.schema.json");
    } else {
        schemaFilePath = path.join(filedir, filename + ".schema.json");
    }

    this.logger.debug("JsonFileTyp load Schema File " + schemaFilePath + "?");
    var loadSchemaFile, schemaData;

    if (fs.existsSync(schemaFilePath)) {
        loadSchemaFile = fs.readFileSync(schemaFilePath, "utf-8");
        schemaData = JSON.parse(loadSchemaFile);
    } else {
        this.logger.warn("Could not open schema file: " + schemaFilePath);
    }

    for (var key in schemaData.properties) {
        if (schemaData.properties[key].localizable == true) {
            localizeProperties[key] = schemaData.properties[key];
        }
    }
    return localizeProperties;
};

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String|Object} data to parse
 */
JsonFile.prototype.parse = function(data) {
    this.logger.debug("Extracting strings from " + this.pathName);

    this.parsedData = data;

    if (typeof data !== "object") {
        this.parsedData = JSON.parse(data);
    }

    if (!this.schema) {
        this.schema = this.loadSchema();
    }
    this.resourceIndex = 0;
    for (var property in this.schema) {
        if ((this.parsedData[property]) &&
            (this.schema[property].type === typeof this.parsedData[property])) {
            var r = this.API.newResource({
                resType: "string",
                project: this.project.getProjectId(),
                key: JsonFile.unescapeString(this.parsedData[property]),
                sourceLocale: this.project.sourceLocale,
                source: JsonFile.cleanString(this.parsedData[property]),
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: undefined,
                datatype: this.datatype,
                index: this.resourceIndex++
            });
            this.set.add(r);
        } else {
            this.logger.debug("[" + property + "] property doesn't have localized `true` or not match the required data type.");
        }
    }
};

/**
 * Extract all the localizable strings from the json file and add them to the
 * project's translation set.
 */
JsonFile.prototype.extract = function() {
    this.logger.debug("Extracting strings from " + this.pathName);
    if (this.pathName) {
        var p = path.join(this.project.root, this.pathName);
        try {
            var data = fs.readFileSync(p, "utf-8");
            if (data) {
                this.parse(data);
            }
        } catch (e) {
            this.logger.warn("Could not read file: " + p);
        }
    }
};

/**
 * Return the set of resources found in the current json file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current json file.
 */
JsonFile.prototype.getTranslationSet = function() {
    return this.set;
}

// we don't localize or write json source files
JsonFile.prototype.write = function() {};

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 * @param {String] locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
JsonFile.prototype.getLocalizedPath = function(locale) {
    var mapping = this.mapping || this.type.getMappings(this.pathName || "") || this.type.getDefaultMapping();
    var rootLocale = "en-US";
    var loc = new Locale(locale);
    this.baseLocale = Utils.isBaseLocale(locale);
    var resDir = this.project.getResourceDirs("json")[0] || ".";
    var lo = loc.getSpec();

    if (this.baseLocale) {
        if (locale !== rootLocale) {
            lo = loc.getLanguage();
        }
    }
    var path = this.API.utils.formatPath(mapping.template, {
        sourcepath: this.pathName,
        resourceDir: resDir,
        locale: lo
    });

    // the file under en/US directory, it has to be located in the resource root
    path = path.replace("/en\/US/", "/");
    return path;
};

JsonFile.prototype.getfullLocalizedPath = function(locale) {
    var respath = this.getLocalizedPath(locale);
    return path.join(this.project.target, respath);
}

JsonFile.prototype._addNewResource = function(text, key, locale) {
    var newres = this.API.newResource({
        resType: "string",
        project: this.project.getProjectId(),
        key: this.makeKey(this.API.utils.escapeInvalidChars(text)),
        sourceLocale: this.project.getSourceLocale(),
        source: this.API.utils.escapeInvalidChars(text),
        targetLocale: locale,
        target: this.API.utils.escapeInvalidChars(text),
        reskey: key,
        state: "new",
        datatype: this.datatype
    });
    this.type.newres.add(newres);
}

JsonFile.prototype._getBaseTranslation = function(locale, translations, tester) {
    if (!locale) return;

    var rootLocale = 'en-US';
    var langDefaultLocale = Utils.getBaseLocale(locale);
    if (langDefaultLocale === locale) {
        langDefaultLocale = rootLocale;
    }

    var translated = null;

    // Get translation for baseLocale
    if (locale !== rootLocale) {
        var hashkey = tester.hashKeyForTranslation(langDefaultLocale);
        var alternativeKey = ResourceString.hashKey(tester.getProject(), langDefaultLocale, tester.getKey(), "javascript", tester.getFlavor());
        translated = translations.getClean(hashkey) || translations.getClean(alternativeKey);

        // If no translation is found for baseLocale, get translation for 'en-US'
        if (!translated && langDefaultLocale !== rootLocale) {
            hashkey = tester.hashKeyForTranslation(rootLocale);
            alternativeKey = ResourceString.hashKey(tester.getProject(), rootLocale, tester.getKey(), "javascript", tester.getFlavor());
            translated = translations.getClean(hashkey) || translations.getClean(alternativeKey);
        }
    }

    // Return the original string if no translation is found for baseLocales
    return translated ? translated.target : tester.getKey();
}

/**
 * Localize the text of the current file to the given locale and return
 * the results.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String} the localized text of this file
 */
JsonFile.prototype.localizeText = function(translations, locale) {
    var deviceType = pluginUtils.getDeviceType(this.project.settings);
    var output = {};
    var stringifyOuput = "";
    var baseTranslation;
    var customInheritLocale;
    for (var property in this.parsedData) {
        if (this.schema && this.schema[property]){
            var text = this.parsedData[property];
            var key = this.makeKey(this.API.utils.escapeInvalidChars(text));
            var tester = this.API.newResource({
                resType: "string",
                project: this.project.getProjectId(),
                sourceLocale: this.project.getSourceLocale(),
                reskey: key,
                datatype: this.datatype
            });
            var hashkey = tester.hashKeyForTranslation(locale);
            var alternativeKey = hashkey.replace("x-json", "javascript");

            var translated = translations.getClean(hashkey) || translations.getClean(alternativeKey);
            customInheritLocale = this.project.getLocaleInherit(locale);
            baseTranslation = key;
            
            var typeValue = this.datatype.replace("x-", "");
            if (!this.project.settings.nopseudo && ((this.project.settings[typeValue] === undefined) ||
                (this.project.settings[typeValue] &&
                !(this.project.settings[typeValue].disablePseudo === true))) &&
                PseudoFactory.isPseudoLocale(locale, this.project)){
                output[property] = this.type.pseudos[locale].getString(key);
            } else {
                if (translated) {
                    baseTranslation = this._getBaseTranslation(locale, translations, tester);
                    if (baseTranslation !== translated.target) {
                        output[property] = pluginUtils.getTarget(translated, deviceType);
                    }
                } else if (!translated && this.isloadCommonData){
                    var comonDataKey = ResourceString.hashKey(this.commonPrjName, locale, tester.getKey(), this.commonPrjType, tester.getFlavor());
                    translated = translations.getClean(comonDataKey);
                    if (translated) {
                        baseTranslation = this._getBaseTranslation(locale, translations, tester);
                        if (baseTranslation !== translated.target) {
                            output[property] = pluginUtils.getTarget(translated, deviceType);
                        }
                    } else if (!translated && customInheritLocale) {
                        var hashkey2 = tester.hashKeyForTranslation(customInheritLocale);
                        var alternativeKey2 = ResourceString.hashKey(tester.getProject(), customInheritLocale, tester.getKey(), "javascript", tester.getFlavor());
                        var translated2 = translations.getClean(hashkey2) || translations.getClean(alternativeKey2);
                        if (translated2) {
                            baseTranslation = this._getBaseTranslation(locale, translations, tester);
                            if (baseTranslation !== translated2.target) {
                                output[property] = translated2.target;
                            }
                        } else {
                            this.logger.trace("New string found: " + text);
                            this._addNewResource(text, key, locale);
                        }
                    } else {
                        this.logger.trace("New string found: " + text);
                        this._addNewResource(text, key, locale);
                    }
                } else if(!translated && customInheritLocale) {
                    var hashkey2 = tester.hashKeyForTranslation(customInheritLocale);
                    var alternativeKey2 = ResourceString.hashKey(tester.getProject(), customInheritLocale, tester.getKey(), "javascript", tester.getFlavor());
                    var translated2 = translations.getClean(hashkey2) || translations.getClean(alternativeKey2);
                    if (translated2) {
                        baseTranslation = translated2.target;
                        output[property] = translated2.target;
                    } else {
                        this.logger.trace("New string found: " + text);
                        this._addNewResource(text, key, locale);
                    }
                } else {
                    this.logger.trace("New string found: " + text);
                    this._addNewResource(text, key, locale);
                }
           }
        }
    }

    if (output) {
        stringifyOuput = JSON.stringify(output, true, 4);
    }
    return stringifyOuput;
}

/**
  * Localize the contents of this json file and write out the
  * localized json file to a different file path.
  *
  * @param {TranslationSet} translations the current set of
  * translations
  * @param {Array.<String>} locales array of locales to translate to
  */
JsonFile.prototype.localize = function(translations, locales) {
    // don't localize if there is no text

    if ((typeof(translations) !== 'undefined') && (typeof(translations.getProjects()) !== 'undefined') && (translations.getProjects().indexOf("common") !== -1)) {
        this.isloadCommonData = true;
    }

    if (this.commonPath) {
        if (!this.isloadCommonData) {
            this._loadCommonXliff(translations);
            this.isloadCommonData = true;
        } else {
            this._addComonDatatoTranslationSet(translations);
        }
    }
    
    for (var i=0; i < locales.length; i++) {
       if (!this.project.isSourceLocale(locales[i])) {
            var translatedOutput = this.localizeText(translations, locales[i]);
            if (translatedOutput !== "{}") {
                var pathName = this.getLocalizedPath(locales[i]);
                var d = path.dirname(pathName);
                this.API.utils.makeDirs(d);
                fs.writeFileSync(pathName, translatedOutput, "utf-8");
            }
        }
    }
};

JsonFile.prototype._addComonDatatoTranslationSet = function(tsdata) {
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

JsonFile.prototype._loadCommonXliff = function(tsdata) {
    if (fs.existsSync(this.commonPath)){
        var list = fs.readdirSync(this.commonPath);
    }
    var xliffStyle = (this.project.settings && this.project.settings.xliffStyle) ? this.project.settings.xliffStyle : "webOS";
    if (list && list.length !== 0) {
        list.forEach(function(file){
            var commonXliff = this.API.newXliff({
                sourceLocale: this.project.getSourceLocale(),
                project: this.project.getProjectId(),
                path: this.commonPath,
                style: xliffStyle
            });
            var pathName = path.join(this.commonPath, file);
            var data = fs.readFileSync(pathName, "utf-8");
            commonXliff.deserialize(data);
            var resources = commonXliff.getResources();
            
            if (resources.length > 0){
                this.commonPrjName = resources[0].getProject();
                this.commonPrjType = resources[0].getDataType();
                resources.forEach(function(res){
                    tsdata.add(res);
                }.bind(this));
            }
        }.bind(this));
    }
};

/**
  * Write the manifest file to dist.
  */
JsonFile.prototype.writeManifest = function(filePath) {
    var manifest = {
        files: []
    };

    if (!fs.existsSync(filePath)) return;

    function walk(root, dir) {
        var list = fs.readdirSync(path.join(root, dir));
        list.forEach(function (file) {
            var sourcePathRelative = path.join(dir, file);
            var sourcePath = path.join(root, sourcePathRelative);
            var stat = fs.statSync(sourcePath);
            if (stat && stat.isDirectory()) {
                walk(root, sourcePathRelative);
            } else {
                if (file.match(/\.json$/) && (file !== "ilibmanifest.json")) {
                    manifest.files.push(sourcePathRelative);
                }
            }
        });
    }

    walk(filePath, "");
    var manifestFilePath = path.join(filePath, "ilibmanifest.json");
    var readManifest, data;
    if (fs.existsSync(manifestFilePath)) {
        readManifest = fs.readFileSync(manifestFilePath, {encoding: 'utf-8'});
        data = JSON.parse(readManifest)
    }
    if ((!data || data["generated"] === undefined) && manifest.files.length > 0) {
        for (var i=0; i < manifest.files.length; i++) {
            this.logger.info("Writing out", path.join(filePath, manifest.files[i]) + " to Manifest file");
        }
        manifest["l10n_timestamp"] = new Date().getTime().toString();
        manifest["generated"] = true;
        fs.writeFileSync(manifestFilePath, JSON.stringify(manifest, undefined, 4), 'utf-8');
    }
}

module.exports = JsonFile;