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

describe('test the localization result of webos-dart app', () => {
    const projectRoot = (process.cwd().indexOf("integrationTest")) >-1 ? ".": "./test/integrationTest";
    const resourcePath = path.join(projectRoot, "assets/i18n");
    let filePath, jsonData = {};
    console.log(process.cwd());
    beforeAll(async() => {
        /*if (fs.existsSync(resourcePath)) {
            fs.rmSync(resourcePath, { recursive: true });
        }*/
        const projectSettings = {
            "rootDir": projectRoot, 
            "id": "sample-webos-dart",
            "projectType": "webos-dart",
            "sourceLocale": "en-KR",
            "pseudoLocale" : {
                "zxx-XX": "debug"
            },
            "resourceDirs" : { "json": "assets/i18n" },
            "resourceFileTypes": { "json":"ilib-loctool-webos-json-resource" },
            "plugins": [ "ilib-loctool-webos-dart" ],
            "xliffStyle": "custom",
            "xliffVersion": 2,
        };

        const appSettings = {
            localizeOnly: true,
            xliffsDir: "./xliffs",
            mode: "localize",
            xliffVersion: 2,
            nopseudo: false,
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
        var project = ProjectFactory.newProject(projectSettings, appSettings);

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
        /*if (fs.existsSync(resourcePath)) {
            fs.rmSync(resourcePath, { recursive: true });
        }*/
    });
    test("dartsample_test_ko_KR", function() {
        expect.assertions(4);
        filePath = path.join(resourcePath, 'ko.json');
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["Search"]).toBe("통합 검색");
        expect(jsonData["App List"]).toBe("앱 목록");
        expect(jsonData["Back button"]).toBe("이전 버튼");
    });
    test("dartsample_test_es_CO", function() {
        expect.assertions(4);
        filePath = path.join(resourcePath, 'es.json');
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["Search"]).toBe("Buscar");
        expect(jsonData["App List"]).toBe("Lista de Aplicaciones");
        expect(jsonData["Back button"]).toBe("Botón regresar");
    });
    test("dartsample_test_es_US", function() {
        expect.assertions(2);
        filePath = path.join(resourcePath, 'en.json');
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["Programme"]).toBe("Channel");
    });
    test("dartsample_test_en_GB", function() {
        expect.assertions(2);
        filePath = path.join(resourcePath, 'en_GB.json');
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["Programme"]).toBe("Programme");
    });
    test("dartsample_test_en_AU", function() {
        expect.assertions(2);
        filePath = path.join(resourcePath, 'en_AU.json');
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["Programme"]).toBe("Programme");
    });
    /*
    test("dartsample_test_fr_CA", function() {
        expect.assertions(6);
        filePath = path.join(resourcePath, 'fr.json');
        jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["App List"]).toBe("Liste des applications");
        expect(jsonData["App Rating"]).toBe("Évaluation de l'application");
        expect(jsonData["Back button"]).toBe("Bouton Retour");
        expect(jsonData["Delete All"]).toBe("Tout supprimer");
        expect(jsonData["Search_all"]).toBe("Rechercher");
    });
    test("dartsample_test_fr_FR", function() {
        expect.assertions(6);
        filePath = path.join(resourcePath, 'fr_FR.json');
        jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["App List"]).toBe("Liste des applications");
        expect(jsonData["App Rating"]).toBe("Évaluation de l'application");
        expect(jsonData["Back button"]).toBe("Bouton Retour");
        expect(jsonData["Delete All"]).toBe("Tout supprimer");
        expect(jsonData["Search_all"]).toBe("Recherche");
    });
    
    test("dartsample_test_es_ES", function() {
        expect.assertions(7);
        filePath = path.join(resourcePath, 'es_ES.json');
        jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["App List"]).toBe("Lista de aplicaciones");
        expect(jsonData["App Rating"]).toBe("Clasificación de la aplicación");
        expect(jsonData["Back button"]).toBe("Botón atrás");
        expect(jsonData["Delete All"]).toBe("Eliminar todo");
        expect(jsonData["Search_all"]).toBe("Búsqueda");
        expect(jsonData["OK"]).toBe("OK");
    });
    test("dartsample_test_en_US", function() {
        expect.assertions(7);
        filePath = path.join(resourcePath, 'en.json');
        jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["App List"]).toBe("App List");
        expect(jsonData["App Rating"]).toBe("App Rating");
        expect(jsonData["Back button"]).toBe("Back button");
        expect(jsonData["Delete All"]).toBe("Delete All");
        expect(jsonData["Search_all"]).toBe("Search");
        expect(jsonData["{appName} app cannot be deleted."]).toBe("{appName} app cannot be deleted.");
    });
    test("dartsample_test_ja_JP", function() {
        expect.assertions(6);
        filePath = path.join(resourcePath, 'ja.json');
        jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["App List"]).toBe("アプリリスト");
        expect(jsonData["App Rating"]).toBe("アプリの評価");
        expect(jsonData["Back button"]).toBe("[戻る]ボタン");
        expect(jsonData["Delete All"]).toBe("すべて削除");
        expect(jsonData["Search_all"]).toBe("検索");
    });
    test("dartsample_test_sl_SI", function() {
        expect.assertions(6);
        filePath = path.join(resourcePath, 'sl.json');
        jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["Search_all"]).toBe("Iskanje");
        expect(jsonData["1#At least 1 letter|#At least {num} letters"].one).toBe("Vsaj {num} znak");
        expect(jsonData["1#At least 1 letter|#At least {num} letters"].two).toBe("Vsaj {num} znaka");
        expect(jsonData["1#At least 1 letter|#At least {num} letters"].few).toBe("Vsaj {num} znake");
        expect(jsonData["1#At least 1 letter|#At least {num} letters"].other).toBe("Vsaj {num} znakov");
    });*/
});