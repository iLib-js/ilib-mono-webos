/*
 * webOSPlugin.test.js - test the webOS plugin
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
import webOSPlugin from '../src/index.js';
import HtmlFormatter from '../src/HtmlFormatter.js';
import { Rule, Result } from 'ilib-lint-common';

class MockRule extends Rule {
    constructor(options) {
        super(options);
        this.name = "mock";
        this.description = "asdf asdf";
        this.link = "https://github.com/docs/rule.md";
    }
}

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

    test('test format() of HtmlFormatter', () => {
        expect.assertions(1);
        let mockRule =  new MockRule();
        const formatter = new HtmlFormatter();

        const result = formatter.format(new Result({
            description: "A description for testing purposes",
            highlight: "This is just <e0>me</e0> testing.",
            id: "test.id",
            lineNumber: 123,
            pathName: "test.txt",
            rule: mockRule,
            severity: "error",
            source: "test",
            locale: "de-DE"
        }));

        const expected =
            '<table>\n' +
            '<thead>\n' +
            '<tr><th colspan="2" style=padding-left:8px;color:white;black;background-color:maroon;text-align:left;font-size:22px; width=280px;>[error]</th><th style="text-align:left"></th></tr>\n' +
            '<tr><td style="padding-left:8px;background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;text-align:left;color:Cadetblue;font-weight:bold">filepath</td><td style="background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;padding-left:8px;padding-right:30px;color:Cadetblue;font-weight:bold">test.txt</td></tr>\n' +
            '<tr><td style="padding-left:8px;background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;color:red; text-align:left">Descriptions</td><td style="background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;padding-left:8px;color:red;">A description for testing purposes</td></tr>\n' +
            '<tr><td style="padding-left:8px;background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;">key</td><td style="background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;padding-left:8px;padding-right:30px">test.id</td></tr>\n' +
            '<tr><td style="padding-left:8px;background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;">source</td><td style="background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;padding-left:8px;padding-right:30px">test</td></tr>\n' +
            '<tr><td style="padding-left:8px;background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;">target</td><td style="background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;padding-left:8px;padding-right:30px">This is just <span style="color:red">me</span> testing.</td></tr>\n' +
            '<tr><td style="padding-left:8px;background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;padding-right:20px">mock</td><td style="background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;padding-left:8px;padding-right:30px">asdf asdf</td></tr>\n' +
            '<tr><td style="padding-left:8px;background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;">More info</td><td style="background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;padding-left:8px;"><a href=https://github.com/docs/rule.md>https://github.com/docs/rule.md</td></tr>\n' +
            '<tr><td style="padding-left:8px;background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;">Auto-fix</td><td style="background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;padding-left:8px;">unavailable</td></tr>\n' +
            '<thead>\n' +
            '<table>\n' +
            '<br>\n';
        expect(result).toBe(expected);
    });

    test('test formatOutput() of HtmlFormatter', () => {
        expect.assertions(1);

        let mockRule =  new MockRule();
        const formatter = new HtmlFormatter();

        let options = {
            prjName: "sample-app",
            results: [
                new Result({
                    description: "A description for testing purposes",
                    highlight: "This is just <e0>me</e0> testing.",
                    id: "test.id",
                    lineNumber: 123,
                    pathName: "test.txt",
                    rule: mockRule,
                    severity: "error",
                    source: "test",
                    fix: {
                        type: "resource",
                        applied: false
                    }
                })
            ],
            fileStats: {
                files: 1,
                lines: 10,
                bytes: 100,
                modules: 1
            },
            resultStats: {
                errors:11,
                warning: 0,
                suggestions: 0
            }
        }

        const actual = formatter.formatOutput(options);
        const expected =
            '<!DOCTYPE html>\n' +
            '<html>\n' +
            '<head>\n' +
            '<title>ilib-lint Result for webOS Apps</title>\n' +
            '<meta charset=\"UTF-8\">\n' +
            '</head>\n' +
            '<body>\n' +
            '<p style=\"color:#714AFF;text-align:left;font-size:30px;font-weight:bold\" width=300px;> [undefined] Summary</p>\n' +
            '<table>\n' +
            '<thead>\n' +
            '<tr><td style=\"font-size:20px\">Total Elapsed Time : </td>\n' +
            '<td style=\"font-size:20px;color:green;font-weight:bold\">undefinedseconds</td></tr>\n' +
            '<tr><td></td><td></td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\"width=150px;>Average over</td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\"width=150px;>Average over</td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\"width=150px;>Average over</td>\n' +
            '</tr><tr>\n' +
            '<td></td><td style=\"border-bottom:2px solid #ddd;\">Total</td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\">1 Files</td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\">1 Modules</td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\">10 Lines</td></tr>\n' +
            '<tr>\n' +
            '<td style=\"border-bottom:2px solid #ddd;font-size:20px\">Errors:</td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;font-weight:bold;font-size:20px;color:red\">11</td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\">11             </td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\">11             </td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\">1.1            </td>\n' +
            '</tr><tr>\n' +
            '<td style=\"border-bottom:2px solid #ddd;font-size:20px\">Warnings:</td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;font-weight:bold;font-size:20px;color:orange\">undefined</td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\">NaN            </td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\">NaN            </td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\">NaN            </td>\n' +
            '</tr><tr>\n' +
            '<td>Suggestions:</td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\">0</td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\">0              </td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\">0              </td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\">0              </td>\n' +
            '</tr><tr>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\">I18N Score(0-100)</td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\">NaN</td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\"></td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\"></td>\n' +
            '<td style=\"border-bottom:2px solid #ddd;\"></td>\n' +
            '</tr>\n' +
            '</thead>\n' +
            '</table>\n' +
            '<br/>\n' +
            '<hr align=\"left\" width=\"1100px\"/>\n' +
            '<div id=\"detail-section\"><p style=\"color:#714AFF; text-align:left; font-size:30px; font-weight:bold\" width=320px;>Detailed Information</p><table>\n' +
            '<thead>\n' +
            '<tr><th colspan=\"2\" style=padding-left:8px;color:white;black;background-color:maroon;text-align:left;font-size:22px; width=280px;>[error]</th><th style=\"text-align:left\"></th></tr>\n' +
            '<tr><td style=\"padding-left:8px;background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;text-align:left;color:Cadetblue;font-weight:bold\">filepath</td><td style=\"background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;padding-left:8px;padding-right:30px;color:Cadetblue;font-weight:bold\">test.txt</td></tr>\n' +
            '<tr><td style=\"padding-left:8px;background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;color:red; text-align:left\">Descriptions</td><td style=\"background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;padding-left:8px;color:red;\">A description for testing purposes</td></tr>\n' +
            '<tr><td style=\"padding-left:8px;background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;\">key</td><td style=\"background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;padding-left:8px;padding-right:30px\">test.id</td></tr>\n' +
            '<tr><td style=\"padding-left:8px;background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;\">source</td><td style=\"background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;padding-left:8px;padding-right:30px\">test</td></tr>\n' +
            '<tr><td style=\"padding-left:8px;background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;\">target</td><td style=\"background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;padding-left:8px;padding-right:30px\">This is just <span style=\"color:red\">me</span> testing.</td></tr>\n' +
            '<tr><td style=\"padding-left:8px;background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;padding-right:20px\">mock</td><td style=\"background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;padding-left:8px;padding-right:30px\">asdf asdf</td></tr>\n' +
            '<tr><td style=\"padding-left:8px;background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;\">More info</td><td style=\"background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;padding-left:8px;\"><a href=https://github.com/docs/rule.md>https://github.com/docs/rule.md</td></tr>\n' +
            '<tr><td style=\"padding-left:8px;background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;\">Auto-fix</td><td style=\"background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;padding-left:8px;\">false</td></tr>\n' +
            '<thead>\n' +
            '<table>\n' +
            '<br>\n' +
            '</div></body>\n' +
            '</html>\n';
        expect(actual).toBe(expected);

    });
});
