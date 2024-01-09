/*
 * JSONResourceFile.js - represents an JSON style resource file
 *
 * Copyright (c) 2019-2023, JEDLSoft
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
var Locale = require("ilib/lib/Locale.js");
var Utils = require("loctool/lib/utils.js");

/**
 * @class Represents an JSON resource file.
 * The props may contain any of the following properties:
 *
 * <ul>
 * <li>project - the name of the project for this file
 * <li>pathName - the path to the file, relative to the root of the project
 * <li>type - type of this resource file
 * <li>locale - the locale of this file
 * </ul>
 * @param {Object} props properties that control the construction of this file.
 */
var JSONResourceFile = function(props) {
    this.project = props.project;
    this.locale = new Locale(props.locale);
    this.API = props.project.getAPI();
    this.logger = this.API.getLogger("loctool.plugin.webOSJsonResourceFile");
    if (Object.keys(this.project.localeMap).length > 0) {
        Utils.setBaseLocale(this.project.localeMap);
    }
    this.baseLocale = Utils.isBaseLocale(this.locale.getSpec());
    this.set = this.API.newTranslationSet(this.project && this.project.sourceLocale || "en-US");
};

/**
 * We don't read javascript resource files. We only write them.
 */
JSONResourceFile.prototype.extract = function() {};

/**
 * Get the locale of this resource file. For JSON resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
JSONResourceFile.prototype.getLocale = function() {
    return this.locale;
};
/**
 * Get the locale of this resource file. For JSON resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
JSONResourceFile.prototype.getContext = function() {
    return this.context;
};

/**
 * Get all resources from this file. This will return all resources
 * of mixed types (strings, arrays, or plurals).
 *
 * @returns {Resource} all of the resources available in this resource file.
 */
JSONResourceFile.prototype.getAll = function() {
    return this.set.getAll();
};

/**
 * Add a resource to this file. The locale of the resource
 * should correspond to the locale of the file, and the
 * context of the resource should match the context of
 * the file.
 *
 * @param {Resource} res a resource to add to this file
 */
JSONResourceFile.prototype.addResource = function(res) {
    this.logger.trace("JSONResourceFile.addResource: " + JSON.stringify(res) + " to " + this.project.getProjectId() + ", " + this.locale + ", " + JSON.stringify(this.context));
    var resLocale = res.getTargetLocale() || res.getSourceLocale();
    if (res && res.getProject() === this.project.getProjectId() && resLocale === this.locale.getSpec()) {
        this.logger.trace("correct project, context, and locale. Adding.");
        this.set.add(res);
    } else {
        if (res) {
            if (res.getProject() !== this.project.getProjectId()) {
                this.logger.warn("Attempt to add a resource to a resource file with the incorrect project.");
            } else {
                this.logger.warn("Attempt to add a resource to a resource file with the incorrect locale. " + resLocale + " vs. " + this.locale.getSpec());
            }
        } else {
            this.logger.warn("Attempt to add an undefined resource to a resource file.");
        }
    }
};

/**
 * Return true if this resource file has been modified
 * since it was loaded from disk.
 *
 * @returns {boolean} true if this resource file has been
 * modified since it was loaded
 */
JSONResourceFile.prototype.isDirty = function() {
    return this.set.isDirty();
};

// we don't localize resource files
JSONResourceFile.prototype.localize = function() {};

function clean(str) {
    if (!str) return;
    return str.replace(/\s+/, " ").trim();
}

/**
 * @private
 */
JSONResourceFile.prototype.getDefaultSpec = function() {
    if (!this.defaultSpec) {
        this.defaultSpec = this.project.settings.localeDefaults ?
            this.API.utils.getLocaleDefault(this.locale, this.flavor, this.project.settings.localeDefaults) :
            this.locale.getSpec();
    }

    return this.defaultSpec;
};

/**
 * @private
 */
JSONResourceFile.prototype._isPluralData = function(data) {
    //if (this.project.getProjectType() !== 'webos-dart') return false;
    if (this.project.options.projectType !== 'webos-dart') return false;

    if (data.indexOf("#" !== -1) && data.indexOf("|") !== -1) {
        return true;
    }
    return false;
};

/**
 * @private
 */
JSONResourceFile.prototype._parsePluralData = function(data) {
    var splitData = data.split("|");
    var parsePlural = {};
    if (splitData.length > 0) {
        splitData.forEach(function(item){
            var categoryMap = {
                "0" : "zero",
                "1" : "one",
                "2" : "two"
            } 

            var parse = item.split("#");
            if (categoryMap[parse[0]] !== undefined) parse[0] = categoryMap[parse[0]];
            if (parse[0] === '') parse[0] = "other";
            parsePlural[parse[0]] = parse[1];

        }.bind(this));
    }

    return parsePlural;
};

/**
 * Generate the content of the resource file.
 *
 * @private
 * @returns {String} the content of the resource file
 */
