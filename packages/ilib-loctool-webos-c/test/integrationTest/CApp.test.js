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
            "rootDir": projectRoot, 
            "id": "sample-webos-c",
            "projectType": "webos-c",
            "sourceLocale": "en-KR",
            "pseudoLocale" : {
                "zxx-XX": "debug"
            },
            "resourceDirs" : { "json": "resources" },
            "resourceFileTypes": { "json":"ilib-loctool-webos-json-resource" },
            "plugins": [ "ilib-loctool-webos-c" ],
            "xliffStyle": "custom",
            "xliffVersion": 2,
        };

        const appSettings = {
            localizeOnly: true,
            translationsDir: "./xliffs",
            mode: "localize",
            xliffVersion: 2,
            nopseudo: false,
            resourceFileNames: { "c": fileName },
            webos: {
                "commonXliff": path.join(projectRoot, "./common")
            },
            locales:[
                "en-AU",
                "en-GB",
                "en-US",
                "es-CO",
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
        expect.assertions(4);
        filePath = path.join(resourcePath, 'ko', fileName);
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(Object.keys(jsonData).length).toBeGreaterThan(0);
        expect(jsonData["No"]).toBe("아니오");
        expect(jsonData["OK"]).toBe("확인");
        expect(jsonData["Yes"]).toBe("예");
    });
    test("csample_test_es_CO", function() {
        expect.assertions(3);
        filePath = path.join(resourcePath, 'es', fileName);
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(Object.keys(jsonData).length).toBeGreaterThan(0);
        expect(jsonData["Sound Out"]).toBe("Salida de Audio");
        expect(jsonData["OK"]).toBe("Aceptar");
    });
    test("csample_test_en_US", function() {
        expect.assertions(2);
        filePath = path.join(resourcePath, fileName);
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(Object.keys(jsonData).length).toBeGreaterThan(0);
        expect(jsonData["Programme"]).toBe("Channel");
    });
    test("csample_test_en_AU", function() {
        expect.assertions(2);
        filePath = path.join(resourcePath, 'en/AU', fileName);
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(Object.keys(jsonData).length).toBeGreaterThan(0);
        expect(jsonData["Programme"]).toBe("Programme");
    });
    test("csample_test_en_GB", function() {
        expect.assertions(2);
        filePath = path.join(resourcePath, 'en/GB', fileName);
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(Object.keys(jsonData).length).toBeGreaterThan(0);
        expect(jsonData["Programme"]).toBe("Programme");
    });
    test("csample_test_zxx", function() {
        expect.assertions(6);
        filePath = path.join(resourcePath, 'zxx', fileName);
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(Object.keys(jsonData).length).toBeGreaterThan(0);
        expect(jsonData["No"]).toBe("[Ňõ0]");
        expect(jsonData["OK"]).toBe("[Øĸ0]");
        expect(jsonData["Yes"]).toBe("[Ŷëš10]");
        expect(jsonData["Programme"]).toBe("[Pŕõğŕàmmë43210]");
        expect(jsonData["Sound Out"]).toBe("[Šõüñð Øüţ43210]");
    });
});
