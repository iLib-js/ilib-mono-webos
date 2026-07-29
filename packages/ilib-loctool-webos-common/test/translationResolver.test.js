/*
 * translationResolver.test.js - test the translationResolver utility
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

var { buildResolver, resolveTranslation } = require("../translationResolver.js");
var { buildPolicy } = require("../lookupByPolicy.js");
var TranslationSet = require("loctool/lib/TranslationSet.js");
var ResourceString = require("loctool/lib/ResourceString.js");
var Utils = require("loctool/lib/utils.js");

function makeTestResource(key, source) {
    return {
        reskey: "rk-" + key,
        getProject: function() { return "myapp"; },
        getDataType: function() { return "cpp"; },
        getPath: function() { return "src/main.cpp"; },
        getContext: function() { return "main"; },
        getKey: function() { return key; },
        getSource: function() { return source; },
        getFlavor: function() { return undefined; },
        cleanHashKeyForTranslation: function(locale) { return key + "::" + locale; },
        clone: function() {
            var copy = makeTestResource(key, source);
            copy.setTargetLocale = function(locale) { this._targetLocale = locale; };
            copy.setTarget = function(target) { this.target = target; };
            copy.setState = function(state) { this.state = state; };
            copy.setComment = function(comment) { this.comment = comment; };
            return copy;
        }
    };
}

function makeTranslated(target, source, key) {
    var make = function(t, s, k) {
        var obj = {
            reskey: "tr-" + (k || "key"),
            getSource: function() { return s || "src"; },
            getKey: function() { return k || "key"; },
            getFlavor: function() { return undefined; },
            target: t,
            metadata: { target: t },
            setTargetLocale: function(locale) { this._targetLocale = locale; },
            setTarget: function(value) { this.target = value; }
        };
        obj.clone = function() {
            var copy = make(this.target, this.getSource(), this.getKey());
            copy.reskey = this.reskey;
            return copy;
        };
        return obj;
    };

    return make(target, source, key);
}

function makeApi() {
    return {
        utils: {
            cleanString: function(s) { return s; }
        }
    };
}

function makeCollector() {
    var map = {};
    return {
        getResourceFile: function(locale, resPath) {
            var key = resPath || locale;
            if (!map[key]) {
                map[key] = {
                    pathName: key + ".json",
                    resources: [],
                    addResource: function(r) { this.resources.push(r); }
                };
            }
            return map[key];
        },
        getAddedCount: function(locale) {
            return map[locale] ? map[locale].resources.length : 0;
        },
        getAdded: function(locale) {
            return map[locale] ? map[locale].resources : [];
        }
    };
}

function makeNewres() {
    var added = [];
    return {
        add: jest.fn(function(r) { added.push(r); }),
        _added: added
    };
}

function makeDb(hitMap) {
    return {
        getResourceByCleanHashKey: jest.fn(function(key, cb) {
            var result = (hitMap && hitMap[key]) || null;
            cb(null, result);
        })
    };
}

/**
 * Helper: create a resolver with a simple db and empty policy (no common project).
 */
function makeSimpleResolver(db) {
    return {
        db: db,
        policy: [],
        makeLookupParams: function(resource, locale) {
            return { db: db, resource: resource, locale: locale, policy: [] };
        }
    };
}

/**
 * Helper: a TranslationSet containing one common-project resource, so that
 * buildResolver() detects common data (commonPrjName/commonPrjType).
 */
function makeCommonTs() {
    var ts = new TranslationSet();
    ts.add(new ResourceString({
        project: "common",
        sourceLocale: "en-US",
        targetLocale: "ko-KR",
        key: "hello",
        source: "hello",
        target: "안녕",
        datatype: "javascript"
    }));
    return ts;
}

// ── buildResolver ────────────────────────────────────────────────────────────

