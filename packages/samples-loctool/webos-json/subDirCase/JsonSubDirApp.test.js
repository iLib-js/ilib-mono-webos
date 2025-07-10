/*
 * JsonSubDirApp.test.js - test the localization result of webos-json app in subDirCase.
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

describe('test the localization result of webos-json(subDir Case) app', () => {
    const resourcePath = 'resources';
    let fileName = 'appinfo.json';

    const generalOptions = '-2 --xliffStyle custom --pseudo --localizeOnly';
    const localeInherit = '--localeInherit en-AU:en-GB';
    const localeMap = '--localeMap es-CO:es';

    let filePath, jsonData = {};

    beforeAll(async() => {
      await new Promise((resolve, reject) => {
        exec(`npm run clean;loctool ${generalOptions} ${localeMap} ${localeInherit}`, {cwd: 'subDirCase'}, (error, stdout, stderr) => {
          if (error) {
            return reject(error);
          }
          resolve(stdout);
        });
      });
    }, 50000);
    test("subdirApp1_jsonsample_test_ko_KR", function() {
        expect.assertions(3);
        filePath = path.join("subDirCase/app1", resourcePath, 'ko', fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["title"]).toBe("[common]현재 방송");
        expect(jsonData["vendor"]).toBe("전자");
    });
    test("subdirApp1_jsonsample_test_en_US", function() {
        expect.assertions(2);
        filePath = path.join("subDirCase/app1", resourcePath, fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["title"]).toBe("(en-US) Live TV");
    });
    test("subdirApp1_jsonsample_test_en_GB", function() {
        expect.assertions(2);
        filePath = path.join("subDirCase/app1", resourcePath, "en/GB", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["title"]).toBe("(en-GB) Live TV");
    });
    test("subdirApp1_jsonsample_test_zh_Hans_CN", function() {
        expect.assertions(2);
        filePath = path.join("subDirCase/app1", resourcePath, "zh", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["vendor"]).toBe("电子");
    });
    test("subdirApp2_jsonsample_test_ru_RU", function() {
        expect.assertions(2);
        filePath = path.join("subDirCase/app2", resourcePath, "ru", fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["title"]).toBe("YouTube Детям");
    });
});