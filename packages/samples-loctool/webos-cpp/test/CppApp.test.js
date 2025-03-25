/*
 * CppApp.test.js - test the localization result of webos-cpp app.
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
const { isValidPath, loadData } = require('../../Utils.js');

describe('test the localization result of webos-cpp app', () => {
    const resourcePath = 'resources';
    const fileName = 'cppstrings.json';

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
    test("csample_test_ko_KR", function() {
        expect.assertions(4);
        filePath = path.join(resourcePath, 'ko', fileName);
        jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["No"]).toBe("아니오");
        expect(jsonData["Update"]).toBe("업데이트");
        expect(jsonData["Update"]).toBe("업데이트");
    });
    test("csample_test_en_US", function() {
      expect.assertions(3);
      filePath = path.join(resourcePath, fileName);
      jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

      expect(jsonData).toBeTruthy();
      expect(jsonData["Ivory Coast"]).toBe("Côte d’Ivoire");
      expect(jsonData["Programme"]).toBe("Channel");
    });
    test("csample_test_en_AU", function() {
      expect.assertions(8);
      filePath = path.join(resourcePath, "en/AU", fileName);
      jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

      expect(jsonData).toBeTruthy();
      expect(jsonData["Service Area Zip Code"]).toBe("Service Area Postcode");
      expect(jsonData["TV Program Locks"]).toBe("TV Rating Locks");
      expect(jsonData["Programme"]).toBe("Programme");
      expect(jsonData["Game Optimizer"]).toBe("Game Optimiser"); //common data
      expect(jsonData["HDMI Deep Color"]).toBe("HDMI Deep Colour"); //common data
      expect(jsonData["Programme"]).toBeTruthy();
      expect(jsonData["Ivory Coast"]).toBeFalsy();
    });
    test("csample_test_en_GB", function() {
      expect.assertions(8);
      filePath = path.join(resourcePath, "en/GB", fileName);
      jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

      expect(jsonData).toBeTruthy();
      expect(jsonData["Service Area Zip Code"]).toBe("Service Area Postcode");
      expect(jsonData["TV Program Locks"]).toBe("TV Rating Locks");
      expect(jsonData["Programme"]).toBe("Programme");
      expect(jsonData["Game Optimizer"]).toBe("Game Optimiser"); //common data
      expect(jsonData["HDMI Deep Color"]).toBe("HDMI Deep Colour"); //common data
      expect(jsonData["Programme"]).toBeTruthy();
      expect(jsonData["Ivory Coast"]).toBeFalsy();
    });
    test("csample_test_fr_CA", function() {
      expect.assertions(6);
      filePath = path.join(resourcePath, "fr", fileName);
      jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

      expect(jsonData).toBeTruthy();
      expect(jsonData["Agree"]).toBe("D’accord");
      expect(jsonData["Programme"]).toBe("Programme");
      expect(jsonData["Others"]).toBe("Autres");
      expect(jsonData["Others"]).toBe("Autres");
      expect(jsonData["Exit"]).toBe("Quitter"); //common data
    });
    test("csample_test_fr_FR", function() {
      expect.assertions(5);
      filePath = path.join(resourcePath, "fr/FR", fileName);
      jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

      expect(jsonData).toBeTruthy();
      expect(jsonData["Agree"]).toBe("J'accepte");
      expect(jsonData["Agree"]).toBe("J'accepte");
      expect(jsonData["Others"]).toBeFalsy();
      expect(jsonData["Exit"]).toBeFalsy();
    });
    test("csample_test_es_ES", function() {
      expect.assertions(4);
      filePath = path.join(resourcePath, "es/ES", fileName);
      jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

      expect(jsonData).toBeTruthy();
      expect(jsonData["Sound Out"]).toBe("Salida de sonido");
      expect(jsonData["OK"]).toBe("OK");
      expect(jsonData["OK"]).toBeTruthy();
    });
    test("csample_test_es_CO", function() {
      expect.assertions(3);
      filePath = path.join(resourcePath, "es", fileName);
      jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

      expect(jsonData).toBeTruthy();
      expect(jsonData["Sound Out"]).toBe("Salida de Audio");
      expect(jsonData["OK"]).toBe("Aceptar");
    });
});