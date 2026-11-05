/*
 * RSFileType.test.js - test the Rust file type handler object.
 *
 * Copyright (c) 2026 JEDLSoft
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

if (!RSFileType) {
    var RSFileType = require("../RSFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    id: "app",
    plugins: ["../."],
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"]
});

describe("rsfiletype", function() {
    test("RSFileTypeConstructor", function() {
        expect.assertions(1);

        var rsft = new RSFileType(p);
        expect(rsft).toBeTruthy();
    });
    test("RSFileTypeHandlesRustFileTrue", function() {
        expect.assertions(2);

        var rsft = new RSFileType(p);
        expect(rsft).toBeTruthy();
        expect(rsft.handles("foo.rs")).toBeTruthy();
    });
    test("RSFileTypeHandlesRustFileTrue2", function() {
        expect.assertions(2);

        var rsft = new RSFileType(p);
        expect(rsft).toBeTruthy();
        expect(rsft.handles("foo/bar/test.rs")).toBeTruthy();
    });
    test("RSFileTypeHandlesJSXFalse", function() {
        expect.assertions(2);

        var rsft = new RSFileType(p);
        expect(rsft).toBeTruthy();
        expect(!rsft.handles("foo.jsx")).toBeTruthy();
    });
    test("RSFileTypeHandlesCFalse", function() {
        expect.assertions(2);

        var rsft = new RSFileType(p);
        expect(rsft).toBeTruthy();
        expect(!rsft.handles("foo.c")).toBeTruthy();
    });
    test("RSFileTypeHandlesFalseClose", function() {
        expect.assertions(2);

        var rsft = new RSFileType(p);
        expect(rsft).toBeTruthy();
        expect(!rsft.handles("foors")).toBeTruthy();
    });
    test("RSFileTypeGetDataType", function() {
        expect.assertions(2);

        var rsft = new RSFileType(p);
        expect(rsft).toBeTruthy();
        expect(rsft.getDataType()).toBe("rs");
    });
    test("RSFileTypeGetExtensions", function() {
        expect.assertions(2);

        var rsft = new RSFileType(p);
        expect(rsft).toBeTruthy();
        expect(rsft.getExtensions()[0]).toBe(".rs");
    });
});
