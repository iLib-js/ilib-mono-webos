/*
 * RustFileType.test.js - test the Rust file type handler object.
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

if (!RustFileType) {
    var RustFileType = require("../RustFileType.js");
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
    rust: {
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

var p3 = new CustomProject({
    id: "app",
    plugins: ["../."],
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"],
    rust: {
        mappings: {
            "src/**/*.rs": {
                "template": "[resourceDir]/[localeDir]/rsstrings.json"
            }
        }
    }
});

var p4 = new CustomProject({
    id: "app",
    plugins: ["../."],
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"],
    rust: {
        mappings: {}
    }
});

describe("rustfiletype", function() {
    test("RustFileTypeConstructor", function() {
        expect.assertions(1);

        var rft = new RustFileType(p);
        expect(rft).toBeTruthy();
    });
    test("RustFileTypeHandlesRustFileTrue", function() {
        expect.assertions(2);

        var rft = new RustFileType(p);
        expect(rft).toBeTruthy();
        expect(rft.handles("foo.rs")).toBeTruthy();
    });
    test("RustFileTypeHandlesRustFileTrue2", function() {
        expect.assertions(2);

        var rft = new RustFileType(p);
        expect(rft).toBeTruthy();
        expect(rft.handles("foo/bar/test.rs")).toBeTruthy();
    });
    test("RustFileTypeHandlesJSXFalse", function() {
        expect.assertions(2);

        var rft = new RustFileType(p);
        expect(rft).toBeTruthy();
        expect(!rft.handles("foo.jsx")).toBeTruthy();
    });
    test("RustFileTypeHandlesCFalse", function() {
        expect.assertions(2);

        var rft = new RustFileType(p);
        expect(rft).toBeTruthy();
        expect(!rft.handles("foo.c")).toBeTruthy();
    });
    test("RustFileTypeHandlesFalseClose", function() {
        expect.assertions(2);

        var rft = new RustFileType(p);
        expect(rft).toBeTruthy();
        expect(!rft.handles("foors")).toBeTruthy();
    });
    test("RustFileTypeHandlesUndefinedPath", function() {
        expect.assertions(2);

        var rft = new RustFileType(p);
        expect(rft).toBeTruthy();
        expect(rft.handles(undefined)).toBeFalsy();
    });
    test("RustFileTypeHandlesDotSlashPath", function() {
        expect.assertions(2);

        var rft = new RustFileType(p);
        expect(rft).toBeTruthy();
        expect(rft.handles("./src/foo.rs")).toBeTruthy();
    });
    test("RustFileTypeHandlesCustomMappingMatch", function() {
        expect.assertions(3);

        var rft = new RustFileType(p3);
        expect(rft).toBeTruthy();
        expect(rft.handles("src/foo.rs")).toBeTruthy();
        expect(rft.handles("src/ui/bar.rs")).toBeTruthy();
    });
    test("RustFileTypeHandlesCustomMappingNoMatch", function() {
        expect.assertions(3);

        var rft = new RustFileType(p3);
        expect(rft).toBeTruthy();
        // Rust files outside of the mappings are not handled
        expect(rft.handles("lib/foo.rs")).toBeFalsy();
        expect(rft.handles("foo.rs")).toBeFalsy();
    });
    test("RustFileTypeGetDataType", function() {
        expect.assertions(2);

        var rft = new RustFileType(p);
        expect(rft).toBeTruthy();
        expect(rft.getDataType()).toBe("x-rust");
    });
    test("RustFileTypeGetExtensions", function() {
        expect.assertions(2);

        var rft = new RustFileType(p);
        expect(rft).toBeTruthy();
        expect(rft.getExtensions()[0]).toBe(".rs");
    });
    test("RustFileTypeGetMappingDefault", function() {
        expect.assertions(2);

        var rft = new RustFileType(p);
        expect(rft).toBeTruthy();
        expect(rft.getMapping("src/foo.rs")).toStrictEqual({
            "template": "[resourceDir]/[localeDir]/rsstrings.json"
        });
    });
    test("RustFileTypeGetMappingUndefinedPath", function() {
        expect.assertions(2);

        var rft = new RustFileType(p);
        expect(rft).toBeTruthy();
        expect(rft.getMapping(undefined)).toBeUndefined();
    });
    test("RustFileTypeEmptyMappingsUseDefault", function() {
        expect.assertions(5);

        var rft = new RustFileType(p4);
        expect(rft).toBeTruthy();
        var expected = {
            "template": "[resourceDir]/[localeDir]/rsstrings.json"
        };
        // an empty mappings object falls back to the default mappings
        expect(rft.getMapping("src/foo.rs")).toStrictEqual(expected);
        expect(rft.getDefaultMapping()).toStrictEqual(expected);
        expect(rft.handles("src/foo.rs")).toBeTruthy();
        expect(rft.getLocalizedPath(undefined, "src/foo.rs", "ko-KR")).toBe("testfiles/resources/ko/rsstrings.json");
    });
    test("RustFileTypeEmptyMappingsWarnOnce", function() {
        expect.assertions(2);

        var rft = new RustFileType(p4);
        var spy = jest.spyOn(rft.logger, "warn");
        rft.getMapping("src/a.rs");
        rft.getMapping("src/b.rs");
        rft.handles("src/c.rs");

        // the warning for the empty mappings is logged only once
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toContain("settings.rust.mappings is empty");
        spy.mockRestore();
    });
    test("RustFileTypeGetMappingDotSlashPath", function() {
        expect.assertions(2);

        var rft = new RustFileType(p2);
        expect(rft).toBeTruthy();
        expect(rft.getMapping("./src/ui/foo.rs")).toStrictEqual({
            "template": "[dir]/i18n/[localeDir]/strings.json"
        });
    });
    test("RustFileTypeGetMappingCustom", function() {
        expect.assertions(3);

        var rft = new RustFileType(p2);
        expect(rft).toBeTruthy();
        expect(rft.getMapping("src/ui/foo.rs")).toStrictEqual({
            "template": "[dir]/i18n/[localeDir]/strings.json"
        });
        expect(rft.getMapping("lib/foo.rs")).toStrictEqual({
            "template": "[resourceDir]/[localeUnder].json"
        });
    });
    test("RustFileTypeGetMappingCustomNoMatch", function() {
        expect.assertions(2);

        var rft = new RustFileType(p2);
        expect(rft).toBeTruthy();
        expect(rft.getMapping("foo.c")).toBeUndefined();
    });
    test("RustFileTypeGetDefaultMapping", function() {
        expect.assertions(2);

        expect(new RustFileType(p).getDefaultMapping()).toStrictEqual({
            "template": "[resourceDir]/[localeDir]/rsstrings.json"
        });
        expect(new RustFileType(p2).getDefaultMapping()).toStrictEqual({
            "template": "[dir]/i18n/[localeDir]/strings.json"
        });
    });
    test("RustFileTypeGetLocalizedPathDefault", function() {
        expect.assertions(8);

        var rft = new RustFileType(p);
        expect(rft).toBeTruthy();
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
            expect(rft.getLocalizedPath(undefined, "src/foo.rs", locales[i])).toBe(expected[i]);
        }
    });
    test("RustFileTypeGetLocalizedPathCustomDir", function() {
        expect.assertions(4);

        var rft = new RustFileType(p2);
        expect(rft).toBeTruthy();
        expect(rft.getLocalizedPath(undefined, "src/ui/foo.rs", "en-US")).toBe("testfiles/src/ui/i18n/strings.json");
        expect(rft.getLocalizedPath(undefined, "src/ui/foo.rs", "ko-KR")).toBe("testfiles/src/ui/i18n/ko/strings.json");
        expect(rft.getLocalizedPath(undefined, "src/ui/foo.rs", "en-GB")).toBe("testfiles/src/ui/i18n/en/GB/strings.json");
    });
    test("RustFileTypeGetLocalizedPathCustomLocaleUnder", function() {
        expect.assertions(4);

        var rft = new RustFileType(p2);
        expect(rft).toBeTruthy();
        expect(rft.getLocalizedPath(undefined, "lib/foo.rs", "ko-KR")).toBe("testfiles/resources/ko.json");
        expect(rft.getLocalizedPath(undefined, "lib/foo.rs", "en-GB")).toBe("testfiles/resources/en_GB.json");
        expect(rft.getLocalizedPath(undefined, "lib/foo.rs", "zh-Hant-TW")).toBe("testfiles/resources/zh_Hant_TW.json");
    });
    test("RustFileTypeGetLocalizedPathExplicitMapping", function() {
        expect.assertions(2);

        var rft = new RustFileType(p);
        expect(rft).toBeTruthy();
        var mapping = { "template": "[resourceDir]/[language]/app.json" };
        expect(rft.getLocalizedPath(mapping, "src/foo.rs", "ko-KR")).toBe("testfiles/resources/ko/app.json");
    });
    test("RustFileTypeGetLocalizedPathMappingWithoutTemplate", function() {
        expect.assertions(3);

        var rft = new RustFileType(p);
        expect(rft).toBeTruthy();
        // a mapping without a template falls back to the default template
        expect(rft.getLocalizedPath({}, "src/foo.rs", "ko-KR")).toBe("testfiles/resources/ko/rsstrings.json");
        expect(rft.getLocalizedPath({}, "src/foo.rs", "en-US")).toBe("testfiles/resources/rsstrings.json");
    });
    test("RustFileTypeConstructorPseudoLocaleConfig", function() {
        expect.assertions(4);

        var project = new CustomProject({
            id: "app",
            plugins: ["../."],
            sourceLocale: "en-US",
            pseudoLocale: {
                "zxx-XX": "debug",
                "as-XX": "debug-font"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var rft = new RustFileType(project);
        expect(rft).toBeTruthy();
        expect(rft.pseudos).toBeTruthy();
        expect(rft.pseudos["zxx-XX"]).toBeTruthy();
        expect(rft.pseudos["as-XX"]).toBeTruthy();
    });
    test("RustFileTypeGetExtracted", function() {
        expect.assertions(2);

        var rft = new RustFileType(p);
        var extracted = rft.getExtracted();
        expect(extracted).toBeTruthy();
        expect(extracted.size()).toBe(0);
    });
    test("RustFileTypeGetNew", function() {
        expect.assertions(2);

        var rft = new RustFileType(p);
        var newres = rft.getNew();
        expect(newres).toBeTruthy();
        expect(newres.size()).toBe(0);
    });
    test("RustFileTypeGetPseudo", function() {
        expect.assertions(2);

        var rft = new RustFileType(p);
        var pseudo = rft.getPseudo();
        expect(pseudo).toBeTruthy();
        expect(pseudo.size()).toBe(0);
    });
    test("RustFileTypeAddSet", function() {
        expect.assertions(2);

        var rft = new RustFileType(p);
        var rf = rft.newFile("src/foo.rs");
        rf.parse('get_loc_string(res_bundle, "OK");');
        rft.addSet(rf.getTranslationSet());

        expect(rft.getExtracted().size()).toBe(1);
        expect(rft.getExtracted().getBySource("OK")).toBeTruthy();
    });
});
