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

const { exec } = require('child_process');
const path = require('path');
const pluginUtils = require("ilib-loctool-webos-common/utils.js");

describe('test the localization result of webos-dart app', () => {
    const resourcePath = 'assets/i18n';
    const generalOptions = '-2 --xliffStyle custom --pseudo --localizeOnly';
    const localeInherit = '--localeInherit en-AU:en-GB';
    const localeMap = '--localeMap es-CO:es,fr-CA:fr';

    let filePath, jsonData = {};

    beforeAll(async() => {
        await new Promise((resolve, reject) => {
            exec(`npm run clean; loctool ${generalOptions} ${localeMap} ${localeInherit}`, (error, stdout, stderr) => {
                if (error) {
                   return reject(error);
                }
                resolve(stdout);
            });
        });
    }, 50000);
    test("dartsample_test_ko_KR", function() {
        expect.assertions(9);
        filePath = path.join(resourcePath, 'ko.json');
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["App List"]).toBe("앱 목록");
        expect(jsonData["App Rating"]).toBe("앱 등급");
        expect(jsonData["Back button"]).toBe("이전 버튼");
        expect(jsonData["Delete All"]).toBe("모두 삭제");
        expect(jsonData["Search_all"]).toBe("통합 검색");
        expect(jsonData["{appName} app cannot be deleted."]).toBe("{appName}앱은 삭제될 수 없습니다.");
        expect(jsonData["The first option is {arg1}."]).toBe("첫 번째 옵션은 {arg1} 입니다.");
        expect(jsonData["Exclusive features for {%TV_model} are all gathered here."]).toBe("{%TV_model}에서만 제공하는 유용한 기능들이 모여 있어요.");
    });
    test("dartsample_test_fr_CA", function() {
        expect.assertions(6);
        filePath = path.join(resourcePath, 'fr.json');
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

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
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["App List"]).toBe("Liste des applications");
        expect(jsonData["App Rating"]).toBe("Évaluation de l'application");
        expect(jsonData["Back button"]).toBe("Bouton Retour");
        expect(jsonData["Delete All"]).toBe("Tout supprimer");
        expect(jsonData["Search_all"]).toBe("Recherche");
    });
    test("dartsample_test_es_CO", function() {
        expect.assertions(11);
        filePath = path.join(resourcePath, 'es.json');
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["App List"]).toBe("Lista de Aplicaciones");
        expect(jsonData["App Rating"]).toBe("Clasificación de Aplicación");
        expect(jsonData["Back button"]).toBe("Botón regresar");
        expect(jsonData["Delete All"]).toBe("Eliminar Todo");
        expect(jsonData["Search_all"]).toBe("Buscar");
        expect(jsonData["OK"]).toBe("Aceptar");
        expect(jsonData["plural.demo"].one).toBe("Has pulsado el botón una vez.");
        expect(jsonData["plural.demo"].two).toBe("Has pulsado el botón dos veces.");
        expect(jsonData["plural.demo"].other).toBe("Ha pulsado el botón {num} veces.");
        expect(jsonData["Trailing commas"]).toBe("Comas finales");
    });
    test("dartsample_test_es_ES", function() {
        expect.assertions(7);
        filePath = path.join(resourcePath, 'es_ES.json');
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

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
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

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
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

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
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["Search_all"]).toBe("Iskanje");
        expect(jsonData["1#At least 1 letter|#At least {num} letters"].one).toBe("Vsaj {num} znak");
        expect(jsonData["1#At least 1 letter|#At least {num} letters"].two).toBe("Vsaj {num} znaka");
        expect(jsonData["1#At least 1 letter|#At least {num} letters"].few).toBe("Vsaj {num} znake");
        expect(jsonData["1#At least 1 letter|#At least {num} letters"].other).toBe("Vsaj {num} znakov");
    });
});