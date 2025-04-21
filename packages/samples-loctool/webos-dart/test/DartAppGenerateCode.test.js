/*
 * DartAppGenerateCode.test.js - test the localization result in generate mode of webos-dart app.
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
const { isValidPath, loadData } = require('../../Utils.js');

const GenerateModeProcess = require("loctool/lib/GenerateModeProcess.js");
const ProjectFactory = require("loctool/lib/ProjectFactory.js");

describe('test the localization result (generate mode) of webos-dart app', () => {
    const resourcePath = 'assets/i18n';
    let filePath, jsonData;

    beforeAll(async() => {
      console.log("beforeAll");
      const outputPath = "./assets/i18n";
      if (fs.existsSync(outputPath)) {
        fs.rmSync(outputPath, { recursive: true });
      }

      const projectSettings = {
        "rootDir": ".",
        "id": "sample-webos-dart",
        "projectType": "webos-dart",
        "sourceLocale": "en-KR",
        "resourceDirs" : { "json": "assets/i18n" },
        "resourceFileTypes": { "json":"ilib-loctool-webos-json-resource" },
        "plugins": [ "ilib-loctool-webos-dart" ],
        "xliffStyle": "custom",
        "xliffVersion": 2,
      };
      const appSettings = {
        xliffsDir: "./xliffs",
        locales:[ 
          "en-US",
          "en-US",
          "es-CO",
          "es-ES",
          "fr-CA",
          "fr-FR",
          "ja-JP",
          "ko-KR",
          "sl-SI"
         ],
        localeMap: {
          "es-CO": "es",
          "fr-CA": "fr"
        },
        localeInherit: {
          "en-AU": "en-GB",
        }
      };
      debugger;
      var project = ProjectFactory.newProject(projectSettings, appSettings);
      var process = GenerateModeProcess(project);
      //expect(process).toBeTruthy();
      
    }, 50000);
    test("code_dartsample_generate_test_ko_KR", function() {
        expect.assertions(8);
        filePath = path.join(resourcePath, 'ko.json');
        debugger;
        jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["App List"]).toBe("앱 목록");
        expect(jsonData["App Rating"]).toBe("앱 등급");
        expect(jsonData["Back button"]).toBe("이전 버튼");
        expect(jsonData["Delete All"]).toBe("모두 삭제");
        expect(jsonData["Search_all"]).toBe("통합 검색");
        expect(jsonData["{appName} app cannot be deleted."]).toBe("{appName}앱은 삭제될 수 없습니다.");
        expect(jsonData["Live TV"]).toBe("현재 방송"); //no source code
    });
    test("code_dartsample_generate_test_fr_CA", function() {
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
  test("code_dartsample_generate_test_fr_FR", function() {
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
  test("code_dartsample_generate_test_es_CO", function() {
    expect.assertions(9);
    filePath = path.join(resourcePath, 'es.json');
    jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

    expect(jsonData).toBeTruthy();
    expect(jsonData["App List"]).toBe("Lista de Aplicaciones");
    expect(jsonData["App Rating"]).toBe("Clasificación de Aplicación");
    expect(jsonData["Back button"]).toBe("Botón regresar");
    expect(jsonData["Delete All"]).toBe("Eliminar Todo");
    expect(jsonData["Search_all"]).toBe("Buscar");
    expect(jsonData["plural.demo"].one).toBe("Has pulsado el botón una vez.");
    expect(jsonData["plural.demo"].two).toBe("Has pulsado el botón dos veces.");
    expect(jsonData["plural.demo"].other).toBe("Ha pulsado el botón {num} veces.");
  });
  test("code_dartsample_generate_test_es_ES", function() {
    expect.assertions(6);
    filePath = path.join(resourcePath, 'es_ES.json');
    jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

    expect(jsonData).toBeTruthy();
    expect(jsonData["App List"]).toBe("Lista de aplicaciones");
    expect(jsonData["App Rating"]).toBe("Clasificación de la aplicación");
    expect(jsonData["Back button"]).toBe("Botón atrás");
    expect(jsonData["Delete All"]).toBe("Eliminar todo");
    expect(jsonData["Search_all"]).toBe("Búsqueda");
  });
  test("code_dartsample_generate_test_en_US", function() {
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
  test("code_dartsample_generate_test_ja_JP", function() {
    expect.assertions(7);
    filePath = path.join(resourcePath, 'ja.json');
    jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

    expect(jsonData).toBeTruthy();
    expect(jsonData["App List"]).toBe("アプリリスト");
    expect(jsonData["App Rating"]).toBe("アプリの評価");
    expect(jsonData["Back button"]).toBe("[戻る]ボタン");
    expect(jsonData["Delete All"]).toBe("すべて削除");
    expect(jsonData["Search_all"]).toBe("検索");
    expect(jsonData["Time"]).toBe("時刻"); // no source code
  });
  test("code_dartsample_generate_test_sl_SI", function() {
    expect.assertions(6);
    filePath = path.join(resourcePath, 'sl.json');
    jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

    expect(jsonData).toBeTruthy();
    expect(jsonData["Search_all"]).toBe("Iskanje");
    expect(jsonData["1#At least 1 letter|#At least {num} letters"].one).toBe("Vsaj {num} znak");
    expect(jsonData["1#At least 1 letter|#At least {num} letters"].two).toBe("Vsaj {num} znaka");
    expect(jsonData["1#At least 1 letter|#At least {num} letters"].few).toBe("Vsaj {num} znake");
    expect(jsonData["1#At least 1 letter|#At least {num} letters"].other).toBe("Vsaj {num} znakov");
  });
});