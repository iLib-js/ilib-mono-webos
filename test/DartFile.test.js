/*
 * DartFile.test.js - test the Dart file handler object.
 *
 * Copyright (c) 2023, JEDLSoft
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

        var d = new DartFile({project: p});
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
        debugger;
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
    });/*
    test("DartFileParseSimpleSingleQuotes", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse("$L('This is a test')");

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });
    test("DartFileParseSimpleSingleQuotesByKeyValue1", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse("$L({key:'speaker_channel', value:'Channel'})");

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Channel");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Channel");
        expect(r.getKey()).toBe("speaker_channel");
    });
    test("DartFileParseSimpleSingleQuotesByKeyValue2", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse("$L({value:'Channel', key:'speaker_channel'})");

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Channel");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Channel");
        expect(r.getKey()).toBe("speaker_channel");
    });
    test("DartFileParseSimpleSingleQuotesByKeyValue3", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse("$L({key: 'speaker_channel', value: 'Channel'})");

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Channel");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Channel");
        expect(r.getKey()).toBe("speaker_channel");
    });
    test("DartFileParseSimpleSingleQuotesByKeyValue4", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse("$L( { key:  'speaker_channel', value:   'Channel' } )");

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Channel");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Channel");
        expect(r.getKey()).toBe("speaker_channel");
    });
    test("DartFileParseJSSimpleSingleQuotes", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse("RB.getStringJS('This is a test')");

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });
    test("DartFileParseMoreComplexSingleQuotes", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse("if (subcat == 'Has types') {title = RB.getString('Types of {topic}').format({topic: topic.attribute.name})}");

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Types of {topic}");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Types of {topic}");
        expect(r.getKey()).toBe("Types of {topic}");
    });
    test("DartFileParseSimpleIgnoreWhitespace", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('   rb.getString  (    \t "This is a test"    );  ');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });
    test("DartFileParseSimpleIgnoreWhitespace2", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: "./js/t1.js",
            type: dft
        });
        expect(d).toBeTruthy();
        d.extract();
        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Go to  'Settings > General > Channels > Channel Tuning & Settings > Transponder Edit' and add one.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Go to  'Settings > General > Channels > Channel Tuning & Settings > Transponder Edit' and add one.");
        expect(r.getKey()).toBe("Go to 'Settings > General > Channels > Channel Tuning & Settings > Transponder Edit' and add one.");
    });
    test("DartFileParseJSCompressWhitespaceInKey", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('RB.getStringJS("\t\t This \n \n is \n\t a    test")');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("\t\t This \n \n is \n\t a    test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("\t\t This \n \n is \n\t a    test");
        expect(r.getKey()).toBe(" This is a test");
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

        d.parse('RB.getString("This is a test")');

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

        d.parse('\tRB.getString("This is a test"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');

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

        d.parse("\trb.getString('This is a test'); // i18n: this is a translator\'s comment\n\tfoo('This is not');");

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
            '    rb.getString(\'We\\\'ll notify you when {prefix}{last_name} accepts you as a friend!\').format({\n' +
            '        prefix: detail.name_prefix,\n' +
            '        last_name: detail.last_name\n' +
            '    });'
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

        d.parse(
            '    rb.getString("We\\"ll notify you when {prefix}{last_name} accepts you as a friend!").format({\n' +
            '        prefix: detail.name_prefix,\n' +
            '        last_name: detail.last_name\n' +
            '    });'
        );

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

        d.parse('\trb.getString("This is a test", "foobar"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');

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

        d.parse('RB.getString("This is a test", "unique_id")');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "unique_id"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("unique_id");
    });
    test("DartFileParseJSWithKey", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('RB.getStringJS("This is a test", "unique_id")');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "unique_id"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("unique_id");
    });
    test("DartFileParseWithKeySingleQuotes", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse("RB.getString('This is a test', 'unique_id')");

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "unique_id"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("unique_id");
    });
    test("DartFileParseJSWithKeySingleQuotes", function() {
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse("RB.getStringJS('This is a test', 'unique_id')");

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "unique_id"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("unique_id");
    });
    test("DartFileParseWithKeyCantGetBySource", function() {
        expect.assertions(3);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('RB.getString("This is a test", "unique_id")');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(!r).toBeTruthy();
    });
    test("DartFileParseMultiple", function() {
        expect.assertions(8);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test");');

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

        d.parse('RB.getString("This is a test", "x");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "y");');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "x"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(!r[0].getAutoKey()).toBeTruthy();
        expect(r[0].getKey()).toBe("x");

        r = set.getBy({
            reskey: "y"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(!r[0].getAutoKey()).toBeTruthy();
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

        d.parse('RB.getString("This is a test"), RB.getString("This is a second test"), RB.getString("This is a third test")');

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

        d.parse('RB.getString("This is a test");   // i18n: foo\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test");\t// i18n: bar');

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

        d.parse('RB.getString("This is a test", "asdf");   // i18n: foo\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test", "kdkdkd");\t// i18n: bar');

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

        d.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test");');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");

        expect(set.size()).toBe(1);
    });
    test("DartFileParseDupsDifferingByKeyOnly", function() {
        expect.assertions(8);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "unique_id");');

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");

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

        d.parse('RB.getString("This is a test" + " and this isnt");');

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

        d.parse('RB.getString("This is a test" + foobar);');

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

        d.parse('RB.getString(foobar);');

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

        d.parse('RB.getString();');

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

        d.parse('EPIRB.getString("This is a test");');

        var set = d.getTranslationSet();
        expect(set.size()).toBe(1);
    });
    test("DartFileParseSubobject", function() {
        expect.assertions(2);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('App.RB.getString("This is a test");');

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
            "        var subcats = [RB.getStringJS('Personal'), RB.getStringJS('Smart Watches')];\n" +
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

        d.parse("var subcats = [RB.getStringJS(''), RB.getString(''), RB.getStringJS('', 'foo'), RB.getStringJS('foo', '')];\n");

        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });
    test("DartFileExtractFile", function() {
        expect.assertions(8);

        var d = new DartFile({
            project: p,
            pathName: "./js/t1.js",
            type: dft
        });
        expect(d).toBeTruthy();

        // should read the file
        d.extract();
        var set = d.getTranslationSet();
        expect(set.size()).toBe(9);

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");

        var r = set.getBy({
            reskey: "id1"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test with a unique id");
        expect(r[0].getKey()).toBe("id1");
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
        expect.assertions(5);

        var d = new DartFile({
            project: p,
            pathName: "./js/t2.js",
            type: dft
        });
        expect(d).toBeTruthy();

        // should attempt to read the file and not fail
        d.extract();

        var set = d.getTranslationSet();
        expect(set.size()).toBe(11);


        var r = set.getBySource("Track");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Track");
        expect(r.getKey()).toBe("music_track");
    });
    test("DartPseudoLocalization1", function() {
        expect.assertions(4);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('rb.getStringJS("This is a test")');
        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();

        var rb = new RegularPseudo({
            type: "Dart"
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

        d.parse('rb.getStringJS("This is a test")');
        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();

        var rb = new RegularPseudo({
            type: "Dart",
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

        d.parse('rb.getStringJS("This is a test")');
        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();

        var rb = new RegularPseudo({
            type: "Dart",
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

        d.parse('rb.getStringJS("This is a test")');
        var set = d.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();

        var rb = new RegularPseudo({
            type: "Dart",
            targetLocale: "zxx-Hebr-XX"
        });
        var rs2 = r.generatePseudo("zxx-Hebr-XX", rb);
        expect(rs2.getTarget()).toBe('[טהִס ִס ַ טֶסט6543210]');
    });
    test("DartFileTest4", function() {
        expect.assertions(2);

        var d = new DartFile({
            project: p,
            pathName: "./js/t4.js",
            type: dft
        });
        expect(d).toBeTruthy();

        // should attempt to read the file and not fail
        d.extract();

        var set = d.getTranslationSet();
        expect(set.size()).toBe(4);
    });
    test("DartFileNotParseComment", function() {
        expect.assertions(2);

        var d = new DartFile({
            project: p,
            pathName: undefined,
            type: dft
        });
        expect(d).toBeTruthy();

        d.parse('// $L("This is a test"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');

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

        d.parse('$L("This is a test"); // i18n: this is a translator\'s comment\n\t$L("This is a test2");foo("This is not");');

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
    });*/
});