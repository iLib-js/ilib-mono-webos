/*
 * CppApp.test.js - test the localization result in generate mode of webos-cpp app
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

describe("[integration] test the localization result of webos-cpp app", () => {
    const projectRoot = (process.cwd().indexOf("integrationTest")) > -1 ? "." : "./test/integrationTest";
    const resourcePath = path.join(projectRoot, "resources2");
    const fileName = "cppstrings.json";
    let filePath, jsonData;

    beforeAll(async() => {
        if (fs.existsSync(resourcePath)) {
            fs.rmSync(resourcePath, { recursive: true });
        }
        const projectSettings = {
            rootDir: projectRoot,
            id: "sample-webos-cpp",
            projectType: "webos-cpp",
            sourceLocale: "en-KR",
            resourceDirs : { "json": "resources2" },
            resourceFileTypes: { "json":"ilib-loctool-webos-json-resource" },
            plugins: [ "ilib-loctool-webos-cpp" ]
        };

        const appSettings = {
            localizeOnly: true,
            translationsDir: "./xliffs",
            mode: "generate",
            metadata : {
                "device-type": "Projector"
            },
            xliffVersion: 2,
            xliffStyle: "webOS",
            nopseudo: true,
            resourceFileNames: { "cpp": fileName },
            locales:[
                "ko-KR",
                "es-CO",
                "en-AU"
            ],
            localeInherit: {
                "en-AU": "en-GB",
            },
            localeMap: {
                "es-CO": "es"
            },
        };
        const project = ProjectFactory.newProject(projectSettings, appSettings);
        process = GenerateModeProcess(project);
    }, 50000);
    afterAll(async () => {
        if (fs.existsSync(resourcePath)) {
            fs.rmSync(resourcePath, { recursive: true });
        }
    });
    test("cppsample_test_ko_KR_generate_mode", function() {
        expect.assertions(9);
        filePath = path.join(resourcePath, 'ko', fileName);

        expect(process).toBeTruthy();
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();
        jsonData = pluginUtils.loadData(filePath);

        expect(Object.keys(jsonData).length).toBe(6);
        expect(jsonData["No"]).toBe("아니오");
        expect(jsonData["Yes"]).toBe("예");
        expect(jsonData["Update"]).toBe("업데이트");
        expect(jsonData["Cancel"]).toBe("취소");
        expect(jsonData["Time Settings"]).toBe("시간 설정");
        expect(jsonData["* This feature is applied once and only once when the TV is turned off."]).toBe("* 이 기능은 프로젝터가 꺼질 때 한번만 실행됩니다.");
    });
    test("cppsample_test_es_CO_generate_mode", function() {
       expect.assertions(3);
       filePath = path.join(resourcePath, "es", fileName);
       expect(pluginUtils.isValidPath(filePath)).toBeTruthy();
       jsonData = pluginUtils.loadData(filePath);
       expect(jsonData["Sound Out"]).toBe("Salida de Audio");
       expect(jsonData["TV Information"]).toBe("Información del proyector");
    });
    test("cppsample_test_en_AU_generate_mode", function() {
        expect.assertions(3);
        filePath = path.join(resourcePath, 'en/AU', fileName);
        expect(pluginUtils.isValidPath(filePath)).toBeTruthy();
        jsonData = pluginUtils.loadData(filePath);
        expect(jsonData["Programme"]).toBe("Programme");
        expect(jsonData["TV Name"]).toBe("Projector Name");
    });
  });