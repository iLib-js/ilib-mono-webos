/*
 * JsApp.test.js - test the localization result of webos-js app.
 *
 * Copyright (c) 2025-2026 JEDLSoft
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
            rootDir: projectRoot,
            id: "sample-webos-js",
            projectType: "webos-js",
            sourceLocale: "en-KR",
            "pseudoLocale" : {
                "zxx-XX": "debug",
                "zxx-Hant-TW": "chinese-traditional-tw"
            },
            resourceDirs : { "json": "resources" },
            resourceFileTypes: { "json":"ilib-loctool-webos-json-resource" },
            plugins: [ "ilib-loctool-webos-javascript" ]
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
                "en-AU",
                "en-GB",
                "en-US",
                "es-CO",
                "es-ES",
                "ko-KR",
                "ko-CN",
                "zh-Hans-CN",
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
        expect.assertions(7);
        let rb = new ResBundle({
            locale:"ko-KR",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Hello").toString()).toBe("안녕");
        expect(rb.getString("Thank you").toString()).toBe("고마워");
        expect(rb.getString("Bye").toString()).toBe("잘가");
        expect(rb.getString("Time Settings").toString()).toBe("시간 설정");
        expect(rb.getString("%deviceType% Speaker").toString()).toBe("모니터 스피커"); //metadata-common
        expect(rb.getString("Internal Speaker + Wired Headphones").toString()).toBe("모니터 스피커 + 유선 헤드폰"); //metadata
    });
    test("jssample_test_ko_CN", function() {
        expect.assertions(2);
        let rb = new ResBundle({
            locale:"ko-CN",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Time Settings").toString()).toBe("시간 설정(ko-CN)");
    });
    test("jssample_test_es_CO", function() {
        expect.assertions(3);
        let rb = new ResBundle({
            locale:"es-CO",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Sound Out").toString()).toBe("Salida de Audio");
        expect(rb.getString("TV Name").toString()).toBe("Nombre del Monitor"); //metadata-common
    });
    test("jssample_test_es_ES", function() {
        expect.assertions(2);
        let rb = new ResBundle({
            locale:"es-ES",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("TV Name").toString()).toBe("Nombre del monitor"); //metadata-localemap
    });
    test("jssample_test_en_AU", function() {
        expect.assertions(5);
        let rb = new ResBundle({
            locale:"en-AU",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Programme").toString()).toBe("Programme");
        expect(rb.getString("Time Settings").toString()).toBe("Time Settings(en-GB)");
        expect(rb.getString("Bye").toString()).toBe("Bye(common: en-GB)");
        expect(rb.getString("TV Name").toString()).toBe("Monitor Name");// metadata-localeinherit
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
    test("jssample_test_zhHansCN", function() {
        expect.assertions(5);
        let rb = new ResBundle({
            locale:"zh-Hans-CN",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Hello").toString()).toBe("你好");
        expect(rb.getString("Thank you").toString()).toBe("谢谢");
        expect(rb.getString("Bye").toString()).toBe("再见");
        expect(rb.getString("Time Settings").toString()).toBe("时间设置");
    });
    test("jssample_test_zxxHantTW", function() {
        expect.assertions(7);

        const xliffPath = path.join(process.cwd(), projectRoot, "xliffs");
        expect((fs.existsSync(path.join(xliffPath, 'zh-Hans-CN.xliff')))).toBeTruthy();
        expect(!(fs.existsSync(path.join(xliffPath, 'zh-Hans-TW.xliff')))).toBeTruthy();

        let rb = new ResBundle({
            locale:"zxx-Hant-TW",
            basePath : defaultRSPath
        });
        expect(rb).toBeTruthy();
        expect(rb.getString("Hello").toString()).toBe("你好"); // generated based on zh-Hans-CN translation
        expect(rb.getString("Thank you").toString()).toBe("謝謝"); // generated based on zh-Hans-CN translation
        expect(rb.getString("Bye").toString()).toBe("再見"); // generated based on zh-Hans-CN translation
        expect(rb.getString("Time Settings").toString()).toBe("時間設定"); // generated based on zh-Hans-CN translation
    });
});
