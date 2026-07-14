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

    test("includeUniversal=false returns common-only policy", function() {
        var policy = buildPolicy({ includeUniversal: false });
        expect(policy).toHaveLength(1);
        expect(policy[0].project).toBe("common");
    });

    test("includeUniversal=true prepends current+universal step", function() {
        var policy = buildPolicy({ includeUniversal: true });
        expect(policy).toHaveLength(2);
        expect(policy[0]).toMatchObject({
            keyType: "cleanHashKey",
            project: "current",
            datatype: "universal",
            needsCommonData: false
        });
        expect(policy[1]).toMatchObject({
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
        var policy = buildPolicy({ includeUniversal: false });
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

    test("universal step not skipped when isCommonDataLoaded=false", function(done) {
        var ResourceString = require("loctool/lib/ResourceString.js");
        var universalKey = ResourceString.cleanHashKey("myapp", "ko-KR", "hello", "universal", undefined);
        var fakeTranslated = { target: "안녕" };
        var db = makeDb({ [universalKey]: fakeTranslated });

        var policy = buildPolicy({ includeUniversal: true });
        lookupByPolicy({
            db: db,
            resource: makeResource("myapp", "hello"),
            locale: "ko-KR",
            policy: policy,
            isCommonDataLoaded: false
        }, function(result) {
            expect(result).toBe(fakeTranslated);
            expect(db.getResourceByCleanHashKey).toHaveBeenCalledTimes(1);
            done();
        });
    });

    test("universal step hit returns result without calling common step", function(done) {
        var ResourceString = require("loctool/lib/ResourceString.js");
        var universalKey = ResourceString.cleanHashKey("myapp", "ko-KR", "hello", "universal", undefined);
        var fakeTranslated = { target: "안녕" };
        var db = makeDb({ [universalKey]: fakeTranslated });

        var policy = buildPolicy({ includeUniversal: true });
        lookupByPolicy({
            db: db,
            resource: makeResource("myapp", "hello"),
            locale: "ko-KR",
            policy: policy,
            isCommonDataLoaded: true,
            commonPrjName: "common",
            commonPrjType: "x-json"
        }, function(result) {
            expect(result).toBe(fakeTranslated);
            // Only universal key was queried — common step skipped
            expect(db.getResourceByCleanHashKey).toHaveBeenCalledTimes(1);
            done();
        });
    });

    test("universal miss then common hit returns common result", function(done) {
        var ResourceString = require("loctool/lib/ResourceString.js");
        var commonKey = ResourceString.hashKey("common", "ko-KR", "hello", "x-json", undefined);
        var fakeCommon = { target: "공통 안녕" };
        var db = makeDb({ [commonKey]: fakeCommon });

        var policy = buildPolicy({ includeUniversal: true });
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
            expect(db.getResourceByCleanHashKey).toHaveBeenCalledTimes(2);
            done();
        });
    });

    test("common step hit returns result", function(done) {
        var ResourceString = require("loctool/lib/ResourceString.js");
        var commonKey = ResourceString.hashKey("common", "ko-KR", "hello", "x-json", undefined);
        var fakeCommon = { target: "공통 안녕" };
        var db = makeDb({ [commonKey]: fakeCommon });

        var policy = buildPolicy({ includeUniversal: false });
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

    test("all steps miss calls back with undefined", function(done) {
        var db = makeDb({});
        var policy = buildPolicy({ includeUniversal: true });
        lookupByPolicy({
            db: db,
            resource: makeResource("myapp", "hello"),
            locale: "ko-KR",
            policy: policy,
            isCommonDataLoaded: true,
            commonPrjName: "common",
            commonPrjType: "x-json"
        }, function(result) {
            expect(result).toBeUndefined();
            expect(db.getResourceByCleanHashKey).toHaveBeenCalledTimes(2);
            done();
        });
    });

    test("missing project in resource skips current step", function(done) {
        var ResourceString = require("loctool/lib/ResourceString.js");
        var commonKey = ResourceString.hashKey("common", "ko-KR", "hello", "x-json", undefined);
        var fakeCommon = { target: "공통" };
        var db = makeDb({ [commonKey]: fakeCommon });

        var noProjectResource = {
            getProject: function() { return null; },
            getKey: function() { return "hello"; },
            getFlavor: function() { return undefined; }
        };

        var policy = buildPolicy({ includeUniversal: true });
        lookupByPolicy({
            db: db,
            resource: noProjectResource,
            locale: "ko-KR",
            policy: policy,
            isCommonDataLoaded: true,
            commonPrjName: "common",
            commonPrjType: "x-json"
        }, function(result) {
            // universal step skipped (no project), falls through to common
            expect(result).toBe(fakeCommon);
            expect(db.getResourceByCleanHashKey).toHaveBeenCalledTimes(1);
            done();
        });
    });

    test("missing commonPrjName skips common step", function(done) {
        var db = makeDb({});
        var policy = buildPolicy({ includeUniversal: false });
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

    test("flavor is passed through to key builder", function(done) {
        var ResourceString = require("loctool/lib/ResourceString.js");
        var universalKey = ResourceString.cleanHashKey("myapp", "ko-KR", "hello", "universal", "flavor1");
        var fakeTranslated = { target: "맛있는 안녕" };
        var db = makeDb({ [universalKey]: fakeTranslated });

        var policy = buildPolicy({ includeUniversal: true });
        lookupByPolicy({
            db: db,
            resource: makeResource("myapp", "hello", "flavor1"),
            locale: "ko-KR",
            policy: policy,
            isCommonDataLoaded: false
        }, function(result) {
            expect(result).toBe(fakeTranslated);
            done();
        });
    });
});