describe("buildResolver", function() {
    test("translations undefined — no common data in lookup params", function() {
        var db = makeDb({});
        var resolver = buildResolver(db, undefined);
        expect(resolver.db).toBe(db);
        expect(resolver.policy).toEqual(buildPolicy());
        expect(typeof resolver.makeLookupParams).toBe("function");

        var params = resolver.makeLookupParams(makeTestResource("a", "A"), "ko-KR");
        expect(params.commonPrjName).toBeUndefined();
        expect(params.commonPrjType).toBeUndefined();
    });

    test("no common project in translations — no common data in lookup params", function() {
        var ts = new TranslationSet();
        ts.add(new ResourceString({
            project: "myapp",
            sourceLocale: "en-US",
            targetLocale: "ko-KR",
            key: "hi",
            source: "hi",
            target: "안녕"
        }));
        var db = makeDb({});
        var resolver = buildResolver(db, ts);

        var params = resolver.makeLookupParams(makeTestResource("a", "A"), "ko-KR");
        expect(params.commonPrjName).toBeUndefined();
    });

    test("common project present — lookup params carry commonPrjName and commonPrjType", function() {
        var ts = makeCommonTs();
        var db = makeDb({});
        var resolver = buildResolver(db, ts);

        var params = resolver.makeLookupParams(makeTestResource("a", "A"), "ko-KR");
        expect(params.commonPrjName).toBe("common");
        expect(params.commonPrjType).toBe("javascript");
    });

    test("common project present but getBy returns empty — no common data in lookup params", function() {
        var ts = new TranslationSet();
        ts.getProjects = function() { return ["common"]; };
        ts.getBy = function() { return []; };
        var db = makeDb({});
        var resolver = buildResolver(db, ts);

        var params = resolver.makeLookupParams(makeTestResource("a", "A"), "ko-KR");
        expect(params.commonPrjName).toBeUndefined();
        expect(params.commonPrjType).toBeUndefined();
    });

    test("makeLookupParams builds correct params object", function() {
        var ts = makeCommonTs();
        var db = makeDb({});
        var resolver = buildResolver(db, ts);

        var resource = makeTestResource("hello", "Hello");
        var params = resolver.makeLookupParams(resource, "ko-KR");

        expect(params.db).toBe(db);
        expect(params.resource).toBe(resource);
        expect(params.locale).toBe("ko-KR");
        expect(params.policy).toEqual(buildPolicy());
        expect(params.commonPrjName).toBe("common");
        expect(params.commonPrjType).toBe("javascript");
    });

    test("common data is captured at build time and reused across calls", function() {
        var ts = makeCommonTs();
        var db = makeDb({});
        var resolver = buildResolver(db, ts);

        var first = resolver.makeLookupParams(makeTestResource("a", "A"), "ko-KR");
        var second = resolver.makeLookupParams(makeTestResource("b", "B"), "ja-JP");

        expect(first.commonPrjName).toBe("common");
        expect(second.commonPrjName).toBe("common");
        expect(second.commonPrjType).toBe("javascript");
    });
});

// ── resolveTranslation: dedup mode tests ──────────────────────────────────────

