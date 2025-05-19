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

describe('[integration] test the localization result of webos-js app', () => {
    const projectRoot = (process.cwd().indexOf("integrationTest")) > -1 ? "." : "./test/integrationTest";
    const defaultRSPath = path.join(process.cwd(), projectRoot, "resources");
    beforeAll(async() => {
        if (fs.existsSync(defaultRSPath)) {
            fs.rmSync(defaultRSPath, { recursive: true });
        }
        const projectSettings = {
            "rootDir": projectRoot,
            "id": "sample-webos-js",
            "projectType": "webos-js",
            "sourceLocale": "en-KR",
            "pseudoLocale" : {
                "zxx-XX": "debug"
            },
            "resourceDirs" : { "json": "resources" },
            "resourceFileTypes": { "json":"ilib-loctool-webos-json-resource" },
            "plugins": [ "ilib-loctool-webos-javascript" ],
            "xliffStyle": "custom",
            "xliffVersion": 2,
        };
        const appSettings = {
            localizeOnly: true,
            xliffsDir: "./xliffs",
            mode: "localize",
            nopseudo: false,
            webos: {
                "commonXliff": path.join(projectRoot, "./common")
            },
            locales:[
                "en-AU",
                "en-GB",
                "en-US",
                "es-CO",
                "ko-KR",
            ],
            localeMap: {
                "es-CO": "es",
                "fr-CA": "fr"
            },
            localeInherit: {
                "en-AU": "en-GB",
            }
        };
        const project = ProjectFactory.newProject(projectSettings, appSettings);
        project.addPath("src/sample.js");
        
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
        expect.assertions(5);
        let rb = new ResBundle({
            locale:"ko-KR",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Hello").toString()).toBe("안녕");
        expect(rb.getString("Thank you").toString()).toBe("고마워");
        expect(rb.getString("Bye").toString()).toBe("잘가");
        expect(rb.getString("Time Settings").toString()).toBe("시간 설정");
    });
    test("jssample_test_es_CO", function() {
        expect.assertions(2);
        let rb = new ResBundle({
            locale:"es-CO",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Sound Out").toString()).toBe("Salida de Audio");
    });
    test("jssample_test_en_AU", function() {
        expect.assertions(2);
        let rb = new ResBundle({
            locale:"en-AU",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Programme").toString()).toBe("Programme");
    });
    test("jssample_test_en_GB", function() {
        expect.assertions(2);
        let rb = new ResBundle({
            locale:"en-GB",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Programme").toString()).toBe("Programme");
    });
    test("jssample_test_en_US", function() {
        expect.assertions(2);
        let rb = new ResBundle({
            locale:"en-US",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Programme").toString()).toBe("Channel");
    });
    test("jssample_test_zxx", function() {
        expect.assertions(7);
        let rb = new ResBundle({
            locale:"zxx",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Hello").toString()).toBe("[Ħëľľõ210]");
        expect(rb.getString("Thank you").toString()).toBe("[Ťĥàñķ ÿõü43210]");
        expect(rb.getString("Bye").toString()).toBe("[ßÿë10]");
        expect(rb.getString("Time Settings").toString()).toBe("[Ťímë Šëţţíñğš6543210]");
        expect(rb.getString("Sound Out").toString()).toBe("[Šõüñð Øüţ43210]");
        expect(rb.getString("Programme").toString()).toBe("[Pŕõğŕàmmë43210]");
    });
});