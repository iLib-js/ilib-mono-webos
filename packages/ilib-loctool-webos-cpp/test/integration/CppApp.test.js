/*
 * CppApp.test.js - test the localization result in localize mode of webos-cpp app
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


const fs = require("fs");
const path = require('path');

const ProjectFactory = require("loctool/lib/ProjectFactory.js");

const isValidPath = (filepath) => {
  return filepath ? fs.existsSync(filepath) : false;
}

const loadData = (filepath) => {
  try {
      const readData = fs.readFileSync(filepath, 'utf-8');
      return JSON.parse(readData);
  } catch (error) {
      console.error(`Error reading or parsing file: ${error.message}`);
      return null;
  }
}

describe("[integration] test the localization result of webos-cpp app", () => {
    const projectRoot = "./test/integration";
    let filePath, jsonData;
    const resourcePath = path.join(projectRoot, "resources");
    const fileName = "cppstrings.json";

    beforeAll(async() => {
        if (fs.existsSync(resourcePath)) {
            fs.rmSync(resourcePath, { recursive: true });
        }
        const projectSettings = {
            "rootDir": projectRoot, 
            "id": "sample-webos-cpp",
            "projectType": "webos-cpp",
            "sourceLocale": "en-KR",
            "resourceDirs" : { "json": "resources" },
            "resourceFileTypes": { "json":"ilib-loctool-webos-json-resource" },
            "plugins": [ "ilib-loctool-webos-cpp" ],
            "xliffStyle": "custom",
            "xliffVersion": 2,
        };

        const appSettings = {
            localizeOnly: true,
            xliffsDir: "./xliffs",  // under projectRoot
            mode: "localize",
            xliffVersion: 2,
            nopseudo: true,
            resourceFileNames: { "cpp": fileName },
            webos: {
                "commonXliff": "./test/integration/common"
            },
            locales:[
                "en-AU",
                "en-GB",
                "en-US",
                "es-CO",
                "es-ES",
                "ja-JP",
                "ko-KR",
                "fr-CA",
                "fr-FR"
            ],
            localeMap: {
                "es-CO": "es",
                "fr-CA": "fr"
            },
            localeInherit: {
                "en-AU": "en-GB",
            }
        };
        var project = ProjectFactory.newProject(projectSettings, appSettings);

        project.addPath("srcfiles/test.cpp");

        if (project) {
            project.init(function() {
                project.extract(function() {
                    project.write(function() {
                        project.save(function() {
                            project.close(function() {
                            });
                        });
                    });
                });
            });
        }
        
    }, 50000);

    afterAll(async () => {
        if (fs.existsSync(resourcePath)) {
            fs.rmSync(resourcePath, { recursive: true });
        }
     });
        
    test("cppsample_test_ko_KR", function() {
        expect.assertions(4);
        filePath = path.join(resourcePath, 'ko', fileName);
        jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["No"]).toBe("아니오");
        expect(jsonData["Update"]).toBe("업데이트");
        expect(jsonData["Update"]).toBe("업데이트");
    });
    test("cppsample_test_en_US", function() {
        expect.assertions(3);
        filePath = path.join(resourcePath, fileName);
        jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["Ivory Coast"]).toBe("Côte d’Ivoire");
        expect(jsonData["Programme"]).toBe("Channel");
    });
    test("cppsample_test_en_AU", function() {
        expect.assertions(8);
        filePath = path.join(resourcePath, "en/AU", fileName);
        jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["Service Area Zip Code"]).toBe("Service Area Postcode");
        expect(jsonData["TV Program Locks"]).toBe("TV Rating Locks");
        expect(jsonData["Programme"]).toBe("Programme");
        expect(jsonData["Game Optimizer"]).toBe("Game Optimiser"); //common data
        expect(jsonData["HDMI Deep Color"]).toBe("HDMI Deep Colour"); //common data
        expect(jsonData["Programme"]).toBeTruthy();
        expect(jsonData["Ivory Coast"]).toBeFalsy();
    });
    test("cppsample_test_en_GB", function() {
        expect.assertions(8);
        filePath = path.join(resourcePath, "en/GB", fileName);
        jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["Service Area Zip Code"]).toBe("Service Area Postcode");
        expect(jsonData["TV Program Locks"]).toBe("TV Rating Locks");
        expect(jsonData["Programme"]).toBe("Programme");
        expect(jsonData["Game Optimizer"]).toBe("Game Optimiser"); //common data
        expect(jsonData["HDMI Deep Color"]).toBe("HDMI Deep Colour"); //common data
        expect(jsonData["Programme"]).toBeTruthy();
        expect(jsonData["Ivory Coast"]).toBeFalsy();
    });
    test("cppsample_test_fr_CA", function() {
        expect.assertions(6);
        filePath = path.join(resourcePath, "fr", fileName);
        jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["Agree"]).toBe("D’accord");
        expect(jsonData["Programme"]).toBe("Programme");
        expect(jsonData["Others"]).toBe("Autres");
        expect(jsonData["Others"]).toBe("Autres");
        expect(jsonData["Exit"]).toBe("Quitter"); //common data
    });
    test("cppsample_test_fr_FR", function() {
        expect.assertions(5);
        filePath = path.join(resourcePath, "fr/FR", fileName);
        jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["Agree"]).toBe("J'accepte");
        expect(jsonData["Agree"]).toBe("J'accepte");
        expect(jsonData["Others"]).toBeFalsy();
        expect(jsonData["Exit"]).toBeFalsy();
    });
    test("cppsample_test_es_ES", function() {
        expect.assertions(4);
        filePath = path.join(resourcePath, "es/ES", fileName);
        jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["Sound Out"]).toBe("Salida de sonido");
        expect(jsonData["OK"]).toBe("OK");
        expect(jsonData["OK"]).toBeTruthy();
    });
    test("cppsample_test_es_CO", function() {
        expect.assertions(3);
        filePath = path.join(resourcePath, "es", fileName);
        jsonData = isValidPath(filePath) ? loadData(filePath) : jsonData;

        expect(jsonData).toBeTruthy();
        expect(jsonData["Sound Out"]).toBe("Salida de Audio");
        expect(jsonData["OK"]).toBe("Aceptar");
    });

  });
