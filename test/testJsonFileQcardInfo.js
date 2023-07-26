/*
 * testJsonFileQcardInfo.js - test the qcardinfo.json file type handler object.
 *
 * Copyright (c) 2023 JEDLSoft
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

if (!JsonFile) {
    var JsonFile = require("../JsonFile.js");
    var JsonFileType = require("../JsonFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
    var TranslationSet =  require("loctool/lib/TranslationSet.js");
    var ResourceString =  require("loctool/lib/ResourceString.js");
}

var p = new CustomProject({
    id: "app",
    type: "webos-web",
    sourceLocale: "en-KR",
    schema: "./test/testfiles/qcardinfo.schema.json",
    resourceDirs: {
        "json": "localized_json"
    },
    }, "./test/testfiles", {
    locales:["en-GB", "ko-KR"],
    jsonMap: {
        "mappings": {
            "**/qcardinfo.json": {
                "template": "[dir]/[resourceDir]/[localeDir]/[filename]"
            }
        }
    }
});

var sampleqcardinfo = {
    "id": "com.palm.app.sportsettings",
    "title": "Sports",
    "description": "All sports information in one place",
    "image": "qcardImage.png",
    "icon": "qcardIIcon.png"
}

var ajft = new JsonFileType(p);

module.exports.qcardjsonfile = {
    testJsonFileConstructor: function(test) {
        test.expect(1);

        var ajf = new JsonFile({project: p, type:ajft});
        test.ok(ajf);
        test.done();
    },
    testJsonFileConstructorParams: function(test) {
        test.expect(1);

        var ajf = new JsonFile({
            project: p,
            type: ajft
        });

        test.ok(ajf);
        test.done();
    },
    testJsonFileConstructorNoFile: function(test) {
        test.expect(1);

        var ajf = new JsonFile({
            project: p,
            pathName: undefined,
            type: ajft
        });
        test.ok(ajf);
        test.done();
    },
    testJsonFileMakeKey: function(test) {
        test.expect(2);

        var ajf = new JsonFile({
            project: p,
            pathName: undefined,
            type: ajft
        });
        test.ok(ajf);
        test.equal(ajf.makeKey("title"), "title");
        test.done();
    },
    testJsonFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var ajf = new JsonFile({
            project: p,
            pathName: undefined,
            type: ajft
        });
        test.ok(ajf);
        ajf.parse(sampleqcardinfo);

        var set = ajf.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: "Sports"
        });
        test.ok(r);

        test.equal(r[0].getSource(), "Sports");
        test.equal(r[0].getKey(), "Sports");

        test.done();
    },
    testJsonFileParseMultipleWithKey: function(test) {
        test.expect(6);

        var ajf = new JsonFile({
            project: p,
            pathName: undefined,
            type: ajft
        });
        test.ok(ajf);

        ajf.parse('{"title":"Sports"}');

        var set = ajf.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: "Sports"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "Sports");
        test.ok(r[0].getAutoKey());
        test.equal(r[0].getKey(), "Sports");

        test.done();
    },
    testJsonFileExtractFile: function(test) {
        test.expect(8);

        var ajf = new JsonFile({
            project: p,
            pathName: "./qcardinfo.json",
            type: ajft
        });
        test.ok(ajf);

        // should read the file
        ajf.extract();
        var set = ajf.getTranslationSet();
        test.equal(set.size(), 2);

        var r = set.getBySource("Sports");
        test.ok(r);
        test.equal(r.getSource(), "Sports");
        test.equal(r.getKey(), "Sports");

        var r = set.getBy({
            reskey: "Sports"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "Sports");
        test.equal(r[0].getKey(), "Sports");

        test.done();
    },
        testJsonFiledefaultPath: function(test) {
        test.expect(2);

        var ajf = new JsonFile({
            project: p,
            pathName: ".",
            type: ajft
        });
        test.ok(ajf);

        // should attempt to read the file and not fail
        ajf.extract();

        var set = ajf.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },
    testJsonFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var ajf = new JsonFile({
            project: p,
            pathName: undefined,
            type: ajft
        });
        test.ok(ajf);

        // should attempt to read the file and not fail
        ajf.extract();

        var set = ajf.getTranslationSet();
        test.equal(set.size(), 0);
        test.done();
    },
    testJsonFileTest2: function(test) {
        test.expect(2);

        var ajf = new JsonFile({
            project: p,
            pathName: "./js/t2.js",
            type: ajft
        });
        test.ok(ajf);

        // should attempt to read the file and not fail
        ajf.extract();

        var set = ajf.getTranslationSet();
        test.equal(set.size(), 0);
        test.done();
    },
    testJsonParse: function (test) {
        test.expect(5);
        var ajf = new JsonFile({
            project: p,
            type: ajft
        });
        test.ok(ajf);
        ajf.parse({
            "id": "app",
            "title": "Sports",
            "description": "All sports information in one place",
            "image": "$qcardImage.png",
            "icon": "$sqcard_icon.png"
        });
        var set = ajf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("Sports");
        test.ok(r);
        test.equal(r.getSource(), "Sports");
        test.equal(r.getKey(), "Sports");

        test.done();
    },
    testJsonParseMultiple: function (test) {
        test.expect(6);
        var ajf = new JsonFile({
            project: p,
            type: ajft
        });
        test.ok(ajf);
        ajf.parse({
            "id": "app",
            "title": "Sports",
            "description": "All sports information in one place",
            "image": "$qcardImage.png",
            "icon": "$sqcard_icon.png"
        });
        var set = ajf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 2);

        var r = set.getBySource("All sports information in one place");
        test.ok(r);
        test.equal(r.getSource(), "All sports information in one place");
        test.equal(r.getKey(), "All sports information in one place");
        test.done();

    },
    testJsonLocalzeText: function(test) {
        test.expect(2);
        var ajf = new JsonFile({
            project: p,
            type: ajft
        });
        test.ok(ajf);
        ajf.parse({
            "id": "app",
            "title": "Sports",
            "description": "All sports information in one place",
            "image": "$qcardImage.png",
            "icon": "$sqcard_icon.png"
        });
        var translations = new TranslationSet();
        var resource = new ResourceString({
            project: "app",
            source: "Sports",
            sourceLocale: "en-KR",
            key: "Sports",
            target: "스포츠",
            targetLocale: "ko-KR",
            datatype: "x-json"
        })
        translations.add(resource);

        var actual = ajf.localizeText(translations, "ko-KR");
        var expected = '{\n    "title": "스포츠"\n}';
        test.equal(actual, expected);
        test.done();
    },
    testJsonLocalzeTextMultiple: function(test) {
        test.expect(2);
        var ajf = new JsonFile({
            project: p,
            type: ajft
        });
        test.ok(ajf);
        ajf.parse({
            "id": "app",
            "title": "Sports",
            "description": "All sports information in one place",
            "image": "$qcardImage.png",
            "icon": "$sqcard_icon.png"
        });
        var translations = new TranslationSet();

        translations.add(new ResourceString({
            project: "app",
            source: "Sports",
            sourceLocale: "en-KR",
            key: "Sports",
            target: "스포츠",
            targetLocale: "ko-KR",
            datatype: "javascript"
        }));

        translations.add(new ResourceString({
            project: "app",
            source: "All sports information in one place",
            sourceLocale: "en-KR",
            key: "All sports information in one place",
            target: "모든 스포츠 정보를 한눈에",
            targetLocale: "ko-KR",
            datatype: "x-json"
        }));

        var actual = ajf.localizeText(translations, "ko-KR");
        var expected =
        '{\n    "title": "스포츠",\n'+
        '    "description": "모든 스포츠 정보를 한눈에"\n'+
        '}'
        test.equal(actual, expected);
        test.done();
    },
    testJSONResourceFileGetResourceFilePaths: function(test) {
        test.expect(193);
        var locales = ["af-ZA","am-ET","ar-AE","ar-BH","ar-DJ","ar-DZ","ar-EG","ar-IQ",
        "ar-JO","ar-KW","ar-LB","ar-LY","ar-MA","ar-MR","ar-OM","ar-QA","ar-SA","ar-SD",
        "ar-SY","ar-TN","ar-YE","as-IN","az-Latn-AZ","bg-BG","bn-IN","bs-Latn-BA","bs-Latn-ME",
        "cs-CZ","da-DK","de-AT","de-CH","de-DE","de-LU","el-CY","el-GR","en-AM","en-AU","en-AZ",
        "en-CA","en-CN","en-ET","en-GB","en-GE","en-GH","en-GM","en-HK","en-IE","en-IN","en-IS",
        "en-JP","en-KE","en-LK","en-LR","en-MM","en-MW","en-MX","en-MY","en-NG","en-NZ","en-PH",
        "en-PK","en-PR","en-RW","en-SD","en-SG","en-SL","en-TW","en-TZ","en-UG","en-US","en-ZA",
        "en-ZM","es-AR","es-BO","es-CA","es-CL","es-CO","es-CR","es-DO","es-EC","es-ES","es-GQ",
        "es-GT","es-HN","es-MX","es-NI","es-PA","es-PE","es-PH","es-PR","es-PY","es-SV","es-US",
        "es-UY","es-VE","et-EE","fa-AF","fa-IR","fi-FI","fr-BE","fr-BF","fr-BJ","fr-CA","fr-CD",
        "fr-CF","fr-CG","fr-CH","fr-CI","fr-CM","fr-GQ","fr-DJ","fr-DZ","fr-FR","fr-GA","fr-GN",
        "fr-LB","fr-LU","fr-ML","fr-RW","fr-SN","fr-TG","ga-IE","gu-IN","ha-Latn-NG","he-IL",
        "hi-IN","hr-HR","hr-ME","hu-HU","id-ID","is-IS","it-CH","it-IT","ja-JP","kk-Cyrl-KZ","km-KH",
        "kn-IN","ko-KR","ku-Arab-IQ","lt-LT","lv-LV","mk-MK","ml-IN","mn-Cyrl-MN","mr-IN","ms-MY",
        "ms-SG","nb-NO","nl-BE","nl-NL","or-IN","pa-IN","pa-PK","pl-PL","pt-AO","pt-BR","pt-GQ",
        "pt-CV","pt-PT","ro-RO","ru-BY","ru-GE","ru-KG","ru-KZ","ru-RU","ru-UA","si-LK","sk-SK",
        "sl-SI","sq-AL","sq-ME","sr-Latn-ME","sr-Latn-RS","sv-FI","sv-SE","sw-Latn-KE","ta-IN",
        "te-IN","th-TH","tr-AM","tr-AZ","tr-CY","tr-TR","uk-UA","ur-IN","ur-PK","uz-Latn-UZ","vi-VN",
        "zh-Hans-CN","zh-Hans-MY","zh-Hans-SG","zh-Hant-HK","zh-Hant-TW"];

        var expected = [
            "test/testfiles/localized_json/af/qcardinfo.json",
            "test/testfiles/localized_json/am/qcardinfo.json",
            "test/testfiles/localized_json/ar/AE/qcardinfo.json",
            "test/testfiles/localized_json/ar/BH/qcardinfo.json",
            "test/testfiles/localized_json/ar/DJ/qcardinfo.json",
            "test/testfiles/localized_json/ar/DZ/qcardinfo.json",
            "test/testfiles/localized_json/ar/qcardinfo.json",
            "test/testfiles/localized_json/ar/IQ/qcardinfo.json",
            "test/testfiles/localized_json/ar/JO/qcardinfo.json",
            "test/testfiles/localized_json/ar/KW/qcardinfo.json",
            "test/testfiles/localized_json/ar/LB/qcardinfo.json",
            "test/testfiles/localized_json/ar/LY/qcardinfo.json",
            "test/testfiles/localized_json/ar/MA/qcardinfo.json",
            "test/testfiles/localized_json/ar/MR/qcardinfo.json",
            "test/testfiles/localized_json/ar/OM/qcardinfo.json",
            "test/testfiles/localized_json/ar/QA/qcardinfo.json",
            "test/testfiles/localized_json/ar/SA/qcardinfo.json",
            "test/testfiles/localized_json/ar/SD/qcardinfo.json",
            "test/testfiles/localized_json/ar/SY/qcardinfo.json",
            "test/testfiles/localized_json/ar/TN/qcardinfo.json",
            "test/testfiles/localized_json/ar/YE/qcardinfo.json",
            "test/testfiles/localized_json/as/qcardinfo.json",
            "test/testfiles/localized_json/az/qcardinfo.json",
            "test/testfiles/localized_json/bg/qcardinfo.json",
            "test/testfiles/localized_json/bn/IN/qcardinfo.json",
            "test/testfiles/localized_json/bs/qcardinfo.json",
            "test/testfiles/localized_json/bs/Latn/ME/qcardinfo.json",
            "test/testfiles/localized_json/cs/qcardinfo.json",
            "test/testfiles/localized_json/da/qcardinfo.json",
            "test/testfiles/localized_json/de/AT/qcardinfo.json",
            "test/testfiles/localized_json/de/CH/qcardinfo.json",
            "test/testfiles/localized_json/de/qcardinfo.json",
            "test/testfiles/localized_json/de/LU/qcardinfo.json",
            "test/testfiles/localized_json/el/CY/qcardinfo.json",
            "test/testfiles/localized_json/el/qcardinfo.json",
            "test/testfiles/localized_json/en/AM/qcardinfo.json",
            "test/testfiles/localized_json/en/AU/qcardinfo.json",
            "test/testfiles/localized_json/en/AZ/qcardinfo.json",
            "test/testfiles/localized_json/en/CA/qcardinfo.json",
            "test/testfiles/localized_json/en/CN/qcardinfo.json",
            "test/testfiles/localized_json/en/ET/qcardinfo.json",
            "test/testfiles/localized_json/en/GB/qcardinfo.json",
            "test/testfiles/localized_json/en/GE/qcardinfo.json",
            "test/testfiles/localized_json/en/GH/qcardinfo.json",
            "test/testfiles/localized_json/en/GM/qcardinfo.json",
            "test/testfiles/localized_json/en/HK/qcardinfo.json",
            "test/testfiles/localized_json/en/IE/qcardinfo.json",
            "test/testfiles/localized_json/en/IN/qcardinfo.json",
            "test/testfiles/localized_json/en/IS/qcardinfo.json",
            "test/testfiles/localized_json/en/JP/qcardinfo.json",
            "test/testfiles/localized_json/en/KE/qcardinfo.json",
            "test/testfiles/localized_json/en/LK/qcardinfo.json",
            "test/testfiles/localized_json/en/LR/qcardinfo.json",
            "test/testfiles/localized_json/en/MM/qcardinfo.json",
            "test/testfiles/localized_json/en/MW/qcardinfo.json",
            "test/testfiles/localized_json/en/MX/qcardinfo.json",
            "test/testfiles/localized_json/en/MY/qcardinfo.json",
            "test/testfiles/localized_json/en/NG/qcardinfo.json",
            "test/testfiles/localized_json/en/NZ/qcardinfo.json",
            "test/testfiles/localized_json/en/PH/qcardinfo.json",
            "test/testfiles/localized_json/en/PK/qcardinfo.json",
            "test/testfiles/localized_json/en/PR/qcardinfo.json",
            "test/testfiles/localized_json/en/RW/qcardinfo.json",
            "test/testfiles/localized_json/en/SD/qcardinfo.json",
            "test/testfiles/localized_json/en/SG/qcardinfo.json",
            "test/testfiles/localized_json/en/SL/qcardinfo.json",
            "test/testfiles/localized_json/en/TW/qcardinfo.json",
            "test/testfiles/localized_json/en/TZ/qcardinfo.json",
            "test/testfiles/localized_json/en/UG/qcardinfo.json",
            "test/testfiles/localized_json/qcardinfo.json",
            "test/testfiles/localized_json/en/ZA/qcardinfo.json",
            "test/testfiles/localized_json/en/ZM/qcardinfo.json",
            "test/testfiles/localized_json/es/AR/qcardinfo.json",
            "test/testfiles/localized_json/es/BO/qcardinfo.json",
            "test/testfiles/localized_json/es/CA/qcardinfo.json",
            "test/testfiles/localized_json/es/CL/qcardinfo.json",
            "test/testfiles/localized_json/es/CO/qcardinfo.json",
            "test/testfiles/localized_json/es/CR/qcardinfo.json",
            "test/testfiles/localized_json/es/DO/qcardinfo.json",
            "test/testfiles/localized_json/es/EC/qcardinfo.json",
            "test/testfiles/localized_json/es/qcardinfo.json",
            "test/testfiles/localized_json/es/GQ/qcardinfo.json",
            "test/testfiles/localized_json/es/GT/qcardinfo.json",
            "test/testfiles/localized_json/es/HN/qcardinfo.json",
            "test/testfiles/localized_json/es/MX/qcardinfo.json",
            "test/testfiles/localized_json/es/NI/qcardinfo.json",
            "test/testfiles/localized_json/es/PA/qcardinfo.json",
            "test/testfiles/localized_json/es/PE/qcardinfo.json",
            "test/testfiles/localized_json/es/PH/qcardinfo.json",
            "test/testfiles/localized_json/es/PR/qcardinfo.json",
            "test/testfiles/localized_json/es/PY/qcardinfo.json",
            "test/testfiles/localized_json/es/SV/qcardinfo.json",
            "test/testfiles/localized_json/es/US/qcardinfo.json",
            "test/testfiles/localized_json/es/UY/qcardinfo.json",
            "test/testfiles/localized_json/es/VE/qcardinfo.json",
            "test/testfiles/localized_json/et/qcardinfo.json",
            "test/testfiles/localized_json/fa/AF/qcardinfo.json",
            "test/testfiles/localized_json/fa/qcardinfo.json",
            "test/testfiles/localized_json/fi/qcardinfo.json",
            "test/testfiles/localized_json/fr/BE/qcardinfo.json",
            "test/testfiles/localized_json/fr/BF/qcardinfo.json",
            "test/testfiles/localized_json/fr/BJ/qcardinfo.json",
            "test/testfiles/localized_json/fr/CA/qcardinfo.json",
            "test/testfiles/localized_json/fr/CD/qcardinfo.json",
            "test/testfiles/localized_json/fr/CF/qcardinfo.json",
            "test/testfiles/localized_json/fr/CG/qcardinfo.json",
            "test/testfiles/localized_json/fr/CH/qcardinfo.json",
            "test/testfiles/localized_json/fr/CI/qcardinfo.json",
            "test/testfiles/localized_json/fr/CM/qcardinfo.json",
            "test/testfiles/localized_json/fr/GQ/qcardinfo.json",
            "test/testfiles/localized_json/fr/DJ/qcardinfo.json",
            "test/testfiles/localized_json/fr/DZ/qcardinfo.json",
            "test/testfiles/localized_json/fr/qcardinfo.json",
            "test/testfiles/localized_json/fr/GA/qcardinfo.json",
            "test/testfiles/localized_json/fr/GN/qcardinfo.json",
            "test/testfiles/localized_json/fr/LB/qcardinfo.json",
            "test/testfiles/localized_json/fr/LU/qcardinfo.json",
            "test/testfiles/localized_json/fr/ML/qcardinfo.json",
            "test/testfiles/localized_json/fr/RW/qcardinfo.json",
            "test/testfiles/localized_json/fr/SN/qcardinfo.json",
            "test/testfiles/localized_json/fr/TG/qcardinfo.json",
            "test/testfiles/localized_json/ga/qcardinfo.json",
            "test/testfiles/localized_json/gu/qcardinfo.json",
            "test/testfiles/localized_json/ha/qcardinfo.json",
            "test/testfiles/localized_json/he/qcardinfo.json",
            "test/testfiles/localized_json/hi/qcardinfo.json",
            "test/testfiles/localized_json/hr/qcardinfo.json",
            "test/testfiles/localized_json/hr/ME/qcardinfo.json",
            "test/testfiles/localized_json/hu/qcardinfo.json",
            "test/testfiles/localized_json/id/qcardinfo.json",
            "test/testfiles/localized_json/is/qcardinfo.json",
            "test/testfiles/localized_json/it/CH/qcardinfo.json",
            "test/testfiles/localized_json/it/qcardinfo.json",
            "test/testfiles/localized_json/ja/qcardinfo.json",
            "test/testfiles/localized_json/kk/qcardinfo.json",
            "test/testfiles/localized_json/km/qcardinfo.json",
            "test/testfiles/localized_json/kn/qcardinfo.json",
            "test/testfiles/localized_json/ko/qcardinfo.json",
            "test/testfiles/localized_json/ku/Arab/IQ/qcardinfo.json",
            "test/testfiles/localized_json/lt/qcardinfo.json",
            "test/testfiles/localized_json/lv/qcardinfo.json",
            "test/testfiles/localized_json/mk/qcardinfo.json",
            "test/testfiles/localized_json/ml/qcardinfo.json",
            "test/testfiles/localized_json/mn/qcardinfo.json",
            "test/testfiles/localized_json/mr/qcardinfo.json",
            "test/testfiles/localized_json/ms/qcardinfo.json",
            "test/testfiles/localized_json/ms/SG/qcardinfo.json",
            "test/testfiles/localized_json/nb/qcardinfo.json",
            "test/testfiles/localized_json/nl/BE/qcardinfo.json",
            "test/testfiles/localized_json/nl/qcardinfo.json",
            "test/testfiles/localized_json/or/qcardinfo.json",
            "test/testfiles/localized_json/pa/qcardinfo.json",
            "test/testfiles/localized_json/pa/PK/qcardinfo.json",
            "test/testfiles/localized_json/pl/qcardinfo.json",
            "test/testfiles/localized_json/pt/AO/qcardinfo.json",
            "test/testfiles/localized_json/pt/qcardinfo.json",
            "test/testfiles/localized_json/pt/GQ/qcardinfo.json",
            "test/testfiles/localized_json/pt/CV/qcardinfo.json",
            "test/testfiles/localized_json/pt/PT/qcardinfo.json",
            "test/testfiles/localized_json/ro/qcardinfo.json",
            "test/testfiles/localized_json/ru/BY/qcardinfo.json",
            "test/testfiles/localized_json/ru/GE/qcardinfo.json",
            "test/testfiles/localized_json/ru/KG/qcardinfo.json",
            "test/testfiles/localized_json/ru/KZ/qcardinfo.json",
            "test/testfiles/localized_json/ru/qcardinfo.json",
            "test/testfiles/localized_json/ru/UA/qcardinfo.json",
            "test/testfiles/localized_json/si/qcardinfo.json",
            "test/testfiles/localized_json/sk/qcardinfo.json",
            "test/testfiles/localized_json/sl/qcardinfo.json",
            "test/testfiles/localized_json/sq/qcardinfo.json",
            "test/testfiles/localized_json/sq/ME/qcardinfo.json",
            "test/testfiles/localized_json/sr/Latn/ME/qcardinfo.json",
            "test/testfiles/localized_json/sr/Latn/RS/qcardinfo.json",
            "test/testfiles/localized_json/sv/FI/qcardinfo.json",
            "test/testfiles/localized_json/sv/qcardinfo.json",
            "test/testfiles/localized_json/sw/Latn/KE/qcardinfo.json",
            "test/testfiles/localized_json/ta/qcardinfo.json",
            "test/testfiles/localized_json/te/qcardinfo.json",
            "test/testfiles/localized_json/th/qcardinfo.json",
            "test/testfiles/localized_json/tr/AM/qcardinfo.json",
            "test/testfiles/localized_json/tr/AZ/qcardinfo.json",
            "test/testfiles/localized_json/tr/CY/qcardinfo.json",
            "test/testfiles/localized_json/tr/qcardinfo.json",
            "test/testfiles/localized_json/uk/qcardinfo.json",
            "test/testfiles/localized_json/ur/IN/qcardinfo.json",
            "test/testfiles/localized_json/ur/qcardinfo.json",
            "test/testfiles/localized_json/uz/qcardinfo.json",
            "test/testfiles/localized_json/vi/qcardinfo.json",
            "test/testfiles/localized_json/zh/qcardinfo.json",
            "test/testfiles/localized_json/zh/Hans/MY/qcardinfo.json",
            "test/testfiles/localized_json/zh/Hans/SG/qcardinfo.json",
            "test/testfiles/localized_json/zh/Hant/HK/qcardinfo.json",
            "test/testfiles/localized_json/zh/Hant/TW/qcardinfo.json"
        ];

        for (var i=0; i<locales.length;i++) {
            jsrf = new JsonFile({
                project: p,
                pathName: "./test/testfiles/qcardinfo.json",
                type: ajft,
                locale: locales[i]
            });
            test.equal(jsrf.getLocalizedPath(locales[i]), expected[i]);
        }
        test.done();
    },
    testJSONResourceFileGetResourceFilePathsSimple: function(test) {
        test.expect(10);
        var locales = ["af-ZA","am-ET","ar-AE","ar-BH","ar-DJ","ar-DZ","ar-EG","ar-IQ",
        "ar-JO","ar-KW"];

        var expected = [
            "localized_json/af/qcardinfo.json",
            "localized_json/am/qcardinfo.json",
            "localized_json/ar/AE/qcardinfo.json",
            "localized_json/ar/BH/qcardinfo.json",
            "localized_json/ar/DJ/qcardinfo.json",
            "localized_json/ar/DZ/qcardinfo.json",
            "localized_json/ar/qcardinfo.json",
            "localized_json/ar/IQ/qcardinfo.json",
            "localized_json/ar/JO/qcardinfo.json",
            "localized_json/ar/KW/qcardinfo.json",
        ];

        for (var i=0; i<locales.length;i++) {
            jsrf = new JsonFile({
                project: p,
                pathName: "qcardinfo.json",
                type: ajft,
                locale: locales[i]
            });
            test.equal(jsrf.getLocalizedPath(locales[i]), expected[i]);
        }
        test.done();
    },
    testJSONResourceFileGetResourceFullFilePathsSimple: function(test) {
        test.expect(10);
        var locales = ["af-ZA","am-ET","ar-AE","ar-BH","ar-DJ","ar-DZ","ar-EG","ar-IQ",
        "ar-JO","ar-KW"];

        var expected = [
            "test/testfiles/localized_json/af/qcardinfo.json",
            "test/testfiles/localized_json/am/qcardinfo.json",
            "test/testfiles/localized_json/ar/AE/qcardinfo.json",
            "test/testfiles/localized_json/ar/BH/qcardinfo.json",
            "test/testfiles/localized_json/ar/DJ/qcardinfo.json",
            "test/testfiles/localized_json/ar/DZ/qcardinfo.json",
            "test/testfiles/localized_json/ar/qcardinfo.json",
            "test/testfiles/localized_json/ar/IQ/qcardinfo.json",
            "test/testfiles/localized_json/ar/JO/qcardinfo.json",
            "test/testfiles/localized_json/ar/KW/qcardinfo.json",
        ];

        for (var i=0; i<locales.length;i++) {
            jsrf = new JsonFile({
                project: p,
                pathName: "qcardinfo.json",
                type: ajft,
                locale: locales[i]
            });
            test.equal(jsrf.getfullLocalizedPath(locales[i]), expected[i]);
        }
        test.done();
    },
    testJSONResourceFileGetResourceFilePathsWithTranslations: function(test) {
        test.expect(5);
        var ajf = new JsonFile({
            project: p,
            type: ajft
        });
        test.ok(ajf);
        ajf.parse({
            "id": "app",
            "title": "Live TV",
        });
        var translations = new TranslationSet();
        var resource = new ResourceString({
            project: "app",
            source: "Live TV",
            sourceLocale: "en-KR",
            key: "Live TV",
            target: "(fr-FR) Live TV",
            targetLocale: "fr-FR",
            datatype: "x-json"
        })
        translations.add(resource);

        var resource2 = new ResourceString({
            project: "app",
            source: "Live TV",
            sourceLocale: "en-KR",
            key: "Live TV",
            target: "(fr-CA) Live TV",
            targetLocale: "fr-CA",
            datatype: "x-json"
        })
        translations.add(resource2);

        var actual = ajf.localizeText(translations, "fr-FR");
        var expected = '{\n    "title": "(fr-FR) Live TV"\n}';
        test.equal(actual, expected);
        var actual2 = ajf.localizeText(translations, "fr-CA");
        var expected2 = '{\n    "title": "(fr-CA) Live TV"\n}';
        test.equal(actual2, expected2);

        test.equal(ajf.getLocalizedPath("fr-FR"), "localized_json/fr/");
        test.equal(ajf.getLocalizedPath("fr-CA"), "localized_json/fr/CA/");
        test.done();
    },
    testJsonLocalzeTextWithBaseTranslations: function(test) {
        test.expect(4);
        var ajf = new JsonFile({
            project: p,
            type: ajft
        });
        test.ok(ajf);
        ajf.parse({
            "id": "app",
            "title": "Live TV",
        });
        var translations = new TranslationSet();
        var resource = new ResourceString({
            project: "app",
            source: "Live TV",
            sourceLocale: "en-KR",
            key: "Live TV",
            target: "(fr) Live TV",
            targetLocale: "fr-FR",
            datatype: "x-json"
        })
        translations.add(resource);

        var resource2 = new ResourceString({
            project: "app",
            source: "Live TV",
            sourceLocale: "en-KR",
            key: "Live TV",
            target: "(fr) Live TV",
            targetLocale: "fr-CA",
            datatype: "x-json"
        })
        translations.add(resource2);

        var actual = ajf.localizeText(translations, "fr-FR");
        var expected = '{\n    "title": "(fr) Live TV"\n}';
        test.equal(actual, expected);
        var actual2 = ajf.localizeText(translations, "fr-CA");
        var expected2 = '{}';
        test.equal(actual2, expected2);

        test.equal(ajf.getLocalizedPath("fr-FR"), "localized_json/fr/");
        test.done();
    }
};
