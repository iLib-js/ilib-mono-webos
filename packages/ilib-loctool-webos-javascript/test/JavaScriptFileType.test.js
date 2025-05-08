/*
 * JavaScriptFileType.test.js - test the JavaScript file type handler object.
 *
 * Copyright (c) 2019-2021, 2023, 2025 JEDLSoft
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

if (!JavaScriptFileType) {
    var JavaScriptFileType = require("../JavaScriptFileType.js");
}
var CustomProject =  require("loctool/lib/CustomProject.js");
var TranslationSet = require("loctool/lib/TranslationSet.js");
var ResourceString = require("loctool/lib/ResourceString.js");

var p = new CustomProject({
    id: "app",
    plugins: [require.resolve("../."), require.resolve("../../ilib-loctool-webos-json-resource")],
    sourceLocale: "en-US",
    resourceFileTypes: {
        "json":"ilib-loctool-webos-json-resource"
    },
    }, "./testfiles", {
    locales:["en-GB"],
    mode: "localize"
});

describe("javascriptfiletype", function() {
    test("JavaScriptFileTypeConstructor", function() {
        expect.assertions(1);

        var htf = new JavaScriptFileType(p);

        expect(htf).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesJSTrue", function() {
        expect.assertions(2);

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.handles("foo.js")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesJSXTrue", function() {
        expect.assertions(2);

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.handles("foo.jsx")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesJSFalseClose", function() {
        expect.assertions(2);

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("foojs")).toBeTruthy();
    });
    test("JavaScriptFileTypeWrite", function() {
        expect.assertions(1);

        var trans = new TranslationSet();
        var translated = new ResourceString({
            id: "app",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "asdf",
            source: "This is a test",
            target: "Eine Test",
        });

        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();
        debugger;

        p.init(function() {
            htf.extracted.add(res);
            p.db.ts.add(translated);
            htf.write(trans, ["de-DE"]);
        });

    });
});