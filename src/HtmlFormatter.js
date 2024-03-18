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
        this.name = "html-console-formatter";
        this.description = "Formats results for an Html file with colors.";
    }

    /**
     * Format the given result with the current formatter and return the
     * formatted string.
     *
     * @param {Result} result the result to format
     * @returns {String} the formatted result
     */
    completeFile(resultList) {
        console.log("!");
        let header = '<!DOCTYPE html>\n' +
                     '<html>\n' +
                     '<head>\n' +
                     '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\n' +
                     '<title>Lint Result</title>\n' +
                     '</head>\n' +
                     '<body>\n';
        let end = '</body>\n' +
                  '</html>\n';
        return header + resultList + end;
    }
    format(result) {
        console.log("-------------------------------------");

        let levelTextColor = (result.severity === "error") ? "color:red;" : "color:Burlywood;";
        let trtdText = '<tr><td style="text-align:left">';
        let autofix = (result.fix === undefined) ? "unavilable" : result.fix.applied
        let htmlText = '<table cellpadding="0" cellspacing="0" class="display">\n' +
                       ' <thead>\n' +
                       ' <tr><th style=' + levelTextColor + "text-align:left;font-size:22px; width=180px;>" + "["+result.severity + "]"+ "</th><th style='text-align:left'></th></tr>\n" +
                       ' <tr><td style="text-align:left">filepath</td><td style="color:Cadetblue">' + result.pathName + "</td></tr>\n" +
                       ' <tr><td style="color:red; text-align:left">Descriptions</td><td style="color:red;" >' + result.description + "</td></tr>\n" +
                       trtdText + "key" + "</td><td>" + result.source +  "</td></tr>\n" +
                       trtdText + "source" + "</td><td>" + result.id +  "</td></tr>\n" +
                       trtdText + "target" + "</td><td>" + result.highlight + "</td></tr>\n" +
                       trtdText + result.rule.getName() + "</td><td>" + result.rule.getDescription() + "</td></tr>\n" +
                       trtdText + "More info" + "</td><td>" + result.rule.getLink() + "</td></tr>\n" +
                       trtdText + "Auto-fix" + "</td><td>"  + autofix + "</td></tr>\n" +
                       '<thead>\n' +
                       '<table>\n' +
                       '<br>\n';

        return htmlText;
    }
}

export default HtmlFormatter;
