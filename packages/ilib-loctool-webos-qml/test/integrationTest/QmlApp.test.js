/*
 * QmlApp.test.js - test the localization result of webos-qml app.
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

const path = require('path');
const fs = require('fs');
const xmljs = require("xml-js");

const ProjectFactory = require("loctool/lib/ProjectFactory.js");
const pluginUtils = require("ilib-loctool-webos-common/utils.js");

const makeArray = function (data) {
  return Array.isArray(data) ? data : [data]
};

const loadTSData = (filepath) => {
    const options = {trim:false, nativeTypeAttribute: true, compact: true};

    if (pluginUtils.isValidPath(filepath)) {
        const tsFile = fs.readFileSync(filepath, "utf-8");
        if (tsFile) {
            return xmljs.xml2js(tsFile, options).TS;
        }
    }
    return undefined;
}

describe('[integration] test the localization result of webos-qml app', () => {
    const projectRoot = (process.cwd().indexOf("integrationTest")) >-1 ? "." : "./test/integrationTest";
    const resourcePath = path.join(projectRoot, "resources");
    let filePath, tsData = {};

    beforeAll(async() => {
        if (fs.existsSync(resourcePath)) {
            fs.rmSync(resourcePath, { recursive: true });
        }
        const projectSettings = {
            "rootDir": projectRoot, 
            "id": "sample-webos-qml",
            "projectType": "webos-qml",
            "sourceLocale": "en-KR",
            "pseudoLocale" : {
                "zxx-XX": "debug"
            },
            "resourceDirs" : { "ts": "resources" },
            "resourceFileTypes": { "ts": "ilib-loctool-webos-ts-resource" },
            "plugins": [ "ilib-loctool-webos-qml" ],
            "xliffStyle": "custom",
            "xliffVersion": 2,
        };

        const appSettings = {
            localizeOnly: true,
            xliffsDir: "./xliffs",
            mode: "localize",
            xliffVersion: 2,
            nopseudo: false,
            webos: {
                "commonXliff": path.join(projectRoot, "./common")
            },
            locales:[
                "en-AU",
                "en-GB",
                "en-US",
                "es-CO",
                "ko-KR"
            ],
            localeMap: {
                "es-CO": "es"
            },
            localeInherit: {
                "en-AU": "en-GB",
            }
        };
        const project = ProjectFactory.newProject(projectSettings, appSettings)
        project.addPath("src/test.qml");

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
        if (fs.existsSync(resourcePath)) {
            fs.rmSync(resourcePath, { recursive: true });
        }
    });
    test("qmlsample_test_ko_KR", function() {
        expect.assertions(6);
        
        const expected = {
            "test": [ "오디오","음악",
                "네트워크가 연결되지 않았습니다.\n네트워크 설정 확인 후 다시 시도하세요.",
                "노래"
            ],
        };

        filePath = path.join(resourcePath, 'sample-webos-qml_ko.ts');
        tsData = pluginUtils.isValidPath(filePath) ? loadTSData(filePath) : tsData;
        expect(tsData).toBeTruthy();

        const contextResArr = makeArray(tsData.context);
        expect(contextResArr.length).toBe(1);

        contextResArr.forEach(({ name: { _text: name }, message }) => {
            const messages = makeArray(message);
            messages.forEach(({ translation: { _text: translation } }, idx) => {
                expect(translation).toBe(expected[name][idx]);
            });
        });
    });
    test("qmlsample_test_es_CO", function() {
        expect.assertions(4);
        const expected = {
            "test": ["Aceptar", "Salida de Audio"]
        };

        filePath = path.join(resourcePath, 'sample-webos-qml_es.ts');
        tsData = pluginUtils.isValidPath(filePath) ? loadTSData(filePath) : tsData;
        expect(tsData).toBeTruthy();

        const contextResArr = makeArray(tsData.context);;
        expect(contextResArr.length).toBe(1);

        contextResArr.forEach(({ name: { _text: name }, message }) => {
            const messages = makeArray(message);
            messages.forEach(({ translation: { _text: translation } }, idx) => {
                expect(translation).toBe(expected[name][idx]);
            });
        });
    });
    test("qmlsample_test_en_US", function() {
        expect.assertions(3);
        const expected = {
            "test": ["Service Area Zip Code"]
        };

        filePath = path.join(resourcePath, 'sample-webos-qml_en.ts');
        tsData = pluginUtils.isValidPath(filePath) ? loadTSData(filePath) : tsData;
        expect(tsData).toBeTruthy();

        const contextResArr = makeArray(tsData.context);;
        expect(contextResArr.length).toBe(1);

        contextResArr.forEach(({ name: { _text: name }, message }) => {
            const messages = makeArray(message);
            messages.forEach(({ translation: { _text: translation } }, idx) => {
                expect(translation).toBe(expected[name][idx]);
            });
        });
    });
    test("qmlsample_test_en_GB", function() {
        expect.assertions(3);
      
        const expected = {
            "test": ["Service Area Postcode"]
        };
      
        filePath = path.join(resourcePath, 'sample-webos-qml_en_GB.ts');
        tsData = pluginUtils.isValidPath(filePath) ? loadTSData(filePath) : tsData;
        expect(tsData).toBeTruthy();
      
        const contextResArr = makeArray(tsData.context);;
        expect(contextResArr.length).toBe(1);

        contextResArr.forEach(({ name: { _text: name }, message }) => {
            const messages = makeArray(message);
            messages.forEach(({ translation: { _text: translation } }, idx) => {
                expect(translation).toBe(expected[name][idx]);
            });
        });
    });
    test("qmlsample_test_en_AU", function() {
        expect.assertions(3);
        const expected = {
            "test": ["Service Area Postcode"]
        };

        filePath = path.join(resourcePath, 'sample-webos-qml_en_AU.ts');
        tsData = pluginUtils.isValidPath(filePath) ? loadTSData(filePath) : tsData;
        expect(tsData).toBeTruthy();

        const contextResArr = makeArray(tsData.context);;
        expect(contextResArr.length).toBe(1);

        contextResArr.forEach(({ name: { _text: name }, message }) => {
            const messages = makeArray(message);
            messages.forEach(({ translation: { _text: translation } }, idx) => {
                expect(translation).toBe(expected[name][idx]);
            });
        });
    });
});