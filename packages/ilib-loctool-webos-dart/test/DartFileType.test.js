/*
 * DartFileType.test.js - test the Dart file type handler object.
 *
 * Copyright (c) 2023 JEDLSoft
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

if (!DartFileType) {
    var DartFileType = require("../DartFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    id: "app",
    plugins: ["../."],
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"]
});

describe("Dartfiletype", function() {
    test("DartFileTypeConstructor", function() {
        expect.assertions(1);

        var dft = new DartFileType(p);

        expect(dft).toBeTruthy();
    });
    test("DartFileTypeHandlesDartTrue", function() {
        expect.assertions(2);

        var dft = new DartFileType(p);
        expect(dft).toBeTruthy();

        expect(dft.handles("foo.dart")).toBeTruthy();
    });
    test("DartFileTypeHandlesJSFalseClose", function() {
        expect.assertions(2);

        var dft = new DartFileType(p);
        expect(dft).toBeTruthy();

        expect(!dft.handles("foojs")).toBeTruthy();
    });
    test("DartFileTypeHandlesJSFalseClose2", function() {
        expect.assertions(2);

        var dft = new DartFileType(p);
        expect(dft).toBeTruthy();

        expect(!dft.handles("foodart")).toBeTruthy();
    });
});