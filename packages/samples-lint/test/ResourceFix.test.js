/*
 * ResourceFix.test.js - test to check if the resource has been fixed
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

import path from 'path';
import { loadFileData, isValidPath } from "./utils.js";

const findTarget = (units, srcString) => {
    for (const unit of units) {
        if (unit?.segment?.source?._text === srcString) {
            return unit.segment.target?._text ?? '';
        }
    }
    return '';
};

describe('test if the resource is modifed properly', () => {
    let filePath, result;
    test("test resource-edge-whitespace (am-ET)", function() {
        expect.assertions(3);
        const source = "You can use your Magic Remote to determine the room’s acoustics and optimize your TV’s sound quality based on the results."
        const target = "MAGIC REMOTE በመጠቀም የክፍሉን የድምጽ ማስተጋባት አና በውጤቶቹ መሰረት የቲቪዎን የድምጽ ጥራት ማሰተካከል እና መቆጣጠር ይችላሉ፡፡";

        filePath = path.join('sample-rs-edge-whitespace', 'am-ET.xliff.modified'); // autofix
        xliffData = isValidPath(filePath) ? loadFileData(filePath) : {};
        expect(xliffData).toBeTruthy();

        result = findTarget(xliffData.group.unit, source);
        expect(result).toBe(target);

        filePath = path.join('sample-rs-edge-whitespace', 'am-ET.xliff'); //original
        xliffData = isValidPath(filePath) ? loadFileData(filePath) : {};
        result = findTarget(xliffData.group.unit, source);
        expect(result).not.toBe(target);
    });

    test("test am-ET.xliff.modified file", function() {
        expect.assertions(1);

        filePath = path.join('sample-rs-edge-whitespace', 'am-ET.xliff.modified'); // autofix
        xliffData = isValidPath(filePath) ? loadFileData(filePath) : {};
        expect(xliffData).toMatchSnapshot();
    });

    test("test resource-edge-whitespace (zh-Hans-CN) 1", function() {
        expect.assertions(3);
        const source = "Select your remote's cursor speed and appearance."
        const target = "选择您遥控器的光标速度和外观。";

        filePath = path.join('sample-rs-edge-whitespace', 'zh-Hans-CN.xliff.modified'); // autofix
        xliffData = isValidPath(filePath) ? loadFileData(filePath) : {};
        expect(xliffData).toBeTruthy();

        result = findTarget(xliffData.group.unit, source);
        expect(result).toBe(target);

        filePath = path.join('sample-rs-edge-whitespace', 'zh-Hans-CN.xliff'); //original
        xliffData = isValidPath(filePath) ? loadFileData(filePath) : {};
        result = findTarget(xliffData.group.unit, source);
        expect(result).not.toBe(target);
    });

    test("test resource-edge-whitespace (zh-Hans-CN) 2", function() {
        expect.assertions(3);
        const source = "press OK button to go to next menu"
        const target = "按“确定”按钮以前往下一个菜单";

        filePath = path.join('sample-rs-edge-whitespace', 'zh-Hans-CN.xliff.modified'); // autofix
        xliffData = isValidPath(filePath) ? loadFileData(filePath) : {};
        expect(xliffData).toBeTruthy();

        result = findTarget(xliffData.group.unit, source);
        expect(result).toBe(target);

        filePath = path.join('sample-rs-edge-whitespace', 'zh-Hans-CN.xliff'); //original
        xliffData = isValidPath(filePath) ? loadFileData(filePath) : {};
        result = findTarget(xliffData.group.unit, source);
        expect(result).not.toBe(target);
    });

    test("test resource-edge-whitespace (zh-Hans-CN) 3", function() {
        expect.assertions(3);
        const source = "If the image isn't clear, select another pattern until the picture improves."
        const target = "如果图像不清晰，请选择另一模式，直至图片更加清晰。";

        filePath = path.join('sample-rs-edge-whitespace', 'zh-Hans-CN.xliff.modified'); // autofix
        xliffData = isValidPath(filePath) ? loadFileData(filePath) : {};
        expect(xliffData).toBeTruthy();

        result = findTarget(xliffData.group.unit, source);
        expect(result).toBe(target);

        filePath = path.join('sample-rs-edge-whitespace', 'zh-Hans-CN.xliff'); //original
        xliffData = isValidPath(filePath) ? loadFileData(filePath) : {};
        result = findTarget(xliffData.group.unit, source);
        expect(result).not.toBe(target);
    });
    test("test resource-edge-whitespace (cs-CZ)", function() {
        expect.assertions(3);
        const source = "Password"
        const target = "Heslo";

        filePath = path.join('sample-rs-edge-whitespace', 'cs-CZ.xliff.modified'); // autofix
        xliffData = isValidPath(filePath) ? loadFileData(filePath) : {};
        expect(xliffData).toBeTruthy();

        result = findTarget(xliffData.group.unit, source);
        expect(result).toBe(target);

        filePath = path.join('sample-rs-edge-whitespace', 'cs-CZ.xliff'); //original
        xliffData = isValidPath(filePath) ? loadFileData(filePath) : {};
        result = findTarget(xliffData.group.unit, source);
        expect(result).not.toBe(target);
    });

    test("test cs-CZ.xliff.modified file", function() {
        expect.assertions(1);

        filePath = path.join('sample-rs-edge-whitespace', 'cs-CZ.xliff.modified'); // autofix
        xliffData = isValidPath(filePath) ? loadFileData(filePath) : {};
        expect(xliffData).toMatchSnapshot();
    });
});