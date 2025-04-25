/*
 * JSONResourceFileType.test.js - test the HTML template file type handler object.
 *
 * Copyright (c) 2019-2021, 2023 JEDLSoft
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

var fs = require("fs");
var path = require("path");

if (!JSONResourceFileType) {
    var JSONResourceFile = require("../JSONResourceFile.js");
    var JSONResourceFileType = require("../JSONResourceFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"]
});

var p2 = new CustomProject({
    id: "webosApp",
    projectType: "webos-web",
    sourceLocale: "en-US",
},
"./testfiles",
{
    targetDir: "custom_dir",
    locales: ["es-ES"],
}
);

describe("jsonresourcefiletype", function() {
    test("JSONResourceFileTypeConstructor", function() {
        expect.assertions(1);

        var jrft = new JSONResourceFileType(p);
        expect(jrft).toBeTruthy();
    });
    test("JSONResourceFileGetName", function() {
        expect.assertions(2);

        var jrft = new JSONResourceFileType(p);
        expect(jrft).toBeTruthy();
        expect(jrft.name()).toBe('JSON Resource File');
    });
    test("JSONResourceFileGetDataType", function() {
        expect.assertions(2);

        var jrft = new JSONResourceFileType(p);
        expect(jrft).toBeTruthy();
        expect(jrft.getDataType()).toBe('json');
    });
    test("JSONResourceFileGetExtensions", function() {
        expect.assertions(2);

        var jrft = new JSONResourceFileType(p);
        expect(jrft).toBeTruthy();

        expect(jrft.getExtensions()[0]).toBe('.json');
    });
    test("JSONResourceFileTypeHandlesJS", function() {
        expect.assertions(2);

        var jrft = new JSONResourceFileType(p);
        expect(jrft).toBeTruthy();
        expect(!jrft.handles("foo.json")).toBeTruthy();
    });
    test("JSONResourceFileTypeHandlesActualJSResFile", function() {
        expect.assertions(2);

        var jrft = new JSONResourceFileType(p);
        expect(jrft).toBeTruthy();
        expect(!jrft.handles("localized_js/de-DE.js")).toBeTruthy();
    });
    test("JSONResourceFileTypeGetResourceFile", function() {
        expect.assertions(2);

        var jrft = new JSONResourceFileType(p);
        expect(jrft).toBeTruthy();
        var jsrf = jrft.getResourceFile("fr-FR");
        expect(jsrf.getLocale().getSpec()).toBe("fr-FR");
    });
    test("JSONResourceFileTypeGetResourceFileSameOneEachTime", function() {
        expect.assertions(4);

        var jrft = new JSONResourceFileType(p);
        expect(jrft).toBeTruthy();

        var jsrf1 = jrft.getResourceFile("fr-FR");
        expect(jsrf1.getLocale().getSpec()).toBe("fr-FR");

        var jsrf2 = jrft.getResourceFile("fr-FR");
        expect(jsrf2.getLocale().getSpec()).toBe("fr-FR");

        expect(jsrf1).toStrictEqual(jsrf2);
    });
    test("JSONResourceFileTypeWithTargetDir", function() {
        expect.assertions(4);

        var jrfile = new JSONResourceFile({
            project: p2,
            locale: "es-ES"
        });
        var jrftype = new JSONResourceFileType(p2);
        expect(jrfile).toBeTruthy();
        expect(jrftype).toBeTruthy();

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "es-ES",
                key: "Good Morning!",
                sourceLocale: "en-KR",
                source: "Good Morning!",
                target: "¡Buenos días!"
            }),
        ].forEach(function(res) {
            jrfile.addResource(res);
        });

        jrfile.write();
        jrftype.projectClose();
        var resourceRoot = path.join(p2.target, "resources");

        expect(fs.existsSync(resourceRoot)).toBeTruthy();
        expect(fs.existsSync(path.join(resourceRoot, "ilibmanifest.json"))).toBeTruthy();
    });
});