JSONResourceFile.prototype.getContent = function() {
    var json = {};

    if (this.set.isDirty()) {
        var resources = this.set.getAll();

        // make sure resources are sorted by key so that git diff works nicely across runs of the loctool
        resources.sort(function(left, right) {
            return (left.getKey() < right.getKey()) ? -1 : (left.getKey() > right.getKey() ? 1 : 0);
        });

        for (var j = 0; j < resources.length; j++) {
            var resource = resources[j];
            var result = this._isPluralData(resource.getTarget());
            if (result) {
                var data = this._parsePluralData(resource.getTarget());
                resource.setTarget(data);
            }

            if (resource.getSource() && resource.getTarget()) {
                this.logger.trace("writing translation for " + resource.getKey() + " as " + resource.getTarget());
                json[resource.getKey()] = this.project.settings.identify ?
                    '<span loclang="javascript" locid="' + resource.getKey() + '">' + resource.getTarget() + '</span>' :
                    resource.getTarget();
            } else {
                this.logger.warn("String resource " + resource.getKey() + " has no source text. Skipping...");
            }
        }
    }

    // allow for a project-specific prefix to the file to do things like importing modules and such
    var output = "";
    var settings = this.project.settings;
    if (settings && settings.JSONResourceFile && settings.JSONResourceFile.prefix) {
        output = settings.JSONResourceFile.prefix;
    }
    
    output += JSON.stringify(json, undefined, 4);

    // take care of double-escaped unicode chars
    output = output.replace(/\\\\u/g, "\\u");

    return output;
};

/**
 * @private
 */
JSONResourceFile.prototype._calcLocalePath = function(locale, filename) {
    var rootLocale = "en-US";
    var loc = new Locale(locale);
    var lo = loc.getSpec();
    var path = "";
    var resDir = this.project.getResourceDirs("json")[0] || ".";
    var mappingData = this.getMappings(filename);
    
    if (this.baseLocale) {
        if (locale !== rootLocale) {
            lo = loc.getLanguage();
        }
    }
    var path = this.API.utils.formatPath(mappingData.template, {
        sourcepath: filename,
        resourceDir: resDir,
        locale: lo
    });

    // the file under en/US directory, it has to be located in the resource root
    path = path.replace(/en\/([^A-Z])/, "$1");
    return path;
}

/**
 * Find the path for the resource file for the given project, context,
 * and locale.
 *
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @param {String|undefined} flavor the name of the flavor if any
 * @return {String} the ios strings resource file path that serves the
 * given project, context, and locale.
 */
JSONResourceFile.prototype.getResourceFilePath = function(locale, flavor) {
    locale = locale || this.locale;
    var newPath, localePath;
    var filename = "strings.json";

    if (this.project.settings.resourceFileNames && this.project.settings.resourceFileNames["json"]){
        filename = this.project.settings.resourceFileNames["json"];
    }
    if (this.project.options.projectType) {
        var projectType = this.project.options.projectType.split("-");
        //var projectType = this.project.getProjectType().split("-");
        if (projectType[1] === "c" || projectType[1] === "cpp" || projectType[1] === "dart") {
            filename = this.project.settings.resourceFileNames[projectType[1]];
        }
    }
    
    localePath = this._calcLocalePath(locale, filename);
    newPath = path.join(this.project.target, localePath);
    
    this.logger.trace("Getting resource file path for locale " + locale + ": " + newPath);
    return newPath;
};

var defaultMappings = {
    "strings.json": {
        "template": "[dir]/[resourceDir]/[localeDir]/[filename]"
    }
}

JSONResourceFile.prototype._isExistMappingData = function(filename) {
    var jsonMap = this.project.options?.settings?.jsonMap?.mappings[filename];
    return (typeof jsonMap !== 'undefined') ? jsonMap : undefined;
}

JSONResourceFile.prototype.getMappings = function(filename) {
    if (!filename) return undefined;
    var result = this._isExistMappingData(filename);
    return (typeof result !== 'undefined') ? result : defaultMappings["strings.json"];
}

/**
 * Write the resource file out to disk again.
 */
JSONResourceFile.prototype.write = function() {
    this.logger.trace("writing resource file. [" + this.project.getProjectId() + "," + this.locale + "]");
    if (this.set.isDirty()) {
        this.defaultSpec = this.locale.getSpec();

        if (!this.pathName) {
            this.pathName = this.getResourceFilePath();
        }

        var js = this.getContent();
        if (js !== "{}") {
            this.logger.debug("Wrote string translations to file " + this.pathName);
            dir = path.dirname(this.pathName);
            this.API.utils.makeDirs(dir);
            fs.writeFileSync(this.pathName, js, "utf8");
        }
    } else {
        this.logger.debug("File " + this.pathName + " is not dirty. Skipping.");
    }
};

/**
 * Write the manifest file to disk.
 */
JSONResourceFile.prototype.writeManifest = function(filePath) {
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
    //var manifestFilePath = (this.project.getProjectType() === 'webos-dart') ? path.join(filePath, "fluttermanifest.json") : path.join(filePath, "ilibmanifest.json");
    var manifestFilePath = (this.project.options.projectType === 'webos-dart') ?
                           path.join(filePath, "fluttermanifest.json") : path.join(filePath, "ilibmanifest.json");
    var readManifest, data;
    if (fs.existsSync(manifestFilePath)) {
        readManifest = fs.readFileSync(manifestFilePath, {encoding:'utf8'});
        data = JSON.parse(readManifest)
    }
    if ((!data || data["generated"] === undefined) && manifest.files.length > 0) {
        for (var i=0; i < manifest.files.length; i++) {
            this.logger.info("Writing out", path.join(filePath, manifest.files[i]) + " to Manifest file");
        }
        manifest["l10n_timestamp"] = new Date().getTime().toString();
        manifest["generated"] = true;
        fs.writeFileSync(manifestFilePath, JSON.stringify(manifest, undefined, 4), 'utf8');
    }
};

/**
 * Return the set of resources found in the current JSON
 * resource file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current Java file.
 */
JSONResourceFile.prototype.getTranslationSet = function() {
    return this.set;
}

module.exports = JSONResourceFile;