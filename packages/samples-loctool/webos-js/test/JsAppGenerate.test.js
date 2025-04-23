/*
 * JsAppGenerate.test.js - test the localization result in generate mode of webos-js app.
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
const ResBundle = require("ilib/lib/ResBundle");
const defaultRSPath = path.join(process.cwd(), "resources");
const { isExistKey } = require('../../Utils.js');

const ProjectFactory = require("loctool/lib/ProjectFactory.js");
const GenerateModeProcess = require("loctool/lib/GenerateModeProcess.js");

describe('test the localization result (generate mode) of webos-js app', () => {
    beforeAll(async() => {
        if (fs.existsSync(defaultRSPath)) {
            fs.rmSync(defaultRSPath, { recursive: true });
        }
        const projectSettings = {
            "rootDir": ".",
            "id": "sample-webos-js",
            "projectType": "webos-js",
            "sourceLocale": "en-KR",
            "resourceDirs" : { "json": "resources" },
            "resourceFileTypes": { "json":"ilib-loctool-webos-json-resource" },
            "plugins": [ "ilib-loctool-webos-javascript" ],
            "xliffStyle": "custom",
            "xliffVersion": 2,
        };
        const appSettings = {
            xliffsDir: "./xliffs",
            locales:[
                "as-IN",
                "de-DE",
                "en-AU",
                "en-US",
                "en-GB",
                "en-JP",
                "es-ES",
                "es-CO",
                "fr-CA",
                "fr-FR",
                "ja-JP",
                "ko-KR",
                "ko-US",
                "ko-TW"
            ],
            localeMap: {
                "es-CO": "es",
                "fr-CA": "fr"
            },
            localeInherit: {
                "en-AU": "en-GB",
                "en-JP": "en-GB",
            }
        };
        const project = ProjectFactory.newProject(projectSettings, appSettings);
        GenerateModeProcess(project);

    }, 50000);
    test("jssample_generate_test_ko_KR", function() {
        expect.assertions(6);
        let rb = new ResBundle({
            locale:"ko-KR",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("TV Name : ").toString()).toBe("TV Name :");
        expect(rb.getString("Time Settings").toString()).toBe("[App] 시간 설정");
        expect(rb.getString("High", "volumeModeHigh").toString()).toBe("높음");
        expect(rb.getString("TV On Screen").toString()).toBe("TV 켜짐 화면");

        // common data
        expect(rb.getString("Please enter password.").toString()).toBe("Please enter password.");
    });
    test("jssample_generate_test_ko_US", function() {
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
    })
    test("jssample_generate_test_en_AU", function() {
        expect.assertions(7);

        let rb = new ResBundle({
            locale:"en-AU",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Service Area Zip Code").toString()).toBe("Service Area Postcode");
        expect(rb.getString("TV Program Locks").toString()).toBe("TV Rating Locks");
        expect(rb.getString("Programme").toString()).toBe("Programme");
        expect(rb.getString("Ivory Coast").toString()).toBe("Côte d’Ivoire");

        let fullPath = path.join(defaultRSPath, "en/AU/strings.json");
        expect(isExistKey(fullPath, "Programme")).toBeTruthy();
        expect(isExistKey(fullPath, "Ivory Coast")).toBeFalsy();
    });
    test("jssample_generate_test_en_GB", function() {
        expect.assertions(7);

        let rb = new ResBundle({
            locale:"en-GB",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Service Area Zip Code").toString()).toBe("Service Area Postcode");
        expect(rb.getString("TV Program Locks").toString()).toBe("TV Rating Locks");
        expect(rb.getString("Programme").toString()).toBe("Programme");
        expect(rb.getString("Ivory Coast").toString()).toBe("Côte d’Ivoire");

        let fullPath = path.join(defaultRSPath, "en/GB/strings.json");
        expect(isExistKey(fullPath, "Programme")).toBeTruthy();
        expect(isExistKey(fullPath, "Ivory Coast")).toBeFalsy();
    });
    test("jssample_generate_test_fr_CA", function() {
        expect.assertions(3);

        let rb = new ResBundle({
            locale:"fr-CA",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Agree").toString()).toBe("D’accord");
        expect(rb.getString("Programme").toString()).toBe("Programme");
    });
    test("jssample_generate_test_fr_FR", function() {
        expect.assertions(4);
        let rb = new ResBundle({
            locale:"fr-FR",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Agree").toString()).toBe("J'accepte");
        expect(rb.getString("Others").toString()).toBe("Autres");

        let fullPath = path.join(defaultRSPath, "en/FR/strings.json");
        expect(isExistKey(fullPath, "Others")).toBeFalsy();
    });
    test("jssample_generate_test_es_ES", function() {
        expect.assertions(2);
        let rb = new ResBundle({
            locale:"es-ES",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Sound Out").toString()).toBe("Salida de sonido");
    });
    test("jssample_generate_test_es_CO", function() {
        expect.assertions(2);
        let rb = new ResBundle({
            locale:"es-CO",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Sound Out").toString()).toBe("Salida de Audio");
    });
    test("jssample_generate_test_ja_JP", function() {
        expect.assertions(4);
        let rb = new ResBundle({
            locale:"ja-JP",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Live TV").toString()).toBe("Live TV");
        expect(rb.getString("TV Name : ").toString()).toBe("機器名：");

        expect(rb.getString("To read the Terms and Conditions, go to Settings > Support >  Privacy & Terms.").toString()).toBe("To read the Terms and Conditions, go to Settings > Support >  Privacy & Terms.");
    });
    test("jssample_generate_test_de_DE", function() {
        expect.assertions(3);
        let rb = new ResBundle({
            locale:"de-DE",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("EXIT APP").toString()).toBe("APP BEENDEN");
        expect(rb.getString("SETTINGS").toString()).toBe("EINSTELLUNGEN");
    });
    test("jssample_generate_test_as_IN", function() {
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