/*
 * utils.js - utility function for testing the lint
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

import fs from 'fs';
import xmljs from "xml-js";

export const isValidPath = (filepath) => {
    return filepath ? fs.existsSync(filepath) : false;
}

export const loadFileData = (filepath, type) => {
    const options = { trim: false, nativeTypeAttribute: true, compact: true };

    if (!isValidPath(filepath)) {
        return undefined;
    }

    try {
        const fileContent = fs.readFileSync(filepath, "utf-8");
        
        if (!fileContent) return undefined;

        if (type === "html") {
            return fileContent;
        }

        const parsedData = xmljs.xml2js(fileContent, options);
        return parsedData?.xliff?.file;

    } catch {
        return undefined;
    }
};