/*
 * CppAppGenerate.test.js - test the localization result in generate mode of webos-cpp app.
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

const fs = require("fs");
const { exec } = require('child_process');
const path = require('path');
const { utils: pluginUtils } = require("ilib-loctool-webos-common");

describe('test the localization result (generate mode) of webos-cpp app', () => {
    // write to a separate directory so that this test does not conflict with CppApp.test.js
    const resourcePath = 'resources2';
    const fileName = 'cppstrings.json';

    let filePath, jsonData = {};

    beforeAll(async() => {
        if (fs.existsSync(resourcePath)) {
            fs.rmSync(resourcePath, { recursive: true });
        }
        // run the npm script itself so that the options of the script are verified too
        await new Promise((resolve, reject) => {
            exec(`npm run loc-generate -- --resourceDirs json=${resourcePath}`, (error, stdout, stderr) => {
                if (error) {
                    return reject(error);
                }
                resolve(stdout);
            });
        });
    }, 50000);
    afterAll(() => {
        if (fs.existsSync(resourcePath)) {
            fs.rmSync(resourcePath, { recursive: true });
        }
    });
    test("cppsample_generate_test_ko_KR", function() {
        expect.assertions(4);
        filePath = path.join(resourcePath, 'ko', fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["No"]).toBe("아니오");
        expect(jsonData["Cancel"]).toBe("취소");
        expect(jsonData["Update"]).toBe("업데이트");
    });
    test("cppsample_generate_test_en_AU", function() {
        expect.assertions(3);
        filePath = path.join(resourcePath, 'en/AU', fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["Programme"]).toBe("Programme");
        expect(jsonData["TV Program Locks"]).toBe("TV Rating Locks");
    });
    test("cppsample_generate_test_es_CO", function() {
        expect.assertions(2);
        // es-CO is mapped to es by --localeMap
        filePath = path.join(resourcePath, 'es', fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["Sound Out"]).toBe("Salida de Audio");
    });
    test("cppsample_generate_test_fr_CA", function() {
        expect.assertions(3);
        // fr-CA is mapped to fr by --localeMap
        filePath = path.join(resourcePath, 'fr', fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["Agree"]).toBe("D’accord");
        expect(jsonData["Others"]).toBe("Autres");
    });
});
