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

const optionConfig = {
    help: {
        short: "h",
        help: "This help message",
        showHelp: {
            banner: 'Usage: ilib-lint [-h] [options] path [path ...]'
        }
    },
    files: {
        short: "f",
        varName: "f",
        help: "Specify files"
    },
    directory: {
        short: "d",
        varName: "Specify folder",
        help: "Specify folder"
    },
    ourputDirectory: {
        short: "o",
        varName: "output folder",
        help: "Specify output folder"
    },
    outputFileName: {
        short: "name",
        varName: "output filen name",
        help: "Specify output file name"
    },
    errorsOnly: {
        short: "e",
        flag: true,
        "default": false,
        help: "Only return errors and supress warnings"
    }
};

const options = OptionsParser.parse(optionConfig);
const errorsOnly = options.opt.errorsOnly || false;
const outDir = options.opt.ourputDirectory || "./";
let totalSummary = [];

if (options.opt.ourputDirectory) {
    if (!fs.existsSync(options.opt.ourputDirectory)) {
        fs.mkdirSync(options.opt.ourputDirectory);
    }
}

// node convertHtml.js -d ../jsonSample -e
 
if (options.opt.files) {
    console.log("!");
}

if (options.opt.directory) {
    const dir = options.opt.directory;
    const stat = fs.statSync(dir);

    if (stat && stat.isDirectory()) {
        walk(dir);
    } else {
        console.log("Invalid directory");
        process.exit(1);
    }
}

function walk(dir) {
    let list = fs.readdirSync(dir);
    list.forEach(function(file){
        let fullPath = path.join(dir, file);
        let stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()){
            walk(file);
        } else {
            if (path.extname(file).toLocaleLowerCase() === '.json') {
                convertToHtml(fullPath);
            }
        }
    });

    //let resultName = options.opt.outputFileName || total + "-result.html";
    fs.writeFileSync(path.join(outDir, 'total.json'), JSON.stringify(totalSummary, null, 2), "utf8");
    writeTotalSummaryResult(totalSummary);
}

function writeTotalSummaryResult(sumJsonData) {
    console.log("!");
    let header = formatHeader("total Summary");
    const borderStyle = "border-bottom:2px solid #ddd;";
    const cellStyle = (extra = "") => `style="${borderStyle}${extra}"`;

    let details = `<!DOCTYPE html>
<html>
<head>
  <title>eeeeee</title>
  <meta charset="UTF-8">
</head>
<body>
    <p style="color:#714AFF;text-align:left;font-size:30px;font-weight:bold" width="300px">Total Summary</p>
    <table>
  <thead>
   <tr>
      <td ${cellStyle()}width="150px">Name</td>
      <td ${cellStyle()}width="150px">Number of Errors</td>
      <td ${cellStyle()}width="150px">Number of Warnings</td>
      <td ${cellStyle()}width="250px">Details</td>
    </tr>
`;

    sumJsonData.forEach(function(item){
        let ruleInfo = '';
        if (item.details && typeof item.details ==  'object') {
            Object.entries(item.details).forEach(function([key, value]) {
                ruleInfo += key + ": " + value + '<br>';
            })
        }

        details +=`<tr>
<td ${cellStyle()}>${item.name}</td>
<td ${cellStyle()}>${item.errors}</td>
<td ${cellStyle()}>${item.warnings}</td>
<td ${cellStyle()}>${ruleInfo}</td>
</tr>
`
    });

    let middleString = `</thead>
</table>`
    let fotter = formatFooter();
    let finalResult = [header, details, middleString, fotter
    ].join('');

    let resultName = "total-result.html";
    fs.writeFileSync(path.join(outDir, resultName), finalResult, "utf8");
}

function convertToHtml(jsonFile) {
    const jsonContent = JSON.parse(fs.readFileSync(jsonFile, "utf-8"));
    const sumInfo = {};

    let projectName = jsonContent.summary.projectName.replace('./', '');

    sumInfo.name = projectName;
    sumInfo.errors = jsonContent.summary.resultStats.errors;
    sumInfo.warnings = jsonContent.summary.resultStats.warnings;

    if (jsonContent.summary.score !== 100) {
        sumInfo.details ={};
        jsonContent.details.forEach(function(result) {

            if(sumInfo.details[result.ruleName] == undefined) {
                sumInfo.details[result.ruleName]=1;
            } else {
                sumInfo.details[result.ruleName]++;
            }
        });

        totalSummary.push(sumInfo);
    } else {
        totalSummary.push(sumInfo);
        return;
    }

    let resultAll = [
        formatHeader("ilib-lint Result for webOS Apps"),
        getHtmlStyle(),
        '<body>',
        formatSummary(jsonContent.summary),
        formatResult(jsonContent.details, errorsOnly),
        formatFooter()
    ].join('');

    let resultName = options.opt.outputFileName || projectName + "-result.html";
    fs.writeFileSync(path.join(outDir, resultName), resultAll, "utf8");
}

