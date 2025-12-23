/*
 * CApp.test.js - test the localization result of webos-c app.
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

const fs = require("fs");
const path = require('path');

const ProjectFactory = require("loctool/lib/ProjectFactory.js");
const pluginUtils = require("ilib-loctool-webos-common/utils.js");

describe("[integration] test the localization result of webos-c app", () => {
    const projectRoot = (process.cwd().indexOf("integrationTest")) >-1 ? "." : "./test/integrationTest";
    const resourcePath = path.join(projectRoot, "resources");
    const fileName = "cstrings.json";
    let filePath, jsonData = {};

    beforeAll(async() => {
        if (fs.existsSync(resourcePath)) {
            fs.rmSync(resourcePath, { recursive: true });
        }
        const projectSettings = {
            rootDir: projectRoot,
            id: "sample-webos-c",
            projectType: "webos-c",
            sourceLocale: "en-KR",
            pseudoLocale : {
                "zxx-XX": "debug"
            },
            resourceDirs : { "json": "resources" },
            resourceFileTypes: { "json":"ilib-loctool-webos-json-resource" },
            plugins: [ "ilib-loctool-webos-c" ],
        };

        const appSettings = {
            localizeOnly: true,
            translationsDir : ["./xliffs", "./common"],
            mode: "localize",
            metadata : {
                "device-type": "Monitor"
            },
            xliffVersion: 2,
            xliffStyle: "webOS",
            nopseudo: false,
            resourceFileNames: { "c": fileName },
            locales:[
                "en-AU",
                "en-GB",
                "en-US",
                "es-CO",
                "es-ES",
                "ko-KR"
            ],
            localeMap: {
                "es-CO": "es"
            },
            localeInherit: {
                "en-AU": "en-GB",
            }
        };
        const project = ProjectFactory.newProject(projectSettings, appSettings);
        project.addPath("src/test.c");

        if (project) {
            project.init(function() {
                project.extract(function() {
                    project.generatePseudo();
                    project.write(function() {
                        project.save(function() {
                            project.close(function() {
                            });
                        });
                    });
                });
            });
        }
    }, 50000);
    afterAll(async () => {
        if (fs.existsSync(resourcePath)) {
            fs.rmSync(resourcePath, { recursive: true });
        }
     });
    test("csample_test_ko_KR", function() {
        expect.assertions(5);
        filePath = path.join(resourcePath, 'ko', fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["No"]).toBe("아니오");
        expect(jsonData["OK"]).toBe("확인");
        expect(jsonData["Yes"]).toBe("예");
        expect(jsonData["NOT AVAILABLE"]).toBe("\"Monitor\" 이용이 불가능합니다"); //metadata
    });
    test("csample_test_es_CO", function() {
        expect.assertions(4);
        filePath = path.join(resourcePath, 'es', fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["Sound Out"]).toBe("Salida de Audio");
        expect(jsonData["OK"]).toBe("Aceptar");
        expect(jsonData["TV Name"]).toBe("Nombre del Monitor"); //metadata-common
    });
    test("csample_test_es_ES", function() {
        expect.assertions(2);
        filePath = path.join(resourcePath, 'es/ES', fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();
        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["TV Name"]).toBe("Nombre del monitor");
    });
    test("csample_test_en_US", function() {
        expect.assertions(3);
        filePath = path.join(resourcePath, fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["Programme"]).toBe("Channel");
        expect(jsonData["TV Name"]).toBe("TV Name(en-US)");
    });
    test("csample_test_en_AU", function() {
        expect.assertions(3);
        filePath = path.join(resourcePath, 'en/AU', fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["Programme"]).toBe("Programme");
        expect(jsonData["TV Name"]).toBe("Monitor Name"); // metadata - customInherit
    });
    test("csample_test_en_GB", function() {
        expect.assertions(3);
        filePath = path.join(resourcePath, 'en/GB', fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["Programme"]).toBe("Programme");
        expect(jsonData["TV Name"]).toBe("Monitor Name");
    });
    test("csample_test_zxx", function() {
        expect.assertions(6);
        filePath = path.join(resourcePath, 'zxx', fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["No"]).toBe("[Ňõ0]");
        expect(jsonData["OK"]).toBe("[Øĸ0]");
        expect(jsonData["Yes"]).toBe("[Ŷëš10]");
        expect(jsonData["Programme"]).toBe("[Pŕõğŕàmmë43210]");
        expect(jsonData["Sound Out"]).toBe("[Šõüñð Øüţ43210]");
    });
});
