/*
 * JsonFileType.test.js - test the json type of file template file type handler object.
 *
 * Copyright (c) 2023, JEDLSoft
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
if (!JsonFileType) {
    var JsonFileType = require("../JsonFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}
var p = new CustomProject({
    id: "test",
    plugins: ["../."],
    sourceLocale: "en-KR"
    }, "./test/testfiles", {
    locales:["en-GB"]
});
describe("jsonfiletype", function() {
    test("JsonFileTypeConstructor", function() {
        expect.assertions(1);
        var ajft = new JsonFileType(p);
        expect(ajft).toBeTruthy();
    });
    test("JsonFileTypeHandlesJsonTrue_appinfo", function() {
        expect.assertions(2);
        var ajft = new JsonFileType(p);
        expect(ajft).toBeTruthy();
        expect(ajft.handles("appinfo.json")).toBeTruthy();
    });
    test("JsonFileTypeHandlesJsonPath_appinfo", function() {
        expect.assertions(2);
        var ajft = new JsonFileType(p);
        expect(ajft).toBeTruthy();
        expect(ajft.handles("foo/bar/appinfo.json")).toBeTruthy();
    });
    test("JsonFileTypeHandlesJsonFalse_appinfo", function() {
        expect.assertions(2);
        var ajft = new JsonFileType(p);
        expect(ajft).toBeTruthy();
        expect(!ajft.handles("foo.js")).toBeTruthy();
    });
    test("JsonFileTypeHandlesJsonFalse1_appinfo", function() {
        expect.assertions(2);
        var ajft = new JsonFileType(p);
        expect(ajft).toBeTruthy();
        expect(!ajft.handles("lappinfo.json")).toBeTruthy();
    });
    test("JsonFileTypeHandlesFalseWithlocaleDir_appinfo", function() {
        expect.assertions(2);
        var ajft = new JsonFileType(p);
        expect(ajft).toBeTruthy();
        expect(!ajft.handles("ko/appinfo.json")).toBeTruthy();
    });
    test("JsonFileTypeHandlesFalseWithlocaleDir2_appinfo", function() {
        expect.assertions(2);
        var ajft = new JsonFileType(p);
        expect(ajft).toBeTruthy();
        expect(!ajft.handles("resources/zh/Hant/appinfo.json")).toBeTruthy();
    });
    test("JsonFileTypeHandlesFalseWithlocaleDir3_appinfo", function() {
        expect.assertions(2);
        var ajft = new JsonFileType(p);
        expect(ajft).toBeTruthy();
        expect(!ajft.handles("resources/en/GB/appinfo.json")).toBeTruthy();
    });
    test("JsonFileTypeHandlesWithlocaleDir4_appinfo", function() {
        expect.assertions(2);
        var ajft = new JsonFileType(p);
        expect(ajft).toBeTruthy();
        expect(ajft.handles("sources/GB/appinfo.json")).toBeTruthy();
    });
    test("JsonFileTypeHandlesWithlocaleDir5_appinfo", function() {
        expect.assertions(2);
        var ajft = new JsonFileType(p);
        expect(ajft).toBeTruthy();
        expect(ajft.handles("res/Hant/appinfo.json")).toBeTruthy();
    });
    /// qcardinfo.json
    test("JsonFileTypeHandlesJsonTrue_qcardinfo", function() {
        expect.assertions(2);
        var ajft = new JsonFileType(p);
        expect(ajft).toBeTruthy();
        expect(ajft.handles("qcardinfo.json")).toBeTruthy();
    });
    test("JsonFileTypeHandlesJsonPath_appinfo", function() {
        expect.assertions(2);
        var ajft = new JsonFileType(p);
        expect(ajft).toBeTruthy();
        expect(ajft.handles("foo/bar/qcardinfo.json")).toBeTruthy();
    });
    test("JsonFileTypeHandlesJsonFalse_qcardinfo", function() {
        expect.assertions(2);
        var ajft = new JsonFileType(p);
        expect(ajft).toBeTruthy();
        expect(!ajft.handles("foo.js")).toBeTruthy();
    });
    test("JsonFileTypeHandlesJsonFalse1_qcardinfo", function() {
        expect.assertions(2);
        var ajft = new JsonFileType(p);
        expect(ajft).toBeTruthy();
        expect(!ajft.handles("lqcardinfo.json")).toBeTruthy();
    });
    test("JsonFileTypeHandlesFalseWithlocaleDir_qcardinfo", function() {
        expect.assertions(2);
        var ajft = new JsonFileType(p);
        expect(ajft).toBeTruthy();
        expect(!ajft.handles("ko/qcardinfo.json")).toBeTruthy();
    });
    test("JsonFileTypeHandlesFalseWithlocaleDir2_qcardinfo", function() {
        expect.assertions(2);
        var ajft = new JsonFileType(p);
        expect(ajft).toBeTruthy();
        expect(!ajft.handles("resources/zh/Hant/qcardinfo.json")).toBeTruthy();
    });
    test("JsonFileTypeHandlesFalseWithlocaleDir3_qcardinfo", function() {
        expect.assertions(2);
        var ajft = new JsonFileType(p);
        expect(ajft).toBeTruthy();
        expect(!ajft.handles("resources/en/GB/qcardinfo.json")).toBeTruthy();
    });
    test("JsonFileTypeHandlesWithlocaleDir4_qcardinfo", function() {
        expect.assertions(2);
        var ajft = new JsonFileType(p);
        expect(ajft).toBeTruthy();
        expect(ajft.handles("sources/GB/qcardinfo.json")).toBeTruthy();
    });
    test("JsonFileTypeHandlesWithlocaleDir5_qcardinfo", function() {
        expect.assertions(2);
        var ajft = new JsonFileType(p);
        expect(ajft).toBeTruthy();
        expect(ajft.handles("res/Hant/qcardinfo.json")).toBeTruthy();
    });
});