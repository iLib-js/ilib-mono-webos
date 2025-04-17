/*
 * utils.test.js - test the utility functions
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

var utils = require("../utils.js");
var TranslationSet = require("loctool/lib/TranslationSet.js");
var ResourceString = require("loctool/lib/ResourceString.js");
var CustomProject =  require("loctool/lib/CustomProject.js");

describe("utils", function() {
    test("addNewResourcesFalse", function() {
        expect.assertions(1);
        expect(utils.addNewResource()).toBeFalsy();
    });
    test("addResourcesFalse", function() {
        expect.assertions(1);
        expect(utils.addResource()).toBeFalsy();
    });
    test("addNewResourceData", function() {
        expect.assertions(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        expect(utils.addNewResource(ts, res, "en-US")).toBeTruthy();
        expect(ts.isDirty()).toBeTruthy();
    });
    test("addResourceData", function() {
        expect.assertions(4);

        var p = new CustomProject({
            id: "app",
            plugins: ["ilib-loctool-mock"],
            sourceLocale: "en-US",
            settings: {
                resourceFileTypes: {
                    "mock": "mock-resource"
                }
            },
            }, ". ", {
            locales:["en-GB"]
        });

        var res = new ResourceString({
            id: "app",
            sourceLocale: "en-US",
            key: "asdf",
            source: "This is a test",
        });

        var translated = new ResourceString({
            id: "app",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "asdf",
            source: "This is a test",
            target: "Eine Test",
        });
        expect(p).toBeTruthy();
        expect(res).toBeTruthy();
        expect(translated).toBeTruthy();

        debugger;
        p.init(function() {
            var jt = p.getResourceFileType("mock");
            expect(utils.addResource(jt, translated, res, "de-DE")).toBeTruthy();
        });
    });
});