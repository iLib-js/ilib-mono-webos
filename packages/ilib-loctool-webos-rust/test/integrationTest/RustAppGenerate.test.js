/*
 * RustAppGenerate.test.js - test the localization result in generate mode of webos-rust app.
 *
 * Copyright (c) 2026 JEDLSoft
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
const { utils: pluginUtils } = require("ilib-loctool-webos-common");

describe("[integration] test the localization result (generate mode) of webos-rust app", () => {
    const projectRoot = (process.cwd().indexOf("integrationTest")) >-1 ? "." : "./test/integrationTest";
    const resourcePath = path.join(projectRoot, "resources2");
    let filePath, jsonData = {};

    beforeAll(async() => {
        if (fs.existsSync(resourcePath)) {
            fs.rmSync(resourcePath, { recursive: true });
        }
        const projectSettings = {
            rootDir: projectRoot,
            id: "sample-webos-rust",
            projectType: "webos-rust",
            sourceLocale: "en-KR",
            resourceDirs : { "json": "resources2" },
            resourceFileTypes: { "json":"ilib-loctool-webos-json-resource" },
            plugins: [ "ilib-loctool-webos-rust" ],
        };

        // custom rust.mappings: the first mapping is used in generate mode
        const appSettings = {
            localizeOnly: true,
            translationsDir : ["./xliffs", "./common"],
            mode: "generate",
            xliffVersion: 2,
            xliffStyle: "webOS",
            metadata : {
                "device-type": "Monitor"
            },
            nopseudo: false,
            locales:[
                "en-AU",
                "ko-KR"
            ],
            localeInherit: {
                "en-AU": "en-GB",
            },
            rust: {
                mappings: {
                    "**/*.rs": {
                        "template": "[resourceDir]/[localeUnder]/app.json"
                    }
                }
            }
        };

        const project = ProjectFactory.newProject(projectSettings, appSettings);
        GenerateModeProcess(project);

    }, 50000);
    afterAll(async () => {
        if (fs.existsSync(resourcePath)) {
            fs.rmSync(resourcePath, { recursive: true });
        }
    });
    test("rustsample_test_ko_KR_generate_mode", function() {
        expect.assertions(9);
        filePath = path.join(resourcePath, 'ko', 'app.json');
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["No"]).toBe("아니오");
        expect(jsonData["OK"]).toBe("확인");
        expect(jsonData["Yes"]).toBe("예");
        expect(jsonData["Time Settings"]).toBe("시간 설정");
        expect(jsonData["NOT AVAILABLE"]).toBe("\"Monitor\" 이용이 불가능합니다");
        expect(jsonData["EXIT APP"]).toBe("앱 종료"); // universal
        expect(jsonData["RETRY"]).toBe("재시도(universal)"); // universal
        expect(jsonData["PictureMode.Standard"]).toBe("표준");
    });
    test("rustsample_test_en_AU_generate_mode", function() {
        expect.assertions(3);
        filePath = path.join(resourcePath, 'en_AU', 'app.json');
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["Programme"]).toBe("Programme");
        expect(jsonData["TV Name"]).toBe("Monitor Name");
    });
});
