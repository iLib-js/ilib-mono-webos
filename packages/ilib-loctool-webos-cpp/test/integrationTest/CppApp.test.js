/*
 * CppApp.test.js - test the localization result in localize mode of webos-cpp app
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

describe("[integration] test the localization result of webos-cpp app", () => {
    const projectRoot = (process.cwd().indexOf("integrationTest")) > -1 ? "." : "./test/integrationTest";
    const resourcePath = path.join(projectRoot, "resources");
    const fileName = "cppstrings.json";
    let filePath, jsonData;

    beforeAll(async() => {
        if (fs.existsSync(resourcePath)) {
            fs.rmSync(resourcePath, { recursive: true });
        }
        const projectSettings = {
            rootDir: projectRoot,
            id: "sample-webos-cpp",
            projectType: "webos-cpp",
            sourceLocale: "en-KR",
            pseudoLocale : {
                "zxx-XX": "debug"
            },
            resourceDirs : { "json": "resources" },
            resourceFileTypes: { "json":"ilib-loctool-webos-json-resource" },
            plugins: [ "ilib-loctool-webos-cpp" ]
        };

        const appSettings = {
            localizeOnly: true,
            translationsDir : ["./xliffs", "./common"],
            mode: "localize",
            metadata : {
                "device-type": "StanbyME"
            },
            xliffVersion: 2,
            xliffStyle: "webOS",
            nopseudo: false,
            resourceFileNames: { "cpp": fileName },
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
        project.addPath("src/test.cpp");

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
    test("cppsample_test_ko_KR", function() {
        expect.assertions(6);
        filePath = path.join(resourcePath, 'ko', fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["Yes"]).toBe("예");
        expect(jsonData["No"]).toBe("아니오");
        expect(jsonData["Update"]).toBe("업데이트");
        expect(jsonData["Cancel"]).toBe("취소");
        expect(jsonData["* This feature is applied once and only once when the TV is turned off."]).toBe("* 이 기능은 기기 전원이 꺼질 때 한번만 실행됩니다."); //metadata
    });
    test("cppsample_test_es_CO", function() {
        expect.assertions(5);
        filePath = path.join(resourcePath, "es", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["Sound Out"]).toBe("Salida de Audio");
        expect(jsonData["OK"]).toBe("Aceptar"); // common
        expect(jsonData["TV Information"]).toBe("Información del dispositivo");
        expect(jsonData["TV Name"]).toBe("Nombre del dispositivo(common)"); //metadata-common
    });
    test("cppsample_test_es_ES", function() {
            expect.assertions(2);
            filePath = path.join(resourcePath, 'es/ES', fileName);
            expect(pluginUtils.isValidPath(filePath)).toBeTruthy();
            jsonData = pluginUtils.loadData(filePath);
            expect(jsonData["TV Name"]).toBe("Nombre del dispositivo");
        });
    test("cppsample_test_en_US", function() {
        expect.assertions(3);
        filePath = path.join(resourcePath, fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["Programme"]).toBe("Channel");
        expect(jsonData["TV Name"]).toBe("TV Name(en-US)");
    });
    test("cppsample_test_en_AU", function() {
        expect.assertions(3);
        filePath = path.join(resourcePath, "en/AU", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["Programme"]).toBe("Programme");
        expect(jsonData["TV Name"]).toBe("Device Name"); // metadata - customInherit
    });
    test("cppsample_test_en_GB", function() {
        expect.assertions(2);
        filePath = path.join(resourcePath, "en/GB", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["Programme"]).toBe("Programme");
    });
    test("cppsample_test_zxx", function() {
        expect.assertions(8);
        filePath = path.join(resourcePath, "zxx", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["Cancel"]).toBe("[Çàñçëľ210]");
        expect(jsonData["No"]).toBe("[Ňõ0]");
        expect(jsonData["Programme"]).toBe("[Pŕõğŕàmmë43210]");
        expect(jsonData["Sound Out"]).toBe("[Šõüñð Øüţ43210]");
        expect(jsonData["Update"]).toBe("[Úþðàţë210]");
        expect(jsonData["Yes"]).toBe("[Ŷëš10]");
        expect(jsonData["* This feature is applied once and only once when the TV is turned off."]).toBe("[* Ťĥíš fëàţüŕë íš àþþľíëð õñçë àñð õñľÿ õñçë ŵĥëñ ţĥë ŤV íš ţüŕñëð õff.32109876543210]");
    });
  });
