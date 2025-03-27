/*
 * Utils.js - Util functions that are commonly used in tests.
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

const fs = require('fs');
const xmljs = require("xml-js");

const isValidPath = (filepath) => {
    return filepath ? fs.existsSync(filepath) : false;
}

const loadData = (filepath) => {
    try {
        const readData = fs.readFileSync(filepath, 'utf-8');
        return JSON.parse(readData);
    } catch (error) {
        console.error(`Error reading or parsing file: ${error.message}`);
        return null;
    }
}

const isExistKey = (filepath, key) => {
    const jsonData = isValidPath(filepath) ? loadData(filepath) : {};
    return (jsonData && jsonData.hasOwnProperty(key));
}

const loadTSData = (filepath) => {
    const options = {trim:false, nativeTypeAttribute: true, compact: true};

    if (isValidPath(filepath)) {
        const tsFile = fs.readFileSync(filepath, "utf-8");
        if (tsFile) {
            return xmljs.xml2js(tsFile, options).TS;
        }
    }
    return undefined;
}

module.exports = { isValidPath, loadData, isExistKey, loadTSData };