/*
 * ResourceFix.test.js - test to check if the resource has been fixed
 *
 * Copyright (c) 2025 JEDLSoft
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

const path = require('path');
const fs = require('fs');
const xmljs = require("xml-js");
const pluginUtils = require("ilib-loctool-webos-common/utils.js");

const loadXliffData = (filepath) => {
    const options = { trim: false, nativeTypeAttribute: true, compact: true };

    if (!pluginUtils.isValidPath(filepath)) {
        return undefined;
    }

    try {
        const tsFile = fs.readFileSync(filepath, "utf-8");
        if (!tsFile) return undefined;

        const parsed = xmljs.xml2js(tsFile, options);
        return parsed?.xliff?.file;
    } catch (error) {
        return undefined;
    }
};

const findTarget = (units, srcString) => {
    for (const unit of units) {
        if (unit?.segment?.source?._text === srcString) {
            return unit.segment.target?._text || '';
        }
    }
    return '';
};

describe('test if the resource is modifed properly', () => {
    let filePath;
    test("test resource-edge-whitespace (am-ET)", function() {
        expect.assertions(3);
        const source = "You can use your Magic Remote to determine the room’s acoustics and optimize your TV’s sound quality based on the results."
        const target = "MAGIC REMOTE በመጠቀም የክፍሉን የድምጽ ማስተጋባት አና በውጤቶቹ መሰረት የቲቪዎን የድምጽ ጥራት ማሰተካከል እና መቆጣጠር ይችላሉ፡፡";
        let result;
        
        filePath = path.join('sample-rs-edge-whitespace', 'am-ET.xliff.modified'); // autofix
        xliffData = pluginUtils.isValidPath(filePath) ? loadXliffData(filePath) : {};
        expect(xliffData).toBeTruthy();
        
        result = findTarget(xliffData.group.unit, source);        
        expect(result).toBe(target);


        filePath = path.join('sample-rs-edge-whitespace', 'am-ET.xliff'); //original
        xliffData = pluginUtils.isValidPath(filePath) ? loadXliffData(filePath) : {};
        result = findTarget(xliffData.group.unit, source);        
        expect(result).not.toBe(target);
    });
    test("test am-ET.xliff.modified file", function() {
        expect.assertions(1);

        filePath = path.join('sample-rs-edge-whitespace', 'am-ET.xliff.modified'); // autofix
        xliffData = pluginUtils.isValidPath(filePath) ? loadXliffData(filePath) : {};
        expect(xliffData).toMatchSnapshot();
    });
});