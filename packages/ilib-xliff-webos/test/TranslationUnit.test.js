/*
 * TranslastionUnit.test.js - test the TranslastionUnit object.
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


import TranslationUnit from "../src/TranslationUnit.js";

describe("TranslationUnit", () => {
    const validOptions = {
        source: 'Hello',
        sourceLocale: 'en-US',
        key: 'Hello',
        file: 'src/index.js',
        project: 'testProject',
        target: '안녕',
        targetLocale: 'ko-KR'
    };

     test('should create a TranslationUnit instance with valid options', () => {
        const unit = new TranslationUnit(validOptions);
        expect(unit).toBeInstanceOf(TranslationUnit);
        expect(unit.source).toBe('Hello');
        expect(unit.target).toBe('안녕');
        expect(unit.project).toBe('testProject');
    });
    test('should throw an error if required parameters are missing', () => {
        const incompleteOptions = {
            source: 'Hello',
            key: 'greeting.hello',
            file: 'src/index.js',
        };
        expect(() => new TranslationUnit(incompleteOptions)).toThrow(
            /Missing required parameters/
        );
    });
    test('should allow creating an empty TranslationUnit when no options are provided', () => {
        const unit = new TranslationUnit();
        expect(unit).toBeInstanceOf(TranslationUnit);
        expect(Object.keys(unit).length).toBe(0);
    });

    test('clone() should return a new instance with the same properties', () => {
        const unit = new TranslationUnit(validOptions);
        const clone = unit.clone();

        expect(clone).toBeInstanceOf(TranslationUnit);
        expect(clone).not.toBe(unit);
        expect(clone).toEqual(unit);
    });

    test('clone() should not affect the original when modified', () => {
        const unit = new TranslationUnit(validOptions);
        const clone = unit.clone();
        clone.target = '안녕하세요';

        expect(unit.target).toBe('안녕');
        expect(clone.target).toBe('안녕하세요');
    });
});