function formatSummary(summmaryInfo) {
    const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

    const formatRatio = (value) => [
        fmt.format(value / summmaryInfo.fileStats.files),
        fmt.format(value / summmaryInfo.fileStats.modules),
        fmt.format(value / summmaryInfo.fileStats.lines)
    ];

    const [errFile, errModule, errLine] = formatRatio(summmaryInfo.resultStats.errors);
    const [warnFile, warnModule, warnLine] = formatRatio(summmaryInfo.resultStats.warnings);
    const [suggFile, suggModule, suggLine] = formatRatio(summmaryInfo.resultStats.suggestions);

    return `
<h1>[${summmaryInfo.projectName}] Summary </h1>
<table>
  <thead>
    <tr>
      <td class="highlight">Total Elapsed Time : </td>
      <td class="green">${summmaryInfo.totalTime} seconds</td>
    </tr>
    <tr>
      <td></td><td></td>
      <td width="150px">Average over</td>
      <td width="150px">Average over</td>
      <td width="150px">Average over</td>
    </tr>
    <tr>
      <td></td>
      <td>Total</td>
      <td>${summmaryInfo.fileStats.files} Files</td>
      <td>${summmaryInfo.fileStats.modules} Modules</td>
      <td>${summmaryInfo.fileStats.lines} Lines</td>
    </tr>
    <tr>
      <td class="highlight">Errors:</td>
      <td class="red")}>${summmaryInfo.resultStats.errors}</td>
      <td>${errFile}</td>
      <td>${errModule}</td>
      <td>${errLine}</td>
    </tr>
    <tr>
      <td class="highlight">Warnings:</td>
      <td class="orange">${summmaryInfo.resultStats.warnings}</td>
      <td>${warnFile}</td>
      <td>${warnModule}</td>
      <td>${warnLine}</td>
    </tr>
    <tr>
      <td class="highlight">Suggestions:</td>
      <td>${summmaryInfo.resultStats.suggestions}</td>
      <td>${suggFile}</td>
      <td>${suggModule}</td>
      <td>${suggLine}</td>
    </tr>
    <tr>
      <td class="highlight"}>I18N Score (0–100)</td>
      <td>${fmt.format(summmaryInfo.score)}</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </thead>
</table>
<hr align="left" width="1100px"/>
`;
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

    a {
      color: #4B3AFF;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .error-block {
      margin-top: 25px;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }

    .error-header {
      background-color: #6b1b1b;
      color: white;
      padding: 10px 15px;
      font-size: 20px;
      font-weight: bold;
    }

    .error-table td {
      background-color: #fafafa;
    }

    .error-table td:first-child {
      font-weight: bold;
      width: 200px;
      background-color: #f0f0f0;
    }

    hr {
      border: none;
      border-top: 2px solid #ddd;
      margin: 30px 0;
    }
  </style>
    `;
}
function formatResult(detailInfo, errorsOnly) {
    if (!detailInfo || detailInfo.length === 0) return '';

    const resultAll = detailInfo
        .map(result => format(result, errorsOnly))
        .join('');

    const title = `<div id="detail-section"><p style="color:#714AFF; text-align:left; font-size:30px; font-weight:bold; width:320px;">Detailed Information</p>`;
    return resultAll ? `${title}${resultAll}</div>` : '';
}

function format(result, errorsOnly){
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

        const htmlText = `<table>
  <thead>
    <tr>
      <th colspan="2" style="${levelTextColor}">[${result.severity}]</th>
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
      <td>
        <a href="${result.link}">${result.link}</a>
      </td>
    </tr>
    <tr>
      <td>Auto-fix</td>
      <td>${autofix}</td>
    </tr>
  </tbody>
</table>
<br>`;
    return htmlText;
}

function formatHeader(headerTitle) {
    return `<!DOCTYPE html>
<html>
<head>
  <title>${headerTitle}</title>
  <meta charset="UTF-8">
</head>
`;
}

function formatFooter() {
    return `</body></html>`;
}