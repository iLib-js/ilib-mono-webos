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

var p2 = new CustomProject({
    id: "app",
    plugins: ["../."],
    sourceLocale: "en-US",
    resourceDirs: {
        "json": "resources"
    }
}, "./testfiles", {
    locales:["en-GB"],
    rs: {
        mappings: {
            "src/**/*.rs": {
                "template": "[dir]/i18n/[localeDir]/strings.json"
            },
            "**/*.rs": {
                "template": "[resourceDir]/[localeUnder].json"
            }
        }
    }
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
    test("RSFileTypeGetMappingDefault", function() {
        expect.assertions(2);

        var rsft = new RSFileType(p);
        expect(rsft).toBeTruthy();
        expect(rsft.getMapping("src/foo.rs")).toStrictEqual({
            "template": "[resourceDir]/[localeDir]/rsstrings.json"
        });
    });
    test("RSFileTypeGetMappingUndefinedPath", function() {
        expect.assertions(2);

        var rsft = new RSFileType(p);
        expect(rsft).toBeTruthy();
        expect(rsft.getMapping(undefined)).toBeUndefined();
    });
    test("RSFileTypeGetMappingCustom", function() {
        expect.assertions(3);

        var rsft = new RSFileType(p2);
        expect(rsft).toBeTruthy();
        expect(rsft.getMapping("src/ui/foo.rs")).toStrictEqual({
            "template": "[dir]/i18n/[localeDir]/strings.json"
        });
        expect(rsft.getMapping("lib/foo.rs")).toStrictEqual({
            "template": "[resourceDir]/[localeUnder].json"
        });
    });
    test("RSFileTypeGetMappingCustomNoMatch", function() {
        expect.assertions(2);

        var rsft = new RSFileType(p2);
        expect(rsft).toBeTruthy();
        expect(rsft.getMapping("foo.c")).toBeUndefined();
    });
    test("RSFileTypeGetDefaultMapping", function() {
        expect.assertions(2);

        expect(new RSFileType(p).getDefaultMapping()).toStrictEqual({
            "template": "[resourceDir]/[localeDir]/rsstrings.json"
        });
        expect(new RSFileType(p2).getDefaultMapping()).toStrictEqual({
            "template": "[dir]/i18n/[localeDir]/strings.json"
        });
    });
    test("RSFileTypeGetLocalizedPathDefault", function() {
        expect.assertions(8);

        var rsft = new RSFileType(p);
        expect(rsft).toBeTruthy();
        var locales = ["en-US", "ko-KR", "en-GB", "es-CO", "fr-FR", "zh-Hans-CN", "zh-Hant-TW"];
        var expected = [
            "testfiles/resources/rsstrings.json",
            "testfiles/resources/ko/rsstrings.json",
            "testfiles/resources/en/GB/rsstrings.json",
            "testfiles/resources/es/CO/rsstrings.json",
            "testfiles/resources/fr/rsstrings.json",
            "testfiles/resources/zh/rsstrings.json",
            "testfiles/resources/zh/Hant/TW/rsstrings.json"
        ];
        for (var i = 0; i < locales.length; i++) {
            expect(rsft.getLocalizedPath(undefined, "src/foo.rs", locales[i])).toBe(expected[i]);
        }
    });
    test("RSFileTypeGetLocalizedPathCustomDir", function() {
        expect.assertions(4);

        var rsft = new RSFileType(p2);
        expect(rsft).toBeTruthy();
        expect(rsft.getLocalizedPath(undefined, "src/ui/foo.rs", "en-US")).toBe("testfiles/src/ui/i18n/strings.json");
        expect(rsft.getLocalizedPath(undefined, "src/ui/foo.rs", "ko-KR")).toBe("testfiles/src/ui/i18n/ko/strings.json");
        expect(rsft.getLocalizedPath(undefined, "src/ui/foo.rs", "en-GB")).toBe("testfiles/src/ui/i18n/en/GB/strings.json");
    });
    test("RSFileTypeGetLocalizedPathCustomLocaleUnder", function() {
        expect.assertions(4);

        var rsft = new RSFileType(p2);
        expect(rsft).toBeTruthy();
        expect(rsft.getLocalizedPath(undefined, "lib/foo.rs", "ko-KR")).toBe("testfiles/resources/ko.json");
        expect(rsft.getLocalizedPath(undefined, "lib/foo.rs", "en-GB")).toBe("testfiles/resources/en_GB.json");
        expect(rsft.getLocalizedPath(undefined, "lib/foo.rs", "zh-Hant-TW")).toBe("testfiles/resources/zh_Hant_TW.json");
    });
    test("RSFileTypeGetLocalizedPathExplicitMapping", function() {
        expect.assertions(2);

        var rsft = new RSFileType(p);
        expect(rsft).toBeTruthy();
        var mapping = { "template": "[resourceDir]/[language]/app.json" };
        expect(rsft.getLocalizedPath(mapping, "src/foo.rs", "ko-KR")).toBe("testfiles/resources/ko/app.json");
    });
});
