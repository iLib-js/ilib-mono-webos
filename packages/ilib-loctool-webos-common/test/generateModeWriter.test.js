/*
 * generateModeWriter.test.js - test the generateModeWriter utility
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

var { writeGenerateModeResources } = require("../generateModeWriter.js");

function makeResource(project, datatype, key, locale, flavor) {
    return {
        getProject: function() { return project; },
        getDataType: function() { return datatype; },
        getKey: function() { return key; },
        getTargetLocale: function() { return locale || "ko-KR"; },
        getFlavor: function() { return flavor || undefined; }
    };
}

function makeGenRes(key, source, target, locale) {
    return {
        reskey: key,
        target: target,
        getProject: function() { return "myapp"; },
        getDataType: function() { return "javascript"; },
        getKey: function() { return key; },
        getTargetLocale: function() { return locale || "ko-KR"; },
        getFlavor: function() { return undefined; },
        getSource: function() { return source; },
        setTarget: jest.fn(function(t) { this.target = t; }),
        cleanHashKeyForTranslation: function(l) { return key + "::" + l; },
        clone: function() {
            var copy = makeGenRes(key, source, target, locale);
            copy.setTargetLocale = jest.fn(function(l) { copy._locale = l; copy.getTargetLocale = function() { return l; }; });
            return copy;
        }
    };
}

function makeProject(inheritMap, translationMap) {
    return {
        getProjectId: function() { return "myapp"; },
        getLocaleInherit: function(locale) { return (inheritMap || {})[locale]; },
        getTranslations: function(locales) {
            var map = translationMap || {};
            var result = [];
            locales.forEach(function(l) { if (map[l]) result = result.concat(map[l]); });
            return result;
        }
    };
}

function makeDb(hitMap) {
    return {
        getResourceByCleanHashKey: jest.fn(function(key, cb) {
            cb(null, (hitMap || {})[key] || null);
        })
    };
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

// ── filtering (internal behavior verified through writeGenerateModeResources) ──

describe("writeGenerateModeResources - filtering", function() {
    test("empty resources produces no writes", function() {
        var resFileType = makeResFileType();
        writeGenerateModeResources({
            project: makeProject(),
            translationLocales: ["ko-KR"],
            resources: [],
            selfDatatype: "javascript",
            resFileType: resFileType,
            db: makeDb(),
            deviceType: undefined,
            dedupByBaseTranslation: false,
            includeUniversal: true
        });
        expect(resFileType.file.addResource).not.toHaveBeenCalled();
    });

    test("keeps self-datatype resource", function() {
        var res = makeGenRes("key1", "Hello", "안녕");
        var resFileType = makeResFileType();
        writeGenerateModeResources({
            project: makeProject(undefined, { "ko-KR": [res] }),
            translationLocales: ["ko-KR"],
            resources: [res],
            selfDatatype: "javascript",
            resFileType: resFileType,
            db: makeDb(),
            deviceType: undefined,
            dedupByBaseTranslation: false,
            includeUniversal: true
        });
        expect(resFileType.file.addResource).toHaveBeenCalledTimes(1);
    });

    test("keeps universal resource when self-datatype absent", function() {
        var res = makeGenRes("key1", "Hello", "안녕");
        res.getDataType = function() { return "universal"; };
        var resFileType = makeResFileType();
        writeGenerateModeResources({
            project: makeProject(undefined, { "ko-KR": [res] }),
            translationLocales: ["ko-KR"],
            resources: [res],
            selfDatatype: "javascript",
            resFileType: resFileType,
            db: makeDb(),
            deviceType: undefined,
            dedupByBaseTranslation: false,
            includeUniversal: true
        });
        expect(resFileType.file.addResource).toHaveBeenCalledTimes(1);
    });

    test("excludes universal when includeUniversal is false", function() {
        var res = makeGenRes("key1", "Hello", "안녕");
        res.getDataType = function() { return "universal"; };
        var resFileType = makeResFileType();
        writeGenerateModeResources({
            project: makeProject(undefined, { "ko-KR": [res] }),
            translationLocales: ["ko-KR"],
            resources: [res],
            selfDatatype: "javascript",
            resFileType: resFileType,
            db: makeDb(),
            deviceType: undefined,
            dedupByBaseTranslation: false,
            includeUniversal: false
        });
        expect(resFileType.file.addResource).not.toHaveBeenCalled();
    });

    test("self-datatype wins over universal for same reskey+locale", function() {
        var selfRes = makeGenRes("key1", "Hello", "자체");
        var univRes = makeGenRes("key1", "Hello", "유니버설");
        univRes.getDataType = function() { return "universal"; };
        var resFileType = makeResFileType();
        writeGenerateModeResources({
            project: makeProject(undefined, { "ko-KR": [univRes, selfRes] }),
            translationLocales: ["ko-KR"],
            resources: [univRes, selfRes],
            selfDatatype: "javascript",
            resFileType: resFileType,
            db: makeDb(),
            deviceType: undefined,
            dedupByBaseTranslation: false,
            includeUniversal: true
        });
        expect(resFileType.file.addResource).toHaveBeenCalledTimes(1);
        expect(selfRes.setTarget).toHaveBeenCalled();
    });

    test("excludes resources from other project", function() {
        var res = makeGenRes("key1", "Hello", "안녕");
        res.getProject = function() { return "other"; };
        var resFileType = makeResFileType();
        writeGenerateModeResources({
            project: makeProject(),
            translationLocales: ["ko-KR"],
            resources: [res],
            selfDatatype: "javascript",
            resFileType: resFileType,
            db: makeDb(),
            deviceType: undefined,
            dedupByBaseTranslation: false,
            includeUniversal: true
        });
        expect(resFileType.file.addResource).not.toHaveBeenCalled();
    });

    test("excludes resources with unrelated datatype", function() {
        var res = makeGenRes("key1", "Hello", "안녕");
        res.getDataType = function() { return "x-dart"; };
        var resFileType = makeResFileType();
        writeGenerateModeResources({
            project: makeProject(),
            translationLocales: ["ko-KR"],
            resources: [res],
            selfDatatype: "javascript",
            resFileType: resFileType,
            db: makeDb(),
            deviceType: undefined,
            dedupByBaseTranslation: false,
            includeUniversal: true
        });
        expect(resFileType.file.addResource).not.toHaveBeenCalled();
    });

    test("different flavors are separate entries", function() {
        var res1 = makeGenRes("key1", "Hello", "안녕1", "ko-KR");
        res1.getFlavor = function() { return "flavor1"; };
        res1.getDataType = function() { return "universal"; };
        var res2 = makeGenRes("key1", "Hello", "안녕2", "ko-KR");
        res2.getFlavor = function() { return "flavor2"; };
        res2.getDataType = function() { return "universal"; };
        var resFileType = makeResFileType();
        writeGenerateModeResources({
            project: makeProject(undefined, { "ko-KR": [res1, res2] }),
            translationLocales: ["ko-KR"],
            resources: [res1, res2],
            selfDatatype: "javascript",
            resFileType: resFileType,
            db: makeDb(),
            deviceType: undefined,
            dedupByBaseTranslation: false,
            includeUniversal: true
        });
        expect(resFileType.file.addResource).toHaveBeenCalledTimes(2);
    });
});

// ── write behavior ──────────────────────────────────────────────────────────────

describe("writeGenerateModeResources - write behavior", function() {
    test("write-through (dedupByBaseTranslation=false): writes all resources", function() {
        var res = makeGenRes("key1", "Hello", "안녕");
        var resFileType = makeResFileType();
        writeGenerateModeResources({
            project: makeProject(undefined, { "ko-KR": [res] }),
            translationLocales: ["ko-KR"],
            resources: [res],
            selfDatatype: "javascript",
            resFileType: resFileType,
            db: makeDb(),
            deviceType: undefined,
            dedupByBaseTranslation: false,
            includeUniversal: true
        });
        expect(resFileType.file.addResource).toHaveBeenCalledTimes(1);
    });

    test("dedup (dedupByBaseTranslation=true): writes when translation differs from base", function() {
        var res = makeGenRes("key1", "Hello", "안녕");
        var baseRes = { target: "English" };
        var db = makeDb({ "key1::en": baseRes });
        var resFileType = makeResFileType();
        writeGenerateModeResources({
            project: makeProject(undefined, { "ko-KR": [res] }),
            translationLocales: ["ko-KR"],
            resources: [res],
            selfDatatype: "javascript",
            resFileType: resFileType,
            db: db,
            deviceType: undefined,
            dedupByBaseTranslation: true,
            includeUniversal: true
        });
        expect(resFileType.file.addResource).toHaveBeenCalledTimes(1);
    });

    test("dedup: skips when translation equals source (no base found)", function() {
        var res = makeGenRes("key1", "Hello", "Hello");
        var resFileType = makeResFileType();
        writeGenerateModeResources({
            project: makeProject(undefined, { "ko-KR": [res] }),
            translationLocales: ["ko-KR"],
            resources: [res],
            selfDatatype: "javascript",
            resFileType: resFileType,
            db: makeDb(),
            deviceType: undefined,
            dedupByBaseTranslation: true,
            includeUniversal: true
        });
        expect(resFileType.file.addResource).not.toHaveBeenCalled();
    });

    test("customInherit: clones parent resources for locale with no translations", function() {
        var parentRes = makeGenRes("key1", "Hello", "English", "en-GB");
        parentRes.getProject = function() { return "myapp"; };
        var project = makeProject(
            { "en-AU": "en-GB" },
            { "en-AU": [], "en-GB": [parentRes] }
        );
        project.getProjectId = function() { return "myapp"; };
        var resFileType = makeResFileType();
        writeGenerateModeResources({
            project: project,
            translationLocales: ["en-AU"],
            resources: [],
            selfDatatype: "javascript",
            resFileType: resFileType,
            db: makeDb(),
            deviceType: undefined,
            dedupByBaseTranslation: false,
            includeUniversal: true
        });
        expect(resFileType.file.addResource).toHaveBeenCalledTimes(1);
    });

    test("customInherit: skips clone when locale already has translations", function() {
        var ownRes = makeGenRes("key1", "Hello", "호주영어", "en-AU");
        var project = makeProject(
            { "en-AU": "en-GB" },
            { "en-AU": [ownRes] }
        );
        project.getProjectId = function() { return "myapp"; };
        var resFileType = makeResFileType();
        writeGenerateModeResources({
            project: project,
            translationLocales: ["en-AU"],
            resources: [ownRes],
            selfDatatype: "javascript",
            resFileType: resFileType,
            db: makeDb(),
            deviceType: undefined,
            dedupByBaseTranslation: false,
            includeUniversal: true
        });
        // only the original resource, no clone appended
        expect(resFileType.file.addResource).toHaveBeenCalledTimes(1);
    });

    test("dedup: uses langkey base translation when found", function() {
        var res = makeGenRes("key1", "Hello", "캐나다 프랑스어", "fr-CA");
        var baseRes = { target: "English" };
        var db = makeDb({ "key1::fr-FR": baseRes });
        var resFileType = makeResFileType();
        writeGenerateModeResources({
            project: makeProject(undefined, { "fr-CA": [res] }),
            translationLocales: ["fr-CA"],
            resources: [res],
            selfDatatype: "javascript",
            resFileType: resFileType,
            db: db,
            deviceType: undefined,
            dedupByBaseTranslation: true,
            includeUniversal: true
        });
        expect(resFileType.file.addResource).toHaveBeenCalledTimes(1);
    });

    test("dedup: falls back to enUSKey base translation when langkey misses", function() {
        var res = makeGenRes("key1", "Hello", "캐나다 프랑스어", "fr-CA");
        var baseRes = { target: "English" };
        var db = makeDb({ "key1::en-US": baseRes });
        var resFileType = makeResFileType();
        writeGenerateModeResources({
            project: makeProject(undefined, { "fr-CA": [res] }),
            translationLocales: ["fr-CA"],
            resources: [res],
            selfDatatype: "javascript",
            resFileType: resFileType,
            db: db,
            deviceType: undefined,
            dedupByBaseTranslation: true,
            includeUniversal: true
        });
        expect(resFileType.file.addResource).toHaveBeenCalledTimes(1);
    });
});
