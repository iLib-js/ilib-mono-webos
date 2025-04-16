/*
 * utils.test.js - test 
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

describe("utils", function() {
    test("addResourcesFalse", function() {
        expect.assertions(1);
        expect(utils.addNewResource()).toBeFalsy();
    });
    test("addResourcesData", function() {
        expect.assertions(1);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        expect(utils.addNewResource(ts, res, "en-US")).toBeTruthy();
    });
});