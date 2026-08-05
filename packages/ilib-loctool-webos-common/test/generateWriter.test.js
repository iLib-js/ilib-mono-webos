/*
 * generateWriter.test.js - test the generateWriter utility
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

var { filterGenResources, writeGenResources } = require("../generateWriter.js");

function makeResource(project, datatype, key, locale, flavor) {
    return {
        getProject: function() { return project; },
        getDataType: function() { return datatype; },
        getKey: function() { return key; },
        getTargetLocale: function() { return locale || "ko-KR"; },
        getFlavor: function() { return flavor || undefined; }
    };
}

describe("filterGenResources", function() {
    test("returns empty array for empty input", function() {
        expect(filterGenResources([], "myapp", "javascript")).toEqual([]);
    });

    test("keeps self-datatype resource", function() {
        var res = makeResource("myapp", "javascript", "key1");
        var result = filterGenResources([res], "myapp", "javascript", { includeUniversal: true });
        expect(result).toHaveLength(1);
        expect(result[0]).toBe(res);
    });

    test("keeps universal resource when self-datatype absent", function() {
        var res = makeResource("myapp", "universal", "key1");
        var result = filterGenResources([res], "myapp", "javascript", { includeUniversal: true });
        expect(result).toHaveLength(1);
        expect(result[0]).toBe(res);
    });

    test("self-datatype wins over universal for same reskey+locale", function() {
        var selfRes = makeResource("myapp", "javascript", "key1");
        var univRes = makeResource("myapp", "universal", "key1");
        var result = filterGenResources([univRes, selfRes], "myapp", "javascript", { includeUniversal: true });
        expect(result).toHaveLength(1);
        expect(result[0]).toBe(selfRes);
    });

    test("self-datatype wins over universal regardless of array order", function() {
        var selfRes = makeResource("myapp", "javascript", "key1");
        var univRes = makeResource("myapp", "universal", "key1");
        var result = filterGenResources([selfRes, univRes], "myapp", "javascript", { includeUniversal: true });
        expect(result).toHaveLength(1);
        expect(result[0]).toBe(selfRes);
    });

    test("excludes universal when includeUniversal is false", function() {
        var univRes = makeResource("myapp", "universal", "key1");
        var result = filterGenResources([univRes], "myapp", "javascript");
        expect(result).toHaveLength(0);
    });

    test("excludes resources from other project", function() {
        var res = makeResource("common", "javascript", "key1");
        var result = filterGenResources([res], "myapp", "javascript", { includeUniversal: true });
        expect(result).toHaveLength(0);
    });

    test("excludes common project even for universal datatype", function() {
        var res = makeResource("common", "universal", "key1");
        var result = filterGenResources([res], "myapp", "javascript", { includeUniversal: true });
        expect(result).toHaveLength(0);
    });

    test("excludes resources with unrelated datatype", function() {
        var res = makeResource("myapp", "x-dart", "key1");
        var result = filterGenResources([res], "myapp", "javascript", { includeUniversal: true });
        expect(result).toHaveLength(0);
    });

    test("different flavors are separate entries", function() {
        var res1 = makeResource("myapp", "universal", "key1", "ko-KR", "flavor1");
        var res2 = makeResource("myapp", "universal", "key1", "ko-KR", "flavor2");
        var result = filterGenResources([res1, res2], "myapp", "javascript", { includeUniversal: true });
        expect(result).toHaveLength(2);
    });

    test("mixed array: keeps self and universal, excludes wrong project/datatype", function() {
        var selfRes = makeResource("myapp", "javascript", "key1");
        var univRes = makeResource("myapp", "universal", "key2");
        var resources = [
            selfRes,
            makeResource("common", "javascript", "key1"),
            univRes,
            makeResource("myapp", "x-dart", "key3")
        ];
        var result = filterGenResources(resources, "myapp", "javascript", { includeUniversal: true });
        expect(result).toHaveLength(2);
        expect(result).toContain(selfRes);
        expect(result).toContain(univRes);
    });
});

// ── writeGenResources ───────────────────────────────────────────────────────────

function makeGenRes(key, source, target, locale) {
    return {
        reskey: key,
        target: target,
        getTargetLocale: function() { return locale || "ko-KR"; },
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

describe("writeGenResources", function() {
    test("write-through (dedupByBaseTranslation=false): writes all resources", function() {
        var res = makeGenRes("key1", "Hello", "안녕");
        var resFileType = makeResFileType();
        writeGenResources({
            project: makeProject(),
            translationLocales: ["ko-KR"],
            genresources: [res],
            resFileType: resFileType,
            db: makeDb(),
            deviceType: undefined,
            dedupByBaseTranslation: false
        });
        expect(resFileType.file.addResource).toHaveBeenCalledTimes(1);
    });

    test("dedup (dedupByBaseTranslation=true): writes when translation differs from base", function() {
        var res = makeGenRes("key1", "Hello", "안녕");
        var baseRes = { target: "English" };
        var db = makeDb({ "key1::en": baseRes });
        var resFileType = makeResFileType();
        writeGenResources({
            project: makeProject(),
            translationLocales: ["ko-KR"],
            genresources: [res],
            resFileType: resFileType,
            db: db,
            deviceType: undefined,
            dedupByBaseTranslation: true
        });
        expect(resFileType.file.addResource).toHaveBeenCalledTimes(1);
    });

    test("dedup: skips when translation equals source (no base found)", function() {
        var res = makeGenRes("key1", "Hello", "Hello");
        var resFileType = makeResFileType();
        writeGenResources({
            project: makeProject(),
            translationLocales: ["ko-KR"],
            genresources: [res],
            resFileType: resFileType,
            db: makeDb(),
            deviceType: undefined,
            dedupByBaseTranslation: true
        });
        expect(resFileType.file.addResource).not.toHaveBeenCalled();
    });

    test("customInherit: clones parent resources for locale with no translations", function() {
        var parentRes = makeGenRes("key1", "Hello", "English", "en-GB");
        var project = makeProject(
            { "en-AU": "en-GB" },
            { "en-AU": [], "en-GB": [parentRes] }
        );
        var genresources = [];
        var resFileType = makeResFileType();
        writeGenResources({
            project: project,
            translationLocales: ["en-AU"],
            genresources: genresources,
            resFileType: resFileType,
            db: makeDb(),
            deviceType: undefined,
            dedupByBaseTranslation: false
        });
        expect(resFileType.file.addResource).toHaveBeenCalledTimes(1);
    });

    test("customInherit: skips clone when locale already has translations", function() {
        var ownRes = makeGenRes("key1", "Hello", "호주영어", "en-AU");
        var project = makeProject(
            { "en-AU": "en-GB" },
            { "en-AU": [ownRes] }
        );
        var genresources = [ownRes];
        var resFileType = makeResFileType();
        writeGenResources({
            project: project,
            translationLocales: ["en-AU"],
            genresources: genresources,
            resFileType: resFileType,
            db: makeDb(),
            deviceType: undefined,
            dedupByBaseTranslation: false
        });
        // only the original resource, no clone appended
        expect(resFileType.file.addResource).toHaveBeenCalledTimes(1);
    });

    test("dedup: uses langkey base translation when found", function() {
        // fr-CA: getBaseLocale=fr-FR → langkey=key1::fr-FR (hit)
        var res = makeGenRes("key1", "Hello", "캐나다 프랑스어", "fr-CA");
        var baseRes = { target: "English" };
        var db = makeDb({ "key1::fr-FR": baseRes });
        var resFileType = makeResFileType();
        writeGenResources({
            project: makeProject(),
            translationLocales: ["fr-CA"],
            genresources: [res],
            resFileType: resFileType,
            db: db,
            deviceType: undefined,
            dedupByBaseTranslation: true
        });
        expect(resFileType.file.addResource).toHaveBeenCalledTimes(1);
    });

    test("dedup: falls back to enUSKey base translation when langkey misses", function() {
        // fr-CA: isBaseLocale=false, getBaseLocale=fr-FR → langkey=key1::fr-FR (miss), enUSKey=key1::en-US (hit)
        var res = makeGenRes("key1", "Hello", "캐나다 프랑스어", "fr-CA");
        var baseRes = { target: "English" };
        var db = makeDb({ "key1::en-US": baseRes });
        var resFileType = makeResFileType();
        writeGenResources({
            project: makeProject(),
            translationLocales: ["fr-CA"],
            genresources: [res],
            resFileType: resFileType,
            db: db,
            deviceType: undefined,
            dedupByBaseTranslation: true
        });
        expect(resFileType.file.addResource).toHaveBeenCalledTimes(1);
    });

    test("empty genresources produces no writes", function() {
        var resFileType = makeResFileType();
        writeGenResources({
            project: makeProject(),
            translationLocales: ["ko-KR"],
            genresources: [],
            resFileType: resFileType,
            db: makeDb(),
            deviceType: undefined,
            dedupByBaseTranslation: true
        });
        expect(resFileType.file.addResource).not.toHaveBeenCalled();
    });
});
