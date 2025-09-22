/*
 * webOSXliff.test.js - test the webOS xliff object.
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


import webOSXliff from "../src/webOSXliff.js";
import TranslationUnit from "../src/TranslationUnit.js";

describe("webOSXliff", () => {
    test("should create webOSXliffinstance", () => {
        expect.assertions(1);
        var x = new webOSXliff();
        expect(x).toBeTruthy();
    });
    test("should create empty webOSXliff instance", () => {
        expect.assertions(2);
        var x = new webOSXliff({version: "2.0"});
        expect(x).toBeTruthy();
        expect(x.size()).toBe(0);
    });
    test("should handle numeric version 2.0", () => {
        expect.assertions(2);
        var x = new webOSXliff({version: 2.0});
        expect(x).toBeTruthy();
        expect(x.size()).toBe(0);
    });
    test('should get default lines count', () => {
        const x = new webOSXliff();
        expect(x).toBeTruthy();

        // default value
        expect(x.getLines()).toBe(0);
    });
    test('should get default bytes count', () => {
        const x = new webOSXliff();
        expect(x).toBeTruthy();

        // default value
        expect(x.getBytes()).toBe(0);
    });
    test("should create webOSXliff instance with configuration", () => {
        expect.assertions(5);
        var x = new webOSXliff({
            version: "2.0",
            style: "webOS",
            sourceLocale: "en-KR",
            path: "a/b/ko-KR.xliff"
        });
        expect(x).toBeTruthy();
        expect(x.getVersion()).toBe(2.0);
        expect(x["style"]).toBe("webOS");
        expect(x.sourceLocale).toBe("en-KR");
        expect(x.path).toBe("a/b/ko-KR.xliff");
    });
    test("should add translation unit to webOS  xliff", () => {
        expect.assertions(11);
        const x = new webOSXliff();
        expect(x).toBeTruthy();

        let tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-KR",
            key: "foobar",
            file: "foo/bar/asdf.js",
            project: "webapp",
            resType: "string",
            state: "new",
            comment: "This is a comment",
            datatype: "javascript"
        });

        x.addTranslationUnit(tu);

        const tulist = x.getTranslationUnits();

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);
        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-KR");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.js");
        expect(tulist[0].state).toBe("new");
        expect(tulist[0].comment).toBe("This is a comment");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].datatype).toBe("javascript");
    });
    test("should add multiple translation units to webOS  xliff", () => {
        expect.assertions(19);
        const x = new webOSXliff();
        expect(x).toBeTruthy();

        let tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-KR",
            key: "foobar",
            file: "foo/bar/asdf.js",
            project: "webapp",
            resType: "string",
            state: "new",
            comment: "This is a comment",
            datatype: "javascript"
        });

        x.addTranslationUnit(tu);

        tu = new TranslationUnit({
            source: "foobar",
            sourceLocale: "en-KR",
            key: "asdf",
            file: "x.js",
            project: "webapp",
            resType: "array",
            state: "translated",
            comment: "No comment",
            datatype: "javascript"
        });

        x.addTranslationUnit(tu);

        const tulist = x.getTranslationUnits();

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);
        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-KR");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.js");
        expect(tulist[0].state).toBe("new");
        expect(tulist[0].comment).toBe("This is a comment");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].datatype).toBe("javascript");

        expect(tulist[1].source).toBe("foobar");
        expect(tulist[1].sourceLocale).toBe("en-KR");
        expect(tulist[1].key).toBe("asdf");
        expect(tulist[1].file).toBe("x.js");
        expect(tulist[1].state).toBe("translated");
        expect(tulist[1].comment).toBe("No comment");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].datatype).toBe("javascript");
    });
    test("should handle adding same translation unit twice in webOS  xliff", () => {
        expect.assertions(11);
        const x = new webOSXliff();
        expect(x).toBeTruthy();

        let tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-KR",
            key: "foobar",
            file: "foo/bar/asdf.js",
            project: "webapp",
            resType: "string",
            state: "new",
            comment: "This is a comment",
            datatype: "javascript"
        });

        x.addTranslationUnit(tu);
        x.addTranslationUnit(tu); // second time should not add anything

        const tulist = x.getTranslationUnits();

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);
        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-KR");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.js");
        expect(tulist[0].state).toBe("new");
        expect(tulist[0].comment).toBe("This is a comment");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].datatype).toBe("javascript");
    });
    test('should add translation unit with same TU twice without duplication in webOS  xliff', () => {
        const x = new webOSXliff();
        expect(x).toBeTruthy();

        let tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-KR",
            key: "foobar",
            file: "foo/bar/asdf.js",
            project: "webapp",
            resType: "string",
            state: "new",
            comment: "This is a comment",
            datatype: "javascript"
        });

        x.addTranslationUnit(tu);
        x.addTranslationUnit(tu); // second time should not add anything

        const tulist = x.getTranslationUnits();

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);
        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-KR");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.js");
        expect(tulist[0].state).toBe("new");
        expect(tulist[0].comment).toBe("This is a comment");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].datatype).toBe("javascript");
    });
    test('should add multiple translation units at once to webOS  xliff', () => {
        const x = new webOSXliff();
        expect(x).toBeTruthy();

        x.addTranslationUnits([
            new TranslationUnit({
                source: "Asdf asdf",
                sourceLocale: "en-KR",
                key: "foobar",
                file: "foo/bar/asdf.js",
                project: "webapp",
                resType: "string",
                state: "new",
                comment: "This is a comment",
                datatype: "javascript"
            }),
            new TranslationUnit({
                source: "foobar",
                sourceLocale: "en-KR",
                key: "asdf",
                file: "x.js",
                project: "webapp",
                resType: "array",
                state: "translated",
                comment: "No comment",
                datatype: "javascript"
            })
        ]);

        const tulist = x.getTranslationUnits();

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);
        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-KR");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.js");
        expect(tulist[0].state).toBe("new");
        expect(tulist[0].comment).toBe("This is a comment");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].datatype).toBe("javascript");

        expect(tulist[1].source).toBe("foobar");
        expect(tulist[1].sourceLocale).toBe("en-KR");
        expect(tulist[1].key).toBe("asdf");
        expect(tulist[1].file).toBe("x.js");
        expect(tulist[1].state).toBe("translated");
        expect(tulist[1].comment).toBe("No comment");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].datatype).toBe("javascript");
    });
    test('should return correct size of translation units in webOS  xliff', () => {
        const x = new webOSXliff();
        expect(x).toBeTruthy();
        expect(x.size()).toBe(0);

        x.addTranslationUnits([
            new TranslationUnit({
                source: "Asdf asdf",
                sourceLocale: "en-KR",
                key: "foobar",
                file: "foo/bar/asdf.js",
                project: "webapp",
                resType: "string",
                state: "new",
                comment: "This is a comment",
                datatype: "javascript"
            }),
            new TranslationUnit({
                source: "foobar",
                sourceLocale: "en-KR",
                key: "asdf",
                file: "x.javascript",
                project: "webapp",
                resType: "array",
                state: "translated",
                comment: "No comment",
                datatype: "javascript"
            })
        ]);
        expect(x.size()).toBe(2);
    });
    test('should serialize XLIFF 2.0 with source only', () => {
        const x = new webOSXliff();
        expect(x).toBeTruthy();

        const tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-KR",
            key: "foobar",
            file: "foo/bar/asdf.js",
            project: "webapp",
            resType: "string",
            state: "new",
            comment: "This is a comment",
            datatype: "javascript"
        });

        x.addTranslationUnit(tu);

        let actual = x.serialize();
        let expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" version="2.0">\n' +
            '  <file id="webapp_f1" original="webapp">\n' +
            '    <group id="webapp_g1" name="javascript">\n' +
            '      <unit id="webapp_g1_1" name="foobar">\n' +
            '        <notes>\n' +
            '          <note>This is a comment</note>\n' +
            '        </notes>\n' +
            '        <segment>\n' +
            '          <source>Asdf asdf</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '</xliff>';

        expect(actual).toBe(expected);
    });
    test('should serialize XLIFF 2.0 with source and target', () => {
        const x = new webOSXliff();
        expect(x).toBeTruthy();

        const tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-KR",
            target: "bam bam",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.js",
            project: "webapp",
            resType: "string",
            comment: "This is a comment",
            datatype: "javascript"
        });

        x.addTranslationUnit(tu);

        let actual = x.serialize();
        let expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="de-DE" version="2.0">\n' +
            '  <file id="webapp_f1" original="webapp">\n' +
            '    <group id="webapp_g1" name="javascript">\n' +
            '      <unit id="webapp_g1_1" name="foobar">\n' +
            '        <notes>\n' +
            '          <note>This is a comment</note>\n' +
            '        </notes>\n' +
            '        <segment>\n' +
            '          <source>Asdf asdf</source>\n' +
            '          <target>bam bam</target>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '</xliff>';

        expect(actual).toBe(expected);
    });
    test('should serialize with metadata', () => {
        const x = new webOSXliff();
        expect(x).toBeTruthy();
        const tu = new TranslationUnit({
            source: "NOT AVAILABLE",
            sourceLocale: "en-KR",
            target: "이용이 불가능합니다",
            targetLocale: "ko-KR",
            key: "NOT AVAILABLE",
            file: "foo/bar/asdf.js",
            project: "webapp",
            resType: "string",
            datatype: "javascript"
        });
        tu.metadata = {
            "mda:metaGroup": {
                "mda:meta": [
                    {
                        "_attributes" : {"type": "Monitor"},
                        "_text": "\"Monitor\" 이용이 불가능합니다"
                    },
                    {
                        "_attributes" : {"type": "Box"},
                        "_text": "\"Box\" 이용이 불가능합니다"
                    },
                    {
                        "_attributes" : {"type": "SoundBar"},
                        "_text": "\"SoundBar\" 이용이 불가능합니다"
                    }
                ],
                "_attributes": {
                    "category": "device-type"
                }
            }
        }

        x.addTranslationUnit(tu);

        let actual = x.serialize();
        let expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" ' +
            'xmlns:mda="urn:oasis:names:tc:xliff:metadata:2.0" ' +
            'srcLang="en-KR" trgLang="ko-KR" version="2.0">\n' +
            '  <file id="webapp_f1" original="webapp">\n' +
            '    <group id="webapp_g1" name="javascript">\n' +
            '      <unit id="webapp_g1_1">\n' +
            '        <mda:metadata>\n' +
            '          <mda:metaGroup category="device-type">\n' +
            '            <mda:meta type="Monitor">"Monitor" 이용이 불가능합니다</mda:meta>\n' +
            '            <mda:meta type="Box">"Box" 이용이 불가능합니다</mda:meta>\n' +
            '            <mda:meta type="SoundBar">"SoundBar" 이용이 불가능합니다</mda:meta>\n' +
            '          </mda:metaGroup>\n' +
            '        </mda:metadata>\n' +
            '        <segment>\n' +
            '          <source>NOT AVAILABLE</source>\n' +
            '          <target>이용이 불가능합니다</target>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '</xliff>';

        expect(actual).toBe(expected);
    });
    test('should get lines count after deserialization', () => {
        const x = new webOSXliff();
        expect(x).toBeTruthy();
        expect(x.getLines()).toBe(0);

        x.deserialize(
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="de-DE" version="2.0">\n' +
        '  <file id="sample_f1" original="sample">\n' +
        '      <group id="sample_g1" name="c">\n' +
        '        <unit id="sample_g1_1">\n' +
        '          <segment>\n' +
        '            <source>Asdf asdf</source>\n' +
        '            <target>foobarfoo</target>\n' +
        '          </segment>\n' +
        '        </unit>\n' +
        '      </group>\n' +
        '  </file>\n' +
        '</xliff>');

        expect(x.getLines()).toBe(13);
    });
    test('should get lines count after serialization', () => {
        const x = new webOSXliff();
        expect(x).toBeTruthy();

        expect(x.getLines()).toBe(0);

        x.addTranslationUnits([
            new TranslationUnit({
                source: "Asdf asdf",
                sourceLocale: "en-US",
                target: "Asdf",
                targetLocale: "de-DE",
                key: 'foobar asdf',
                file: "foo/bar/asdf.java",
                project: "androidapp",
                origin: "target",
                datatype: "plaintext"
            }),
            new TranslationUnit({
                source: "baby baby",
                sourceLocale: "en-US",
                target: "baby",
                targetLocale: "de-DE",
                key: "huzzah asdf test",
                file: "foo/bar/j.java",
                project: "webapp",
                origin: "target",
                datatype: "plaintext"
            })
        ]);

        let actual = x.serialize();
        expect(actual).toBeTruthy();
        expect(x.getLines()).toBe(23);
    });
    test('should get bytes count after deserialization', () => {
        const x = new webOSXliff();
        expect(x).toBeTruthy();

        expect(x.getBytes()).toBe(0);

        x.deserialize(
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="de-DE" version="2.0">\n' +
        '  <file id="sample_f1" original="sample">\n' +
        '      <group id="sample_g1" name="c">\n' +
        '        <unit id="sample_g1_1">\n' +
        '          <segment>\n' +
        '            <source>Asdf asdf</source>\n' +
        '            <target>foobarfoo</target>\n' +
        '          </segment>\n' +
        '        </unit>\n' +
        '      </group>\n' +
        '  </file>\n' +
        '</xliff>');

        expect(x.getBytes()).toBe(419);
    });
    test('should get bytes count after serialization', () => {
        const x = new webOSXliff();
        expect(x).toBeTruthy();

        expect(x.getBytes()).toBe(0);

        x.addTranslationUnits([
            new TranslationUnit({
                source: "Asdf asdf",
                sourceLocale: "en-US",
                target: "Asdf",
                targetLocale: "de-DE",
                key: 'foobar asdf',
                file: "foo/bar/asdf.java",
                project: "androidapp",
                origin: "target",
                datatype: "plaintext"
            }),
            new TranslationUnit({
                source: "baby baby",
                sourceLocale: "en-US",
                target: "baby",
                targetLocale: "de-DE",
                key: "huzzah asdf test",
                file: "foo/bar/j.java",
                project: "webapp",
                origin: "target",
                datatype: "plaintext"
            })
        ]);

        let actual = x.serialize();
        expect(actual).toBeTruthy();
        expect(x.getBytes()).toBe(724);
    });
    test('should deserialize webOS XLIFF', () => {
        const x = new webOSXliff();
        expect(x).toBeTruthy();

        x.deserialize(
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="de-DE" version="2.0">\n' +
        '  <file id="sample_f1" original="sample">\n' +
        '      <group id="sample_g1" name="c">\n' +
        '        <unit id="sample_g1_1">\n' +
        '          <segment>\n' +
        '            <source>Asdf asdf</source>\n' +
        '            <target>foobarfoo</target>\n' +
        '          </segment>\n' +
        '        </unit>\n' +
        '      </group>\n' +
        '  </file>\n' +
        '</xliff>');

        let tulist = x.getTranslationUnits();
        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-KR");
        expect(tulist[0].targetLocale).toBe("de-DE");
        expect(tulist[0].key).toBe("Asdf asdf");
        expect(tulist[0].target).toBe("foobarfoo");
    });
    test('should deserialize XLIFF 2.0 with resfile', () => {
        const x = new webOSXliff();
        expect(x).toBeTruthy();

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="de-DE" version="2.0">\n' +
                '  <file id="sample1_f1" original="sample1">\n' +
                '    <group id="sample1_g1" name="c">\n' +
                '      <unit id="sample1_g1_1" name="foobar">\n' +
                '        <segment>\n' +
                '          <source>Asdf asdf</source>\n' +
                '          <target>foobarfoo</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '  <file id="sample2_f2" original="sample2">\n' +
                '    <group id="sample2_g2" name="c">\n' +
                '      <unit id="sample2_g2_1" name="huzzah">\n' +
                '        <segment>\n' +
                '          <source>baby baby</source>\n' +
                '          <target>bebe bebe</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>', "a/b/c/resfile.xliff");

        let tulist = x.getTranslationUnits();

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);

        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-KR");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("sample1");
        expect(tulist[0].project).toBe("sample1");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("sample1_g1_1");
        expect(tulist[0].target).toBe("foobarfoo");
        expect(tulist[0].targetLocale).toBe("de-DE");
        expect(tulist[0].resfile).toBe("a/b/c/resfile.xliff");

        expect(tulist[1].source).toBe("baby baby");
        expect(tulist[1].sourceLocale).toBe("en-KR");
        expect(tulist[1].key).toBe("huzzah");
        expect(tulist[1].file).toBe("sample2");
        expect(tulist[1].project).toBe("sample2");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("sample2_g2_1");
        expect(tulist[1].target).toBe("bebe bebe");
        expect(tulist[1].targetLocale).toBe("de-DE");
        expect(tulist[1].resfile).toBe("a/b/c/resfile.xliff");
    });
    test('should deserialize XLIFF 2.0 with escaped newlines in resname', () => {
        const x = new webOSXliff();
        expect(x).toBeTruthy();

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="en-CA" version="2.0">\n' +
                '  <file id="sample1_f1" original="sample1">\n' +
                '    <group id="sample1_g1" name="javascript">\n' +
                '      <unit id="sample1_g1_1" name="foobar\\nbar\\t">\n' +
                '        <segment>\n' +
                '          <source>a\\nb</source>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '  <file id="sample2_f2" original="sample2">\n' +
                '    <group id="sample2_g2" name="javascript">\n' +
                '      <unit id="sample2_g2_1" name="huzzah\\n\\na plague on both your houses">\n' +
                '        <segment>\n' +
                '          <source>e\\nh</source>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>');

        let tulist = x.getTranslationUnits();

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);

        expect(tulist[0].source).toBe("a\\nb");
        expect(tulist[0].sourceLocale).toBe("en-KR");
        expect(tulist[0].key).toBe("foobar\\nbar\\t");
        expect(tulist[0].file).toBe("sample1");
        expect(tulist[0].project).toBe("sample1");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("sample1_g1_1");

        expect(tulist[1].source).toBe("e\\nh");
        expect(tulist[1].sourceLocale).toBe("en-KR");
        expect(tulist[1].key).toBe("huzzah\\n\\na plague on both your houses");
        expect(tulist[1].file).toBe("sample2");
        expect(tulist[1].project).toBe("sample2");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("sample2_g2_1");
    });
    test('should deserialize XLIFF 2.0 with empty source', () => {
        const x = new webOSXliff();
        expect(x).toBeTruthy();

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="fr-FR" version="2.0">\n' +
                '  <file id="sample1_f1" original="sample1">\n' +
                '    <group id="sample1_g1" name="javascript">\n' +
                '      <unit id="sample1_g1_1" name="foobar">\n' +
                '        <segment>\n' +
                '          <source></source>\n' +
                '          <target>Baby Baby</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '  <file id="sample2_f2" original="sample2">\n' +
                '    <group id="sample2_g2" name="javascript">\n' +
                '      <unit id="sample2_g2_1" name="huzzah">\n' +
                '        <segment>\n' +
                '          <source>baby baby</source>\n' +
                '          <target>bebe bebe</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>');

        let tulist = x.getTranslationUnits();

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].source).toBe("baby baby");
        expect(tulist[0].sourceLocale).toBe("en-KR");
        expect(tulist[0].key).toBe("huzzah");
        expect(tulist[0].file).toBe("sample2");
        expect(tulist[0].project).toBe("sample2");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("sample2_g2_1");

        expect(tulist[0].target).toBe("bebe bebe");
        expect(tulist[0].targetLocale).toBe("fr-FR");
    });

    test('should deserialize XLIFF 2.0 with empty target', () => {
        const x = new webOSXliff();
        expect(x).toBeTruthy();

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-KR" trgLang="fr-FR" version="2.0">\n' +
                '  <file id="sample1_f1" original="sample1">\n' +
                '    <group id="sample1_g1" name="javascript">\n' +
                '      <unit id="sample1_g1_1" name="foobar">\n' +
                '        <segment>\n' +
                '          <source>Asdf asdf</source>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '  <file id="sample2_f2" original="sample2">\n' +
                '    <group id="sample2_g1" name="javascript">\n' +
                '      <unit id="sample2_g2_1" name="huzzah">\n' +
                '        <segment>\n' +
                '          <source>baby baby</source>\n' +
                '          <target></target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>');

        let tulist = x.getTranslationUnits();

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);

        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-KR");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("sample1");
        expect(tulist[0].project).toBe("sample1");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("sample1_g1_1");
        expect(tulist[0].target).toBe("");

        expect(tulist[1].source).toBe("baby baby");
        expect(tulist[1].sourceLocale).toBe("en-KR");
        expect(tulist[1].key).toBe("huzzah");
        expect(tulist[1].file).toBe("sample2");
        expect(tulist[1].project).toBe("sample2");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].target).toBe("");
        expect(tulist[1].id).toBe("sample2_g2_1");
    });
    test('webOSXliffDeserialize_metadata', () => {
        const x = new webOSXliff({
            metadata: {"device-type": "SoundBar"}
        });
        expect(x).toBeTruthy();

        x.deserialize(
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" version="2.0"\n' +
        'xmlns:mda="urn:oasis:names:tc:xliff:metadata:2.0"\n' +
        'srcLang="en-KR" trgLang="ko-KR">\n' +
        '  <file id="sample-webos-c_f1" original="sample-webos-c">\n' +
        '      <group id="sample-webos-c_g1" name="c">\n' +
        '        <unit id="sample-webos-c_g1_1">\n' +
        '          <mda:metadata>\n' +
        '            <mda:metaGroup category="device-type">\n' +
        '              <mda:meta type="Monitor">"Monitor" 이용이 불가능합니다</mda:meta>\n' +
        '              <mda:meta type="Box">"Box" 이용이 불가능합니다</mda:meta>\n' +
        '              <mda:meta type="SoundBar">"SoundBar" 이용이 불가능합니다</mda:meta>\n' +
        '            </mda:metaGroup>\n' +
        '          </mda:metadata>\n' +
        '          <segment>\n' +
        '            <source>NOT AVAILABLE</source>\n' +
        '            <target>이용이 불가능합니다</target>\n' +
        '          </segment>\n' +
        '        </unit>\n' +
        '      </group>\n' +
        '  </file>\n' +
        '</xliff>');

        let tulist = x.getTranslationUnits();
        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        const expectedMetadata = {
            "_position": 344,
            "mda:metaGroup": {
                "_position": 371,
                "mda:meta": [
                    {
                        "_position": 424,
                        "_attributes" : {"type": "Monitor"},
                        "_text": "\"Monitor\" 이용이 불가능합니다"
                    },
                    {
                        "_position": 495,
                        "_attributes" : {"type": "Box"},
                        "_text": "\"Box\" 이용이 불가능합니다"
                    },
                    {
                        "_position": 558,
                        "_attributes" : {"type": "SoundBar"},
                        "_text": "\"SoundBar\" 이용이 불가능합니다"
                    }
                ],
                "_attributes": {
                    "category": "device-type"
                }
            }
        }

        expect(tulist[0].source).toBe("NOT AVAILABLE");
        expect(tulist[0].sourceLocale).toBe("en-KR");
        expect(tulist[0].targetLocale).toBe("ko-KR");
        expect(tulist[0].key).toBe("NOT AVAILABLE");
        expect(tulist[0].target).toBe("이용이 불가능합니다");
        expect(tulist[0].metadata).toStrictEqual(expectedMetadata);
    });
});
