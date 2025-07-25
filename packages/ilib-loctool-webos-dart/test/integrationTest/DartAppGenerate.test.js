/*
 * DartAppGenerate.test.js - test the localization result in generate mode of webos-dart app.
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

describe('[integration] test the localization result (generate mode) of webos-dart app', () => {
    const projectRoot = (process.cwd().indexOf("integrationTest")) > -1 ? ".": "./test/integrationTest";
    const resourcePath = path.join(projectRoot, "assets2/i18n");
    let filePath, jsonData;

    beforeAll(async() => {
        const outputPath = "./assets2/i18n";
        if (fs.existsSync(outputPath)) {
            fs.rmSync(outputPath, { recursive: true });
        }
        const projectSettings = {
            rootDir: projectRoot,
            id: "sample-webos-dart",
            projectType: "webos-dart",
            sourceLocale: "en-KR",
            resourceDirs : { "json": "assets2/i18n" },
            resourceFileTypes: { "json":"ilib-loctool-webos-json-resource" },
            plugins: [ "ilib-loctool-webos-dart" ]
        };
        const appSettings = {
            translationsDir: "./xliffs",
            xliffStyle: "webOS",
            metadata : {
                "device-type": "StanbyME"
            },
            xliffVersion: 2,
            locales:[
                "ko-KR"
            ],
            localeMap: {
                "es-CO": "es"
            },
            localeInherit: {
                "en-AU": "en-GB",
            },
            dart: {
               disablePseudo: false,
                mappings : {
                    "**/*.dart": {
                        "template": path.join(projectRoot, "[dir]/assets/i18n/[localeUnder].json")
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
    test("dartsample_generate_test_ko_KR", function() {
        expect.assertions(7);
        filePath = path.join(resourcePath, 'ko.json');
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();

        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["App List"]).toBe("앱 목록");
        expect(jsonData["Back button"]).toBe("이전 버튼");
        expect(jsonData["Delete All"]).toBe("모두 삭제");
        expect(jsonData["Live TV"]).toBe("현재 방송");
        expect(jsonData["Search"]).toBe("통합 검색");
        expect(jsonData["Internal Speaker"]).toBe("내부 스피커");
    });
});