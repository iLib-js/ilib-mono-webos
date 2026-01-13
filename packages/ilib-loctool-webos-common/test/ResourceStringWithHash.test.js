/*
 * ResourceStringWithHash.test.js - 
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

var ResourceString = require("loctool/lib/ResourceString");
var ResourceStringWithHash = require("../ResourceStringWithHash");
var utils = require("loctool/lib/utils");

describe("ResourceStringWithHash", function() {
   test("ResourceStringWithHashConstructorEmpty", function() {
        expect.assertions(1);

        var rsh = new ResourceStringWithHash();
        expect(rsh).toBeTruthy();
    });
    test("ResourceStringWithHashConstructorNoProps", function() {
        expect.assertions(1);

        var rsh = new ResourceStringWithHash({});
        expect(rsh).toBeTruthy();
    })

    test("ResourceStringWithHashConstructor", function() {
        expect.assertions(1);

        var rsh = new ResourceStringWithHash({
            key: "asdf",
            source: "This is a test",
            sourceLocale: "de-DE",
            pathName: "a/b/c.js"
        });
        expect(rsh).toBeTruthy();
    });

    test("ResourceStringWithHashConstructorWithSourceAndTarget", function() {
        expect.assertions(1);

        var rsh = new ResourceStringWithHash({
            key: "asdf",
            source: "This is a test",
            sourceLocale: "en-US",
            pathName: "a/b/c.js",
            target: "Dies ist einen Test.",
            targetLocale: "de-DE"
        });
        expect(rsh).toBeTruthy();
    });

    test("ResourceStringWithHashKeyWithSpaces", function() {
        expect.assertions(2);

        var rsh = new ResourceStringWithHash({
            project: "iosapp",
            key: "Good     Morning ",
            source: "Good     Morning ",
            sourceLocale: "en-US",
            target: "Guten Morgen.",
            targetLocale: "de-DE",
            pathName: "a/b/c.js",
            datatype: "html"
        });
        expect(rsh).toBeTruthy();

        expect(rsh.hashKey()).toBe("rsh_iosapp_de-DE_Good     Morning _html__r561082449");
    });

    test("ResourceStringWithHashConstructorRightContents", function() {
        expect.assertions(7);

        var rsh = new ResourceStringWithHash({
            key: "asdf",
            source: "This is a test",
            sourceLocale: "de-DE",
            pathName: "a/b/c.js"
        });
        expect(rsh).toBeTruthy();

        expect(rsh.getKey()).toBe("asdf");
        expect(rsh.getSource()).toBe("This is a test");
        expect(rsh.getSourceLocale()).toBe("de-DE");
        expect(rsh.pathName).toBe("a/b/c.js");
        expect(rsh.getTarget()).toBeFalsy(); // source-only string
        expect(rsh.getTargetLocale()).toBeFalsy();
    });

    test("ResourceStringWithHashCleanHashKey", function() {
        expect.assertions(2);

        var rsh = new ResourceStringWithHash({
            project: "iosapp",
            key: "Good     Morning ",
            source: "Good     Morning ",
            sourceLocale: "en-US",
            target: "Guten Morgen.",
            targetLocale: "de-DE",
            pathName: "a/b/c.js",
            datatype: "html"
        });
        expect(rsh).toBeTruthy();

        expect(rsh.cleanHashKey()).toBe("rsh_iosapp_de-DE_Good Morning _html__r561082449");
    });
    
    test("ResourceStringWithHashConstructorRightContents", function() {
        expect.assertions(7);

        var rsh = new ResourceStringWithHash({
            key: "asdf",
            source: "This is a test",
            sourceLocale: "de-DE",
            pathName: "a/b/c.js"
        });
        expect(rsh).toBeTruthy();

        expect(rsh.getKey()).toBe("asdf");
        expect(rsh.getSource()).toBe("This is a test");
        expect(rsh.getSourceLocale()).toBe("de-DE");
        expect(rsh.pathName).toBe("a/b/c.js");
        expect(rsh.getTarget()).toBeFalsy(); // source-only string
        expect(rsh.getTargetLocale()).toBeFalsy();
    });

    test("ResourceStringWithHashConstructorSourceTargetRightContents", function() {
        expect.assertions(7);

        var rsh = new ResourceStringWithHash({
            key: "asdf",
            source: "This is a test",
            sourceLocale: "en-US",
            pathName: "a/b/c.js",
            target: "Dies ist einen Test.",
            targetLocale: "de-DE"
        });
        expect(rsh).toBeTruthy();

        expect(rsh.getKey()).toBe("asdf");
        expect(rsh.getSource()).toBe("This is a test");
        expect(rsh.sourceLocale).toBe("en-US");
        expect(rsh.pathName).toBe("a/b/c.js");
        expect(rsh.getTarget()).toBe("Dies ist einen Test.");
        expect(rsh.getTargetLocale()).toBe("de-DE");
    });

    test("ResourceStringWithHashConstructorDefaults", function() {
        expect.assertions(6);

        var rsh = new ResourceStringWithHash({
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.js"
        });
        expect(rsh).toBeTruthy();

        // got the right one?
        expect(rsh.getKey()).toBe("asdf");

        // now the defaults
        expect(rsh.sourceLocale).toBe("en-US");
        expect(rsh.origin).toBe("source");
        expect(rsh.datatype).toBe("plaintext");
        expect(rsh.resType).toBe("string");
    });

    test("ResourceStringWithHashGetKey", function() {
        expect.assertions(2);

        var rsh = new ResourceStringWithHash({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(rsh).toBeTruthy();
        expect(rsh.getKey()).toBe("foo");
    });

    test("ResourceStringWithHashAutoKey", function() {
        expect.assertions(2);

        var rsh = new ResourceStringWithHash({
            key: "foo",
            source: "source string",
            autoKey: true,
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(rsh).toBeTruthy();
        expect(rsh.getAutoKey()).toBeTruthy();
    });

    test("ResourceStringWithHashNotAutoKey", function() {
        expect.assertions(2);

        var rsh = new ResourceStringWithHash({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(rsh).toBeTruthy();
        expect(!rsh.getAutoKey()).toBeTruthy();
    });

    test("ResourceStringWithHashGetKeyEmpty", function() {
        expect.assertions(2);

        var rsh = new ResourceString();
        expect(rsh).toBeTruthy();
        expect(!rsh.getKey()).toBeTruthy();
    });

    test("ResourceStringWithHashGetContext", function() {
        expect.assertions(2);

        var rsh = new ResourceStringWithHash({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE",
            context: "landscape"
        });
        expect(rsh).toBeTruthy();
        expect(rsh.getContext()).toBe("landscape");
    });

    test("ResourceStringWithHashGetContextEmpty", function() {
        expect.assertions(2);

        var rsh = new ResourceStringWithHash({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(rsh).toBeTruthy();
        expect(!rsh.getContext()).toBeTruthy();
    });

    test("ResourceStringWithHashGetSource", function() {
        expect.assertions(2);

        var rsh = new ResourceStringWithHash({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(rsh).toBeTruthy();
        expect(rsh.getSource()).toBe("source string");
    });

    test("ResourceStringWithHashSize", function() {
        expect.assertions(2);

        var rsh = new ResourceStringWithHash({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });

        expect(rsh).toBeTruthy();
        expect(rsh.size()).toBe(1); // should always be 1
    });

    test("ResourceStringWithHashGetSourceEmpty", function() {
        expect.assertions(2);

        var rsh = new ResourceString();
        expect(rsh).toBeTruthy();
        expect(!rsh.getSource()).toBeTruthy();
    });

    test("ResourceStringWithHashGetMetadata", function() {
        expect.assertions(2);

        var rsh = new ResourceStringWithHash({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE",
            metadata:  {
                "test": "test-abcd"
            }
        });
        expect(rsh).toBeTruthy();
        expect(rsh.getMetadata()).toStrictEqual({"test": "test-abcd"});
    });

    test("ResourceStringWithHashGetMetadata2", function() {
        expect.assertions(2);

        var rsh = new ResourceStringWithHash({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE",
        });
        expect(rsh).toBeTruthy();
        expect(rsh.getMetadata()).toBeFalsy();
    });

    test("ResourceStringWithHashSetMetadata", function() {
        expect.assertions(2);

        var rsh = new ResourceStringWithHash({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE",
            metadata:{}
        });
        expect(rsh).toBeTruthy();
        rsh.setMetadata({"test": "test-xyz"});
        expect(rsh.getMetadata()).toStrictEqual({"test": "test-xyz"});
    });

    test("ResourceStringWithHashClone", function() {
        expect.assertions(10);

        var rsh = new ResourceStringWithHash({
            project: "foo",
            context: "blah",
            targetLocale: "de-DE",
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.js",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rsh).toBeTruthy();

        var rsh2 = rsh.clone();

        expect(rsh2).toBeTruthy();
        expect(rsh2.project).toBe(rsh.project);
        expect(rsh2.context).toBe(rsh.context);
        expect(rsh2.sourceLocale).toBe(rsh.sourceLocale);
        expect(rsh2.reskey).toBe(rsh.reskey);
        expect(rsh2.getSource()).toStrictEqual(rsh.getSource());
        expect(rsh2.pathName).toBe(rsh.pathName);
        expect(rsh2.comment).toBe(rsh.comment);
        expect(rsh2.state).toBe(rsh.state);
    });

    test("ResourceStringWithHashStaticHashKey", function() {
        expect.assertions(1);
        var sourceHash = utils.hashKey("This is a test");
        expect(ResourceStringWithHash.hashKey("webapp", "de-DE", "This is a test", "javascript", undefined, sourceHash)).toBe("rsh_webapp_de-DE_This is a test_javascript__r654479252");
    });

    test("ResourceStringWithHashStaticHashKeyMissingParts", function() {
        expect.assertions(1);

        expect(ResourceStringWithHash.hashKey(undefined, "de-DE", undefined, undefined)).toBe("rsh__de-DE____");
    });

    test("ResourceStringWithHashHashKey", function() {
        expect.assertions(2);

        var rsh = new ResourceStringWithHash({
            project: "webapp",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Dies ist einen Test.",
            targetLocale: "de-DE",
            pathName: "a/b/c.js",
            datatype: "javascript"
        });
        expect(rsh).toBeTruthy();
        expect(rsh.hashKey()).toBe("rsh_webapp_de-DE_This is a test_javascript__r654479252");
    });

    test("ResourceStringWithHashHashKeyMultiSpaces", function() {
        expect.assertions(3);

        var rsh = new ResourceStringWithHash({
            project: "webapp",
            key: "This is a test  ",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Dies ist einen Test.",
            targetLocale: "de-DE",
            pathName: "a/b/c.js",
            datatype: "javascript"
        });
        expect(rsh).toBeTruthy();
        expect(rsh.hashKey()).toBe("rsh_webapp_de-DE_This is a test  _javascript__r654479252");
        expect(rsh.cleanHashKey()).toBe("rsh_webapp_de-DE_This is a test _javascript__r654479252");
    });

});