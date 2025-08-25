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
});