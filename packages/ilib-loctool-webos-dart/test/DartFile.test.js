/*
 * DartFile.test.js - test the Dart file handler object.
 *
 * Copyright (c) 2023-2025, JEDLSoft
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

if (!DartFile) {
    var DartFile = require("../DartFile.js");
    var DartFileType = require("../DartFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
    var RegularPseudo =  require("loctool/lib/RegularPseudo.js");
}

var p = new CustomProject({
    id: "app",
    plugins: ["../."],
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"]
});

var dft = new DartFileType(p);

describe("dartfile", function() {
    test("DartFileConstructor", function() {
        expect.assertions(1);
        var d = new DartFile({
            project: p,
            type: dft
        });
        expect(d).toBeTruthy();
    });
    test("DartFileConstructorParams", function() {
        expect.assertions(1);

        var d = new DartFile({
            project: p,
            pathName: "./testfiles/t1.dart",
            type: dft
        });

        expect(d).toBeTruthy();
    });
    test("DartFileConstructorNoFile", function() {
        expect.assertions(1);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();
    });
    test("DartFileMakeKey", function() {
        expect.assertions(2);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();
        expect(d.makeKey("This is a test")).toBe("This is a test");
    });
    test("DartFileParseSimpleGetByKey", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("This is a test")');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "This is a test"
        });
        expect(r).toBeTruthy();

        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("This is a test");
    });
    test("DartFileParseSimpleGetByKey2", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('switch (params) {\n'  +
                '    case "a":\n' +
                '       this.actionBtnTitle = translate(' +
                '        "Save Bookmark"    );\n' +
                ' break; \n'
        );

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "Save Bookmark"
        });
        expect(r).toBeTruthy();

        expect(r[0].getSource()).toBe("Save Bookmark");
        expect(r[0].getKey()).toBe("Save Bookmark");
    });
    test("DartFileParseSimpleGetBySource", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("This is a test")');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });
    test("DartFileParseJSSimpleGetBySource", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("This is a test")');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });
    test("DartFileParseTranslateWithKey", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("High", key: "home_connect")');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("High");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("High");
        expect(r.getKey()).toBe("home_connect");
    });
    test("DartFileParseTranslateWithKey2", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate(   "Channel",    key  : "speaker_channel"  )');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Channel");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Channel");
        expect(r.getKey()).toBe("speaker_channel");
    });
    test("DartFileParseTranslateWithKeySingleQuote", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse("translate('High', key: 'home_connect')");

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("High");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("High");
        expect(r.getKey()).toBe("home_connect");
    });
    test("DartFileParseSimpleWithArg", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("{arg1} app cannot be deleted.", args:{"arg1": "Settings"})');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("{arg1} app cannot be deleted.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("{arg1} app cannot be deleted.");
        expect(r.getKey()).toBe("{arg1} app cannot be deleted.");
    });
    test("DartFileParseSimpleWithArgSingleQuote", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse("translate('{arg1} app cannot be deleted.', args:{'arg1': 'Settings'})");

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("{arg1} app cannot be deleted.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("{arg1} app cannot be deleted.");
        expect(r.getKey()).toBe("{arg1} app cannot be deleted.");
    });
    test("DartFileParseSimpleWithArg3", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate( " {arg1} app cannot be deleted. " , args:{"arg1": "Settings"})');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource(" {arg1} app cannot be deleted. ");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe(" {arg1} app cannot be deleted. ");
        expect(r.getKey()).toBe(" {arg1} app cannot be deleted. ");
    });
    test("DartFileParseSimpleWithArgWithTypedefined", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("The lowest temp is {arg1}", args: <String, String>{"arg1": "15"}),');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("The lowest temp is {arg1}");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("The lowest temp is {arg1}");
        expect(r.getKey()).toBe("The lowest temp is {arg1}");
    });
    test("DartFileParseSimpleWithArgWithTypedefined2", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("The lowest temp is {arg1} and the highest temp is {arg2}.", args: <String, int>{"arg1": 15, "arg2": 30}),');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("The lowest temp is {arg1} and the highest temp is {arg2}.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("The lowest temp is {arg1} and the highest temp is {arg2}.");
        expect(r.getKey()).toBe("The lowest temp is {arg1} and the highest temp is {arg2}.");
    });
    test("DartFileParseSimpleWithArgWithTypedefined3", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse("translate('The lowest temp is {arg1} and the highest temp is {arg2}.', args: <String, int>{'arg1': 15, 'arg2': 30}),");

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("The lowest temp is {arg1} and the highest temp is {arg2}.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("The lowest temp is {arg1} and the highest temp is {arg2}.");
        expect(r.getKey()).toBe("The lowest temp is {arg1} and the highest temp is {arg2}.");
    });
    test("DartFileParseSimpleIgnoreWhitespace", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('   translate  (    \t "This is a test"    );  ');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });
    test("DartFileParseSimpleIgnoreWhitespace2", function() {
        expect.assertions(6);

        var d = new DartFile({
            project: p,
            pathName: "./t1.dart",
            type: dft
        });
        expect(d).toBeTruthy();
        d.extract();
        var set = d.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(4);

        var r = set.getBySource("Save Bookmark");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Save Bookmark");
        expect(r.getKey()).toBe("Save Bookmark");
    });
    test("DartFileParseSimpleRightSize", function() {
        expect.assertions(4);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        var set = d.getTranslationSet();
        expect(set.size()).toBe(0);

        d.parse('translate("High", key: "home_connect")');

        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
    });
    test("DartFileParseSimpleWithTranslatorComment", function() {
        expect.assertions(6);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('\ttranslate("This is a test"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(r.getComment()).toBe("this is a translator's comment");
    });
    test("DartFileParseSingleQuotesWithTranslatorComment", function() {
        expect.assertions(6);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse("\ttranslate('This is a test'); // i18n: this is a translator\'s comment\n\tfoo('This is not');");

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(r.getComment()).toBe("this is a translator's comment");
    });
    test("DartFileParseSingleQuotesWithEmbeddedSingleQuotes", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse(
            '    translate(\'We\\\'ll notify you when {prefix}{last_name} accepts you as a friend!\')\n' +
            '    );'
        );

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("We'll notify you when {prefix}{last_name} accepts you as a friend!");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("We'll notify you when {prefix}{last_name} accepts you as a friend!");
        expect(r.getKey()).toBe("We'll notify you when {prefix}{last_name} accepts you as a friend!");
    });
    test("DartFileParseSingleQuotesWithEmbeddedDoubleQuotes", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("We\\"ll notify you when {prefix}{last_name} accepts you as a friend!", args: {"prefix": "Mr.", "last_name": "Lee"})');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('We"ll notify you when {prefix}{last_name} accepts you as a friend!');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('We"ll notify you when {prefix}{last_name} accepts you as a friend!');
        expect(r.getKey()).toBe('We"ll notify you when {prefix}{last_name} accepts you as a friend!');
    });
    test("DartFileParseSimpleWithUniqueIdAndTranslatorComment", function() {
        expect.assertions(6);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('\ttranslate("This is a test", key: "foobar"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "foobar"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("foobar");
        expect(r[0].getComment()).toBe("this is a translator's comment");
    });
    test("DartFileParseWithKey", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("This is a test", key:"unique_id")');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "unique_id"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("unique_id");
    });
    test("DartFileParseMultiple", function() {
        expect.assertions(8);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("This is a test");\n\ta.parse("This is another test.");\n\t\ttranslate("This is also a test");');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");

        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("This is also a test");
    });
    test("DartFileParseMultipleWithKey", function() {
        expect.assertions(10);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("This is a test", key:"x");\n\ta.parse("This is another test.");\n\t\ttranslate("This is a test", key: "y");');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "x"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getAutoKey()).toBeTruthy();
        expect(r[0].getKey()).toBe("x");

        r = set.getBy({
            reskey: "y"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getAutoKey()).toBeTruthy();
        expect(r[0].getKey()).toBe("y");
    });
    test("DartFileParseMultipleSameLine", function() {
        expect.assertions(12);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("This is a test"), translate("This is a second test"), translate("This is a third test")');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(3);

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");

        r = set.getBySource("This is a second test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a second test");
        expect(r.getKey()).toBe("This is a second test");

        r = set.getBySource("This is a third test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a third test");
        expect(r.getKey()).toBe("This is a third test");
    });
    test("DartFileParseMultipleWithComments", function() {
        expect.assertions(10);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("This is a test");   // i18n: foo\n\ta.parse("This is another test.");\n\t\ttranslate("This is also a test");\t// i18n: bar');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(r.getComment()).toBe("foo");

        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("This is also a test");
        expect(r.getComment()).toBe("bar");
    });
    test("DartFileParseMultipleWithUniqueIdsAndComments", function() {
        expect.assertions(10);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("This is a test", key: "asdf");   // i18n: foo\n\ta.parse("This is another test.");\n\t\ttranslate("This is also a test", key:"kdkdkd");\t// i18n: bar');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "asdf"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("asdf");
        expect(r[0].getComment()).toBe("foo");

        r = set.getBy({
            reskey: "kdkdkd"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is also a test");
        expect(r[0].getKey()).toBe("kdkdkd");
        expect(r[0].getComment()).toBe("bar");
    });
    test("DartFileParseWithDups", function() {
        expect.assertions(6);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("This is a test");\n\ta.parse("This is another test.");\n\t\ttranslate("This is a test");');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");

        expect(set.size()).toBe(1);
    });
    test("DartFileParseDupsDifferingByKeyOnly", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("This is a test");\n\ta.parse("This is another test.");\n\t\ttranslate("This is a test", key:"unique_id");');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        r = set.getBy({
            reskey: "unique_id"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("unique_id");
    });
    test("DartFileParseBogusConcatenation", function() {
        expect.assertions(2);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("This is a test" + " and this isnt");');

        var set = d.getTranslationSet();

        expect(set.size()).toBe(0);
    });
    test("DartFileParseBogusConcatenation2", function() {
        expect.assertions(2);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("This is a test" + foobar);');

        var set = d.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("DartFileParseBogusNonStringParam", function() {
        expect.assertions(2);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate(foobar);');

        var set = d.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("DartFileParseEmptyParams", function() {
        expect.assertions(2);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate();');

        var set = d.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("DartFileParseWholeWord", function() {
        expect.assertions(2);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('EPIRB.translate("This is a test");');

        var set = d.getTranslationSet();
        expect(set.size()).toBe(1);
    });
    
    test("DartFileParsePunctuationBeforeRB", function() {
        expect.assertions(9);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse(
            "        <%\n" +
            "        var listsOver4 = false;\n" +
            "        var seemoreLen = 0;\n" +
            "        var subcats = [translate('Personal'), translate('Smart Watches')];\n" +
            "        _.each(subcats, function(subcat, j){\n" +
            "            var list = topic.attribute.kb_attribute_relationships[subcat] || [];\n" +
            "            if (list.length > 0) {\n" +
            "        %>\n");

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);

        var r = set.getBySource("Personal");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Personal");
        expect(r.getKey()).toBe("Personal");

        r = set.getBySource("Smart Watches");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Smart Watches");
        expect(r.getKey()).toBe("Smart Watches");
    });
    test("DartFileParseEmptyString", function() {
        expect.assertions(3);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse("var subcats = [translate(''), translate(''), translate('', 'foo'), translate('foo', '')];\n");

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });
    test("DartFileParseTranslatePlural", function() {
        expect.assertions(6);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translatePlural("plural test", _counter)');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("plural test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("plural test");
        expect(r.getKey()).toBe("plural test");

        expect(set.size()).toBe(1);
    });
    test("DartFileParseTranslatePluralSingleQuote", function() {
        expect.assertions(6);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse("translatePlural('plural test', _counter)");

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("plural test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("plural test");
        expect(r.getKey()).toBe("plural test");

        expect(set.size()).toBe(1);
    });
    test("DartFileExtractFile", function() {
        expect.assertions(8);

        var d = new DartFile({
            project: p,
            pathName: "./t1.dart",
            type: dft
        });
        expect(d).toBeTruthy();

        // should read the file
        d.extract();
        var set = d.getTranslationSet();
        expect(set.size()).toBe(4);

        var r = set.getBySource("Save Bookmark");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Save Bookmark");
        expect(r.getKey()).toBe("Save Bookmark");

        var r = set.getBy({
            reskey: "Setting"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Add Bookmark");
        expect(r[0].getKey()).toBe("Setting");
    });
    test("DartFileExtractUndefinedFile", function() {
        expect.assertions(2);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        // should attempt to read the file and not fail
        d.extract();

        var set = d.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("DartFileTest2", function() {
        expect.assertions(11);

        var d = new DartFile({
            project: p,
            pathName: "./t2.dart",
            type: dft
        });
        expect(d).toBeTruthy();

        d.extract();

        var set = d.getTranslationSet();
        expect(set.size()).toBe(5);

        var r = set.getBySource("Track");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Track");
        expect(r.getKey()).toBe("music_track");

        var r = set.getBy({
            reskey: "1#At least 1 letter|#At least {num} letters"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("1#At least 1 letter|#At least {num} letters");
        expect(r[0].getKey()).toBe("1#At least 1 letter|#At least {num} letters");

        var r = set.getBySource("first number {arg1}, second number {arg2}, and third number {arg3}");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("first number {arg1}, second number {arg2}, and third number {arg3}");
        expect(r.getKey()).toBe("first number {arg1}, second number {arg2}, and third number {arg3}");
    });
    test("DartFileTest3", function() {
        expect.assertions(20);

        var d = new DartFile({
            project: p,
            pathName: "./t3.dart",
            type: dft
        });
        expect(d).toBeTruthy();

        d.extract();

        var set = d.getTranslationSet();
        expect(set.size()).toBe(6);

        var r = set.getBySource("WOWCAST ({arg1})");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("WOWCAST ({arg1})");
        expect(r.getKey()).toBe("WOWCAST ({arg1})");

        var r = set.getBySource("GO TO {arg1}");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("GO TO {arg1}");
        expect(r.getKey()).toBe("GO TO {arg1}");

        var r = set.getBySource("Add ({arg1} card)");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Add ({arg1} card)");
        expect(r.getKey()).toBe("Add ({arg1} card)");

        var r = set.getBySource("{appName} app cannot be deleted.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("{appName} app cannot be deleted.");
        expect(r.getKey()).toBe("{appName} app cannot be deleted.");

        var r = set.getBySource("The lowest temp is {arg1} and the highest temp is {arg2}.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("The lowest temp is {arg1} and the highest temp is {arg2}.");
        expect(r.getKey()).toBe("The lowest temp is {arg1} and the highest temp is {arg2}.");

        var r = set.getBySource("Exclusive features for {%model} are all gathered here.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Exclusive features for {%model} are all gathered here.");
        expect(r.getKey()).toBe("Exclusive features for {%model} are all gathered here.");
    });
    test("DartPseudoLocalization1", function() {
        expect.assertions(4);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("This is a test")');
        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();

        var rb = new RegularPseudo({
            type: "text"
        });
        var rs2 = r.generatePseudo("zxx-XX", rb);
        expect(rs2.getTarget()).toBe("[Ťĥíš íš à ţëšţ6543210]");
    });
    test("DartPseudoLocalization2", function() {
        expect.assertions(4);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("This is a test")');
        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();

        var rb = new RegularPseudo({
            type: "text",
            targetLocale: "zxx-Hans-XX"
        });
        var rs2 = r.generatePseudo("zxx-Hans-XX", rb);
        expect(rs2.getTarget()).toBe("[推和意思意思阿推俄思推6543210]");
    });
    test("DartPseudoLocalization3", function() {
        expect.assertions(4);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("This is a test")');
        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();

        var rb = new RegularPseudo({
            type: "text",
            targetLocale: "zxx-Cyrl-XX"
        });
        var rs2 = r.generatePseudo("zxx-Cyrl-XX", rb);
        expect(rs2.getTarget()).toBe("[Тхис ис а тэст6543210]");
    });
    test("DartPseudoLocalization4", function() {
        expect.assertions(4);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("This is a test")');
        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();

        var rb = new RegularPseudo({
            targetLocale: "zxx-Hebr-XX"
        });
        var rs2 = r.generatePseudo("zxx-Hebr-XX", rb);
        expect(rs2.getTarget()).toBe('[טהִס ִס ַ טֶסט6543210]');
    });
    test("DartFileNotParseComment", function() {
        expect.assertions(2);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('// translate("This is a test"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');

        var set = d.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("DartFileNotremotei18nComment", function() {
        expect.assertions(10);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('translate("This is a test"); // i18n: this is a translator\'s comment\n\ttranslate("This is a test2");foo("This is not");');

        var set = d.getTranslationSet();
        expect(set.size()).toBe(2);

        r = set.getBy({
            reskey: "This is a test"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("This is a test");
        expect(r[0].getComment()).toBe("this is a translator\'s comment");

        r = set.getBy({
            reskey: "This is a test2"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test2");
        expect(r[0].getKey()).toBe("This is a test2");
        expect(r[0].getComment()).toBe(undefined);
    });
});