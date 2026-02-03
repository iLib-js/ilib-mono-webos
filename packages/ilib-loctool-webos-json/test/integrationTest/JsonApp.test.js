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

const fs = require('fs');
const path = require('path');
const ProjectFactory = require("loctool/lib/ProjectFactory.js");
const ResBundle = require("ilib/lib/ResBundle");

describe('[integration] test the localization result of webos-json app', () => {
    const projectRoot = (process.cwd().indexOf("integrationTest")) > -1 ? "." : "./test/integrationTest";
    const defaultRSPath = path.join(process.cwd(), projectRoot, "resources");
    beforeAll(async() => {
        if (fs.existsSync(defaultRSPath)) {
            fs.rmSync(defaultRSPath, { recursive: true });
        }
        const projectSettings = {
            rootDir: projectRoot,
            id: "sample-webos-json",
            projectType: "webos-json",
            sourceLocale: "en-KR",
            resourceDirs : { "json": "resources" },
            pseudoLocale : {
                "zxx-XX": "debug"
            },
            plugins: [ "ilib-loctool-webos-json" ]
        };
        const appSettings = {
            localizeOnly: true,
            translationsDir : ["./xliffs", "./common"],
            mode: "localize",
            metadata : {
                "device-type": "Monitor"
            },
            xliffStyle: "webOS",
            xliffVersion: 2,
            nopseudo: false,
            locales:[
                "ko-KR",
            ],
            "jsonMap": {
               "mappings": {
                    "**/appinfo.json": {
                        "template": path.join(projectRoot, "[dir]/[resourceDir]/[localeDir]/[filename]")
                    }
                }
            }
        };
        const project = ProjectFactory.newProject(projectSettings, appSettings);
        project.addPath("appinfo.json");

        if (project) {
            project.init(function() {
                project.extract(function() {
                    project.generatePseudo();
                    project.write(function() {
                        project.save(function() {
                            project.close(function() {
                            });
                        });
                    });
                });
            });
        }
    }, 50000);
    afterAll(async () => {
        if (fs.existsSync(defaultRSPath)) {
            fs.rmSync(defaultRSPath, { recursive: true });
        }
    });
    test("jssample_test_ko_KR", function() {
        expect.assertions(2);

        let rb = new ResBundle({
            locale:"ko-KR",
            basePath : defaultRSPath,
            name: "appinfo"
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("title").toString()).toBe("모니터 스피커"); //metadata-common
    });
});
