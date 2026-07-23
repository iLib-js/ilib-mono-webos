/*
 * lookupByPolicy.test.js - test the lookupByPolicy utility
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

var { buildPolicy, lookupByPolicy, createLookupParams, detectCommonData, writeTranslatedResource } = require("../lookupByPolicy.js");
var TranslationSet = require("loctool/lib/TranslationSet.js");
var ResourceString = require("loctool/lib/ResourceString.js");
var Utils = require("loctool/lib/utils.js");

// Minimal resource mock — only the fields lookupByPolicy needs
function makeResource(project, key, flavor) {
    return {
        getProject: function() { return project; },
        getKey: function() { return key; },
        getFlavor: function() { return flavor || undefined; }
    };
}

function makeDb(hitMap) {
    return {
        getResourceByCleanHashKey: jest.fn(function(key, cb) {
            var result = hitMap[key] || null;
            cb(null, result);
        })
    };
}

// ── buildPolicy ──────────────────────────────────────────────────────────────

describe("buildPolicy", function() {
    test("default (no options) returns common-only policy", function() {
        var policy = buildPolicy();
        expect(policy).toHaveLength(1);
        expect(policy[0]).toMatchObject({
            keyType: "hashKey",
            project: "common",
            datatype: "common"
        });
        expect(policy[0].needsCommonData).toBeUndefined();
    });
});

// ── lookupByPolicy ────────────────────────────────────────────────────────────

describe("lookupByPolicy", function() {
    test("empty policy calls back with undefined", function(done) {
        var db = makeDb({});
        lookupByPolicy({
            db: db,
            resource: makeResource("myapp", "hello"),
            locale: "ko-KR",
            policy: []
        }, function(result) {
            expect(result).toBeUndefined();
            expect(db.getResourceByCleanHashKey).not.toHaveBeenCalled();
            done();
        });
    });

    test("missing commonPrjName/Type skips common step without DB call", function(done) {
        var db = makeDb({});
        var policy = buildPolicy();
        lookupByPolicy({
            db: db,
            resource: makeResource("myapp", "hello"),
            locale: "ko-KR",
            policy: policy
            // commonPrjName/commonPrjType absent — buildKey returns undefined → skip
        }, function(result) {
            expect(result).toBeUndefined();
            expect(db.getResourceByCleanHashKey).not.toHaveBeenCalled();
            done();
        });
    });

    test("common step hit returns result", function(done) {
        var ResourceString = require("loctool/lib/ResourceString.js");
        var commonKey = ResourceString.hashKey("common", "ko-KR", "hello", "x-json", undefined);
        var fakeCommon = { target: "공통 안녕" };
        var db = makeDb({ [commonKey]: fakeCommon });

        var policy = buildPolicy();
        lookupByPolicy({
            db: db,
            resource: makeResource("myapp", "hello"),
            locale: "ko-KR",
            policy: policy,
            commonPrjName: "common",
            commonPrjType: "x-json"
        }, function(result) {
            expect(result).toBe(fakeCommon);
            expect(db.getResourceByCleanHashKey).toHaveBeenCalledTimes(1);
            done();
        });
    });

    test("missing commonPrjName skips common step", function(done) {
        var db = makeDb({});
        var policy = buildPolicy();
        lookupByPolicy({
            db: db,
            resource: makeResource("myapp", "hello"),
            locale: "ko-KR",
            policy: policy
            // commonPrjName and commonPrjType intentionally missing
        }, function(result) {
            expect(result).toBeUndefined();
            expect(db.getResourceByCleanHashKey).not.toHaveBeenCalled();
            done();
        });
    });

});

// ── createLookupParams ────────────────────────────────────────────────────────

describe("createLookupParams", function() {
    test("builds a params object carrying the shared context and per-lookup fields", function() {
        var db = makeDb({});
        var policy = buildPolicy();
        var fileType = {
            commonPrjName: "common",
            commonPrjType: "x-json"
        };
        var resource = makeResource("myapp", "hello");

        var make = createLookupParams(fileType, db, policy);
        var params = make(resource, "ko-KR");

        expect(params).toEqual({
            db: db,
            resource: resource,
            locale: "ko-KR",
            policy: policy,
            commonPrjName: "common",
            commonPrjType: "x-json"
        });
    });

    test("reads commonPrjName/Type lazily from fileType on each call", function() {
        var db = makeDb({});
        var policy = buildPolicy();
        var fileType = {};

        var make = createLookupParams(fileType, db, policy);
        var before = make(makeResource("myapp", "a"), "ko-KR");
        expect(before.commonPrjName).toBeUndefined();
        expect(before.commonPrjType).toBeUndefined();

        // common data populated later during write()
        fileType.commonPrjName = "common";
        fileType.commonPrjType = "x-json";

        var after = make(makeResource("myapp", "b"), "ja-JP");
        expect(after.commonPrjName).toBe("common");
        expect(after.commonPrjType).toBe("x-json");
        expect(after.locale).toBe("ja-JP");
    });

    test("produced params drive lookupByPolicy to a common-step hit", function(done) {
        var ResourceString = require("loctool/lib/ResourceString.js");
        var commonKey = ResourceString.hashKey("common", "ko-KR", "hello", "x-json", undefined);
        var fakeCommon = { target: "공통 안녕" };
        var db = makeDb({ [commonKey]: fakeCommon });
        var fileType = {
            commonPrjName: "common",
            commonPrjType: "x-json"
        };

        var make = createLookupParams(fileType, db, buildPolicy());
        lookupByPolicy(make(makeResource("myapp", "hello"), "ko-KR"), function(result) {
            expect(result).toBe(fakeCommon);
            done();
        });
    });
});

// ── detectCommonData ──────────────────────────────────────────────────────────

describe("detectCommonData", function() {
    function makeCommonTs() {
        var ts = new TranslationSet();
        ts.add(new ResourceString({
            project: "common",
            sourceLocale: "en-US",
            targetLocale: "ko-KR",
            key: "hello",
            source: "hello",
            target: "안녕",
            datatype: "x-json"
        }));
        return ts;
    }

    test("translations undefined — no-op, commonPrjName not set", function() {
        var ft = {};
        detectCommonData(ft, undefined);
        expect(ft.commonPrjName).toBeUndefined();
    });

    test("no common project in translations — commonPrjName not set", function() {
        var ts = new TranslationSet();
        ts.add(new ResourceString({
            project: "myapp",
            sourceLocale: "en-US",
            targetLocale: "ko-KR",
            key: "hi",
            source: "hi",
            target: "안녕"
        }));
        var ft = {};
        detectCommonData(ft, ts);
        expect(ft.commonPrjName).toBeUndefined();
    });

    test("common project present — sets commonPrjName and commonPrjType", function() {
        var ts = makeCommonTs();
        var ft = {};
        detectCommonData(ft, ts);
        expect(ft.commonPrjName).toBe("common");
        expect(ft.commonPrjType).toBe("x-json");
    });

    test("common project present but getBy returns empty — name/type not set", function() {
        var ts = new TranslationSet();
        ts.getProjects = function() { return ["common"]; };
        ts.getBy = function() { return []; };
        var ft = {};
        detectCommonData(ft, ts);
        expect(ft.commonPrjName).toBeUndefined();
        expect(ft.commonPrjType).toBeUndefined();
    });
});

// ── writeTranslatedResource ───────────────────────────────────────────────────

describe("writeTranslatedResource", function() {
    function makeTestResource(key, source) {
        return {
            reskey: "rk-" + key,
            getProject: function() { return "myapp"; },
            getDataType: function() { return "cpp"; },
            getPath: function() { return "src/main.cpp"; },
            getContext: function() { return "main"; },
            getKey: function() { return key; },
            getSource: function() { return source; },
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
            return {
                reskey: "tr-" + (k || "key"),
                getSource: function() { return s || "src"; },
                getKey: function() { return k || "key"; },
                target: t,
                metadata: { target: t },
                setTargetLocale: function(locale) { this._targetLocale = locale; },
                setTarget: function(value) { this.target = value; },
                clone: function() {
                    return make(this.target, this.getSource(), this.getKey());
                }
            };
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
            getResourceFile: function(locale) {
                if (!map[locale]) {
                    map[locale] = {
                        pathName: locale + ".json",
                        resources: [],
                        addResource: function(r) { this.resources.push(r); }
                    };
                }
                return map[locale];
            },
            _files: map
        };
    }

    test("dedupByBaseTranslation false writes even when target equals source", function(done) {
        var res = makeTestResource("hello", "Hello");
        var translated = makeTranslated("Hello", "Hello", "Hello");
        var db = {
            getResourceByCleanHashKey: jest.fn(function(key, cb) {
                cb(null, key === "hello::fr-FR" ? translated : null);
            })
        };
        var resFileType = makeCollector();
        var newres = { add: jest.fn() };
        var makeLookupParams = function(resource, locale) {
            return { db: db, resource: resource, locale: locale, policy: [] };
        };

        writeTranslatedResource({
            db: db,
            resFileType: resFileType,
            newres: newres,
            res: res,
            locale: "fr-FR",
            dedupByBaseTranslation: false,
            deviceType: undefined,
            API: makeApi(),
            makeLookupParams: makeLookupParams
        });

        setImmediate(function() {
            expect(resFileType._files["fr-FR"].resources.length).toBe(1);
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
        var db = {
            getResourceByCleanHashKey: jest.fn(function(key, cb) {
                if (key === "hello::" + langDefaultLocale) {
                    cb(null, baseTranslated);
                    return;
                }
                if (key === "hello::" + locale) {
                    cb(null, frTranslated);
                    return;
                }
                cb(null, null);
            })
        };
        var resFileType = makeCollector();
        var newres = { add: jest.fn() };
        var makeLookupParams = function(resource, locale) {
            return { db: db, resource: resource, locale: locale, policy: [] };
        };

        writeTranslatedResource({
            db: db,
            resFileType: resFileType,
            newres: newres,
            res: res,
            locale: locale,
            dedupByBaseTranslation: true,
            translationLocales: [langDefaultLocale, locale],
            deviceType: undefined,
            API: makeApi(),
            makeLookupParams: makeLookupParams
        });

        setImmediate(function() {
            try {
                expect(resFileType._files[locale]).toBeUndefined();
                expect(newres.add).not.toHaveBeenCalled();
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    test("explicit baseTranslation is used even when translationLocales is present", function(done) {
        var res = makeTestResource("hello", "Hello");
        var frTranslated = makeTranslated("Hola", "Hello", "Hello");
        var baseTranslated = makeTranslated("Bonjour", "Hello", "Hello");
        var locale = "es-CO";
        var langDefaultLocale = Utils.getBaseLocale(locale);
        var db = {
            getResourceByCleanHashKey: jest.fn(function(key, cb) {
                if (key === "hello::" + langDefaultLocale) {
                    cb(null, baseTranslated);
                    return;
                }
                if (key === "hello::" + locale) {
                    cb(null, frTranslated);
                    return;
                }
                cb(null, null);
            })
        };
        var resFileType = makeCollector();
        var newres = { add: jest.fn() };
        var makeLookupParams = function(resource, locale) {
            return { db: db, resource: resource, locale: locale, policy: [] };
        };

        writeTranslatedResource({
            db: db,
            resFileType: resFileType,
            newres: newres,
            res: res,
            locale: locale,
            dedupByBaseTranslation: true,
            baseTranslation: "Hola",
            translationLocales: [langDefaultLocale, locale],
            deviceType: undefined,
            API: makeApi(),
            makeLookupParams: makeLookupParams
        });

        setImmediate(function() {
            try {
                expect(db.getResourceByCleanHashKey).not.toHaveBeenCalledWith("hello::" + langDefaultLocale, expect.any(Function));
                expect(resFileType._files[locale]).toBeUndefined();
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    test("dedup uses source as fallback base when translationLocales is absent", function(done) {
        var res = makeTestResource("hello", "Hello");
        var translated = makeTranslated("Hello", "Hello", "Hello");
        var db = {
            getResourceByCleanHashKey: jest.fn(function(key, cb) {
                cb(null, key === "hello::fr-FR" ? translated : null);
            })
        };
        var resFileType = makeCollector();
        var newres = { add: jest.fn() };
        var makeLookupParams = function(resource, locale) {
            return { db: db, resource: resource, locale: locale, policy: [] };
        };

        writeTranslatedResource({
            db: db,
            resFileType: resFileType,
            newres: newres,
            res: res,
            locale: "fr-FR",
            dedupByBaseTranslation: true,
            deviceType: undefined,
            API: makeApi(),
            makeLookupParams: makeLookupParams
        });

        setImmediate(function() {
            try {
                expect(resFileType._files["fr-FR"]).toBeUndefined();
                done();
            } catch (e) {
                done(e);
            }
        });
    });
});
