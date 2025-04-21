/*
 * DartFile.js - plugin to extract resources from a Dart source code file
 *
 * Copyright (c) 2023-2025, JEDLSoft
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

/**
 * Create a new Dart file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project file
 * @param {FileType} type the file type of this instance
 */
var DartFile = function(props) {
    this.project = props.project;
    this.pathName = props.pathName;
    this.type = props.type;
    this.API = props.project.getAPI();
    this.logger = this.API.getLogger("loctool.plugin.webOSJSFile");
    this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
    this.mapping = this.type.getMapping(this.pathName);
};

/**
 * Unescape the string to make the same string that would be
 * in memory in the target programming language.
 *
 * @static
 * @param {String} string the string to unescape
 * @returns {String} the unescaped string
 */
DartFile.unescapeString = function(string) {
    var unescaped = string;

    unescaped = unescaped.
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
DartFile.cleanString = function(string) {
    var unescaped = DartFile.unescapeString(string);

    unescaped = unescaped.
        replace(/\\[btnfr]/g, " ").
        replace(/[ \n\t\r\f]+/g, " ").
        trim();

    return unescaped;
};
/**
 * Remove single and multi-lines comments except for i18n comment style.
 *
 * @private
 * @param {String} string the string to clean
 * @returns {String} the cleaned string
 */
DartFile.trimComments = function(data) {
    if (!data) return;
    // comment style: // , /* */ single, multi line
    var trimData = data.replace(/\/\/\s*((?!i18n).)*[$/\n]/g, "").
                    replace(/\/\*+([^*]|\*(?!\/))*\*+\//g, "").
                    replace(/\/\*(.*)\*\//g, "");
    return trimData;
};

/**
 * Make a new key for the given string. This must correspond
 * exactly with the code in the xliff file so that the
 * resources match up. 
 *
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique key for this string
 */
DartFile.prototype.makeKey = function(source) {
    return DartFile.unescapeString(source).replace(/\s+/gm, ' ');
};

/*
translate("High")
translate("High", key: "home_connect_210") // will be supported for webos
translate("{arg1} app cannot be deleted.", arg:{"arg1": "Settings"})
translate("The lowest temp is {arg1}", args: <String, int>{"arg1": 15})
translate("The lowest temperature is {arg1} and the highest temperature is {arg2}.", arg:{"arg1": 15, "arg2": 30})
*/
var reTranslate = new RegExp(/translate\s*\(\s*("((\\"|[^"])*)"|'((\\'|[^'])*)')\s*\)/g);
var reTranslateWithKey = new RegExp(/translate\s*\(\s*("((\\"|[^"])*)"|'((\\'|[^'])*)')\s*\,\s*(key)\s*\:\s*("((\\"|[^"])*)"|'((\\'|[^'])*)')\s*\)/g);
var reTranslateWithArg = new RegExp(/translate\s*\(\s*("((\\"|[^"])*)"|'((\\'|[^'])*)')\s*\,\s*args\s*\:/g);
var reTranslatePlural = new RegExp(/translatePlural\s*\(\s*("((\\"|[^"])*)"|'((\\'|[^'])*)')\s*\,\s*(.*)\)/g);
var reI18nComment = new RegExp("//\\s*i18n\\s*:\\s*(.*)$");

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
DartFile.prototype.parse = function(data) {
    this.logger.debug("Extracting strings from " + this.pathName);

    data = DartFile.trimComments(data);
    this.resourceIndex = 0;
    var comment, match, key;

    reTranslate.lastIndex = 0; // just to be safe
    // e.g translate("hello")
    var result = reTranslate.exec(data);
    while (result && result.length > 2 && result[1]) {
        // different matches for single and double quotes
        match = (result[1][0] === '"') ? result[2] : result[4];

        if (match && match.length) {
            this.logger.trace("Found string key: " + this.makeKey(match) + ", string: '" + match + "'");

            var last = data.indexOf('\n', reTranslate.lastIndex);
            last = (last === -1) ? data.length : last;
            var line = data.substring(reTranslate.lastIndex, last);
            var commentResult = reI18nComment.exec(line);
            comment = (commentResult && commentResult.length > 1) ? commentResult[1] : undefined;

            var r = this.API.newResource({
                resType: "string",
                project: this.project.getProjectId(),
                key: this.makeKey(match),
                sourceLocale: this.project.sourceLocale,
                source: DartFile.unescapeString(match),
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: comment,
                datatype: this.type.datatype,
                index: this.resourceIndex++
            });
            // for use later when we write out resources
            r.mapping = this.mapping;
            this.set.add(r);
        } else {
            this.logger.debug("Warning: Bogus empty string in get string call: ");
            this.logger.debug("... " + data.substring(result.index, reTranslate.lastIndex) + " ...");
        }
        result = reTranslate.exec(data);
    }

    // just to be safe
    reI18nComment.lastIndex = 0;
    reTranslateWithKey.lastIndex = 0;
    // e.g. translate("hello", key: "hello_key");
    result = reTranslateWithKey.exec(data);
    while (result && result.length > 5 && result[1] && result[6]) {
        // different matches for single and double quotes
        match = (result[1][0] === '"') ? result[2] : result[4];
        key = (result[7][0] === '"') ? result[8] : result[10];

        if (match && key && match.length && key.length) {
            var last = data.indexOf('\n', reTranslateWithKey.lastIndex);
            last = (last === -1) ? data.length : last;
            var line = data.substring(reTranslateWithKey.lastIndex, last);
            var commentResult = reI18nComment.exec(line);
            comment = (commentResult && commentResult.length > 1) ? commentResult[1] : undefined;

            this.logger.trace("Found string '" + match + "' with unique key " + key + ", comment: " + comment);

            var r = this.API.newResource({
                resType: "string",
                project: this.project.getProjectId(),
                key: this.makeKey(key),
                sourceLocale: this.project.sourceLocale,
                source: DartFile.unescapeString(match),
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: comment,
                datatype: this.type.datatype,
                index: this.resourceIndex++
            });
            // for use later when we write out resources
            r.mapping = this.mapping;
            this.set.add(r);
        } else {
            this.logger.debug("Warning: Bogus empty string in get string call: ");
            this.logger.debug("... " + data.substring(result.index, reTranslateWithKey.lastIndex) + " ...");
        }
        result = reTranslateWithKey.exec(data);
    }

    // just to be safe
    reI18nComment.lastIndex = 0;
    reTranslateWithArg.lastIndex = 0;
    //e.g. translate("{arg1} app cannot be deleted.", arg:{"arg1": "Settings"})
    var result = reTranslateWithArg.exec(data);
    while (result && result.length > 2 && result[1]) {
        // different matches for single and double quotes
        match = (result[1][0] === '"') ? result[2] : result[4];

        if (match && match.length) {
            this.logger.trace("Found string key: " + this.makeKey(match) + ", string: '" + match + "'");

            var last = data.indexOf('\n', reTranslateWithArg.lastIndex);
            last = (last === -1) ? data.length : last;
            var line = data.substring(reTranslateWithArg.lastIndex, last);
            var commentResult = reI18nComment.exec(line);
            comment = (commentResult && commentResult.length > 1) ? commentResult[1] : undefined;

            var r = this.API.newResource({
                resType: "string",
                project: this.project.getProjectId(),
                key: this.makeKey(match),
                sourceLocale: this.project.sourceLocale,
                source: DartFile.unescapeString(match),
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: comment,
                datatype: this.type.datatype,
                index: this.resourceIndex++
            });
            // for use later when we write out resources
            r.mapping = this.mapping;
            this.set.add(r);
        } else {
            this.logger.debug("Warning: Bogus empty string in get string call: ");
            this.logger.debug("... " + data.substring(result.index, reTranslateWithArg.lastIndex) + " ...");
        }
        result = reTranslateWithArg.exec(data);
    }

    reTranslatePlural.lastIndex = 0; // just to be safe
    // e.g translatePlural('plural.demo', _counter)
    var result = reTranslatePlural.exec(data);
    while (result && result.length > 2 && result[1]) {
        // different matches for single and double quotes
        match = (result[1][0] === '"') ? result[2] : result[4];

        if (match && match.length) {
            this.logger.trace("Found string key: " + this.makeKey(match) + ", string: '" + match + "'");

            var last = data.indexOf('\n', reTranslatePlural.lastIndex);
            last = (last === -1) ? data.length : last;
            var line = data.substring(reTranslatePlural.lastIndex, last);
            var commentResult = reI18nComment.exec(line);
            comment = (commentResult && commentResult.length > 1) ? commentResult[1] : undefined;

            var r = this.API.newResource({
                resType: "string",
                project: this.project.getProjectId(),
                key: this.makeKey(match),
                sourceLocale: this.project.sourceLocale,
                source: DartFile.unescapeString(match),
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: comment,
                datatype: this.type.datatype,
                index: this.resourceIndex++
            });
            // for use later when we write out resources
            r.mapping = this.mapping;
            this.set.add(r);
        } else {
            this.logger.debug("Warning: Bogus empty string in get string call: ");
            this.logger.debug("... " + data.substring(result.index, reTranslatePlural.lastIndex) + " ...");
        }
        result = reTranslatePlural.exec(data);
    }
};

/**
 * Extract all the localizable strings from the Dart file and add them to the
 * project's translation set.
 */
DartFile.prototype.extract = function() {
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
 * Return the set of resources found in the current Dart file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current Dart file.
 */
DartFile.prototype.getTranslationSet = function() {
    return this.set;
}

// we don't localize or write Dart source files
DartFile.prototype.localize = function() {};
DartFile.prototype.write = function() {};

module.exports = DartFile;
