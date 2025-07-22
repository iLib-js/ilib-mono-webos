/*
 * utils.test.js - test the utility functions
 *
 * Copyright (c) 2025 JEDLSoft
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

var utils = require("../utils.js");
var TranslationSet = require("loctool/lib/TranslationSet.js");
var ResourceString = require("loctool/lib/ResourceString.js");
var CustomProject =  require("loctool/lib/CustomProject.js");

describe("utils", function() {
    test("test_addNewResourcesFalse", function() {
        expect.assertions(1);
        expect(utils.addNewResource()).toBeFalsy();
    });
    test("test_addResourcesFalse", function() {
        expect.assertions(1);
        expect(utils.addResource()).toBeFalsy();
    });
    test("test_addNewResourceData", function() {
        expect.assertions(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        expect(utils.addNewResource(ts, res, "en-US")).toBeTruthy();
        expect(ts.isDirty()).toBeTruthy();
    });
    test("test_addNewResourceDataFalse2", function() {
        expect.assertions(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        expect(utils.addNewResource(ts, res)).toBeFalsy();
        expect(utils.addNewResource(ts)).toBeFalsy();
    });
    test("test_addResourceData", function() {
        expect.assertions(4);

        var p = new CustomProject({
            id: "app",
            plugins: ["ilib-loctool-mock"],
            sourceLocale: "en-US",
            settings: {
                resourceFileTypes: {
                    "mock": "mock-resource"
                }
            },
            }, ". ", {
            locales:["en-GB"]
        });

        var res = new ResourceString({
            id: "app",
            sourceLocale: "en-US",
            key: "asdf",
            source: "This is a test",
        });

        var translated = new ResourceString({
            id: "app",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "asdf",
            source: "This is a test",
            target: "Eine Test",
        });
        expect(p).toBeTruthy();
        expect(res).toBeTruthy();
        expect(translated).toBeTruthy();

        p.init(function() {
            var jt = p.getResourceFileType("mock");
            expect(utils.addResource(jt, translated, res, "de-DE")).toBeTruthy();
        });
    });
    test("test_addResourceData_translationKeyDifferent", function() {
        expect.assertions(4);

        var p = new CustomProject({
            id: "app",
            plugins: ["ilib-loctool-mock"],
            sourceLocale: "en-US",
            settings: {
                resourceFileTypes: {
                    "mock": "mock-resource"
                }
            },
            }, ". ", {
            locales:["en-GB"]
        });

        var res = new ResourceString({
            id: "app",
            sourceLocale: "en-US",
            key: "asdf",
            source: "This is a test",
        });

        var translated = new ResourceString({
            id: "app",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "asdfasdf",
            source: "This is a test",
            target: "Eine Test",
        });
        expect(p).toBeTruthy();
        expect(res).toBeTruthy();
        expect(translated).toBeTruthy();

        p.init(function() {
            var jt = p.getResourceFileType("mock");
            expect(utils.addResource(jt, translated, res, "de-DE")).toBeTruthy();
        });
    });
    test("test_isValidPathFalse", function() {
        expect.assertions(2);

        expect(utils.isValidPath()).toBeFalsy();
        expect(utils.isValidPath("./result/temp.json")).toBeFalsy();
    });
    test("test_isValidPathTrue", function() {
        expect.assertions(1);
        expect(utils.isValidPath("./test/testfiles/strings.json")).toBeTruthy();
    });
    test("test_loadData", function() {
        expect.assertions(1);
        var expected = { 'Hello': '안녕하세요.', 'Thank you': '감사합니다.' };
        var actual = utils.loadData("./test/testfiles/strings.json");
        expect(actual).toEqual(expected);
    });
    test("test_loadDataFalse", function() {
        expect.assertions(1);
        expect(utils.loadData("./result/temp.json")).toBe(undefined);
    });
    test("test_isExistKey_True", function() {
        expect.assertions(2);
        expect(utils.isExistKey("./test/testfiles/strings.json", "Hello")).toBeTruthy();
        expect(utils.isExistKey("./test/testfiles/strings.json", "Thank you")).toBeTruthy();
    });
    test("test_isExistKey_False", function() {
        expect.assertions(1);
        expect(utils.isExistKey("./test/testfiles/strings.json", "Bye")).toBeFalsy()
    });
    test("test_getDeviceType", function() {
        expect.assertions(1);

        var settings = {
            metadata: {
                "device-type": "Monitor"
            }
        };
        expect(utils.getDeviceType(settings)).toBe("Monitor");
    });
    test("test_getDeviceType_False", function() {
        expect.assertions(1);

        expect(utils.getDeviceType()).toBeFalsy();
    });
    test("test_getDeviceType_False2", function() {
        expect.assertions(1);
        var settings = {
            metadataaa: {
                "device-type": "Monitor"
            }
        };
        expect(utils.getDeviceType(settings)).toBeFalsy();
    });
    test("test_getTarget", function() {
        expect.assertions(1);

        var translated = new ResourceString({
            id: "app",
            sourceLocale: "en-US",
            targetLocale: "ko-KR",
            key: "NOT AVAILABLE",
            source: "NOT AVAILABLE",
            target: "이용이 불가능합니다",
            metadata: {
                "mda:metaGroup": {
                    "mda:meta": [
                        {
                            "_attributes" : {"type": "Monitor"},
                            "_text": "\"Monitor\" 이용이 불가능합니다"
                        },
                        {
                            "_attributes" : {"type": "Box"},
                            "_text": "\"Box\" 이용이 불가능합니다"
                        },
                        {
                            "_attributes" : {"type": "SoundBar"},
                            "_text": "\"SoundBar\" 이용이 불가능합니다"
                        }
                    ],
                    "_attributes": {
                        "category": "device-type"
                    }
                }
            }
        });

        var deviceType = "SoundBar"
        var result = utils.getTarget(translated, deviceType);
        expect(result).toBe("\"SoundBar\" 이용이 불가능합니다");
    });
    test("test_getTarget2", function() {
        expect.assertions(1);

        var translated = new ResourceString({
            id: "app",
            sourceLocale: "en-US",
            targetLocale: "ko-KR",
            key: "NOT AVAILABLE",
            source: "NOT AVAILABLE",
            target: "이용이 불가능합니다",
            metadata: {
                "mda:metaGroup": {
                    "mda:meta": [
                        {
                            "_attributes" : {"type": "Monitor"},
                            "_text": "\"Monitor\" 이용이 불가능합니다"
                        },
                        {
                            "_attributes" : {"type": "Box"},
                            "_text": "\"Box\" 이용이 불가능합니다"
                        },
                        {
                            "_attributes" : {"type": "SoundBar"},
                            "_text": "\"SoundBar\" 이용이 불가능합니다"
                        }
                    ],
                    "_attributes": {
                        "category": "device-type"
                    }
                }
            }
        });
        var result = utils.getTarget(translated);
        expect(result).toBe("이용이 불가능합니다");
    });
    test("test_getTarget3", function() {
        expect.assertions(1);

        var translated = new ResourceString({
            id: "app",
            sourceLocale: "en-US",
            targetLocale: "ko-KR",
            key: "NOT AVAILABLE",
            source: "NOT AVAILABLE",
            target: "이용이 불가능합니다",
            metadata: {
                "mda:metaGroup": {
                    "mda:meta": [
                        {
                            "_attributes" : {"type": "Monitor"},
                            "_text": "\"Monitor\" 이용이 불가능합니다"
                        },
                        {
                            "_attributes" : {"type": "Box"},
                            "_text": "\"Box\" 이용이 불가능합니다"
                        },
                        {
                            "_attributes" : {"type": "SoundBar"},
                            "_text": "\"SoundBar\" 이용이 불가능합니다"
                        }
                    ],
                    "_attributes": {
                        "category": "device-type"
                    }
                }
            }
        });

        var deviceType = "SoundBarrrrr"
        var result = utils.getTarget(translated, deviceType);
        expect(result).toBe("이용이 불가능합니다");
    });
});