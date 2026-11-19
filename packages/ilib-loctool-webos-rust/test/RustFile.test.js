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
            pathName: "./t1.rs",
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

        rf.parse('res_bundle.get_loc_string("OK");');

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

        rf.parse('res_bundle.get_loc_string(" OK ");');

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

        rf.parse('res_bundle.get_loc_string_with_key("PictureMode.Standard", "Standard");');

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
        rf.parse('res_bundle.get_loc_string_with_key("PictureMode.Standard", "Standard");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
    });
    test("RustFileParseMultiLineArguments", function() {
        expect.assertions(5);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // rustfmt breaks long arguments into lines and adds a trailing comma
        rf.parse('let s = bundle.get_loc_string(\n' +
                 '    "Standard",\n' +
                 ');');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Standard");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Standard");
        expect(r.getKey()).toBe("Standard");
    });
    test("RustFileParseCommentedOutCallOnLastLine", function() {
        expect.assertions(3);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // no newline at the end of the file
        rf.parse('bundle.get_loc_string("A");\n' +
                 '// bundle.get_loc_string("EOF")');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(1);
        expect(set.getBySource("EOF")).toBeFalsy();
    });
    test("RustFileParseCommentedOutCallWithSlashOnLastLine", function() {
        expect.assertions(3);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // a slash in the comment must not end the comment
        rf.parse('bundle.get_loc_string("A");\n' +
                 '// see a/b bundle.get_loc_string("EOF")');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(1);
        expect(set.getBySource("EOF")).toBeFalsy();
    });
    test("RustFileParseI18nCommentWithDoubleQuote", function() {
        expect.assertions(5);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // a double quote in the i18n comment must not open a string literal
        // that hides the commented-out call on the next line
        rf.parse('bundle.get_loc_string("Size"); // i18n: 5" screen\n' +
                 '// bundle.get_loc_string("Z");\n' +
                 'bundle.get_loc_string("OK");\n');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(2);
        expect(set.getBySource("Z")).toBeFalsy();
        expect(set.getBySource("Size").getComment()).toBe('5" screen');
        expect(set.getBySource("OK")).toBeTruthy();
    });
    test("RustFileParseI18nBlockCommentWithDoubleQuote", function() {
        expect.assertions(5);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // a double quote in the i18n block comment must not open a string
        // literal that hides the commented-out call on the next line
        rf.parse('bundle.get_loc_string("Size"); /* i18n: 5" screen */\n' +
                 '/* bundle.get_loc_string("Z"); */\n' +
                 'bundle.get_loc_string("OK");\n');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(2);
        expect(set.getBySource("Z")).toBeFalsy();
        expect(set.getBySource("Size").getComment()).toBe('5" screen');
        expect(set.getBySource("OK")).toBeTruthy();
    });
    test("RustFileParseNestedBlockComment", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // Rust block comments can be nested, so the comment does not end at
        // the first "*/"
        rf.parse('/* outer /* inner */ bundle.get_loc_string("Hidden"); */\n' +
                 'bundle.get_loc_string("A");\n');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(1);
        expect(set.getBySource("Hidden")).toBeFalsy();
        expect(set.getBySource("A")).toBeTruthy();
    });
    test("RustFileParseNestedBlockCommentMultiLine", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // code that already has a block comment, commented out with /* */
        rf.parse('/*\n' +
                 'bundle.get_loc_string("Hidden1"); /* old */\n' +
                 'bundle.get_loc_string("Hidden2");\n' +
                 '*/\n' +
                 'bundle.get_loc_string("A");\n');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(1);
        expect(set.getBySource("Hidden2")).toBeFalsy();
        expect(set.getBySource("A")).toBeTruthy();
    });
    test("RustFileParseUnclosedBlockComment", function() {
        expect.assertions(3);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // a block comment that is not closed runs to the end of the file
        rf.parse('bundle.get_loc_string("A");\n' +
                 '/* bundle.get_loc_string("Hidden");\n');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(1);
        expect(set.getBySource("Hidden")).toBeFalsy();
    });
    test("RustFileParseBlockCommentContainingI18nIsRemoved", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // a block comment is an i18n comment only when it starts with "i18n",
        // so the call commented out here must not be extracted
        rf.parse('/* TODO: i18n\n' +
                 'bundle.get_loc_string("Hidden"); */\n' +
                 'bundle.get_loc_string("A");\n');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(1);
        expect(set.getBySource("Hidden")).toBeFalsy();
        expect(set.getBySource("A")).toBeTruthy();
    });
    test("RustFileParseCommentDoesNotJoinLines", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // the i18n comment of the next line must not be attached to "A"
        rf.parse('bundle.get_loc_string("A"); // not for translators\n' +
                 'bundle.get_loc_string("B"); // i18n for B\n');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(2);
        expect(set.getBySource("A").getComment()).toBeUndefined();
        expect(set.getBySource("B").getComment()).toBe("for B");
    });
    test("RustFileParseI18nCommentOnlyForLastCallOnLine", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('bundle.get_loc_string("X"); bundle.get_loc_string("Y"); // i18n for Y\n');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(2);
        expect(set.getBySource("X").getComment()).toBeUndefined();
        expect(set.getBySource("Y").getComment()).toBe("for Y");
    });
    test("RustFileParseI18nCommentOnlyForLastCallOnLineWithKey", function() {
        expect.assertions(5);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // the calls of the two methods are on the same line
        rf.parse('bundle.get_loc_string_with_key("K", "S"); bundle.get_loc_string("Y"); // i18n for Y\n' +
                 'bundle.get_loc_string("Z"); bundle.get_loc_string_with_key("K2", "S2"); // i18n for K2\n');

        var set = rf.getTranslationSet();
        expect(set.getBy({reskey: "K"})[0].getComment()).toBeUndefined();
        expect(set.getBySource("Y").getComment()).toBe("for Y");
        expect(set.getBySource("Z").getComment()).toBeUndefined();
        expect(set.getBy({reskey: "K2"})[0].getComment()).toBe("for K2");
    });
    test("RustFileParseCRLF", function() {
        expect.assertions(5);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('bundle.get_loc_string("A"); // i18n note\r\n' +
                 '// bundle.get_loc_string("C")\r\n' +
                 'bundle.get_loc_string("B"); /* i18n block note */\r\n');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(2);
        expect(set.getBySource("C")).toBeFalsy();
        expect(set.getBySource("A").getComment()).toBe("note");
        expect(set.getBySource("B").getComment()).toBe("block note");
    });
    test("RustFileParseLineContinuation", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // a backslash at the end of a line removes the newline and the leading
        // whitespace of the next line, so rustc makes "Connect a LAN cable to the TV."
        rf.parse('let s = bundle.get_loc_string("Connect a LAN cable \\\n' +
                 '        to the TV.");');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(1);

        var r = set.getBySource("Connect a LAN cable to the TV.");
        expect(r).toBeTruthy();
        expect(r.getKey()).toBe("Connect a LAN cable to the TV.");
    });
    test("RustFileParseLineContinuationCRLF", function() {
        expect.assertions(3);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('let s = bundle.get_loc_string("Connect a LAN cable \\\r\n' +
                 '        to the TV.");\r\n');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(1);
        expect(set.getBySource("Connect a LAN cable to the TV.")).toBeTruthy();
    });
    test("RustFileParseLineContinuationMultipleLines", function() {
        expect.assertions(3);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // the whitespace before the backslash is kept, blank lines after it are skipped
        rf.parse('let s = bundle.get_loc_string("One, \\\n' +
                 '    two,\\\n' +
                 '\n' +
                 '    three.");');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(1);
        expect(set.getBySource("One, two,three.")).toBeTruthy();
    });
    test("RustFileParseWithKeyLineContinuation", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('let s = bundle.get_loc_string_with_key(\n' +
                 '    "Settings.Network.Wired.Description",\n' +
                 '    "Connect a LAN cable to the TV \\\n' +
                 '     to use a wired network connection.",\n' +
                 ');');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(1);

        var r = set.getBy({
            reskey: "Settings.Network.Wired.Description"
        });
        expect(r.length).toBe(1);
        expect(r[0].getSource()).toBe("Connect a LAN cable to the TV to use a wired network connection.");
    });
    test("RustFileParseLineContinuationWithCommentMarker", function() {
        expect.assertions(3);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // "//" after a line continuation is still inside the string literal
        rf.parse('let s = bundle.get_loc_string("See \\\n' +
                 '    http://www.lg.com for details.");');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(1);
        expect(set.getBySource("See http://www.lg.com for details.")).toBeTruthy();
    });
    test("RustFileParseEscapedBackslashAtEndOfLine", function() {
        expect.assertions(3);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // "\\" + newline is an escaped backslash followed by a real newline,
        // not a line continuation
        rf.parse('let s = bundle.get_loc_string("C:\\\\\n' +
                 'next");');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(1);
        expect(set.getBySource("C:\\\nnext")).toBeTruthy();
    });
    test("RustFileRemoveLineContinuations", function() {
        expect.assertions(7);

        expect(RustFile.removeLineContinuations("a \\\n    b")).toBe("a b");
        expect(RustFile.removeLineContinuations("a \\\r\n\tb")).toBe("a b");
        // an escaped backslash at the end of a line is literal text
        expect(RustFile.removeLineContinuations("a\\\\\nb")).toBe("a\\\\\nb");
        // an escaped backslash followed by a line continuation
        expect(RustFile.removeLineContinuations("a\\\\\\\n  b")).toBe("a\\\\b");
        expect(RustFile.removeLineContinuations("no continuation")).toBe("no continuation");
        expect(RustFile.removeLineContinuations("")).toBe("");
        expect(RustFile.removeLineContinuations(undefined)).toBeUndefined();
    });
    test("RustFileParseWithKeyMultiLineArguments", function() {
        expect.assertions(5);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // rustfmt puts a chained method call on its own line and breaks the arguments
        rf.parse('let s = bundle\n' +
                 '    .get_loc_string_with_key(\n' +
                 '        "PictureMode.Standard",\n' +
                 '        "Standard",\n' +
                 '    );');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "PictureMode.Standard"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Standard");
        expect(r[0].getKey()).toBe("PictureMode.Standard");
    });
    test("RustFileParseEscapedQuotes", function() {
        expect.assertions(3);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('let s = bundle.get_loc_string("Press \\"OK\\" to continue");');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(1);
        expect(set.getBySource('Press "OK" to continue')).toBeTruthy();
    });
    test("RustFileParseReceiverExpression", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // the receiver can be any expression, including one with commas
        rf.parse('let a = self.res_bundle.get_loc_string("N1");\n' +
                 'let b = get_bundle(a, b).get_loc_string("N2");');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(2);
        expect(set.getBySource("N1")).toBeTruthy();
        expect(set.getBySource("N2")).toBeTruthy();
    });
    test("RustFileParseFunctionCallFormNotMatched", function() {
        expect.assertions(2);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // the resource bundle has no free functions, so calls without a receiver
        // (e.g. get_loc_string(res_bundle, "Yes") or get_loc_string("No"))
        // are NOT extracted
        rf.parse('let a = get_loc_string(res_bundle, "Yes");\n' +
                 'let b = get_loc_string_with_key(res_bundle, "PictureMode.Standard", "Standard");\n' +
                 'let c = get_loc_string("No");');

        expect(rf.getTranslationSet().size()).toBe(0);
    });
    test("RustFileParseWrongArgumentCountNotMatched", function() {
        expect.assertions(2);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // get_loc_string takes one string and get_loc_string_with_key takes two
        rf.parse('let a = bundle.get_loc_string("A", "B");\n' +
                 'let b = bundle.get_loc_string_with_key("X", "K", "S");\n' +
                 'let c = bundle.get_loc_string_with_key("Standard");\n' +
                 'let d = bundle.get_loc_string();');

        expect(rf.getTranslationSet().size()).toBe(0);
    });
    test("RustFileParseNonLiteralArgumentNotMatched", function() {
        expect.assertions(2);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // only string literals can be extracted
        rf.parse('let a = bundle.get_loc_string(label);\n' +
                 'let b = bundle.get_loc_string_with_key(key, "Standard");');

        expect(rf.getTranslationSet().size()).toBe(0);
    });
    test("RustFileParseArbitraryReceiverName", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // the receiver does not need to be named "bundle"
        rf.parse('let s = aaa.get_loc_string("Standard");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.getBySource("Standard")).toBeTruthy();
        expect(set.size()).toBe(1);
    });
    test("RustFileParsePathCallNotMatched", function() {
        expect.assertions(2);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // path calls (::) are not the method-call form, so they are not extracted
        rf.parse('let a = foo::bar::get_loc_string("Standard");\n' +
                 'let b = ResBundle::get_loc_string(&bundle, "Yes");');

        expect(rf.getTranslationSet().size()).toBe(0);
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
        rf.parse('let s = bundle.my_get_loc_string("ShouldNotBeExtracted");');

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

        rf.parse('let a = res_bundle.get_loc_string("Yes");\n' +
                  'let b = res_bundle.get_loc_string("No");');

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
        rf.parse('// res_bundle.get_loc_string("ShouldNotBeExtracted");\n');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
    test("RustFileExtractFile", function() {
        expect.assertions(8);

        var rf = new RustFile({
            project: p,
            pathName: "./t1.rs",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.extract();

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(8);
        expect(set.getBySource("Yes")).toBeTruthy();
        expect(set.getBySource("Hello, world!")).toBeTruthy();
        expect(set.getBySource("Standard").getKey()).toBe("PictureMode.Standard");
        // multi-line arguments with a trailing comma
        expect(set.getBySource("Picture")).toBeTruthy();
        expect(set.getBySource("Low").getKey()).toBe("EnergyMode.Low");
    });
    test("RustFileResourceHasMapping", function() {
        expect.assertions(4);

        var rf = new RustFile({
            project: p,
            pathName: "src/foo.rs",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('res_bundle.get_loc_string("OK");\nres_bundle.get_loc_string_with_key("PictureMode.Standard", "Standard");');

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

        rf.parse('let ok = res_bundle.get_loc_string("OK"); // i18n button');

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

        rf.parse('let cancel = res_bundle.get_loc_string("Cancel"); /* i18n cancel button */');

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

        rf.parse('let power = res_bundle.get_loc_string("Power"); // i18n : Power button');

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

        rf.parse('let s = res_bundle.get_loc_string_with_key("PictureMode.Standard", "Standard"); // i18n picture mode');

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
    test("RustFileTrimComment", function() {
        expect.assertions(10);

        expect(RustFile.trimComment(" : Power button")).toBe("Power button");
        expect(RustFile.trimComment(":Power button")).toBe("Power button");
        expect(RustFile.trimComment("cancel button */")).toBe("cancel button");
        expect(RustFile.trimComment("button  ")).toBe("button");
        // a colon, slash or star in the middle of the comment is kept
        expect(RustFile.trimComment(" Format: HH:MM")).toBe("Format: HH:MM");
        expect(RustFile.trimComment("time 10:30")).toBe("time 10:30");
        expect(RustFile.trimComment("see a/b")).toBe("see a/b");
        expect(RustFile.trimComment("5 * 3 items")).toBe("5 * 3 items");
        // nothing remains
        expect(RustFile.trimComment("  ")).toBeUndefined();
        expect(RustFile.trimComment(" */")).toBeUndefined();
    });
    test("RustFileParseI18nCommentWithColons", function() {
        expect.assertions(3);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('bundle.get_loc_string("Start time"); // i18n Format: HH:MM\n' +
                 'bundle.get_loc_string("End time"); /* i18n : ends at 10:30 */\n');

        var set = rf.getTranslationSet();
        expect(set.getBySource("Start time").getComment()).toBe("Format: HH:MM");
        expect(set.getBySource("End time").getComment()).toBe("ends at 10:30");
    });
    test("RustFileParseI18nCommentAfterComma", function() {
        expect.assertions(2);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // the i18n comment comes after the comma that follows the call
        rf.parse('vec![\n' +
                 '    bundle.get_loc_string("A"), /* i18n: label */\n' +
                 '];\n');

        var set = rf.getTranslationSet();
        expect(set.getBySource("A").getComment()).toBe("label");
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
        rf.parse('let a = res_bundle.get_loc_string("");\n' +
                  'let b = res_bundle.get_loc_string("Yes");');

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
        rf.parse('let a = res_bundle.get_loc_string_with_key("Key.Empty", "");\n' +
                  'let b = res_bundle.get_loc_string_with_key("Key.Two", "Two");');

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

        rf.parse('let a = res_bundle.get_loc_string_with_key("", "NoKey");');

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

/*
 * Unicode escape sequences in Rust string literals.
 *
 * Rust only supports the `\u{XXXX}` form of unicode escapes (the JS/C style
 * `\uXXXX` is a compile error in Rust). In xliff files, unicode escapes
 * in the source strings are written with the JS style escapes, e.g.:
 *   \u0028{num}\u0029 items selected
 *   Press \u2018Enter\u2019 to continue.
 * A Rust app that follows the same convention would write them as `\u{XXXX}`.
 *
 * The plugin converts them to the JS style `\uXXXX`, so that the key is the
 * same as the one in the existing xliff files. These tests check that:
 *   1. the Rust specific `\u{...}` form does not leak into the key/source, and
 *   2. the generated JSON resource file is valid JSON and its key matches the
 *      string that the Rust code has at runtime, so that the lookup succeeds.
 */
var JSONResourceFile = require("ilib-loctool-webos-json-resource/JSONResourceFile.js");

var unicodeEscapeCases = [
    {
        name: "parentheses",
        rust: '\\u{0028}{num}\\u{0029} items selected',
        runtime: "\u0028{num}\u0029 items selected",
        locale: "ko-KR",
        // the target is written with the JS style escapes as well
        target: "\\u0028{num}\\u0029개 항목 선택됨",
        runtimeTarget: "\u0028{num}\u0029개 항목 선택됨"
    },
    {
        name: "curly quotes",
        rust: 'Press \\u{2018}Enter\\u{2019} to continue.',
        runtime: "Press \u2018Enter\u2019 to continue.",
        locale: "ko-KR",
        target: "계속하려면 \\u2018Enter\\u2019를 누르세요.",
        runtimeTarget: "계속하려면 \u2018Enter\u2019를 누르세요."
    },
    {
        name: "low-9 quotes",
        rust: 'Select \\u{201e}Save\\u{201f} to keep the changes.',
        runtime: "Select \u201eSave\u201f to keep the changes.",
        locale: "ko-KR",
        target: "변경 사항을 유지하려면 \\u201e저장\\u201f을 선택하세요.",
        runtimeTarget: "변경 사항을 유지하려면 \u201e저장\u201f을 선택하세요."
    }
];

describe("rustfile unicode escapes", function() {
    unicodeEscapeCases.forEach(function(tc) {
        test("RustFileParseUnicodeEscapeNotLeaked: " + tc.name, function() {
            expect.assertions(3);

            var rf = new RustFile({
                project: p,
                pathName: undefined,
                type: rft
            });
            rf.parse('res_bundle.get_loc_string("' + tc.rust + '");');

            var resources = rf.getTranslationSet().getAll();
            expect(resources.length).toBe(1);
            expect(resources[0].getKey()).not.toContain("\\u{");
            expect(resources[0].getSource()).not.toContain("\\u{");
        });

        test("RustFileUnicodeEscapeJsonResourceMatchesRuntime: " + tc.name, function() {
            expect.assertions(2);

            var rf = new RustFile({
                project: p,
                pathName: undefined,
                type: rft
            });
            rf.parse('res_bundle.get_loc_string("' + tc.rust + '");');
            var extracted = rf.getTranslationSet().getAll()[0];

            var translated = p.getAPI().newResource({
                resType: "string",
                project: "app",
                key: extracted.getKey(),
                sourceLocale: "en-US",
                source: extracted.getSource(),
                targetLocale: tc.locale,
                target: tc.target,
                datatype: "x-rust"
            });

            var jrf = new JSONResourceFile({
                project: p,
                locale: tc.locale
            });
            jrf.addResource(translated);

            // the generated resource file must be valid JSON ...
            var json;
            expect(function() {
                json = JSON.parse(jrf.getContent());
            }).not.toThrow();

            // ... and the translation must be found with the runtime string
            expect(json && json[tc.runtime]).toBe(tc.runtimeTarget);
        });
    });
});

describe("rustfile convertUnicodeEscapes", function() {
    var cases = [
        // [name, input (Rust source text), expected (JS style escape text)]
        ["4 hex digits", 'Press \\u{2018}Enter\\u{2019} to continue.', 'Press \\u2018Enter\\u2019 to continue.'],
        ["upper case is kept", '\\u{201E}Save\\u{201F}', '\\u201ESave\\u201F'],
        ["lower case is kept", '\\u{201e}Save\\u{201f}', '\\u201eSave\\u201f'],
        ["padded to 4 digits", '\\u{28}{num}\\u{29}', '\\u0028{num}\\u0029'],
        ["single digit", '\\u{9}', '\\u0009'],
        ["leading zeros", '\\u{0028}{num}\\u{0029}', '\\u0028{num}\\u0029'],
        ["outside the BMP becomes a surrogate pair", 'Smile \\u{1F600}', 'Smile \\uD83D\\uDE00'],
        ["highest code point", '\\u{10FFFF}', '\\uDBFF\\uDFFF'],
        ["underscores between the digits are removed", '\\u{00_E9} \\u{1F_600}', '\\u00E9 \\uD83D\\uDE00'],
        ["leading underscore is left unchanged", '\\u{_41}', '\\u{_41}'],
        ["escaped backslash is literal text", 'a\\\\u{41}b', 'a\\\\u{41}b'],
        ["escaped backslash followed by a real escape", 'a\\\\\\u{41}b', 'a\\\\\\u0041b'],
        ["above U+10FFFF is left unchanged", '\\u{110000}', '\\u{110000}'],
        ["more than 6 digits is left unchanged", '\\u{0000041}', '\\u{0000041}'],
        ["no digits is left unchanged", '\\u{}', '\\u{}'],
        ["JS style escape is left unchanged", 'Press \\u2018Enter\\u2019', 'Press \\u2018Enter\\u2019'],
        ["no escape", 'This is a test', 'This is a test']
    ];

    cases.forEach(function(tc) {
        test("RustFileConvertUnicodeEscapes: " + tc[0], function() {
            expect.assertions(1);
            expect(RustFile.convertUnicodeEscapes(tc[1])).toBe(tc[2]);
        });
    });

    test("RustFileConvertUnicodeEscapesEmpty", function() {
        expect.assertions(2);
        expect(RustFile.convertUnicodeEscapes("")).toBe("");
        expect(RustFile.convertUnicodeEscapes(undefined)).toBeUndefined();
    });

    test("RustFileParseUnicodeEscapeKeyMatchesXliff", function() {
        expect.assertions(3);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        // key as it is written in the xliff files
        rf.parse('bundle.get_loc_string("Press \\u{2018}Enter\\u{2019} to continue.");');

        var resources = rf.getTranslationSet().getAll();
        expect(resources.length).toBe(1);
        expect(resources[0].getKey()).toBe('Press \\u2018Enter\\u2019 to continue.');
        expect(resources[0].getSource()).toBe('Press \\u2018Enter\\u2019 to continue.');
    });

    test("RustFileParseUnicodeEscapeWithKey", function() {
        expect.assertions(3);

        var rf = new RustFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        rf.parse('bundle.get_loc_string_with_key("Items.\\u{0028}Selected\\u{0029}", "\\u{0028}{num}\\u{0029} items selected");');

        var resources = rf.getTranslationSet().getAll();
        expect(resources.length).toBe(1);
        expect(resources[0].getKey()).toBe('Items.\\u0028Selected\\u0029');
        expect(resources[0].getSource()).toBe('\\u0028{num}\\u0029 items selected');
    });
});
