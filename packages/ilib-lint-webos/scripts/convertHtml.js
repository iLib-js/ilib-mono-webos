#!/usr/bin/env node
/*
 * convertHtml.js - 
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

import path from 'node:path';
import fs from 'fs';
import OptionsParser from 'options-parser';

// Constants
const DEFAULT_OUTPUT_DIR = './';
const TOTAL_RESULT_FILENAME = 'total-result.html';

// Configuration
const optionConfig = {
    help: {
        short: 'h',
        help: 'This help message',
        showHelp: {
            banner: 'Usage: ilib-lint [-h] [options] path [path ...]'
        }
    },
    files: {
        short: 'f',
        varName: 'f',
        help: 'Specify files'
    },
    directory: {
        short: 'd',
        varName: 'Specify folder',
        help: 'Specify folder'
    },
    ourputDirectory: {
        short: 'o',
        varName: 'output folder',
        help: 'Specify output folder'
    },
    outputFileName: {
        short: 'name',
        varName: 'output filen name',
        help: 'Specify output file name'
    },
    errorsOnly: {
        short: 'e',
        flag: true,
        'default': false,
        help: 'Only return errors and supress warnings'
    }
};

// Initialize options
const options = OptionsParser.parse(optionConfig);
const errorsOnly = options.opt.errorsOnly || false;
const outDir = options.opt.ourputDirectory || DEFAULT_OUTPUT_DIR;
let totalSummary = [];

// Ensure output directory exists
if (options.opt.ourputDirectory && !fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

// Main execution
if (options.opt.files) {
    console.log("!");
}

if (options.opt.directory) {
    processDirectory(options.opt.directory);
}

function processDirectory(dir) {
    try {
        const stat = fs.statSync(dir);
        if (!stat.isDirectory()) {
            console.log("Invalid directory");
            process.exit(1);
        }
        walkDirectory(dir);
    } catch (err) {
        console.error(`Error processing directory: ${err.message}`);
        process.exit(1);
    }
}

function walkDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            walkDirectory(fullPath);
        } else if (path.extname(file).toLowerCase() === '.json') {
            convertToHtml(fullPath);
        }
    });
    writeTotalSummaryResult(totalSummary);
}

function writeTotalSummaryResult(sumJsonData) {
    const header = getHeader("Summary of all app results");
    const style = getHtmlStyle();
    const details = buildTotalSummaryTable(sumJsonData);
    const footer = getFooter();

    const finalResult = [header, style, details, footer].join('');
    const resultPath = path.join(outDir, TOTAL_RESULT_FILENAME);

    fs.writeFileSync(resultPath, finalResult, 'utf8');
}

function buildTotalSummaryTable(data) {
    let details = `
<body>
<h1>Summary of all app results</h1>
<hr><table><thead>
<tr>
  <td class="highlight cell-bg" width="100px">Name</td>
  <td class="highlight cell-bg" width="50px">Errors</td>
  <td class="highlight cell-bg" width="50px">Warnings</td>
  <td class="highlight cell-bg" width="250px">Details</td>
</tr>`;

    data.forEach(item => {
        const ruleInfo = buildRuleInfo(item.details);

        details += `<tr>
          <td class="highlight">${item.errors === 0 && item.warnings === 0
              ? item.name
              : `<a href="./${item.name}-result.html">${item.name}</a>`}</td>
          <td class="highlight2 red">${item.errors}</td>
          <td class="highlight2 orange">${item.warnings}</td>
          <td class="highlight2">${ruleInfo}</td>
        </tr>`;
    });

    details += '</thead></table>';
    return details;
}

function buildRuleInfo(details) {
    if (!details || typeof details !== 'object') return '';

    return Object.entries(details)
        .map(([key, value]) => `${key}: ${value} <br>`)
        .join('');
}

function convertToHtml(jsonFile) {
    try {
        const jsonContent = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
        const sumInfo = createSummaryInfo(jsonContent.summary);

        if (jsonContent.summary.score !== 100) {
            sumInfo.details = countRuleViolations(jsonContent.details);
        }

        totalSummary.push(sumInfo);
        generateHtmlOutput(jsonContent, sumInfo);
    } catch (err) {
        console.error(`Error processing ${jsonFile}: ${err.message}`);
    }
}

function createSummaryInfo(summary) {
    return {
        name: summary.projectName,
        errors: summary.resultStats.errors,
        warnings: summary.resultStats.warnings
    };
}

function countRuleViolations(details) {
    return details.reduce((violations, result) => {
        const count = (violations[result.ruleName] || 0) + 1;
        return { ...violations, [result.ruleName]: count };
    }, {});
}

function generateHtmlOutput(jsonContent, sumInfo) {
    const resultAll = [
        getHeader(`ilib-lint Result for webOS Apps`),
        getHtmlStyle(),
        getSummary(jsonContent.summary),
        getDetailResults(jsonContent.details, errorsOnly),
        getFooter()
    ].join('');

    const resultName = options.opt.outputFileName ||
                      `${jsonContent.summary.projectName}-result.html`;
    const outputPath = path.join(outDir, resultName);
    fs.writeFileSync(outputPath, resultAll, 'utf8');
}

function getSummary(summaryInfo) {
    const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
    const formatRatio = value => [
        fmt.format(value / summaryInfo.fileStats.files),
        fmt.format(value / summaryInfo.fileStats.modules),
        fmt.format(value / summaryInfo.fileStats.lines)
    ];

    const [errFile, errModule, errLine] = formatRatio(summaryInfo.resultStats.errors);
    const [warnFile, warnModule, warnLine] = formatRatio(summaryInfo.resultStats.warnings);
    const [suggFile, suggModule, suggLine] = formatRatio(summaryInfo.resultStats.suggestions);

    return `<body>
<h1> [${summaryInfo.projectName}] Summary </h1>
<table>
  <thead>
    <tr>
      <td></td>
      <td width="150px">Average over</td>
      <td width="150px">Average over</td>
      <td width="150px">Average over</td>
    </tr>
    <tr>
      <td></td>
      <td>Total</td>
      <td>${summaryInfo.fileStats.files} Files</td>
      <td>${summaryInfo.fileStats.modules} Modules</td>
      <td>${summaryInfo.fileStats.lines} Lines</td>
    </tr>
    <tr>
      <td class="highlight">Errors:</td>
      <td class="red">${summaryInfo.resultStats.errors}</td>
      <td>${errFile}</td>
      <td>${errModule}</td>
      <td>${errLine}</td>
    </tr>
    <tr>
      <td class="highlight">Warnings:</td>
      <td class="orange">${summaryInfo.resultStats.warnings}</td>
      <td>${warnFile}</td>
      <td>${warnModule}</td>
      <td>${warnLine}</td>
    </tr>
    <tr>
      <td class="highlight">Suggestions:</td>
      <td>${summaryInfo.resultStats.suggestions}</td>
      <td>${suggFile}</td>
      <td>${suggModule}</td>
      <td>${suggLine}</td>
    </tr>
    <tr>
      <td class="highlight">I18N Score (0–100)</td>
      <td>${fmt.format(summaryInfo.score)}</td>
    </tr>
  </thead>
</table>
<hr align="left" width="1100px"/>
`;
}

function getDetailResults(detailInfo, errorsOnly) {
    if (!detailInfo?.length) return '';

    const formattedResults = detailInfo
        .filter(result => !errorsOnly || result.severity === 'error')
        .map(result => formatResult(result, errorsOnly))
        .join('');

    return formattedResults
        ? `<div id="detail-section"><h2>Detailed Information</h2>${formattedResults}</div>`
        : '';
}

function formatResult(result, errorsOnly) {
    const levelStyle = result.severity === 'error'
        ? 'color:white; background-color:maroon;'
        : 'color:white; background-color:orange;';

    const autofix = result.fix?.applied || 'unavailable';
    const targetText = result.highlight
        ? result.highlight
            .replace(/<e\d>/g, '<span style="color:red">')
            .replace(/<\/e\d>/g, '</span>')
        : '';

    return `<table>
  <thead>
    <tr>
      <th colspan="2" style="${levelStyle}">[${result.severity}]</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filepath</td>
      <td>${result.path}</td>
    </tr>
    <tr>
      <td>Descriptions</td>
      <td>${result.description}</td>
    </tr>
    <tr>
      <td>key</td>
      <td>${result.key}</td>
    </tr>
    <tr>
      <td>source</td>
      <td>${result.source}</td>
    </tr>
    <tr>
      <td>target</td>
      <td>${targetText}</td>
    </tr>
    <tr>
      <td>${result.ruleName}</td>
      <td>${result.description}</td>
    </tr>
    <tr>
      <td>More info</td>
      <td><a href="${result.link}">${result.link}</a></td>
    </tr>
    <tr>
      <td>Auto-fix</td>
      <td>${autofix}</td>
    </tr>
  </tbody>
</table>
<br>`;
}

function getHeader(headerTitle) {
    return `<!DOCTYPE html>
<html><head>
  <title>${headerTitle}</title><meta charset="UTF-8">
</head>`;
}

function getFooter() {
    return `</body></html>`;
}

function getHtmlStyle() {
    return `
<style>
body {
  font-family: "Segoe UI", Arial, sans-serif;
  background-color: #f7f8fa;
  color: #333;
  margin: 40px;
}
h1, h2 {
  color: #4B3AFF;
  font-weight: 700;
}
h1 {
  font-size: 32px;
  margin-bottom: 10px;
  border-left: 5px solid #4B3AFF;
  padding-left: 10px;
}
h2 {
  font-size: 26px;
  margin-top: 40px;
  margin-bottom: 15px;
}
.summary, .detail {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 25px;
  margin-bottom: 30px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
th, td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}
th {
  background-color: #6b1b1b;
  color: white;
  font-size: 18px;
}
tr:hover td {
  background-color: #f3f3f3;
}
.highlight {
  font-weight: bold;
  font-size: 20px;
}
.highlight2 {
  font-weight: bold;
  font-size: 18px;
}
.green {
  color: #2e8b57;
  font-weight: bold;
}
.red {
  color: #d9534f;
  font-weight: bold;
}
.orange {
  color: #f0ad4e;
  font-weight: bold;
}
.cell-bg {
  background-color: #91b9e3ff;
}
a {
  color: #4B3AFF;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
hr {
  border: none;
  border-top: 2px solid #ddd;
  margin: 30px 0;
}
</style>
`;
}