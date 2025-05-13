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

const ProjectFactory = require("loctool/lib/ProjectFactory.js");
const GenerateModeProcess = require("loctool/lib/GenerateModeProcess.js");

describe('test the localization result (generate mode) of webos-js app', () => {
    const projectRoot = "./test/integrationTest";
    const defaultRSPath = path.join(process.cwd(), projectRoot, "resources2");
    beforeAll(async() => {
        const projectSettings = {
            "rootDir": projectRoot,
            "id": "sample-webos-js",
            "projectType": "webos-js",
            "sourceLocale": "en-KR",
            "resourceDirs" : { "json": "resources2" },
            "resourceFileTypes": { "json":"ilib-loctool-webos-json-resource" },
            "plugins": [ "ilib-loctool-webos-javascript" ],
            "xliffStyle": "custom",
            "xliffVersion": 2,
        };
        const appSettings = {
            localizeOnly: true,
            xliffsDir: "./xliffs",
            locales:[
                "ko-KR"
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
    afterAll(async () => {
        if (fs.existsSync(defaultRSPath)) {
            fs.rmSync(defaultRSPath, { recursive: true });
        }
    });
    test("jssample_generate_test_ko_KR", function() {
        expect.assertions(5);
        let rb = new ResBundle({
            locale:"ko-KR",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Hello").toString()).toBe("안녕");
        expect(rb.getString("Thank you").toString()).toBe("고마워");
        expect(rb.getString("Bye").toString()).toBe("잘가");
        expect(rb.getString("TV On Screen").toString()).toBe("TV 켜짐 화면");
    });
});