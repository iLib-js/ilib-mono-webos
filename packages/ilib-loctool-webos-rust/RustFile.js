/*
 * RustFile.js - plugin to extract resources from a Rust source code file
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

/**
 * Create a new Rust file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project file
 * @param {FileType} type the file type of this instance
 */
var RustFile = function(props) {
    this.project = props.project;
    this.pathName = props.pathName;
    this.type = props.type;
    this.API = props.project.getAPI();
    this.logger = this.API.getLogger("loctool.plugin.webOSRustFile");
    this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
    this.mapping = this.type && this.type.getMapping(this.pathName);
};

/**
 * Format a UTF-16 code unit as a JS style unicode escape (\uXXXX).
 *
 * @private
 * @param {Number} unit the UTF-16 code unit
 * @returns {String} the escape sequence
 */
function toJsEscape(unit) {
    return "\\u" + ("0000" + unit.toString(16).toUpperCase()).slice(-4);
}

/**
 * Convert the Rust unicode escapes (\u{X} .. \u{XXXXXX}) in the given string
 * to the JS style escapes (\uXXXX) used by the other webOS plugins and in the
 * existing xliff files, so that the same key is generated for the same string.
 *
 * - The hex digits are padded to 4 digits, keeping the case as written
 *   (\u{28} -> \u0028, \u{201e} -> \u201e), because the keys are compared as
 *   text and the existing xliff files mix upper and lower case.
 * - Code points outside the BMP are converted to a surrogate pair
 *   (\u{1F600} -> \uD83D\uDE00).
 * - An escaped backslash followed by "u{...}" (\\u{41}) is literal text and
 *   is left unchanged.
 * - Invalid escapes (no hex digits, more than 6 digits, above U+10FFFF) are
 *   left unchanged; they do not compile in Rust anyway.
 *
 * @static
 * @param {String} string the string to convert
 * @returns {String} the string with JS style unicode escapes
 */
RustFile.convertUnicodeEscapes = function(string) {
    if (!string) return string;
    return string.replace(/(\\*)\\u\{([0-9A-Fa-f]{1,6})\}/g, function(match, backslashes, hex) {
        // an even number of preceding backslashes means this backslash is not escaped
        if (backslashes.length % 2 !== 0) return match;
        var codePoint = parseInt(hex, 16);
        if (codePoint > 0x10FFFF) return match;
        if (codePoint <= 0xFFFF) {
            return backslashes + "\\u" + ("0000" + hex).slice(-4);
        }
        codePoint -= 0x10000;
        return backslashes +
            toJsEscape(0xD800 + (codePoint >> 10)) +
            toJsEscape(0xDC00 + (codePoint & 0x3FF));
    });
};

/**
 * Remove the line continuations in the given string. In a Rust string literal,
 * a backslash at the end of a line removes the newline and all the whitespace
 * at the beginning of the next line:
 *
 *     "Connect a LAN cable \
 *         to the TV."          ->  "Connect a LAN cable to the TV."
 *
 * An escaped backslash at the end of a line ("\\" + newline) is literal text
 * followed by a real newline, and is left unchanged.
 *
 * @static
 * @param {String} string the string to convert
 * @returns {String} the string without line continuations
 */
RustFile.removeLineContinuations = function(string) {
    if (!string) return string;
    return string.replace(/(\\*)\\\r?\n[ \t\r\n]*/g, function(match, backslashes) {
        // an even number of preceding backslashes means this backslash is not escaped
        if (backslashes.length % 2 !== 0) return match;
        return backslashes;
    });
};

/**
 * Unescape the string to make the same string that would be
 * in memory in the target programming language.
 *
 * Line continuations (a backslash at the end of a line) are removed.
 * See {@link RustFile.removeLineContinuations}.
 *
 * Rust unicode escapes (\u{XXXX}) are converted to the JS style escapes
 * (\uXXXX) instead of the actual character, so that the keys match the
 * ones in the existing xliff files. See {@link RustFile.convertUnicodeEscapes}.
 *
 * @static
 * @param {String} string the string to unescape
 * @returns {String} the unescaped string
 */
