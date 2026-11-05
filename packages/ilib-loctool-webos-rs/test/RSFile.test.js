/*
 * RSFile.test.js - test the Rust file handler object.
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

if (!RSFile) {
    var RSFile = require("../RSFile.js");
    var RSFileType = require("../RSFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    id: "app",
    plugins: ["../."],
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"]
});

var rsft = new RSFileType(p);

describe("rsfile", function() {
    test("RSFileConstructor", function() {
        expect.assertions(1);

        var rsf = new RSFile({project: p});
        expect(rsf).toBeTruthy();
    });
    test("RSFileConstructorParams", function() {
        expect.assertions(1);

        var rsf = new RSFile({
            project: p,
            pathName: "./testfiles/rs/t1.rs",
            type: rsft
        });

        expect(rsf).toBeTruthy();
    });
    test("RSFileConstructorNoFile", function() {
        expect.assertions(1);

        var rsf = new RSFile({
            project: p,
            pathName: undefined,
            type: rsft
        });
        expect(rsf).toBeTruthy();
    });
    test("RSFileMakeKey", function() {
        expect.assertions(2);

        var rsf = new RSFile({
            project: p,
            pathName: undefined,
            type: rsft
        });
        expect(rsf).toBeTruthy();
        expect(rsf.makeKey("This is a test")).toBe("This is a test");
    });
    test("RSFileMakeKey2", function() {
        expect.assertions(2);

        var rsf = new RSFile({
            project: p,
            pathName: undefined,
            type: rsft
        });
        expect(rsf).toBeTruthy();
        expect(rsf.makeKey("This is a \"real\" test")).toBe("This is a \"real\" test");
    });
    test("RSFileMakeKeyWithSpace", function() {
        expect.assertions(2);

        var rsf = new RSFile({
            project: p,
            pathName: undefined,
            type: rsft
        });
        expect(rsf).toBeTruthy();
        expect(rsf.makeKey(" This is a test ")).toBe(" This is a test ");
    });
    test("RSFileParseSimpleGetBySource", function() {
        expect.assertions(5);

        var rsf = new RSFile({
            project: p,
            pathName: undefined,
            type: rsft
        });
        expect(rsf).toBeTruthy();

        rsf.parse('get_loc_string(res_bundle, "OK");');

        var set = rsf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("OK");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("OK");
        expect(r.getKey()).toBe("OK");
    });
    test("RSFileParseSimpleGetBySourceWithSpace", function() {
        expect.assertions(5);

        var rsf = new RSFile({
            project: p,
            pathName: undefined,
            type: rsft
        });
        expect(rsf).toBeTruthy();

        rsf.parse('get_loc_string(res_bundle, " OK ");');

        var set = rsf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource(" OK ");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe(" OK ");
        expect(r.getKey()).toBe(" OK ");
    });
    test("RSFileParseWithKey", function() {
        expect.assertions(5);

        var rsf = new RSFile({
            project: p,
            pathName: undefined,
            type: rsft
        });
        expect(rsf).toBeTruthy();

        rsf.parse('get_loc_string_with_key(res_bundle, "PictureMode.Standard", "Standard");');

        var set = rsf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "PictureMode.Standard"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Standard");
        expect(r[0].getKey()).toBe("PictureMode.Standard");
    });
    test("RSFileParseWithKeyNotDoubleExtracted", function() {
        expect.assertions(3);

        var rsf = new RSFile({
            project: p,
            pathName: undefined,
            type: rsft
        });
        expect(rsf).toBeTruthy();

        // get_loc_string_with_key contains "get_loc_string" as a substring;
        // make sure the plain get_loc_string regex does not also match it.
        rsf.parse('get_loc_string_with_key(res_bundle, "PictureMode.Standard", "Standard");');

        var set = rsf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
    });
    test("RSFileParseMethodCallForm", function() {
        expect.assertions(5);

        var rsf = new RSFile({
            project: p,
            pathName: undefined,
            type: rsft
        });
        expect(rsf).toBeTruthy();

        // method-call form with receiver and a single argument
        rsf.parse('let s = bundle.get_loc_string("Standard");');

        var set = rsf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Standard");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Standard");
        expect(r.getKey()).toBe("Standard");
    });
    test("RSFileParseMethodCallWithKeyForm", function() {
        expect.assertions(5);

        var rsf = new RSFile({
            project: p,
            pathName: undefined,
            type: rsft
        });
        expect(rsf).toBeTruthy();

        // method-call form with receiver: (key, source)
        rsf.parse('let s = bundle.get_loc_string_with_key("PictureMode.Standard", "Standard");');

        var set = rsf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "PictureMode.Standard"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Standard");
        expect(r[0].getKey()).toBe("PictureMode.Standard");
    });
    test("RSFileParseArbitraryReceiverName", function() {
        expect.assertions(4);

        var rsf = new RSFile({
            project: p,
            pathName: undefined,
            type: rsft
        });
        expect(rsf).toBeTruthy();

        // any receiver name before get_loc_string should be handled
        rsf.parse('let s = aaa.get_loc_string("Standard");');

        var set = rsf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.getBySource("Standard")).toBeTruthy();
        expect(set.size()).toBe(1);
    });
    test("RSFileParsePathSeparatorPrefix", function() {
        expect.assertions(4);

        var rsf = new RSFile({
            project: p,
            pathName: undefined,
            type: rsft
        });
        expect(rsf).toBeTruthy();

        // Rust path separator (::) before get_loc_string should be handled
        rsf.parse('let s = foo::bar::get_loc_string("Standard");');

        var set = rsf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.getBySource("Standard")).toBeTruthy();
        expect(set.size()).toBe(1);
    });
    test("RSFileParseSuffixIdentifierNotMatched", function() {
        expect.assertions(3);

        var rsf = new RSFile({
            project: p,
            pathName: undefined,
            type: rsft
        });
        expect(rsf).toBeTruthy();

        // get_loc_string as a suffix of a larger identifier must NOT be extracted
        rsf.parse('let s = my_get_loc_string("ShouldNotBeExtracted");');

        var set = rsf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
    test("RSFileParseMultiple", function() {
        expect.assertions(4);

        var rsf = new RSFile({
            project: p,
            pathName: undefined,
            type: rsft
        });
        expect(rsf).toBeTruthy();

        rsf.parse('let a = get_loc_string(res_bundle, "Yes");\n' +
                  'let b = get_loc_string(res_bundle, "No");');

        var set = rsf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.getBySource("Yes")).toBeTruthy();
        expect(set.getBySource("No")).toBeTruthy();
    });
    test("RSFileParseIgnoreComments", function() {
        expect.assertions(3);

        var rsf = new RSFile({
            project: p,
            pathName: undefined,
            type: rsft
        });
        expect(rsf).toBeTruthy();

        // A commented-out call should not be extracted.
        rsf.parse('// get_loc_string(res_bundle, "ShouldNotBeExtracted");\n');

        var set = rsf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
    test("RSFileExtractFile", function() {
        expect.assertions(4);

        var rsf = new RSFile({
            project: p,
            pathName: "./t1.rs",
            type: rsft
        });
        expect(rsf).toBeTruthy();

        rsf.extract();

        var set = rsf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.getBySource("Yes")).toBeTruthy();
        expect(set.getBySource("Hello, world!")).toBeTruthy();
    });
});
