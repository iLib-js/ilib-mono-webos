
/*
 * webOSXliff.js - model an xliff file for the webOS
 *
 * Copyright (c) 2025, JEDLSoft
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

import xmljs from 'ilib-xml-js';
import { JSUtils } from 'ilib-common';
import TranslationUnit from './TranslationUnit.js';

/**
 * Return a string that can be used as an HTML attribute value.
 * @private
 * @param {string} str the string to escape
 * @returns {string} the escaped string
 */
function escapeAttr(str) {
    if (!str) return;
    return str.
        replace(/&/g, "&amp;").
        replace(/"/g, "&quot;").
        replace(/'/g, "&apos;").
        replace(/</g, "&lt;");
}

/**
 * Return the original string based on the one that was used as an attribute value.
 * @private
 * @param {string} str the string to unescape
 * @returns {string} the unescaped string
 */
function unescapeAttr(str) {
    if (!str) return;
    return str.
        replace(/&lt;/g, '<').
        replace(/&quot;/g, '"').
        replace(/&apos;/g, "'").
        replace(/&amp;/g, "&");
}

/**
 * @private
 */
function makeArray(arrayOrObject) {
    return Array.isArray(arrayOrObject) ? arrayOrObject : [ arrayOrObject ];
}

/**
 * @private
 */
function versionString(num) {
    const parts = ("" + num).split(".");
    const integral = parts[0].toString();
    const fraction = parts[1] || "0";
    return integral + '.' + fraction;
}

const newline = /[^\n]*\n/g;

/**
 * @class A class that represents an xliff file for webOS. Xliff stands for Xml
 * Localization Interchange File Format.
 */
class webOSXliff {
    version = 2.0;
    sourceLocale = "en-KR";
    // place to store the translation units
    tu = [];
    tuhash = {};
    lines = 0;

    /**
     * Construct a new Xliff instance. The options may be undefined,
     * which represents a new, clean Xliff instance. The options object may also
     * be an object with any of the following properties:
     *
     * <ul>
     * <li><i>tool-id</i> - the id of the tool that saved this xliff file
     * <li><i>tool-name</i> - the full name of the tool that saved this xliff file
     * <li><i>tool-version</i> - the version of the tool that save this xliff file
     * <li><i>tool-company</i> - the name of the company that made this tool
     * <li><i>copyright</i> - a copyright notice that you would like included into the xliff file
     * <li><i>sourceLocale</i> - specify the default source locale if a resource doesn't have a locale itself
     * <li><i>allowDups</i> - allow duplicate resources in the xliff. By default, dups are
     * filtered out. This option allows you to have trans-units that represent instances of the
     * same resource in the file with different metadata. For example, two instances of a
     * resource may have different comments which may both be useful to translators or
     * two instances of the same resource may have been extracted from different source files.
     * <li><i>version</i> - The version of xliff that will be produced by this instance.
     * </ul>
     *
     * @constructor
     * @param {Array.<Object>|undefined} options options to
     * initialize the file, or undefined for a new empty file
     */
    constructor(options) {
        if (options) {
            this.path = options.path;
            this.sourceLocale = options.sourceLocale;
            this.project = options.project;
            this.allowDups = options.allowDups;
            this.style =  options.style || "standard";
            if (typeof(options.version) !== 'undefined') {
                this.version = Number.parseFloat(options.version);
            }
        }
    }

    /**
     * @private
     * @param project
     * @param context
     * @param sourceLocale
     * @param targetLocale
     * @param source
     * @param key
     * @param type
     * @param path
     * @param ordinal
     * @param quantity
     * @param flavor
     * @param datatype
     * @returns {String} the hash of the above parameters
     */
    _hashKey(project, context, sourceLocale, targetLocale, source, key, type, path, ordinal, quantity, flavor, datatype) {
        const hashkey = [source, key, type || "string", sourceLocale || this.sourceLocale, targetLocale || "", context || "", project, path || "", ordinal || "", quantity || "", flavor || "", datatype].join("_");
        return hashkey;
    }

    /**
     * Get the translation units in this xliff.
     *
     * @returns {Array.<Object>} the translation units in this xliff
     */
    getTranslationUnits() {
        return this.tu;
    }

    /**
     * Add this translation unit to this xliff.
     *
     * @param {TranslationUnit} unit the translation unit to add to this xliff
     */
    addTranslationUnit = function(unit) {
        let oldUnit;

        const hashKeySource = this._hashKey(unit.project, unit.context, unit.sourceLocale, "", unit.source, unit.key, unit.resType, unit.file, unit.ordinal, unit.quantity, unit.flavor, unit.datatype),
        hashKeyTarget = this._hashKey(unit.project, unit.context, unit.sourceLocale, unit.targetLocale, unit.source, unit.key, unit.resType, unit.file, unit.ordinal, unit.quantity, unit.flavor, unit.datatype);

        if (unit.targetLocale) {
            oldUnit = this.tuhash[hashKeySource];
            if (oldUnit) {
                // console.log("Replacing old source-only unit in favour of this joint source/target unit");
                this.tuhash[hashKeySource] = undefined;
                JSUtils.shallowCopy(unit, oldUnit);
                this.tuhash[hashKeyTarget] = oldUnit;
                return;
            }
        }

        oldUnit = this.tuhash[hashKeyTarget];
        if (oldUnit && !this.allowDups) {
            // update the old unit with this new info
            JSUtils.shallowCopy(unit, oldUnit);
        } else {
            if (this.version >= 2 && this.tu.length) {
                if (this.tu[0].targetLocale !== unit.targetLocale) {
                    throw "Mismatched target locale";
                }
            }

            this.tu.push(unit);
            this.tuhash[hashKeyTarget] = unit;
        }

    }

    /**
     * Add translation units to this xliff.
     *
     * @param {Array.<Object>} files the translation units to add to this xliff
     */
    addTranslationUnits(units) {
        units.forEach((unit) => {
            this.addTranslationUnit(unit);
        });
    }

    /**
     * Return the number of translation units in this xliff file.
     *
     * @return {number} the number of translation units in this xliff file
     */
    size() {
        return this.tu.length;
    }

    /**
     * Serialize this xliff instance to a string that contains
     * the xliff format xml text.
     *
     * @param {boolean} untranslated if true, add the untranslated resources
     * to the xliff file without target tags. Otherwiwe, untranslated
     * resources are skipped.
     * @return {String} the current instance encoded as an xliff format
     * xml text
     */
    serialize(untranslated) {
        const xml = this.toStringData();
        this.countLines(xml);
        return xml
    }

    /**
     * Serialize this xliff instance as an customized xliff 2.0 format string.
     * @return {String} the current instance encoded as an customized xliff 2.0
     * format string
     */
    toStringData() {
        const sourceLocale = this.tu[0].sourceLocale;
        const targetLocale = this.tu[0].targetLocale;
        let hasMetadata = false;

        const units = this.tu
            .filter(unit => unit.sourceLocale === sourceLocale && (!targetLocale || unit.targetLocale === targetLocale))
            .sort((a, b) => {
                if (a.project < b.project) return -1;
                if (a.project > b.project) return 1;
                return 0;
            });

        let json = {
            xliff: {
                _attributes: {
                    "xmlns": "urn:oasis:names:tc:xliff:document:2.0",
                }
            }
        };
        // now finally add each of the units to the json
        let files = {};
        let fileIndex = 1;
        let groupIndexMap = {}; // key: project+datatype, value: groupIndex
        let unitIndexMap = {};  // key: project+groupIndex, value: unitIndex

        for (let i = 0; i < units.length; i++) {
            let tu = units[i];
            if (!tu) {
                console.log("undefined?");
            }
            let hashKey = tu.project;
            let datatype = tu.datatype || "javascript";
            let groupKey = hashKey + "_" + datatype;

            if (!groupIndexMap[groupKey]) {
                groupIndexMap[groupKey] = Object.keys(groupIndexMap).length + 1;
            }
            let groupIndex = groupIndexMap[groupKey];

            let file = files[hashKey];
            if (!file) {
                files[hashKey] = file = {
                    _attributes: {
                        "id": tu.project + "_f" + fileIndex++,
                        "original": tu.project
                    },
                    group: []
                };
            }

            let groupSet = file.group.find(g => g._attributes.name === datatype);
            if (!groupSet) {
                groupSet = {
                    _attributes: {
                        "id": tu.project + "_g" + groupIndex,
                        "name": datatype
                    },
                    unit: []
                };
                file.group.push(groupSet);
            }

            let unitKey = tu.project + "_g" + groupIndex;
            if (!unitIndexMap[unitKey]) {
                unitIndexMap[unitKey] = 1;
            }
            let unitIndex = unitIndexMap[unitKey]++;

            let tujson = {
                _attributes: {
                    "id": tu.project + "_g" + groupIndex + "_" + unitIndex,
                    "name": (tu.source !== tu.key) ? escapeAttr(tu.key) : undefined,
                }
            };

            if (tu.metadata) {
                tujson["mda:metadata"] = tu.metadata
                hasMetadata = true;
            }

            if (tu.comment) {
                tujson.notes = {
                    "note": [
                        {
                            "_text": tu.comment
                        }
                    ]
                };
            }

            tujson.segment = [
                {
                    "source": {
                        "_text": tu.source
                    }
                }
            ];

            if (tu.target) {
                tujson.segment[0].target = {
                    _attributes: {
                        state: tu.state,
                    },
                    "_text": tu.target
                };
            }

            groupSet.unit.push(tujson);
        }

        // sort the file tags so that they come out in the same order each time
        if (!json.xliff.file) {
            json.xliff.file = [];
        }
        Object.keys(files).sort().forEach(function(fileHashKey) {
            json.xliff.file.push(files[fileHashKey]);
        });

        if (hasMetadata) {
            json.xliff._attributes["xmlns:mda"] = "urn:oasis:names:tc:xliff:metadata:2.0";
        }
        json.xliff._attributes.srcLang = sourceLocale;
        if (targetLocale) {
            json.xliff._attributes.trgLang = targetLocale;
        }
        json.xliff._attributes.version = versionString(this.version);

        let xml = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + xmljs.js2xml(json, {
            compact: true,
            spaces: 2
        });

        return xml;
    }

    /**
     * Deserialize the given string as an xml file in xliff format
     * into this xliff instance. If there are any existing translation
     * units already in this instance, they will be removed first.
     *
     * @param {String} xml the xliff format text to parse
     * @param {string | undefined} resfile the path to the xliff file,
     * or undefined if this xml file is being parsed from a string
     * instead of a file
     */
    deserialize(xml, resfile) {
        const json = xmljs.xml2js(xml, {
            trim: false,
            nativeTypeAttribute: true,
            compact: true,
            position: false
        });
        this.countLines(xml);
        this.parse(json.xliff, resfile);
        return this.tu;
    }

    /**
     * Parse webOS xliff files
     *
     * @private
     * @param {Element} xliff
     * @param {string|undefined} resfile the path to the xliff file
     * that contains the translation units, or undefined if this xliff
     * is being parsed from a string
     */
    parse(xliff, resfile) {
        const sourceLocale = xliff._attributes["srcLang"] || this.project.sourceLocale;
        const targetLocale = xliff._attributes["trgLang"];

        if (xliff.file) {
            const files = makeArray(xliff.file);
            for (let i = 0; i < files.length; i++) {
                let fileSettings = {};
                let file = files[i];
                let groups = [];
                fileSettings = {
                    pathName: file._attributes["original"],
                    locale: sourceLocale,
                    project: file._attributes["l:project"] || file._attributes["original"],
                    targetLocale: targetLocale,
                    flavor: file._attributes["l:flavor"]
                };
                groups = (typeof (file["group"]) != 'undefined') ? file.group : file;
                groups = makeArray(groups);

                for (let j=0; j < groups.length; j++) {
                    if (groups[j].unit) {
                        let transUnits = makeArray(groups[j].unit);
                        let groupName = groups[j]["_attributes"].name;
                        transUnits.forEach((tu) => {
                            let comment, state, location;
                            let datatype = tu._attributes["l:datatype"] || groupName;
                            let source = "", target = "";
                            if (tu.notes && tu.notes.note) {
                                comment = Array.isArray(tu.notes.note) ?
                                    tu.notes.note[0]["_text"] :
                                    tu.notes.note["_text"];
                            }
                            let resname = tu._attributes.name;
                            let restype = "string";
                            if (tu._attributes.type && tu._attributes.type.startsWith("res:")) {
                                restype = tu._attributes.type.substring(4);
                            }

                            if (tu.segment) {
                                let segments = makeArray(tu.segment);
                                for (let j = 0; j < segments.length; j++) {
                                    let segment = segments[j];
                                    if (segment.source["_text"]) {
                                        source += segment.source["_text"] ?? "";
                                        if (segment.target) {
                                            target += segment.target["_text"] ?? "";
                                            state = segment.target?._attributes?.state;
                                        } else {
                                            target = undefined;
                                        }
                                    }
                                }
                            }
                            if (!resname) {
                                resname = source;
                            }

                            if (source.trim()) {
                                try {
                                    let commonProperties = {
                                        file: fileSettings.pathName,
                                        sourceLocale: fileSettings.locale,
                                        project: fileSettings.project,
                                        id: tu._attributes.id,
                                        key: unescapeAttr(resname),
                                        source: source,
                                        context: tu._attributes["l:context"],
                                        comment: comment,
                                        targetLocale: targetLocale,
                                        target: target,
                                        resType: restype,
                                        state: state,
                                        datatype: datatype,
                                        flavor: fileSettings.flavor,
                                        metadata: tu['mda:metadata'] || undefined,
                                        location,
                                        resfile
                                    };

                                    let unit = new TranslationUnit(commonProperties);
                                    this.tu.push(unit);
                                } catch (e) {
                                    console.log("Skipping invalid translation unit found in xliff file.\n" + e);
                                }
                            } else {
                                //console.log("Found translation unit with an empty or missing source element. File: " + fileSettings.pathName + " Resname: " + tu.resname);
                            }
                        });
                    }
                }
            }
        }
        return this.tu;
    }

    /**
     * @private
     */
    countLines(text) {
        newline.lastIndex = 0;
        this.lines = 1;
        this.lineIndex = [];
        this.fileLength = text.length;

        // set up the line index with the index of the
        // start of each line in the text
        let match;
        let index = 0;
        while ((match = newline.exec(text)) !== null) {
            this.lines++;
            this.lineIndex.push(index);
            index += match[0].length;
        }
        this.lineIndex.push(index);
    }

    /**
     * Return the number of lines in the file. This is only really
     * accurate after it has been serialized or deserialized.
     */
    getLines() {
        return this.lines || 0;
    }

    /**
     * Return the number of bytes in the file. This is only really
     * accurate after it has been serialized or deserialized.
     */
    getBytes() {
        return this.fileLength || 0;
    }

    /**
     * Return the version of this xliff file. If you deserialize a string into this
     * instance of Xliff, the version will be reset to whatever is found inside of
     * the xliff file.
     *
     * @returns {String} the version of this xliff
     */
    getVersion() {
        return this.version || "2.0";
    }

    /**
     * Clear the current xliff file of all translation units and start from scratch. All
     * the settings from the constructor are still kept. Only the translation units are
     * removed.
     */
    clear() {
        this.tu = [];
        this.tuhash = {};
    }

}

export default webOSXliff;
