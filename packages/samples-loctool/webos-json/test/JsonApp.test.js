/*
 * JsonApp.test.js - test the localization result of webos-json app.
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

describe('test the localization result of webos-json app', () => {
    const resourcePath = 'resources';
    let fileName = 'appinfo.json';

    const generalOptions = '-2 --xliffStyle custom --pseudo --localizeOnly';
    const localeInherit = '--localeInherit en-AU:en-GB';
    const localeMap = '--localeMap es-CO:es';

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
    test("appinfo_jsonsample_test_ko_KR", function() {
        expect.assertions(2);
        filePath = path.join(resourcePath, 'ko', fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["title"]).toBe("현재 방송");
    });
    test("appinfo_jsonsample_test_en_US", function() {
        expect.assertions(3);
        filePath = path.join(resourcePath, fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["title"]).toBe("(en-US) Live TV");
        expect(jsonData["vendor"]).toBe("(dup) test");
    });
    test("appinfo_jsonsample_test_en_AU", function() {
        expect.assertions(2);
        filePath = path.join(resourcePath, "en/AU", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["title"]).toBe("(en-GB) Live TV");
    });
    test("appinfo_jsonsample_test_en_GB", function() {
        expect.assertions(2);
        filePath = path.join(resourcePath, "en/GB", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["title"]).toBe("(en-GB) Live TV");
    });
    test("appinfo_jsonsample_test_fr_CA", function() {
        expect.assertions(2);
        filePath = path.join(resourcePath, "fr", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["title"]).toBe("(fr) Live TV");
    });
    test("appinfo_jsonsample_test_fr_FR", function() {
        expect.assertions(2);
        filePath = path.join(resourcePath, "fr", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["title"]).toBe("(fr) Live TV");
    });
    test("appinfo_jsonsample_test_es_ES", function() {
        expect.assertions(4);
        filePath = path.join(resourcePath, "es/ES", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["title"]).toBe("(es-ES) Live TV");
        expect(jsonData["vendor"]).toBeTruthy();
        expect(jsonData["vendor"]).toBe("test");
    });
    test("appinfo_jsonsample_test_es_CO", function() {
        expect.assertions(3);
        filePath = path.join(resourcePath, "es", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["title"]).toBe("(es-CO) Live TV");
        expect(jsonData["vendor"]).toBeFalsy();
    });
    test("appinfo_jsonsample_test_it_IT", function() {
        expect.assertions(2);
        filePath = path.join(resourcePath, "es", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["title"]).toBe("(es-CO) Live TV");
    });
    test("appinfo_jsonsample_test_zh_Hans_CN", function() {
        expect.assertions(2);
        filePath = path.join(resourcePath, "zh", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["title"]).toBe("直播电视");
    });
    test("appinfo_jsonsample_test_zh_Hant_HK", function() {
        expect.assertions(2);
        filePath = path.join(resourcePath, "zh/Hant/HK", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["title"]).toBe("Live TV");
    });
    test("appinfo_jsonsample_test_zh_Hant_TW", function() {
        expect.assertions(2);
        filePath = path.join(resourcePath, "zh/Hant/TW", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["title"]).toBe("直播電視");
    });
    test("appinfo_jsonsample_test_kn_IN", function() {
        expect.assertions(3);
        filePath = path.join(resourcePath, "kn", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["title"]).toBe("(kn-IN) Live TV");
        expect(jsonData["title@oled"]).toBeFalsy();
    });
    test("qcardinfo_jsonsample_test_ko_KR", function() {
        expect.assertions(3);
        fileName = "qcardinfo.json";

        filePath = path.join(resourcePath, "ko", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["title"]).toBe("스포츠");
        expect(jsonData["description"]).toBe("스포츠 정보를 한눈에");
    });
    test("qcardinfo_jsonsample_test_fr_FR", function() {
        expect.assertions(3);
        fileName = "qcardinfo.json";

        filePath = path.join(resourcePath, "fr", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["title"]).toBeFalsy();
        expect(jsonData["description"]).toBe("Toutes les informations sportives rassemblées au même endroit");
    });
    test("qcardinfo_jsonsample_test_fr_CA", function() {
        expect.assertions(3);
        fileName = "qcardinfo.json";

        filePath = path.join(resourcePath, "fr/CA", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["title"]).toBeFalsy();
        expect(jsonData["description"]).toBe("Tous les renseignements sportifs en un seul endroit");
    });
});