describe("resolveTranslation", function() {

    test("dedupByBaseTranslation false writes even when target equals source", function(done) {
        var res = makeTestResource("hello", "Hello");
        var translated = makeTranslated("Hello", "Hello", "Hello");
        var db = makeDb({ "hello::fr-FR": translated });
        var resolver = makeSimpleResolver(db);
        var resFileType = makeCollector();
        var newres = makeNewres();

        resolveTranslation({
            resolver: resolver,
            resFileType: resFileType,
            newres: newres,
            res: res,
            locale: "fr-FR",
            dedupByBaseTranslation: false,
            deviceType: undefined,
            API: makeApi()
        }, function() {
            expect(resFileType.getAddedCount("fr-FR")).toBe(1);
            expect(newres.add).not.toHaveBeenCalled();
            done();
        });
    });

    test("dedupByBaseTranslation true + langDefault resolves base and skips same target", function(done) {
        var res = makeTestResource("hello", "Hello");
        var frTranslated = makeTranslated("Hola", "Hello", "Hello");
        var baseTranslated = makeTranslated("Hola", "Hello", "Hello");
        var locale = "es-CO";
        var langDefaultLocale = Utils.getBaseLocale(locale);
        var hitMap = {};
        hitMap["hello::" + langDefaultLocale] = baseTranslated;
        hitMap["hello::" + locale] = frTranslated;
        var db = makeDb(hitMap);
        var resolver = makeSimpleResolver(db);
        var resFileType = makeCollector();
        var newres = makeNewres();

        resolveTranslation({
            resolver: resolver,
            resFileType: resFileType,
            newres: newres,
            res: res,
            locale: locale,
            dedupByBaseTranslation: true,
            translationLocales: [langDefaultLocale, locale],
            deviceType: undefined,
            API: makeApi()
        }, function() {
            expect(resFileType.getAdded(locale)).toHaveLength(0);
            expect(newres.add).not.toHaveBeenCalled();
            done();
        });
    });

    test("explicit baseTranslation is used even when translationLocales is present", function(done) {
        var res = makeTestResource("hello", "Hello");
        var frTranslated = makeTranslated("Hola", "Hello", "Hello");
        var baseTranslated = makeTranslated("Bonjour", "Hello", "Hello");
        var locale = "es-CO";
        var langDefaultLocale = Utils.getBaseLocale(locale);
        var hitMap = {};
        hitMap["hello::" + langDefaultLocale] = baseTranslated;
        hitMap["hello::" + locale] = frTranslated;
        var db = makeDb(hitMap);
        var resolver = makeSimpleResolver(db);
        var resFileType = makeCollector();
        var newres = makeNewres();

        resolveTranslation({
            resolver: resolver,
            resFileType: resFileType,
            newres: newres,
            res: res,
            locale: locale,
            dedupByBaseTranslation: true,
            baseTranslation: "Hola",
            translationLocales: [langDefaultLocale, locale],
            deviceType: undefined,
            API: makeApi()
        }, function() {
            expect(db.getResourceByCleanHashKey).not.toHaveBeenCalledWith("hello::" + langDefaultLocale, expect.any(Function));
            expect(resFileType.getAdded(locale)).toHaveLength(0);
            done();
        });
    });

    test("dedup uses source as fallback base when translationLocales is absent", function(done) {
        var res = makeTestResource("hello", "Hello");
        var translated = makeTranslated("Hello", "Hello", "Hello");
        var db = makeDb({ "hello::fr-FR": translated });
        var resolver = makeSimpleResolver(db);
        var resFileType = makeCollector();
        var newres = makeNewres();

        resolveTranslation({
            resolver: resolver,
            resFileType: resFileType,
            newres: newres,
            res: res,
            locale: "fr-FR",
            dedupByBaseTranslation: true,
            deviceType: undefined,
            API: makeApi()
        }, function() {
            expect(resFileType.getAdded("fr-FR")).toHaveLength(0);
            done();
        });
    });

    // ── direct miss → policy hit ──────────────────────────────────────────

    test("direct miss + policy hit + differs from base → addResource", function(done) {
        var res = makeTestResource("hello", "Hello");
        var commonTranslated = makeTranslated("안녕", "Hello", "hello");
        var policy = buildPolicy();
        var commonKey = ResourceString.hashKey("common", "ko-KR", "hello", "javascript", undefined);
        var db = makeDb({ [commonKey]: commonTranslated });
        var resolver = buildResolver(db, makeCommonTs());
        var resFileType = makeCollector();
        var newres = makeNewres();

        resolveTranslation({
            resolver: resolver,
            resFileType: resFileType,
            newres: newres,
            res: res,
            locale: "ko-KR",
            dedupByBaseTranslation: true,
            deviceType: undefined,
            API: makeApi()
        }, function() {
            expect(resFileType.getAddedCount("ko-KR")).toBe(1);
            expect(newres.add).not.toHaveBeenCalled();
            done();
        });
    });

    test("direct miss + policy hit + same as base → addNewResource (skip)", function(done) {
        var res = makeTestResource("hello", "Hello");
        var commonTranslated = makeTranslated("Hello", "Hello", "hello");
        var commonKey = ResourceString.hashKey("common", "ko-KR", "hello", "javascript", undefined);
        var db = makeDb({ [commonKey]: commonTranslated });
        var resolver = buildResolver(db, makeCommonTs());
        var resFileType = makeCollector();
        var newres = makeNewres();

        resolveTranslation({
            resolver: resolver,
            resFileType: resFileType,
            newres: newres,
            res: res,
            locale: "ko-KR",
            dedupByBaseTranslation: true,
            deviceType: undefined,
            API: makeApi()
        }, function() {
            expect(resFileType.getAdded("ko-KR")).toHaveLength(0);
            expect(newres.add).toHaveBeenCalledTimes(1);
            done();
        });
    });

    // ── direct miss + policy miss → customInherit fallback ────────────────

    test("direct miss + policy miss + customInherit direct hit → addResource", function(done) {
        var res = makeTestResource("hello", "Hello");
        var inheritTranslated = makeTranslated("Hola", "Hello", "hello");
        var db = makeDb({ "hello::es": inheritTranslated });
        var resolver = makeSimpleResolver(db);
        var resFileType = makeCollector();
        var newres = makeNewres();

        resolveTranslation({
            resolver: resolver,
            resFileType: resFileType,
            newres: newres,
            res: res,
            locale: "es-CO",
            customInheritLocale: "es",
            dedupByBaseTranslation: true,
            deviceType: undefined,
            API: makeApi()
        }, function() {
            expect(resFileType.getAddedCount("es-CO")).toBe(1);
            expect(newres.add).not.toHaveBeenCalled();
            done();
        });
    });

    test("direct miss + policy miss + customInherit direct miss + inherit policy hit → addResource", function(done) {
        var res = makeTestResource("hello", "Hello");
        var inheritCommonKey = ResourceString.hashKey("common", "es", "hello", "javascript", undefined);
        var inheritTranslated = makeTranslated("Hola", "Hello", "hello");
        var db = makeDb({ [inheritCommonKey]: inheritTranslated });
        var resolver = buildResolver(db, makeCommonTs());
        var resFileType = makeCollector();
        var newres = makeNewres();

        resolveTranslation({
            resolver: resolver,
            resFileType: resFileType,
            newres: newres,
            res: res,
            locale: "es-CO",
            customInheritLocale: "es",
            dedupByBaseTranslation: true,
            deviceType: undefined,
            API: makeApi()
        }, function() {
            expect(resFileType.getAddedCount("es-CO")).toBe(1);
            expect(newres.add).not.toHaveBeenCalled();
            done();
        });
    });

    test("all lookups miss → addNewResource", function(done) {
        var res = makeTestResource("hello", "Hello");
        var db = makeDb({});
        var resolver = makeSimpleResolver(db);
        var resFileType = makeCollector();
        var newres = makeNewres();

        resolveTranslation({
            resolver: resolver,
            resFileType: resFileType,
            newres: newres,
            res: res,
            locale: "ko-KR",
            dedupByBaseTranslation: true,
            deviceType: undefined,
            API: makeApi()
        }, function() {
            expect(resFileType.getAdded("ko-KR")).toHaveLength(0);
            expect(newres.add).toHaveBeenCalledTimes(1);
            done();
        });
    });

    // ── direct hit paths ──────────────────────────────────────────────────

    test("direct hit + source mismatch → addNewResource", function(done) {
        var res = makeTestResource("hello", "Hello Updated");
        var translated = makeTranslated("안녕", "Hello Old", "Hello Old");
        var db = makeDb({ "hello::ko-KR": translated });
        var resolver = makeSimpleResolver(db);
        var resFileType = makeCollector();
        var newres = makeNewres();

        resolveTranslation({
            resolver: resolver,
            resFileType: resFileType,
            newres: newres,
            res: res,
            locale: "ko-KR",
            dedupByBaseTranslation: false,
            deviceType: undefined,
            API: makeApi()
        }, function() {
            expect(resFileType.getAdded("ko-KR")).toHaveLength(0);
            expect(newres.add).toHaveBeenCalledTimes(1);
            done();
        });
    });

    test("direct hit + reskey mismatch → clone with updated reskey + addResource", function(done) {
        var res = makeTestResource("hello", "Hello");
        var translated = makeTranslated("안녕", "Hello", "Hello");
        translated.reskey = "tr-Hello";
        var db = makeDb({ "hello::ko-KR": translated });
        var resolver = makeSimpleResolver(db);
        var resFileType = makeCollector();
        var newres = makeNewres();

        resolveTranslation({
            resolver: resolver,
            resFileType: resFileType,
            newres: newres,
            res: res,
            locale: "ko-KR",
            dedupByBaseTranslation: false,
            deviceType: undefined,
            API: makeApi()
        }, function() {
            expect(resFileType.getAddedCount("ko-KR")).toBe(1);
            expect(resFileType.getAdded("ko-KR")[0].reskey).toBe(res.reskey);
            expect(newres.add).not.toHaveBeenCalled();
            done();
        });
    });
});