RustFile.unescapeString = function(string) {
    // Convert Rust unicode escapes first, before the backslashes are unescaped,
    // so that an escaped backslash ("\\u{...}") can still be told apart from a
    // real escape.
    var unescaped = RustFile.convertUnicodeEscapes(RustFile.removeLineContinuations(string));
    unescaped = unescaped.
        replace(/^\\\\/, "\\").             // unescape backslashes
        replace(/([^\\])\\\\/g, "$1\\").
        replace(/([^\\])\\"/g, '$1"').
        replace(/\\"/g, '"').
        replace(/\\'/g, "'").
        replace(/\\n/g, "\n").
        replace(/\\t/g, "\t").
        replace(/\\v/g, "\v");

    return unescaped;
};

/**
 * Use a key for the given string as it is. Not manipulating at all.
 *
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique key for this string
 */
RustFile.prototype.makeKey = function(source) {
    return RustFile.unescapeString(source);
};

/**
 * Trim the comment markers and the leading colon from the text of an
 * i18n comment, so that only the comment for the translators remains.
 * For example, ": Power button" becomes "Power button".
 *
 * @static
 * @param {String|undefined} commentString the text that follows the
 * i18n keyword in the comment
 * @returns {String|undefined} the trimmed comment, or undefined if no
 * comment string is given or nothing remains after trimming
 */
RustFile.trimComment = function(commentString) {
    if (!commentString) return;

    // Only the markers at the beginning (a colon, slashes or stars) and the
    // end ("*/") are removed, so that a colon, slash or star in the middle of
    // the comment (e.g. "Format: HH:MM", "a/b") is kept.
    var trimComment = commentString.
        replace(/\s*\*+\/\s*$/, "").
        replace(/^[\s\/*]*:?\s*/, "").
        replace(/\s+$/, "");
    return trimComment || undefined;
};

/**
 * Remove single and multi-lines comments except for i18n comment style.
 *
 * @private
 * @param {String} data the string to clean
 * @returns {String} the cleaned string
 */
RustFile.removeCommentLines = function(data) {
    if (!data) return;
    // Remove comments while preserving string and character literals.
    // Match char literals and string literals first to skip them,
    // then match // line comments (except i18n) and /* */ block comments.
    // A line comment ends before the line break ("\n" or "\r\n") or at the end
    // of the data, and the line break itself is kept, so that the lines are not
    // joined.
    var trimData = data.replace(
        /'(\\.|[^'\\])'|"(\\[\s\S]|[^"\\])*"|\/\/(?![ \t]*i18n)[^\r\n]*|\/\*(((?!i18n).)*)\*\/|\/\*+((?!i18n)[^*]|\*(?!\/))*\*+\//g,
        function(match) {
            if (match[0] === '"' || match[0] === "'") {
                return match;
            }
            return "";
        }
    );
    return trimData;
};

/*
 * The resource bundle of webOS Rust apps provides only these two methods:
 *
 *     bundle.get_loc_string("source")
 *     bundle.get_loc_string_with_key("key", "source")
 *
 * So the regexes match only the method-call form on a receiver ("." before the
 * method name) with exactly one or two string literal arguments. A trailing comma
 * is allowed because rustfmt adds one when it breaks the arguments into lines.
 * Calls without a receiver, such as get_loc_string(res_bundle, "...") or
 * get_loc_string("..."), and path calls such as ResBundle::get_loc_string(...)
 * are not matched.
 *
 * reGetLocString: [1] source
 * reGetLocStringWithKey: [1] key, [2] source
 */
var reGetLocString = new RegExp(/\.\s*get_loc_string\s*\(\s*"((?:\\[\s\S]|[^"\\])*)"\s*,?\s*\)/g);
var reGetLocStringWithKey = new RegExp(/\.\s*get_loc_string_with_key\s*\(\s*"((?:\\[\s\S]|[^"\\])*)"\s*,\s*"((?:\\[\s\S]|[^"\\])*)"\s*,?\s*\)/g);
var reI18nComment = new RegExp(/\/(\*|\/)\s*i18n\s*(.*)($|\*\/)/);
var reGetLocStringCall = new RegExp(/\.\s*get_loc_string(?:_with_key)?\s*\(/);

/**
 * Find the i18n comment for the call that ends at the given index. The comment
 * must be on the same line as the end of the call, and there must be no other
 * get_loc_string() or get_loc_string_with_key() call between them, so that the
 * comment is attached only to the last call on the line:
 *
 *     bundle.get_loc_string("X"); bundle.get_loc_string("Y"); // i18n for Y
 *
 * @private
 * @param {String} data the data that is being parsed
 * @param {Number} end the index just after the end of the call
 * @returns {String|undefined} the comment, or undefined if there is none
 */
RustFile.getI18nComment = function(data, end) {
    var last = data.indexOf('\n', end);
    last = (last === -1) ? data.length : last;
    // drop the "\r" of a CRLF line ending
    var line = data.substring(end, last).replace(/\r$/, "");
    var commentResult = reI18nComment.exec(line);
    if (!commentResult || commentResult.length < 3) return undefined;
    if (reGetLocStringCall.test(line.substring(0, commentResult.index))) return undefined;
    return commentResult[2];
};

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
RustFile.prototype.parse = function(data) {
    this.logger.debug("Extracting strings from " + this.pathName);

    data = RustFile.removeCommentLines(data);
    this.resourceIndex = 0;

    var comment, match, key;

    // To extract get_loc_string()
    reGetLocString.lastIndex = 0; // just to be safe
    var result = reGetLocString.exec(data);
    while (result && result.length > 1) {
        match = result[1];
        if (match && match.length) {
            this.logger.trace("Found string key: " + this.makeKey(match) + ", string: '" + match + "'");

            comment = RustFile.getI18nComment(data, reGetLocString.lastIndex);

            match = RustFile.unescapeString(match);

            var r = this.API.newResource({
                resType: "string",
                project: this.project.getProjectId(),
                key: match,
                sourceLocale: this.project.sourceLocale,
                source: match,
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: RustFile.trimComment(comment),
                datatype: this.type.datatype,
                index: this.resourceIndex++
            });
            r.mapping = this.mapping;
            this.set.add(r);
        } else {
            this.logger.warn("Warning: Bogus empty string in get string call: ");
            this.logger.warn("... " + data.substring(result.index, reGetLocString.lastIndex) + " ...");
        }
        result = reGetLocString.exec(data);
    }

    // To extract get_loc_string_with_key()
    reGetLocStringWithKey.lastIndex = 0; // just to be safe
    var result = reGetLocStringWithKey.exec(data);
    while (result && result.length > 2) {
        match = result[2];
        key = result[1];

        if (match && match.length && key && key.length) {
            this.logger.trace("Found string key: " + this.makeKey(match) + ", string: '" + match + "'");

            comment = RustFile.getI18nComment(data, reGetLocStringWithKey.lastIndex);
            match = RustFile.unescapeString(match);
            key = RustFile.unescapeString(key);
            var r = this.API.newResource({
                resType: "string",
                project: this.project.getProjectId(),
                key: key,
                sourceLocale: this.project.sourceLocale,
                source: match,
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: RustFile.trimComment(comment),
                datatype: this.type.datatype,
                index: this.resourceIndex++
            });
            r.mapping = this.mapping;
            this.set.add(r);
        } else {
            this.logger.warn("Warning: Bogus empty string in get string call: ");
            this.logger.warn("... " + data.substring(result.index, reGetLocStringWithKey.lastIndex) + " ...");
        }
        result = reGetLocStringWithKey.exec(data);
    }
};

/**
 * Extract all the localizable strings from the Rust file and add them to the
 * project's translation set.
 */
RustFile.prototype.extract = function() {
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
 * Return the set of resources found in the current Rust file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current Rust file.
 */
RustFile.prototype.getTranslationSet = function() {
    return this.set;
}

// we don't localize or write rust source files
RustFile.prototype.localize = function() {};
RustFile.prototype.write = function() {};

module.exports = RustFile;
