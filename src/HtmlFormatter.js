/*
 * HtmlFormatter.js - Formats result output
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
import log4js from 'log4js';
import { Formatter, Result } from 'ilib-lint-common';

var logger = log4js.getLogger("ilib-lint.formatters.HtmlFormatter");

/**
 * @class Represent an output formatter for an ANSI console/terminal
 */
class HtmlFormatter extends Formatter {
    /**
     * Construct an formatter instance.
     * @constructor
     */
    constructor(options) {
        super(options);
        this.name = "html-formatter";
        this.description = "Formats results for an html file with colors.";
    }
    _formatSummary(prjName, totaltime, fileStats, resultStats, score) {
        const fmt = new Intl.NumberFormat("en-US", {
            maxFractionDigits: 2
        });

        let summaryTable = '<p style="color:#714AFF;text-align:left;font-size:30px;font-weight:bold" width=300px;> [' + prjName + '] Summary</p>\n'+
                           '<table>\n' +
                           '<thead>\n' +
                           '<tr><td style="font-size:20px">Total Elapsed Time</td>\n' +
                           '<td style="font-size:20px;color:green;font-weight:bold">' + totaltime + 'seconds</td></tr>\n' +
                           '<tr><td></td><td></td>\n' +
                           '<td width=150px;>Average over</td>\n' +
                           '<td width=150px;>Average over</td>\n' +
                           '<td width=150px;>Average over</td>\n' +
                           '</tr><tr>\n'  +
                           '<td></td><td>Total</td>\n' +
                           '<td>' + fileStats.files +  ' Files</td>\n' +
                           '<td>' + fileStats.modules + ' Modules</td>\n' +
                           '<td>' + fileStats.lines + ' Lines</td></tr>\n' +
                           '<tr>\n' +
                           '<td style="font-size:20px">Errors:</td>\n' +
                           '<td style="font-size:20px;color:red">' + resultStats.errors + '</td>\n' +
                           '<td>' + fmt.format(resultStats.errors/fileStats.files).padEnd(15, ' ') + '</td>\n' +
                           '<td>' + fmt.format(resultStats.errors/fileStats.modules).padEnd(15, ' ') + '</td>\n' +
                           '<td>' + fmt.format(resultStats.errors/fileStats.lines).padEnd(15, ' ') + '</td>\n' +
                           '</tr><tr>\n' +
                           '<td style="font-size:20px">Warnings:</td>\n' +
                           '<td style="font-size:20px;color:orange">' + resultStats.warnings + '</td>\n' +
                           '<td>' + fmt.format(resultStats.warnings/fileStats.files).padEnd(15, ' ') + '</td>\n' +
                           '<td>' + fmt.format(resultStats.warnings/fileStats.modules).padEnd(15, ' ') + '</td>\n' +
                           '<td>' + fmt.format(resultStats.warnings/fileStats.lines).padEnd(15, ' ') + '</td>\n' +
                           '</tr><tr>\n' +
                           '<td>Suggestions:</td>\n' +
                           '<td>' + resultStats.suggestions + '</td>\n' +
                           '<td>' + fmt.format(resultStats.suggestions/fileStats.files).padEnd(15, ' ') + '</td>\n' +
                           '<td>' + fmt.format(resultStats.suggestions/fileStats.modules).padEnd(15, ' ') + '</td>\n' +
                           '<td>' + fmt.format(resultStats.suggestions/fileStats.lines).padEnd(15, ' ') + '</td>\n' +
                           '</tr><tr>\n' +
                           '<td>I18N Score(0-100)</td>\n' +
                           '<td>' + fmt.format(score) + '</td>\n' +
                           '</tr>\n' +
                           '</thead>\n' +
                           '</table>\n' +
                           '<br/>\n' +
                           '<hr align="left" width="1100px"/>\n' +
                           '<p style="color:#714AFF;text-align:left;font-size:30px;font-weight:bold" width=320px; >Detailed Information</p>\n';
        return summaryTable;
    }
    _formatHeader() {
        let header = '<!DOCTYPE html>\n' +
                     '<html>\n' +
                     '<head>\n' +
                     '<title>ilib-lint Result for webOS Apps</title>\n' +
                     '</head>\n' +
                     '<body>\n';
        return header;
    }
    _formatFooter(){
        let end = '</body>\n' +
                  '</html>\n';
        return end;
    }
    _formatResult(results, errorsOnly) {
        let resultAll = '';
        if (results) {
            results.forEach(result => {
                resultAll += this.format(result, errorsOnly);
            })
        }
        return resultAll;
    }
    /**
     * Format the given result with the current formatter and return the
     * formatted string.
     *
     * @param {Result} result the result to format
     * @returns {String} the formatted result
     */
    format(result, errorsOnly){
        if (errorsOnly && result.severity !== "error") return "";

        let levelTextColor = (result.severity === "error") ? "color:red;" : "color:orange;";
        let autofix = (result.fix === undefined) ? "unavailable" : result.fix.applied;
        let targetText = result.highlight.replaceAll(/<e\d>/g, '<span style="color:red">').replaceAll(/<\/e\d>/g, '</span>');

        let htmlText = '<table>\n' +
                       '<thead>\n' +
                       '<tr><th style=' + levelTextColor + 'text-align:left;font-size:22px; width=280px;>[' + result.severity + ']</th><th style="text-align:left"></th></tr>\n' +
                       '<tr><td style="text-align:left;color:Cadetblue;font-weight:bold">filepath</td><td style="color:Cadetblue;font-weight:bold">' + result.pathName + "</td></tr>\n" +
                       '<tr><td style="color:red; text-align:left">Descriptions</td><td style="color:red;">' + result.description + "</td></tr>\n" +
                       '<tr><td>key</td><td>' + result.source + '</td></tr>\n' +
                       '<tr><td>source</td><td>' + result.id + '</td></tr>\n' +
                       '<tr><td>target</td><td>' + targetText + '</td></tr>\n' +
                       '<tr><td>' + result.rule.getName() + '</td><td>' + result.rule.getDescription() + '</td></tr>\n' +
                       '<tr><td>More info</td><td><a href=' + result.rule.getLink() + '>' + result.rule.getLink() + '</td></tr>\n' +
                       '<tr><td>Auto-fix</td><td>' + autofix + '</td></tr>\n' +
                       '<thead>\n' +
                       '<table>\n' +
                       '<br>\n';
        return htmlText;
    }

    formatOutput(options) {
        let prjName, totalTime, fileStats, score, resultStats, results, errorsOnly;

        if (options) {
            prjName = options.name;
            totalTime = options.time;
            fileStats = options.fileStats;
            resultStats = options.resultStats;
            results = options.results;
            score = options.score;
            errorsOnly = options.errorOnly;
        }

        let completeOutput= '';
        completeOutput += this._formatHeader();
        completeOutput += this._formatSummary(prjName, totalTime, fileStats, resultStats, score);
        completeOutput += this._formatResult(results, errorsOnly);
        completeOutput += this._formatFooter();

        return completeOutput;
    }
}

export default HtmlFormatter;
