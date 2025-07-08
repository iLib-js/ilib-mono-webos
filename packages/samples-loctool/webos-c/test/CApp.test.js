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

const { exec } = require('child_process');
const path = require('path');
const pluginUtils = require("ilib-loctool-webos-common/utils.js");

describe('test the localization result of webos-c app', () => {
    const resourcePath = 'resources';
    const fileName = 'cstrings.json';

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
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;
        expect(Object.keys(jsonData).length).toBeGreaterThan(0);
        expect(jsonData["No"]).toBe("아니오");
        expect(jsonData["OK"]).toBe("확인");
        expect(jsonData["Do you want to change the settings from 'Digital Sound Output' to 'Pass Through' to minimize audio delay while playing game?"]).toBe("'디지털 음향 내보내기' 를 오디오 지연을 최소화하여 게임을 즐길 수 있는 'Pass Through'로 변경할까요?");
    });
    test("csample_test_en_US", function() {
        expect.assertions(3);
        filePath = path.join(resourcePath, fileName);
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(Object.keys(jsonData).length).toBeGreaterThan(0);
        expect(jsonData["Ivory Coast"]).toBe("Côte d’Ivoire");
        expect(jsonData["Programme"]).toBe("Channel");
    });
    test("csample_test_en_AU", function() {
        expect.assertions(8);
        filePath = path.join(resourcePath, "en/AU", fileName);
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(Object.keys(jsonData).length).toBeGreaterThan(0);
        expect(jsonData["Service Area Zip Code"]).toBe("Service Area Postcode");
        expect(jsonData["TV Program Locks"]).toBe("TV Rating Locks");
        expect(jsonData["Programme"]).toBe("Programme");

        //common data
        expect(jsonData["Game Optimizer"]).toBe("Game Optimiser");
        expect(jsonData["HDMI Deep Color"]).toBe("HDMI Deep Colour");

        expect(jsonData["Programme"]).toBeTruthy();
        expect(jsonData["Ivory Coast"]).toBeFalsy();
    });
    test("csample_test_en_GB", function() {
        expect.assertions(8);
        filePath = path.join(resourcePath, "en/GB", fileName);
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(Object.keys(jsonData).length).toBeGreaterThan(0);
        expect(jsonData["Service Area Zip Code"]).toBe("Service Area Postcode");
        expect(jsonData["TV Program Locks"]).toBe("TV Rating Locks");
        expect(jsonData["Programme"]).toBe("Programme");

        //common data
        expect(jsonData["Game Optimizer"]).toBe("Game Optimiser");
        expect(jsonData["HDMI Deep Color"]).toBe("HDMI Deep Colour");

        expect(jsonData["Programme"]).toBeTruthy();
        expect(jsonData["Ivory Coast"]).toBeFalsy();
    });
    test("csample_test_fr_CA", function() {
        expect.assertions(6);
        filePath = path.join(resourcePath, "fr", fileName);
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(Object.keys(jsonData).length).toBeGreaterThan(0);
        expect(jsonData["Agree"]).toBe("D’accord");
        expect(jsonData["Programme"]).toBe("Programme");
        expect(jsonData["Others"]).toBe("Autres");
        expect(jsonData["Exit"]).toBe("Quitter");
        expect(jsonData["Do you want to change the settings from 'Digital Sound Output' to 'Pass Through' to minimize audio delay while playing game?"]).toBe("Voulez-vous changer les paramètres de « Sortie audio numérique » à « Passage » pour minimiser le délai audio pendant les jeux?");
    });
    test("csample_test_fr_FR", function() {
        expect.assertions(5);
        filePath = path.join(resourcePath, "fr/FR", fileName);
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(Object.keys(jsonData).length).toBeGreaterThan(0);
        expect(jsonData["Agree"]).toBe("J'accepte");
        expect(jsonData["Do you want to change the settings from 'Digital Sound Output' to 'Pass Through' to minimize audio delay while playing game?"]).toBe("Souhaitez-vous modifier les paramètres de « Sortie audio numérique » en « Interconnexion » pour limiter le décalage audio pendant le jeu ?");
        
        expect(jsonData["Others"]).toBeFalsy();
        expect(jsonData["Exit"]).toBeFalsy();
    });
    test("csample_test_es_ES", function() {
        expect.assertions(4);
        filePath = path.join(resourcePath, "es/ES", fileName);
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(Object.keys(jsonData).length).toBeGreaterThan(0);
        expect(jsonData["Sound Out"]).toBe("Salida de sonido");
        expect(jsonData["OK"]).toBe("OK");
        expect(jsonData["OK"]).toBeTruthy();        
    });
    test("csample_test_es_CO", function() {
        expect.assertions(3);
        filePath = path.join(resourcePath, "es", fileName);
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(Object.keys(jsonData).length).toBeGreaterThan(0);
        expect(jsonData["Sound Out"]).toBe("Salida de Audio");
        expect(jsonData["OK"]).toBe("Aceptar");
    });
    test("csample_test_ja_JP", function() {
        expect.assertions(3);
        filePath = path.join(resourcePath, "ja", fileName);
        jsonData = pluginUtils.isValidPath(filePath) ? pluginUtils.loadData(filePath) : jsonData;

        expect(Object.keys(jsonData).length).toBeGreaterThan(0);
        expect(jsonData["No"]).toBe("いいえ");
        expect(jsonData["OK"]).toBe("確認");
    });
});
