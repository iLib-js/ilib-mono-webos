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

var { buildPolicy, lookupByPolicy, createLookupParams } = require("../lookupByPolicy.js");

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
            datatype: "common",
            needsCommonData: true
        });
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
            policy: [],
            isCommonDataLoaded: false
        }, function(result) {
            expect(result).toBeUndefined();
            expect(db.getResourceByCleanHashKey).not.toHaveBeenCalled();
            done();
        });
    });

    test("needsCommonData=true step skipped when isCommonDataLoaded=false", function(done) {
        var db = makeDb({});
        var policy = buildPolicy();
        lookupByPolicy({
            db: db,
            resource: makeResource("myapp", "hello"),
            locale: "ko-KR",
            policy: policy,
            isCommonDataLoaded: false,
            commonPrjName: "common",
            commonPrjType: "x-json"
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
            isCommonDataLoaded: true,
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
            policy: policy,
            isCommonDataLoaded: true
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
            isCommonDataLoaded: true,
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
            isCommonDataLoaded: true,
            commonPrjName: "common",
            commonPrjType: "x-json"
        });
    });

    test("reads common project fields lazily from the fileType on each call", function() {
        var db = makeDb({});
        var policy = buildPolicy();
        var fileType = { isCommonDataLoaded: false };

        var make = createLookupParams(fileType, db, policy);
        var before = make(makeResource("myapp", "a"), "ko-KR");
        expect(before.isCommonDataLoaded).toBe(false);
        expect(before.commonPrjName).toBeUndefined();

        // common data detected later during write()
        fileType.isCommonDataLoaded = true;
        fileType.commonPrjName = "common";
        fileType.commonPrjType = "x-json";

        var after = make(makeResource("myapp", "b"), "ja-JP");
        expect(after.isCommonDataLoaded).toBe(true);
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
            isCommonDataLoaded: true,
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
