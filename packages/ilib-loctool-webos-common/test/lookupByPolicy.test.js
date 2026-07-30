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

var { buildPolicy, lookupByPolicy } = require("../lookupByPolicy.js");
var ResourceString = require("loctool/lib/ResourceString.js");

// Minimal resource mock — only the fields lookupByPolicy needs
function makeResource(key, flavor) {
    return {
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
    test("returns common step when common data is provided", function() {
        var common = { commonPrjName: "common", commonPrjType: "x-json" };
        var policy = buildPolicy("myapp", common);
        expect(policy).toHaveLength(1);
        expect(policy[0]).toMatchObject({
            project: "common",
            datatype: "x-json"
        });
    });

    test("returns empty policy when common data is absent", function() {
        var common = { commonPrjName: undefined, commonPrjType: undefined };
        var policy = buildPolicy("myapp", common);
        expect(policy).toHaveLength(0);
    });

    test("includeUniversal prepends universal step with actual project name", function() {
        var common = { commonPrjName: "common", commonPrjType: "x-json" };
        var policy = buildPolicy("myapp", common, { includeUniversal: true });
        expect(policy).toHaveLength(2);
        expect(policy[0]).toMatchObject({
            project: "myapp",
            datatype: "universal"
        });
        expect(policy[1]).toMatchObject({
            project: "common",
            datatype: "x-json"
        });
    });

    test("includeUniversal without projectName skips universal step", function() {
        var common = { commonPrjName: "common", commonPrjType: "x-json" };
        var policy = buildPolicy(undefined, common, { includeUniversal: true });
        expect(policy).toHaveLength(1);
        expect(policy[0].project).toBe("common");
    });

    test("includeUniversal false does not add universal step", function() {
        var common = { commonPrjName: "common", commonPrjType: "x-json" };
        var policy = buildPolicy("myapp", common, { includeUniversal: false });
        expect(policy).toHaveLength(1);
        expect(policy[0].project).toBe("common");
    });

    test("no common data with includeUniversal returns universal-only policy", function() {
        var common = { commonPrjName: undefined, commonPrjType: undefined };
        var policy = buildPolicy("myapp", common, { includeUniversal: true });
        expect(policy).toHaveLength(1);
        expect(policy[0]).toMatchObject({
            project: "myapp",
            datatype: "universal"
        });
    });
});

// ── lookupByPolicy ────────────────────────────────────────────────────────────

describe("lookupByPolicy", function() {
    test("empty policy calls back with undefined", function(done) {
        var db = makeDb({});
        lookupByPolicy({
            db: db,
            resource: makeResource("hello"),
            locale: "ko-KR",
            policy: []
        }, function(result) {
            expect(result).toBeUndefined();
            expect(db.getResourceByCleanHashKey).not.toHaveBeenCalled();
            done();
        });
    });

    test("common step hit returns result", function(done) {
        var commonKey = ResourceString.cleanHashKey("common", "ko-KR", "hello", "x-json", undefined);
        var fakeCommon = { target: "공통 안녕" };
        var db = makeDb({ [commonKey]: fakeCommon });

        var common = { commonPrjName: "common", commonPrjType: "x-json" };
        var policy = buildPolicy("myapp", common);
        lookupByPolicy({
            db: db,
            resource: makeResource("hello"),
            locale: "ko-KR",
            policy: policy
        }, function(result) {
            expect(result).toBe(fakeCommon);
            expect(db.getResourceByCleanHashKey).toHaveBeenCalledTimes(1);
            done();
        });
    });

    test("common step miss returns undefined", function(done) {
        var db = makeDb({});
        var common = { commonPrjName: "common", commonPrjType: "x-json" };
        var policy = buildPolicy("myapp", common);
        lookupByPolicy({
            db: db,
            resource: makeResource("hello"),
            locale: "ko-KR",
            policy: policy
        }, function(result) {
            expect(result).toBeUndefined();
            expect(db.getResourceByCleanHashKey).toHaveBeenCalledTimes(1);
            done();
        });
    });

    test("universal step hit returns result before reaching common", function(done) {
        var universalKey = ResourceString.cleanHashKey("myapp", "ko-KR", "hello", "universal", undefined);
        var fakeUniversal = { target: "유니버설 안녕" };
        var db = makeDb({ [universalKey]: fakeUniversal });

        var common = { commonPrjName: "common", commonPrjType: "x-json" };
        var policy = buildPolicy("myapp", common, { includeUniversal: true });
        lookupByPolicy({
            db: db,
            resource: makeResource("hello"),
            locale: "ko-KR",
            policy: policy
        }, function(result) {
            expect(result).toBe(fakeUniversal);
            expect(db.getResourceByCleanHashKey).toHaveBeenCalledTimes(1);
            done();
        });
    });

    test("universal step miss falls through to common step", function(done) {
        var commonKey = ResourceString.cleanHashKey("common", "ko-KR", "hello", "x-json", undefined);
        var fakeCommon = { target: "공통 안녕" };
        var db = makeDb({ [commonKey]: fakeCommon });

        var common = { commonPrjName: "common", commonPrjType: "x-json" };
        var policy = buildPolicy("myapp", common, { includeUniversal: true });
        lookupByPolicy({
            db: db,
            resource: makeResource("hello"),
            locale: "ko-KR",
            policy: policy
        }, function(result) {
            expect(result).toBe(fakeCommon);
            // first call for universal (miss), second call for common (hit)
            expect(db.getResourceByCleanHashKey).toHaveBeenCalledTimes(2);
            done();
        });
    });

    test("all steps miss returns undefined", function(done) {
        var db = makeDb({});
        var common = { commonPrjName: "common", commonPrjType: "x-json" };
        var policy = buildPolicy("myapp", common, { includeUniversal: true });
        lookupByPolicy({
            db: db,
            resource: makeResource("hello"),
            locale: "ko-KR",
            policy: policy
        }, function(result) {
            expect(result).toBeUndefined();
            expect(db.getResourceByCleanHashKey).toHaveBeenCalledTimes(2);
            done();
        });
    });

    test("flavor is included in generated key", function(done) {
        var universalKey = ResourceString.cleanHashKey("myapp", "ko-KR", "hello", "universal", "tv");
        var fakeUniversal = { target: "TV 유니버설 안녕" };
        var db = makeDb({ [universalKey]: fakeUniversal });

        var common = { commonPrjName: "common", commonPrjType: "x-json" };
        var policy = buildPolicy("myapp", common, { includeUniversal: true });
        lookupByPolicy({
            db: db,
            resource: makeResource("hello", "tv"),
            locale: "ko-KR",
            policy: policy
        }, function(result) {
            expect(result).toBe(fakeUniversal);
            done();
        });
    });
});
