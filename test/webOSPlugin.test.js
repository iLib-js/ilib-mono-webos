/*
 * webOSPlugin.test.js - test the webOS plugin
 *
 * Copyright © 2024 JEDLSoft
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
import webOSPlugin from '../src/index.js';

describe("testwebOSPlugin", () => {
    test("webOSPlugin", () => {
        expect.assertions(1);

        const xp = new webOSPlugin();
        expect(xp).toBeTruthy();
    });

    test("webOSPluginGetFormatters", () => {
        expect.assertions(4);

        const xp = new webOSPlugin();
        expect(xp).toBeTruthy();
        const formatters = xp.getFormatters();
        expect(formatters).toBeTruthy();
        expect(formatters.length).toBe(1);
        expect(formatters[0].name).toBe("HtmlFormatter");
    });
});
