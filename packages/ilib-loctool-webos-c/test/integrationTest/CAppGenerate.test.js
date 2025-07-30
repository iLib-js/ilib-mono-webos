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

const fs = require("fs");
const path = require('path');

const ProjectFactory = require("loctool/lib/ProjectFactory.js");
const GenerateModeProcess = require("loctool/lib/GenerateModeProcess.js");
const pluginUtils = require("ilib-loctool-webos-common/utils.js");

describe("[integration] test the localization result of webos-c app", () => {
    const projectRoot = (process.cwd().indexOf("integrationTest")) >-1 ? "." : "./test/integrationTest";
    const resourcePath = path.join(projectRoot, "resources2");
    const fileName = "cstrings.json";
    let filePath, jsonData = {};

    beforeAll(async() => {
        if (fs.existsSync(resourcePath)) {
            fs.rmSync(resourcePath, { recursive: true });
        }
        const projectSettings = {
            rootDir: projectRoot,
            id: "sample-webos-c",
            projectType: "webos-c",
            sourceLocale: "en-KR",
            resourceDirs : { "json": "resources2" },
            resourceFileTypes: { "json":"ilib-loctool-webos-json-resource" },
            plugins: [ "ilib-loctool-webos-c" ],
        };

        const appSettings = {
            localizeOnly: true,
            translationsDir: "./xliffs",
            mode: "generate",
            xliffVersion: 2,
            xliffStyle: "webOS",
            metadata : {
                "device-type": "Monitor"
            },
            nopseudo: false,
            resourceFileNames: { "c": fileName },
            locales:[
                "en-AU",
                "ko-KR"
            ],
            localeInherit: {
                "en-AU": "en-GB",
            }
        };

        const project = ProjectFactory.newProject(projectSettings, appSettings);
        process = GenerateModeProcess(project);

    }, 50000);
    afterAll(async () => {
        if (fs.existsSync(resourcePath)) {
            fs.rmSync(resourcePath, { recursive: true });
        }
    });
    test("csample_test_ko_KR_generate_mode", function() {
        expect.assertions(6);
        filePath = path.join(resourcePath, 'ko', fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["No"]).toBe("아니오");
        expect(jsonData["OK"]).toBe("확인");
        expect(jsonData["Yes"]).toBe("예");
        expect(jsonData["Time Settings"]).toBe("시간 설정");
        expect(jsonData["NOT AVAILABLE"]).toBe("\"Monitor\" 이용이 불가능합니다");
    });
    test("csample_test_en_AU_generate_mode", function() {
        expect.assertions(3);
        filePath = path.join(resourcePath, 'en/AU', fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["Programme"]).toBe("Programme");
        expect(jsonData["TV Name"]).toBe("Monitor Name");
    });
});
