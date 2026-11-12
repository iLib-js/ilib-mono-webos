/*
 * RustFile.test.js - test the Rust file handler object.
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

if (!RustFile) {
    var RustFile = require("../RustFile.js");
    var RustFileType = require("../RustFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    id: "app",
    plugins: ["../."],
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"]
});

var rft = new RustFileType(p);

describe("rustfile", function() {
    test("RustFileConstructor", function() {
        expect.assertions(1);

        var rf = new RustFile({project: p});
        expect(rf).toBeTruthy();
    });
    test("RustFileConstructorParams", function() {
        expect.assertions(1);

        var rf = new RustFile({
            project: p,
            pathName: "./testfiles/rs/t1.rs",
            type: rft
        });

        expect(rf).toBeTruthy();
    });
    test("RustFileConstructorNoFile", function() {
        expect.assertions(1);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();
    });
    test("RustFileMakeKey", function() {
        expect.assertions(2);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();
        expect(rf.makeKey("This is a test")).toBe("This is a test");
    });
    test("RustFileMakeKey2", function() {
        expect.assertions(2);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();
        expect(rf.makeKey("This is a \"real\" test")).toBe("This is a \"real\" test");
    });
    test("RustFileMakeKeyWithSpace", function() {
        expect.assertions(2);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();
        expect(rf.makeKey(" This is a test ")).toBe(" This is a test ");
    });
    test("RustFileParseSimpleGetBySource", function() {
        expect.assertions(5);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('get_loc_string(res_bundle, "OK");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("OK");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("OK");
        expect(r.getKey()).toBe("OK");
    });
    test("RustFileParseSimpleGetBySourceWithSpace", function() {
        expect.assertions(5);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('get_loc_string(res_bundle, " OK ");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource(" OK ");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe(" OK ");
        expect(r.getKey()).toBe(" OK ");
    });
    test("RustFileParseWithKey", function() {
        expect.assertions(5);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('get_loc_string_with_key(res_bundle, "PictureMode.Standard", "Standard");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "PictureMode.Standard"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Standard");
        expect(r[0].getKey()).toBe("PictureMode.Standard");
    });
    test("RustFileParseWithKeyNotDoubleExtracted", function() {
        expect.assertions(3);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // get_loc_string_with_key contains "get_loc_string" as a substring;
        // make sure the plain get_loc_string regex does not also match it.
        rf.parse('get_loc_string_with_key(res_bundle, "PictureMode.Standard", "Standard");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
    });
    test("RustFileParseMethodCallForm", function() {
        expect.assertions(5);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // method-call form with receiver and a single argument
        rf.parse('let s = bundle.get_loc_string("Standard");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Standard");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Standard");
        expect(r.getKey()).toBe("Standard");
    });
    test("RustFileParseMethodCallWithKeyForm", function() {
        expect.assertions(5);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // method-call form with receiver: (key, source)
        rf.parse('let s = bundle.get_loc_string_with_key("PictureMode.Standard", "Standard");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "PictureMode.Standard"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Standard");
        expect(r[0].getKey()).toBe("PictureMode.Standard");
    });
    test("RustFileParseArbitraryReceiverName", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // any receiver name before get_loc_string should be handled
        rf.parse('let s = aaa.get_loc_string("Standard");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.getBySource("Standard")).toBeTruthy();
        expect(set.size()).toBe(1);
    });
    test("RustFileParsePathSeparatorPrefix", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // Rust path separator (::) before get_loc_string should be handled
        rf.parse('let s = foo::bar::get_loc_string("Standard");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.getBySource("Standard")).toBeTruthy();
        expect(set.size()).toBe(1);
    });
    test("RustFileParseSuffixIdentifierNotMatched", function() {
        expect.assertions(3);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // get_loc_string as a suffix of a larger identifier must NOT be extracted
        rf.parse('let s = my_get_loc_string("ShouldNotBeExtracted");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
    test("RustFileParseMultiple", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('let a = get_loc_string(res_bundle, "Yes");\n' +
                  'let b = get_loc_string(res_bundle, "No");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.getBySource("Yes")).toBeTruthy();
        expect(set.getBySource("No")).toBeTruthy();
    });
    test("RustFileParseIgnoreComments", function() {
        expect.assertions(3);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // A commented-out call should not be extracted.
        rf.parse('// get_loc_string(res_bundle, "ShouldNotBeExtracted");\n');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
    test("RustFileExtractFile", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: "./t1.rs",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.extract();

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.getBySource("Yes")).toBeTruthy();
        expect(set.getBySource("Hello, world!")).toBeTruthy();
    });
    test("RustFileResourceHasMapping", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: "src/foo.rs",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('get_loc_string(res_bundle, "OK");\nget_loc_string_with_key(res_bundle, "PictureMode.Standard", "Standard");');

        var set = rf.getTranslationSet();
        var expected = { "template": "[resourceDir]/[localeDir]/rsstrings.json" };
        expect(set.getBySource("OK").mapping).toStrictEqual(expected);
        expect(set.getBySource("Standard").mapping).toStrictEqual(expected);
        expect(rf.mapping).toStrictEqual(expected);
    });
    test("RustFileConstructorWithoutType", function() {
        expect.assertions(2);

        var rf = new RustFile({project: p, pathName: "src/foo.rs"});
        expect(rf).toBeTruthy();
        expect(rf.mapping).toBeUndefined();
    });
    test("RustFileParseWithLineComment", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('let ok = get_loc_string(res_bundle, "OK"); // i18n button');

        var set = rf.getTranslationSet();
        var r = set.getBySource("OK");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("OK");
        expect(r.getComment()).toBe("button");
    });
    test("RustFileParseWithBlockComment", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('let cancel = get_loc_string(res_bundle, "Cancel"); /* i18n cancel button */');

        var set = rf.getTranslationSet();
        var r = set.getBySource("Cancel");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Cancel");
        expect(r.getComment()).toBe("cancel button");
    });
    test("RustFileParseWithColonComment", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('let power = get_loc_string(res_bundle, "Power"); // i18n : Power button');

        var set = rf.getTranslationSet();
        var r = set.getBySource("Power");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Power");
        expect(r.getComment()).toBe("Power button");
    });
    test("RustFileParseWithKeyAndComment", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('let s = get_loc_string_with_key(res_bundle, "PictureMode.Standard", "Standard"); // i18n picture mode');

        var set = rf.getTranslationSet();
        var r = set.getBySource("Standard");
        expect(r).toBeTruthy();
        expect(r.getKey()).toBe("PictureMode.Standard");
        expect(r.getComment()).toBe("picture mode");
    });
    test("RustFileTrimCommentUndefined", function() {
        expect.assertions(1);

        expect(RustFile.trimComment(undefined)).toBeUndefined();
    });
    test("RustFileParseEmptyString", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // The empty string is skipped, but the following call is still extracted.
        rf.parse('let a = get_loc_string(res_bundle, "");\n' +
                  'let b = get_loc_string(res_bundle, "Yes");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        expect(set.getBySource("Yes")).toBeTruthy();
    });
    test("RustFileParseWithKeyEmptyString", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // The call with an empty source is skipped, but the following call is still extracted.
        rf.parse('let a = get_loc_string_with_key(res_bundle, "Key.Empty", "");\n' +
                  'let b = get_loc_string_with_key(res_bundle, "Key.Two", "Two");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        expect(set.getBySource("Two").getKey()).toBe("Key.Two");
    });
    test("RustFileParseWithKeyEmptyKey", function() {
        expect.assertions(3);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('let a = get_loc_string_with_key(res_bundle, "", "NoKey");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
    test("RustFileExtractNonExistentFile", function() {
        expect.assertions(3);

        var rf = new RustFile({
            project: p,
            pathName: "./does-not-exist.rs",
            type: rft
        });
        expect(rf).toBeTruthy();

        // should not throw
        rf.extract();

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
    test("RustFileExtractEmptyFile", function() {
        expect.assertions(2);

        var rf = new RustFile({
            project: p,
            pathName: "./empty.rs",
            type: rft
        });

        rf.extract();

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
    test("RustFileExtractUndefinedPath", function() {
        expect.assertions(2);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });

        rf.extract();

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
});
