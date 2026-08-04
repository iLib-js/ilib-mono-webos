/*
 * pseudoWriter.test.js - test the pseudoWriter utility
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

var { writePseudoResources } = require("../pseudoWriter.js");

function makePseudoRes(targetLocale, source, target, datatype) {
    var _target = target;
    return {
        reskey: "key1",
        pathName: "file.js",
        datatype: datatype || "javascript",
        getTargetLocale: function() { return targetLocale; },
        getSource: function() { return source; },
        setTarget: function(t) { _target = t; },
        target: target
    };
}

function makePseudo(resources) {
    return { getAll: function() { return resources; } };
}

function makeResFileType() {
    var file = {
        pathName: "out.json",
        addResource: jest.fn()
    };
    return {
        getResourceFile: jest.fn(function() { return file; }),
        file: file
    };
}

describe("writePseudoResources", function() {
    test("writes resource when target differs from source", function() {
        var res = makePseudoRes("ko-KR", "Hello", "안녕");
        var pseudo = makePseudo([res]);
        var resFileType = makeResFileType();
        writePseudoResources(pseudo, {}, "javascript", "javascript", resFileType, "en-US", undefined);
        expect(resFileType.file.addResource).toHaveBeenCalledTimes(1);
    });

    test("skips resource when source equals target", function() {
        var res = makePseudoRes("ko-KR", "Hello", "Hello");
        var pseudo = makePseudo([res]);
        var resFileType = makeResFileType();
        writePseudoResources(pseudo, {}, "javascript", "javascript", resFileType, "en-US", undefined);
        expect(resFileType.file.addResource).not.toHaveBeenCalled();
    });

    test("skips resource when targetLocale equals sourceLocale", function() {
        var res = makePseudoRes("en-US", "Hello", "안녕");
        var pseudo = makePseudo([res]);
        var resFileType = makeResFileType();
        writePseudoResources(pseudo, {}, "javascript", "javascript", resFileType, "en-US", undefined);
        expect(resFileType.file.addResource).not.toHaveBeenCalled();
    });

    test("excludes resources with non-matching datatype", function() {
        var res = makePseudoRes("ko-KR", "Hello", "안녕", "x-dart");
        var pseudo = makePseudo([res]);
        var resFileType = makeResFileType();
        writePseudoResources(pseudo, {}, "javascript", "javascript", resFileType, "en-US", undefined);
        expect(resFileType.file.addResource).not.toHaveBeenCalled();
    });

    test("skips all when disablePseudo is true", function() {
        var res = makePseudoRes("ko-KR", "Hello", "안녕");
        var pseudo = makePseudo([res]);
        var resFileType = makeResFileType();
        writePseudoResources(pseudo, { javascript: { disablePseudo: true } }, "javascript", "javascript",
            resFileType, "en-US", undefined);
        expect(resFileType.file.addResource).not.toHaveBeenCalled();
    });

    test("passes resPath from resPathFn to getResourceFile", function() {
        var res = makePseudoRes("ko-KR", "Hello", "안녕");
        var pseudo = makePseudo([res]);
        var resFileType = makeResFileType();
        var resPathFn = jest.fn(function() { return "some/path.json"; });
        writePseudoResources(pseudo, {}, "javascript", "javascript", resFileType, "en-US", undefined, resPathFn);
        expect(resFileType.getResourceFile).toHaveBeenCalledWith("ko-KR", "some/path.json");
    });

    test("passes undefined resPath when resPathFn omitted", function() {
        var res = makePseudoRes("ko-KR", "Hello", "안녕");
        var pseudo = makePseudo([res]);
        var resFileType = makeResFileType();
        writePseudoResources(pseudo, {}, "javascript", "javascript", resFileType, "en-US", undefined);
        expect(resFileType.getResourceFile).toHaveBeenCalledWith("ko-KR", undefined);
    });

    test("empty pseudo produces no writes", function() {
        var pseudo = makePseudo([]);
        var resFileType = makeResFileType();
        writePseudoResources(pseudo, {}, "javascript", "javascript", resFileType, "en-US", undefined);
        expect(resFileType.file.addResource).not.toHaveBeenCalled();
    });
});
