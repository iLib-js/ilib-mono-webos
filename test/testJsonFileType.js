/*
 * testJsonFileType.js - test the json type of file template file type handler object.
 *
 * Copyright (c) 2023, JEDLSoft
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

if (!JsonFileType) {
    var JsonFileType = require("../JsonFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    id: "test",
    plugins: ["../."],
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"]
});

module.exports.jsonfiletype = {
    testJsonFileTypeConstructor: function(test) {
        test.expect(1);
        var ajft = new JsonFileType(p);
        test.ok(ajft);
        test.done();
    },
    testJsonFileTypeHandlesJsonTrue_appinfo: function(test) {
        test.expect(2);
        var ajft = new JsonFileType(p);
        test.ok(ajft);
        test.ok(ajft.handles("appinfo.json"));
        test.done();
    },
    testJsonFileTypeHandlesJsonPath_appinfo: function(test) {
        test.expect(2);
        var ajft = new JsonFileType(p);
        test.ok(ajft);
        test.ok(ajft.handles("foo/bar/appinfo.json"));
        test.done();
    },
    testJsonFileTypeHandlesJsonFalse_appinfo: function(test) {
        test.expect(2);
        var ajft = new JsonFileType(p);
        test.ok(ajft);
        test.ok(!ajft.handles("foo.js"));
        test.done();
    },
    testJsonFileTypeHandlesJsonFalse1_appinfo: function(test) {
        test.expect(2);
        var ajft = new JsonFileType(p);
        test.ok(ajft);
        test.ok(!ajft.handles("lappinfo.json"));
        test.done();
    },
    testJsonFileTypeHandlesFalseWithlocaleDir_appinfo: function(test) {
        test.expect(2);
        var ajft = new JsonFileType(p);
        test.ok(ajft);
        test.ok(!ajft.handles("ko/appinfo.json"));
        test.done();
    },
    testJsonFileTypeHandlesFalseWithlocaleDir2_appinfo: function(test) {
        test.expect(2);
        var ajft = new JsonFileType(p);
        test.ok(ajft);
        test.ok(!ajft.handles("resources/zh/Hant/appinfo.json"));
        test.done();
    },
    testJsonFileTypeHandlesFalseWithlocaleDir3_appinfo: function(test) {
        test.expect(2);
        var ajft = new JsonFileType(p);
        test.ok(ajft);
        test.ok(!ajft.handles("resources/en/GB/appinfo.json"));
        test.done();
    },
    testJsonFileTypeHandlesWithlocaleDir4_appinfo: function(test) {
        test.expect(2);
        var ajft = new JsonFileType(p);
        test.ok(ajft);
        test.ok(ajft.handles("sources/GB/appinfo.json"));
        test.done();
    },
    testJsonFileTypeHandlesWithlocaleDir5_appinfo: function(test) {
        test.expect(2);
        var ajft = new JsonFileType(p);
        test.ok(ajft);
        test.ok(ajft.handles("res/Hant/appinfo.json"));
        test.done();
    },
    /// qcardinfo.json
    testJsonFileTypeHandlesJsonTrue_qcardinfo: function(test) {
        test.expect(2);
        var ajft = new JsonFileType(p);
        test.ok(ajft);
        test.ok(ajft.handles("qcardinfo.json"));
        test.done();
    },
    testJsonFileTypeHandlesJsonPath_appinfo: function(test) {
        test.expect(2);
        var ajft = new JsonFileType(p);
        test.ok(ajft);
        test.ok(ajft.handles("foo/bar/qcardinfo.json"));
        test.done();
    },
    testJsonFileTypeHandlesJsonFalse_qcardinfo: function(test) {
        test.expect(2);
        var ajft = new JsonFileType(p);
        test.ok(ajft);
        test.ok(!ajft.handles("foo.js"));
        test.done();
    },
    testJsonFileTypeHandlesJsonFalse1_qcardinfo: function(test) {
        test.expect(2);
        var ajft = new JsonFileType(p);
        test.ok(ajft);
        test.ok(!ajft.handles("lqcardinfo.json"));
        test.done();
    },
    testJsonFileTypeHandlesFalseWithlocaleDir_qcardinfo: function(test) {
        test.expect(2);
        var ajft = new JsonFileType(p);
        test.ok(ajft);
        test.ok(!ajft.handles("ko/qcardinfo.json"));
        test.done();
    },
    testJsonFileTypeHandlesFalseWithlocaleDir2_qcardinfo: function(test) {
        test.expect(2);
        var ajft = new JsonFileType(p);
        test.ok(ajft);
        test.ok(!ajft.handles("resources/zh/Hant/qcardinfo.json"));
        test.done();
    },
    testJsonFileTypeHandlesFalseWithlocaleDir3_qcardinfo: function(test) {
        test.expect(2);
        var ajft = new JsonFileType(p);
        test.ok(ajft);
        test.ok(!ajft.handles("resources/en/GB/qcardinfo.json"));
        test.done();
    },
    testJsonFileTypeHandlesWithlocaleDir4_qcardinfo: function(test) {
        test.expect(2);
        var ajft = new JsonFileType(p);
        test.ok(ajft);
        test.ok(ajft.handles("sources/GB/qcardinfo.json"));
        test.done();
    },
    testJsonFileTypeHandlesWithlocaleDir5_qcardinfo: function(test) {
        test.expect(2);
        var ajft = new JsonFileType(p);
        test.ok(ajft);
        test.ok(ajft.handles("res/Hant/qcardinfo.json"));
        test.done();
    }
};