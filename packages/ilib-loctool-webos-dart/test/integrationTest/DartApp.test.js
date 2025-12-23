/*
 * DartApp.test.js - test the localization result of webos-dart app.
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

describe('[integration] test the localization result of webos-dart app', () => {
    const projectRoot = (process.cwd().indexOf("integrationTest")) > -1 ? ".": "./test/integrationTest";
    const resourcePath = path.join(projectRoot, "assets/i18n");
    let filePath, jsonData = {};

    beforeAll(async() => {
        if (fs.existsSync(resourcePath)) {
            fs.rmSync(resourcePath, { recursive: true });
        }
        const projectSettings = {
            rootDir: projectRoot,
            id: "sample-webos-dart",
            projectType: "webos-dart",
            sourceLocale: "en-KR",
            pseudoLocale : {
                "zxx-XX": "debug"
            },
            resourceDirs : { "json": "assets/i18n" },
            resourceFileTypes: { "json":"ilib-loctool-webos-json-resource" },
            plugins: [ "ilib-loctool-webos-dart" ]
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
            },
            dart: {
               disablePseudo: false,
                mappings : {
                    "**/*.dart": {
                        "template": path.join(projectRoot, "[dir]/assets/i18n/[localeUnder].json")
                    }
                }
            }
        };
        const project = ProjectFactory.newProject(projectSettings, appSettings)
        project.addPath("src/test.dart");

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
    test("dartsample_test_ko_KR", function() {
        expect.assertions(5);
        filePath = path.join(resourcePath, 'ko.json');
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["App List"]).toBe("앱 목록");
        expect(jsonData["Back button"]).toBe("이전 버튼");
        expect(jsonData["Search"]).toBe("통합 검색");
        expect(jsonData["Internal Speaker"]).toBe("모니터 스피커"); // metadata
    });
    test("dartsample_test_es_CO", function() {
        expect.assertions(6);
        filePath = path.join(resourcePath, 'es.json');
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["App List"]).toBe("Lista de Aplicaciones");
        expect(jsonData["Search"]).toBe("Buscar");
        expect(jsonData["Back button"]).toBe("Botón regresar");
        expect(jsonData["App Rating"]).toBe("Clasificación de Aplicación");
        expect(jsonData["TV Name"]).toBe("Nombre del Monitor"); // metadata - common
    });
    test("dartsample_test_es_ES", function() {
        expect.assertions(2);
        filePath = path.join(resourcePath, 'es_ES.json');
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["TV Name"]).toBe("Nombre del monitor"); // metadata - localemap
    });
    test("dartsample_test_en_US", function() {
        expect.assertions(2);
        filePath = path.join(resourcePath, 'en.json');
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["Programme"]).toBe("Channel");
    });
    test("dartsample_test_en_GB", function() {
        expect.assertions(2);
        filePath = path.join(resourcePath, 'en_GB.json');
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["Programme"]).toBe("Programme");
    });
    test("dartsample_test_en_AU", function() {
        expect.assertions(3);
        filePath = path.join(resourcePath, 'en_AU.json');
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["Programme"]).toBe("Programme");
        expect(jsonData["TV Name"]).toBe("Monitor Name"); // metadata - localeInherit
    });
    test("dartsample_test_zxx", function() {
        expect.assertions(8);
        filePath = path.join(resourcePath, 'zxx.json');
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(Object.keys(jsonData).length).toBe(7);
        expect(jsonData["App List"]).toBe("[Ãþþ Ľíšţ3210]");
        expect(jsonData["Back button"]).toBe("[ßàçķ büţţõñ543210]");
        expect(jsonData["Programme"]).toBe("[Pŕõğŕàmmë43210]");
        expect(jsonData["Search"]).toBe("[Šëàŕçĥ210]");
        expect(jsonData["Internal Speaker"]).toBe("[Ïñţëŕñàľ Šþëàķëŕ76543210]");
        expect(jsonData["TV Name"]).toBe("[ŤV Ňàmë3210]");
    });
});
