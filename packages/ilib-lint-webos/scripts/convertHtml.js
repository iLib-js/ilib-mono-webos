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
}
let totalSummary = {};

function convertToHtml(jsonFile) {
    const jsonContent = JSON.parse(fs.readFileSync(jsonFile, "utf-8"));
    console.log("!");
    
    if (jsonContent.summary.score === 100) return;
    let projectName = jsonContent.summary.projectName.replace('./', '');
    let resultAll = [
        formatHeader(),
        formatSummary(jsonContent.summary),
        formatResult(jsonContent.details, errorsOnly),
        formatFooter()
    ].join('');
    console.log("!");
    let resultName = options.opt.outputFileName || projectName + "-result.html";
    
    fs.writeFileSync(path.join(outDir, resultName), resultAll, "utf8");
}

function formatSummary(summmaryInfo) {
    const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
    const borderStyle = "border-bottom:2px solid #ddd;";
    const cellStyle = (extra = "") => `style="${borderStyle}${extra}"`;

    const formatRatio = (value) => [
        fmt.format(value / summmaryInfo.fileStats.files),
        fmt.format(value / summmaryInfo.fileStats.modules),
        fmt.format(value / summmaryInfo.fileStats.lines)
    ];

    const [errFile, errModule, errLine] = formatRatio(summmaryInfo.resultStats.errors);
    const [warnFile, warnModule, warnLine] = formatRatio(summmaryInfo.resultStats.warnings);
    const [suggFile, suggModule, suggLine] = formatRatio(summmaryInfo.resultStats.suggestions);

    return `
<p style="color:#714AFF;text-align:left;font-size:30px;font-weight:bold" width="300px">
    [${summmaryInfo.projectName}] Summary
</p>
<table>
  <thead>
    <tr>
      <td style="font-size:20px">Total Elapsed Time : </td>
      <td style="font-size:20px;color:green;font-weight:bold">${summmaryInfo.totalTime} seconds</td>
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
      <td ${cellStyle()}>${summmaryInfo.fileStats.files} Files</td>
      <td ${cellStyle()}>${summmaryInfo.fileStats.modules} Modules</td>
      <td ${cellStyle()}>${summmaryInfo.fileStats.lines} Lines</td>
    </tr>
    <tr>
      <td ${cellStyle("font-size:20px")}>Errors:</td>
      <td ${cellStyle("font-weight:bold;font-size:20px;color:red")}>${summmaryInfo.resultStats.errors}</td>
      <td ${cellStyle()}>${errFile}</td>
      <td ${cellStyle()}>${errModule}</td>
      <td ${cellStyle()}>${errLine}</td>
    </tr>
    <tr>
      <td ${cellStyle("font-size:20px")}>Warnings:</td>
      <td ${cellStyle("font-weight:bold;font-size:20px;color:orange")}>${summmaryInfo.resultStats.warnings}</td>
      <td ${cellStyle()}>${warnFile}</td>
      <td ${cellStyle()}>${warnModule}</td>
      <td ${cellStyle()}>${warnLine}</td>
    </tr>
    <tr>
      <td ${cellStyle("font-size:20px")}>Suggestions:</td>
      <td ${cellStyle("font-weight:bold;font-size:20px")}>${summmaryInfo.resultStats.suggestions}</td>
      <td ${cellStyle()}>${suggFile}</td>
      <td ${cellStyle()}>${suggModule}</td>
      <td ${cellStyle()}>${suggLine}</td>
    </tr>
    <tr>
      <td ${cellStyle("font-size:19px")}>I18N Score (0–100)</td>
      <td ${cellStyle("font-size:19px;color:black")}>${fmt.format(summmaryInfo.score)}</td>
      <td ${cellStyle()}></td>
      <td ${cellStyle()}></td>
      <td ${cellStyle()}></td>
    </tr>
  </thead>
</table>
<hr align="left" width="1100px"/>
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
      <td ${tdValueStyle}>${result.path}</td>
    </tr>
    <tr>
      <td ${tdLabelStyle} style="${cellStyle} color:red;">Descriptions</td>
      <td ${tdValueStyle} style="${cellStyle} color:red;">${result.description}</td>
    </tr>
    <tr>
      <td ${tdLabelStyle}>key</td>
      <td ${tdValueStyle}>${result.key}</td>
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
      <td ${tdLabelStyle}>${result.ruleName}</td>
      <td ${tdValueStyle}>${result.description}</td>
    </tr>
    <tr>
      <td ${tdLabelStyle}>More info</td>
      <td ${tdValueStyle}>
        <a href="${result.link}">${result.link}</a>
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

function formatHeader() {
    return `<!DOCTYPE html>
<html>
<head>
  <title>ilib-lint Result for webOS Apps</title>
  <meta charset="UTF-8">
</head>
<body>`;
}

function formatFooter() {
    return `</body></html>`;
}