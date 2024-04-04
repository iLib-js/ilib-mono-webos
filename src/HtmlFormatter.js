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
        this.description = "Formats results as an html file with colors.";
    }
    /**
     * @private
     */
    _formatSummary(prjName, totaltime, fileStats, resultStats, score) {
        const fmt = new Intl.NumberFormat("en-US", {
            maxFractionDigits: 2
        });
        let borderStyle = "border-bottom:2px solid #ddd;";
        let summaryTable = '<p style="color:#714AFF;text-align:left;font-size:30px;font-weight:bold" width=300px;> [' + prjName + '] Summary</p>\n'+
                           '<table>\n' +
                           '<thead>\n' +
                           '<tr><td style="font-size:20px">Total Elapsed Time : </td>\n' +
                           '<td style="font-size:20px;color:green;font-weight:bold">' + totaltime + 'seconds</td></tr>\n' +
                           '<tr><td></td><td></td>\n' +
                           '<td style="'+ borderStyle + '"width=150px;>Average over</td>\n' +
                           '<td style="'+ borderStyle + '"width=150px;>Average over</td>\n' +
                           '<td style="'+ borderStyle + '"width=150px;>Average over</td>\n' +
                           '</tr><tr>\n'  +
                           '<td></td><td style="' + borderStyle + '">Total</td>\n' +
                           '<td style="'+ borderStyle +'">' + fileStats.files +  ' Files</td>\n' +
                           '<td style="'+ borderStyle +'">' + fileStats.modules + ' Modules</td>\n' +
                           '<td style="'+ borderStyle +'">' + fileStats.lines + ' Lines</td></tr>\n' +
                           '<tr>\n' +
                           '<td style="' + borderStyle + 'font-size:20px">Errors:</td>\n' +
                           '<td style="' + borderStyle + 'font-weight:bold;font-size:20px;color:red">' + resultStats.errors + '</td>\n' +
                           '<td style="'+ borderStyle +'">' + fmt.format(resultStats.errors/fileStats.files).padEnd(15, ' ') + '</td>\n' +
                           '<td style="'+ borderStyle +'">' + fmt.format(resultStats.errors/fileStats.modules).padEnd(15, ' ') + '</td>\n' +
                           '<td style="'+ borderStyle +'">' + fmt.format(resultStats.errors/fileStats.lines).padEnd(15, ' ') + '</td>\n' +
                           '</tr><tr>\n' +
                           '<td style="' + borderStyle + 'font-size:20px">Warnings:</td>\n' +
                           '<td style="' + borderStyle + 'font-weight:bold;font-size:20px;color:orange">' + resultStats.warnings + '</td>\n' +
                           '<td style="'+ borderStyle +'">' + fmt.format(resultStats.warnings/fileStats.files).padEnd(15, ' ') + '</td>\n' +
                           '<td style="'+ borderStyle +'">' + fmt.format(resultStats.warnings/fileStats.modules).padEnd(15, ' ') + '</td>\n' +
                           '<td style="'+ borderStyle +'">' + fmt.format(resultStats.warnings/fileStats.lines).padEnd(15, ' ') + '</td>\n' +
                           '</tr><tr>\n' +
                           '<td>Suggestions:</td>\n' +
                           '<td style="'+ borderStyle +'">' + resultStats.suggestions + '</td>\n' +
                           '<td style="'+ borderStyle +'">' + fmt.format(resultStats.suggestions/fileStats.files).padEnd(15, ' ') + '</td>\n' +
                           '<td style="'+ borderStyle +'">' + fmt.format(resultStats.suggestions/fileStats.modules).padEnd(15, ' ') + '</td>\n' +
                           '<td style="'+ borderStyle +'">' + fmt.format(resultStats.suggestions/fileStats.lines).padEnd(15, ' ') + '</td>\n' +
                           '</tr><tr>\n' +
                           '<td style="' + borderStyle + '">I18N Score(0-100)</td>\n' +
                           '<td style="'+ borderStyle +'">' + fmt.format(score) + '</td>\n' +
                           '<td style="'+ borderStyle +'"></td>\n' +
                           '<td style="'+ borderStyle +'"></td>\n' +
                           '<td style="'+ borderStyle +'"></td>\n' +
                           '</tr>\n' +
                           '</thead>\n' +
                           '</table>\n' +
                           '<br/>\n' +
                           '<hr align="left" width="1100px"/>\n' +
                           '<p style="color:#714AFF;text-align:left;font-size:30px;font-weight:bold" width=320px;>Detailed Information</p>\n';
        return summaryTable;
    }
    /**
     * @private
     */
    _formatHeader() {
        let header = '<!DOCTYPE html>\n' +
                     '<html>\n' +
                     '<head>\n' +
                     '<title>ilib-lint Result for webOS Apps</title>\n' +
                     '<meta charset="UTF-8">\n' +
                     '</head>\n' +
                     '<body>\n';
        return header;
    }
    /**
     * @private
     */
    _formatFooter(){
        let end = '</body>\n' +
                  '</html>\n';
        return end;
    }
    /**
     * @private
     */
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
     * @param {Result} result the result to formatted
     * @param {boolean} [errorOnly] true, if only errors are displayed
     * @returns {String} the formatted result with a complete html form
     */
    format(result, errorsOnly){
        if (errorsOnly && result.severity !== "error") return "";

        let levelTextColor = (result.severity === "error") ? "color:white;black;background-color:maroon;" : "color:white;background-color:orange;";
        let autofix = (result.fix === undefined) ? "unavailable" : result.fix.applied;
        let targetText = (result.highlight !== undefined) ? result.highlight.replaceAll(/<e\d>/g, '<span style="color:red">').replaceAll(/<\/e\d>/g, '</span>') : "";
        let cellBackground = "background:#eee;border-bottom:1px solid #ccc;border-top:1px solid #fff;"
        let htmlText = '<table>\n' +
                       '<thead>\n' +
                       '<tr><th colspan="2" style=padding-left:8px;' + levelTextColor + 'text-align:left;font-size:22px; width=280px;>[' + result.severity + ']</th><th style="text-align:left"></th></tr>\n' +
                       '<tr><td style="padding-left:8px;'+ cellBackground+ 'text-align:left;color:Cadetblue;font-weight:bold">filepath</td><td style="' + cellBackground + 'padding-left:8px;padding-right:30px;color:Cadetblue;font-weight:bold">' + result.pathName + "</td></tr>\n" +
                       '<tr><td style="padding-left:8px;'+ cellBackground+ 'color:red; text-align:left">Descriptions</td><td style="' + cellBackground+ 'padding-left:8px;color:red;">' + result.description + "</td></tr>\n" +
                       '<tr><td style="padding-left:8px;' + cellBackground + '">key</td><td style="'+ cellBackground + 'padding-left:8px;padding-right:30px">' + result.source + '</td></tr>\n' +
                       '<tr><td style="padding-left:8px;'+ cellBackground + '">source</td><td style="'+ cellBackground+ 'padding-left:8px;padding-right:30px">' + result.id + '</td></tr>\n' +
                       '<tr><td style="padding-left:8px;' + cellBackground + '">target</td><td style="'+ cellBackground + 'padding-left:8px;padding-right:30px">' + targetText + '</td></tr>\n' +
                       '<tr><td style="padding-left:8px;'+ cellBackground + 'padding-right:20px">' + result.rule.getName() + '</td><td style="'+ cellBackground + 'padding-left:8px;padding-right:30px">' + result.rule.getDescription() + '</td></tr>\n' +
                       '<tr><td style="padding-left:8px;'+ cellBackground + '">More info</td><td style="'+ cellBackground+ 'padding-left:8px;"><a href=' + result.rule.getLink() + '>' + result.rule.getLink() + '</td></tr>\n' +
                       '<tr><td style="padding-left:8px;' + cellBackground+ '">Auto-fix</td><td style="' + cellBackground + 'padding-left:8px;">' + autofix + '</td></tr>\n' +
                       '<thead>\n' +
                       '<table>\n' +
                       '<br>\n';
        return htmlText;
    }
    /**
     * Provide the Information that the method can use to format the output
     *
     * @param {Object} [options] the options that needs for fomatter
     * @returns {String} the formatted result
     */
    formatOutput(options) {
        let prjName, totalTime, fileStats, score, resultStats, results, errorsOnly;

        if (options) {
            prjName = options.name;
            totalTime = options.time;
            fileStats = options.fileStats;
            resultStats = options.resultStats;
            results = options.results;
            score = options.score;
            errorsOnly = options.errorsOnly;
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
