/*
 * HtmlFormatter.js - Formats result output
 *
 * Copyright (c) 2024-2025 JEDLSoft
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
import { Formatter, Result } from 'ilib-lint-common';

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
        const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
        const borderStyle = "border-bottom:2px solid #ddd;";
        const cellStyle = (extra = "") => `style="${borderStyle}${extra}"`;

        const formatRatio = (value) => [
            fmt.format(value / fileStats.files),
            fmt.format(value / fileStats.modules),
            fmt.format(value / fileStats.lines)
        ];

        const [errFile, errModule, errLine] = formatRatio(resultStats.errors);
        const [warnFile, warnModule, warnLine] = formatRatio(resultStats.warnings);
        const [suggFile, suggModule, suggLine] = formatRatio(resultStats.suggestions);

        return `
<p style="color:#714AFF;text-align:left;font-size:30px;font-weight:bold" width="300px">
    [${prjName}] Summary
</p>
<table>
  <thead>
    <tr>
      <td style="font-size:20px">Total Elapsed Time : </td>
      <td style="font-size:20px;color:green;font-weight:bold">${totaltime} seconds</td>
    </tr>
    <tr>
      <td></td><td></td>
      <td ${cellStyle()} width="150px">Average over</td>
      <td ${cellStyle()} width="150px">Average over</td>
      <td ${cellStyle()} width="150px">Average over</td>
    </tr>
    <tr>
      <td></td>
      <td ${cellStyle()}>Total</td>
      <td ${cellStyle()}>${fileStats.files} Files</td>
      <td ${cellStyle()}>${fileStats.modules} Modules</td>
      <td ${cellStyle()}>${fileStats.lines} Lines</td>
    </tr>
    <tr>
      <td ${cellStyle("font-size:20px")}>Errors:</td>
      <td ${cellStyle("font-weight:bold;font-size:20px;color:red")}>${resultStats.errors}</td>
      <td ${cellStyle()}>${errFile}</td>
      <td ${cellStyle()}>${errModule}</td>
      <td ${cellStyle()}>${errLine}</td>
    </tr>
    <tr>
      <td ${cellStyle("font-size:20px")}>Warnings:</td>
      <td ${cellStyle("font-weight:bold;font-size:20px;color:orange")}>${resultStats.warnings}</td>
      <td ${cellStyle()}>${warnFile}</td>
      <td ${cellStyle()}>${warnModule}</td>
      <td ${cellStyle()}>${warnLine}</td>
    </tr>
    <tr>
      <td>Suggestions:</td>
      <td ${cellStyle()}>${resultStats.suggestions}</td>
      <td ${cellStyle()}>${suggFile}</td>
      <td ${cellStyle()}>${suggModule}</td>
      <td ${cellStyle()}>${suggLine}</td>
    </tr>
    <tr>
      <td ${cellStyle()}>I18N Score (0–100)</td>
      <td ${cellStyle()}>${fmt.format(score)}</td>
      <td ${cellStyle()}></td>
      <td ${cellStyle()}></td>
      <td ${cellStyle()}></td>
    </tr>
  </thead>
</table>
<hr align="left" width="1100px"/>
`;
}
   // }
    /**
     * @private
     */
_formatHeader() {
    return `<!DOCTYPE html>
<html>
<head>
  <title>ilib-lint Result for webOS Apps</title>
  <meta charset="UTF-8">
</head>
<body>`;
}

    /**
     * @private
     */
    _formatFooter() {
        return `</body></html>`;
    }
    /**
     * @private
     */
    _formatResult(results, errorsOnly) {
        if (!results || results.length === 0) return '';

        const resultAll = results
        .map(result => this.format(result, errorsOnly))
        .join('');

        const title = `<div id="detail-section"><p style="color:#714AFF; text-align:left; font-size:30px; font-weight:bold; width:320px;">Detailed Information</p>`;

        return resultAll ? `${title}${resultAll}</div>` : '';
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

        const levelTextColor = (result.severity === "error")
            ? "color:white; background-color:maroon;"
            : "color:white; background-color:orange;";

        const autofix = (result.fix === undefined)
            ? "unavailable"
            : result.fix.applied;

        const targetText = (result.highlight !== undefined)
            ? result.highlight
            .replaceAll(/<e\d>/g, '<span style="color:red">')
            .replaceAll(/<\/e\d>/g, '</span>')
            : "";

        const cellStyle = "background:#eee; border-bottom:1px solid #ccc; border-top:1px solid #fff; padding-left:8px;";
        const tableStyle = "border-collapse:collapse;";
        const thStyle = `style="${levelTextColor} text-align:left; font-size:22px; width:280px; padding-left:8px;"`;
        const tdLabelStyle = `style="${cellStyle} font-weight:bold;"`;
        const tdValueStyle = `style="${cellStyle} padding-right:30px;"`;

        const htmlText = `<table style="${tableStyle}">
  <thead>
    <tr>
      <th colspan="2" ${thStyle}>[${result.severity}]</th>
      <th style="text-align:left;"></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td ${tdLabelStyle}>filepath</td>
      <td ${tdValueStyle}>${result.pathName}</td>
    </tr>
    <tr>
      <td ${tdLabelStyle} style="${cellStyle} color:red;">Descriptions</td>
      <td ${tdValueStyle} style="${cellStyle} color:red;">${result.description}</td>
    </tr>
    <tr>
      <td ${tdLabelStyle}>key</td>
      <td ${tdValueStyle}>${result.id}</td>
    </tr>
    <tr>
      <td ${tdLabelStyle}>source</td>
      <td ${tdValueStyle}>${result.source}</td>
    </tr>
    <tr>
      <td ${tdLabelStyle}>target</td>
      <td ${tdValueStyle}>${targetText}</td>
    </tr>
    <tr>
      <td ${tdLabelStyle}>${result.rule.getName()}</td>
      <td ${tdValueStyle}>${result.rule.getDescription()}</td>
    </tr>
    <tr>
      <td ${tdLabelStyle}>More info</td>
      <td ${tdValueStyle}>
        <a href="${result.rule.getLink()}">${result.rule.getLink()}</a>
      </td>
    </tr>
    <tr>
      <td ${tdLabelStyle}>Auto-fix</td>
      <td ${tdValueStyle}>${autofix}</td>
    </tr>
  </tbody>
</table>
<br>`;
        return htmlText;
    }
    /**
     * Provide the Information that the method can use to format the output
     *
     * @param {Object} [options] the options that needs for fomatter
     * @returns {String} the formatted result
     */
    formatOutput(options = {}) {
        const {
            name: prjName,
            time: totalTime,
            fileStats,
            resultStats,
            results,
            score,
            errorsOnly
        } = options;

        return [
            this._formatHeader(),
            this._formatSummary(prjName, totalTime, fileStats, resultStats, score),
            this._formatResult(results, errorsOnly),
            this._formatFooter()
        ].join('');
    }
}

export default HtmlFormatter;