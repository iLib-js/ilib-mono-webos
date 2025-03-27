/*
 * QmlApp.test.js - test the localization result of webos-qml app.
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

const { exec } = require('child_process');
const path = require('path');
const { isValidPath, loadTSData } = require('../../Utils.js');

const makeArray = function (data) {
  return Array.isArray(data) ? data : [data]
};

describe('test the localization result of webos-qml app', () => {
    const resourcePath = 'resources';

    const generalOptions = '-2 --xliffStyle custom --pseudo --localizeOnly';
    const localeInherit = '--localeInherit en-AU:en-GB,en-JP:en-GB';
    const localeMap = '--localeMap es-CO:es';

    let filePath, tsData = {};

    beforeAll(async() => {
      await new Promise((resolve, reject) => {
        exec(`npm run clean; loctool ${generalOptions} ${localeMap} ${localeInherit}`, (error, stdout, stderr) => {
          if (error) {
            return reject(error);
          }
          resolve(stdout);
        });
      });
    }, 50000);
    test("qmlsample_test_ko_KR", function() {
        expect.assertions(19);
        
        const expected = {
          "StringSheet": [ "앨범", "(common) 명칭 순", "오디오", "저장 안 함", "장르",
                      "컨텐츠 로딩 중입니다.\n잠시만 기다려 주세요.",
                      "기 본", "음악", '네트워크가 연결되지 않았습니다.\n네트워크 설정 확인 후 다시 시도하세요.',
                      "재생 중", "재생목록",'[common] 비밀번호를 입력해 주세요.', "노래", "[common] 시간 설정"],
          "context" : ["검색"],
          "sample" : ["설정"],
          "systemUI": ['사용할 수 없는 기능입니다.'],
          "appLaunch": ['사용할 수 없는 기능입니다.']
        };

        filePath = path.join(resourcePath, 'music_ko.ts');
        tsData = isValidPath(filePath) ? loadTSData(filePath) : tsData;
        expect(tsData).toBeTruthy();

        const contextResArr = makeArray(tsData.context);
        expect(contextResArr.length).toBe(4);

        contextResArr.forEach(({ name: { _text: name }, message }) => {
          const messages = [].concat(message);
          messages.forEach(({ translation: { _text: translation } }, idx) => {
              expect(translation).toBe(expected[name][idx]);
          });
        });
    });
    test("qmlsample_test_en_US", function() {
      expect.assertions(4);
      const expected = {"StringSheet": ["Service Area Zip Code", "TV Program Locks"]};

      filePath = path.join(resourcePath, 'music_en.ts');
      tsData = isValidPath(filePath) ? loadTSData(filePath) : tsData;
      expect(tsData).toBeTruthy();

      const contextResArr = makeArray(tsData.context);;
      expect(contextResArr.length).toBe(1);

      contextResArr.forEach(({ name: { _text: name }, message }) => {
        const messages = [].concat(message);
        messages.forEach(({ translation: { _text: translation } }, idx) => {
            expect(translation).toBe(expected[name][idx]);
        });
      });
    });
    test("qmlsample_test_en_JP", function() {
      expect.assertions(8);
      const expected = {
        "StringSheet": ["(common) App Name\n(A to Z)", "Game Optimiser", "HDMI Deep Colour",
            "(enGB) Loading.\nPlease wait.", "Service Area Postcode", "TV Rating Locks"]
      };

      filePath = path.join(resourcePath, 'music_en_JP.ts');
      tsData = isValidPath(filePath) ? loadTSData(filePath) : tsData;
      expect(tsData).toBeTruthy();

      const contextResArr = makeArray(tsData.context);;
      expect(contextResArr.length).toBe(1);

      contextResArr.forEach(({ name: { _text: name }, message }) => {
        const messages = [].concat(message);
        messages.forEach(({ translation: { _text: translation } }, idx) => {
            expect(translation).toBe(expected[name][idx]);
        });
      });
    });
    test("qmlsample_test_en_GB", function() {
      expect.assertions(8);
      
      const expected = {
        "StringSheet": ["(common) App Name\n(A to Z)", "Game Optimiser", "HDMI Deep Colour",
            "(enGB) Loading.\nPlease wait.", "Service Area Postcode", "TV Rating Locks"]
      };
      
      filePath = path.join(resourcePath, 'music_en_GB.ts');
      tsData = isValidPath(filePath) ? loadTSData(filePath) : tsData;
      expect(tsData).toBeTruthy();
      
      const contextResArr = makeArray(tsData.context);;
      expect(contextResArr.length).toBe(1);

      contextResArr.forEach(({ name: { _text: name }, message }) => {
        const messages = [].concat(message);
        messages.forEach(({ translation: { _text: translation } }, idx) => {
            expect(translation).toBe(expected[name][idx]);
        });
      });
    });
    test("qmlsample_test_en_AU", function() {
      expect.assertions(8);
      const expected = {
        "StringSheet": ["(common) App Name\n(A to Z)", "Game Optimiser", "HDMI Deep Colour",
            "(enGB) Loading.\nPlease wait.", "Service Area Postcode", "TV Rating Locks"]
      };

      filePath = path.join(resourcePath, 'music_en_AU.ts');
      tsData = isValidPath(filePath) ? loadTSData(filePath) : tsData;
      expect(tsData).toBeTruthy();

      const contextResArr = makeArray(tsData.context);;
      expect(contextResArr.length).toBe(1);

      contextResArr.forEach(({ name: { _text: name }, message }) => {
        const messages = [].concat(message);
        messages.forEach(({ translation: { _text: translation } }, idx) => {
            expect(translation).toBe(expected[name][idx]);
        });
      });
    });
    test("qmlsample_test_es_ES", function() {
      expect.assertions(3);
      const expected = {
        "StringSheet": ["Salida de sonido"]
      };

      filePath = path.join(resourcePath, 'music_es_ES.ts');
      tsData = isValidPath(filePath) ? loadTSData(filePath) : tsData;
      expect(tsData).toBeTruthy();

      const contextResArr = makeArray(tsData.context);
      expect(contextResArr.length).toBe(1);

      contextResArr.forEach(({ name: { _text: name }, message }) => {
        const messages = [].concat(message);
        messages.forEach(({ translation: { _text: translation } }, idx) => {
            expect(translation).toBe(expected[name][idx]);
        });
      });
    });
    test("qmlsample_test_es_CO", function() {
      expect.assertions(3);
      const expected = {
        "StringSheet": ["Salida de Audio"]
      };

      filePath = path.join(resourcePath, 'music_es.ts');
      tsData = isValidPath(filePath) ? loadTSData(filePath) : tsData;
      expect(tsData).toBeTruthy();

      const contextResArr = makeArray(tsData.context);;
      expect(contextResArr.length).toBe(1);

      contextResArr.forEach(({ name: { _text: name }, message }) => {
        const messages = [].concat(message);
        messages.forEach(({ translation: { _text: translation } }, idx) => {
            expect(translation).toBe(expected[name][idx]);
        });
      });
    });
    test("qmlsample_test_fr_FR", function() {
      expect.assertions(4);
      const expected = {
        "StringSheet": ["Quitter", "Autres"]
      };

      filePath = path.join(resourcePath, 'music_fr_FR.ts');
      tsData = isValidPath(filePath) ? loadTSData(filePath) : tsData;
      expect(tsData).toBeTruthy();

      const contextResArr = makeArray(tsData.context);
      expect(contextResArr.length).toBe(1);

      contextResArr.forEach(({ name: { _text: name }, message }) => {
        const messages = [].concat(message);
        messages.forEach(({ translation: { _text: translation } }, idx) => {
            expect(translation).toBe(expected[name][idx]);
        });
      });
    });
    test("qmlsample_test_fr_CA", function() {
      expect.assertions(3);
      const expected = {
        "StringSheet": ["Quitter"]
      };

      filePath = path.join(resourcePath, 'music_fr.ts');
      tsData = isValidPath(filePath) ? loadTSData(filePath) : tsData;
      expect(tsData).toBeTruthy();

      const contextResArr = makeArray(tsData.context);
      expect(contextResArr.length).toBe(1);

      contextResArr.forEach(({ name: { _text: name }, message }) => {
        const messages = [].concat(message);
        messages.forEach(({ translation: { _text: translation } }, idx) => {
            expect(translation).toBe(expected[name][idx]);
        });
      });
    });
    test("qmlsample_test_it_IT", function() {
      expect.assertions(11);
      const expected = {
        "StringSheet": ["Album", "Audio", "Generi", "Musica", "Ora in riproduzione", "Elenco di riproduzione",
        "[common] Immettere la password.", "Canzoni", "[common] Impostazioni Orario"]
      };

      filePath = path.join(resourcePath, 'music_it.ts');
      tsData = isValidPath(filePath) ? loadTSData(filePath) : tsData;
      expect(tsData).toBeTruthy();

      const contextResArr = makeArray(tsData.context);
      expect(contextResArr.length).toBe(1);

      contextResArr.forEach(({ name: { _text: name }, message }) => {
        const messages = [].concat(message);
        messages.forEach(({ translation: { _text: translation } }, idx) => {
            expect(translation).toBe(expected[name][idx]);
        });
      });
    });
    test("qmlsample_test_as_IN", function() {
      expect.assertions(4);
      const expected = {
        "StringSheet": ["পুনৰ চেষ্টা", "পুনৰাম্ভ কৰক"]
      };

      filePath = path.join(resourcePath, 'music_as.ts');
      tsData = isValidPath(filePath) ? loadTSData(filePath) : tsData;
      expect(tsData).toBeTruthy();

      const contextResArr = makeArray(tsData.context);
      expect(contextResArr.length).toBe(1);

      contextResArr.forEach(({ name: { _text: name }, message }) => {
        const messages = [].concat(message);
        messages.forEach(({ translation: { _text: translation } }, idx) => {
            expect(translation).toBe(expected[name][idx]);
        });
      });
    });
});