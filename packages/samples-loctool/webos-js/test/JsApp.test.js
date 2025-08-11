/*
 * JsApp.test.js - test the localization result of webos-js app.
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
const ResBundle = require("ilib/lib/ResBundle");
const defaultRSPath = path.join(process.cwd(), "resources");
const pluginUtils = require("ilib-loctool-webos-common/utils.js");

describe('test the localization result of webos-js app', () => {
    const generalOptions = '-2 --xliffStyle webOS --pseudo --localizeOnly';
    const localeInherit = '--localeInherit en-AU:en-GB';
    const localeMap = '--localeMap es-CO:es,fr-CA:fr';
    const deviceOption = '--metadata device-type=Monitor';
    let fullPath = '';

    beforeAll(async() => {
        await new Promise((resolve, reject) => {
            exec(`npm run clean; loctool ${generalOptions} ${localeMap} ${localeInherit} ${deviceOption}`, (error, stdout, stderr) => {
                if (error) {
                    return reject(error);
                }
                resolve(stdout);
            });
        });
    }, 50000);
    test("jssample_test_ko_KR", function() {
        expect.assertions(9);
        let rb = new ResBundle({
            locale:"ko-KR",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("TV Name : ").toString()).toBe("TV Name :");
        expect(rb.getString("Time Settings").toString()).toBe("[App] 시간 설정");
        expect(rb.getString("High", "volumeModeHigh").toString()).toBe("높음");
        expect(rb.getString("TV On Screen").toString()).toBe("TV 켜짐 화면");
        expect(rb.getString("IPv6 e.g.: {ipAddress}").toString()).toBe("IPv6 예시: {ipAddress}");
        expect(rb.getString("IPv4 e.g.: {ip4Address}").toString()).toBe("IPv4 예시: {ip4Address}");

        // common data
        expect(rb.getString("Please enter password.").toString()).toBe("[common] 비밀번호를 입력해 주세요.");
        // common-metadata
        expect(rb.getString("%deviceType% Speaker").toString()).toBe("모니터 스피커");
    });
    test("jssample_test_ko_US", function() {
        expect.assertions(2);
        let rb = new ResBundle({
            locale:"ko-US",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Antenna NEXTGEN TV").toString()).toBe("안테나 NEXTGEN TV");
    });
    test("jssample_test_ko_TW", function() {
        expect.assertions(2);
        let rb = new ResBundle({
            locale:"ko-TW",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("TV On Screen").toString()).toBe("기기 켜짐 화면");
    });
    test("jssample_test_en_AU", function() {
        expect.assertions(10);

        let rb = new ResBundle({
            locale:"en-AU",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Service Area Zip Code").toString()).toBe("Service Area Postcode");
        expect(rb.getString("TV Program Locks").toString()).toBe("TV Rating Locks");
        expect(rb.getString("Programme").toString()).toBe("Programme");
        expect(rb.getString("Ivory Coast").toString()).toBe("Côte d’Ivoire");

        fullPath = path.join(defaultRSPath, "en/AU/strings.json");
        expect(pluginUtils.isExistKey(fullPath, "Programme")).toBeTruthy();
        expect(pluginUtils.isExistKey(fullPath, "Ivory Coast")).toBeFalsy();

        // common data's locale Inheritence
        expect(rb.getString("Game Optimizer").toString()).toBe("Game Optimiser");
        expect(rb.getString("HDMI Deep Color").toString()).toBe("HDMI Deep Colour");

        // multi-spaces
        expect(rb.getString("Go to  'Settings > General > Channels > Channel Tuning & Settings > Transponder Edit' and add one.").toString()).toBe("Go to 'Settings > General > Programmes > Programme Tuning & Settings > Transponder Edit' and add one.");
    });
    test("jssample_test_en_GB", function() {
        expect.assertions(10);

        let rb = new ResBundle({
            locale:"en-GB",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Service Area Zip Code").toString()).toBe("Service Area Postcode");
        expect(rb.getString("TV Program Locks").toString()).toBe("TV Rating Locks");
        expect(rb.getString("Programme").toString()).toBe("Programme");
        expect(rb.getString("Ivory Coast").toString()).toBe("Côte d’Ivoire");

        fullPath = path.join(defaultRSPath, "en/GB/strings.json");
        expect(pluginUtils.isExistKey(fullPath, "Programme")).toBeTruthy();
        expect(pluginUtils.isExistKey(fullPath, "Ivory Coast")).toBeFalsy();

        // common data's locale Inheritence
        expect(rb.getString("Game Optimizer").toString()).toBe("Game Optimiser");
        expect(rb.getString("HDMI Deep Color").toString()).toBe("HDMI Deep Colour");

        // multi-spaces
        expect(rb.getString("Go to  'Settings > General > Channels > Channel Tuning & Settings > Transponder Edit' and add one.").toString()).toBe("Go to 'Settings > General > Programmes > Programme Tuning & Settings > Transponder Edit' and add one.");
    });
    test("jssample_test_fr_CA", function() {
        expect.assertions(5);

        let rb = new ResBundle({
            locale:"fr-CA",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Agree").toString()).toBe("D’accord");
        expect(rb.getString("Programme").toString()).toBe("Programme");
        
        expect(rb.getString("Exit").toString()).toBe("Quitter"); //common data
        
        fullPath = path.join(defaultRSPath, "fr/strings.json");
        expect(pluginUtils.isExistKey(fullPath, "Exit")).toBeTruthy();
    });
    test("jssample_test_fr_FR", function() {
        expect.assertions(6);
        let rb = new ResBundle({
            locale:"fr-FR",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Agree").toString()).toBe("J'accepte");
        expect(rb.getString("Others").toString()).toBe("Autres");
        
        expect(rb.getString("Exit").toString()).toBe("Quitter"); //common data

        fullPath = path.join(defaultRSPath, "fr/FR/strings.json");
        expect(pluginUtils.isExistKey(fullPath, "Others")).toBeFalsy();
        expect(pluginUtils.isExistKey(fullPath, "Exit")).toBeFalsy();
        
    });
    test("jssample_test_es_ES", function() {
        expect.assertions(4);
        let rb = new ResBundle({
            locale:"es-ES",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Sound Out").toString()).toBe("Salida de sonido");

        expect(rb.getString("OK").toString()).toBe("OK"); //common data
        fullPath = path.join(defaultRSPath, "es/ES/strings.json");
        expect(pluginUtils.isExistKey(fullPath, "OK")).toBeTruthy();
    });
    test("jssample_test_es_CO", function() {
        expect.assertions(3);
        let rb = new ResBundle({
            locale:"es-CO",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Sound Out").toString()).toBe("Salida de Audio");
        expect(rb.getString("OK").toString()).toBe("Aceptar"); // common data
    });
    test("jssample_test_ja_JP", function() {
        expect.assertions(4);

        let rb = new ResBundle({
            locale:"ja-JP",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Live TV").toString()).toBe("Live TV");
        expect(rb.getString("TV Name : ").toString()).toBe("機器名：");

        // fyi. https://github.com/iLib-js/ilib-loctool-webos-javascript/pull/34
        expect(rb.getString("To read the Terms and Conditions, go to Settings > Support >  Privacy & Terms.").toString()).toBe("利用規約を読むには、設定 > サポート > 利用規約 & 法的情報に移動します。");
    });
    test("jssample_test_de_DE", function() {
        expect.assertions(3);
        let rb = new ResBundle({
            locale:"de-DE",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("EXIT APP").toString()).toBe("APP BEENDEN");
        expect(rb.getString("SETTINGS").toString()).toBe("EINSTELLUNGEN");
    });
    test("jssample_test_as_IN", function() {
        expect.assertions(3);
        let rb = new ResBundle({
            locale:"as-IN",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("RETRY").toString()).toBe("পুনৰ চেষ্টা");
        expect(rb.getString("Restart").toString()).toBe("পুনৰাম্ভ কৰক");
    });
});