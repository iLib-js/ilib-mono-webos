/*
 * webOSJsonFormatter.js - Formats result output
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

import { Formatter, Result } from 'ilib-lint-common';

/**
 * @class Represent an output formatter for JSON
 */
class webOSJsonFormatter extends Formatter {
    /**
     * Construct an formatter instance.
     * @constructor
     */
    constructor(options) {
        super(options);
        this.name = "webos-json-formatter";
        this.description = "Formats results in json.";
    }

    /**
     * @private
     */
    _formatResult(results) {
        if (!Array.isArray(results) || results.length === 0) return {};

        return {
            details: results.map(item => this.format(item))
        };
    }
    
    /**
     * Format the given result with the current formatter and return the
     * formatted string.
     *
     * @param {Result} result the result to formatted
     * @param {boolean} [errorOnly] true, if only errors are displayed
     * @returns {String} the formatted result with a complete html form
     */
    format(result){
        return {
            severity: result.severity,
            description: result.description,
            path: result.pathName,
            locale: result.locale,
            autofix: (result.fix == undefined) ? "unavailable" : result.fix.applied,
            source: result.source,
            key: result.id,
            highlight: result.highlight,
            ruleName: result.rule.getName(),        
            link: result.rule.getLink()
        };
    }

    /**
     * @private
     */
    _formatSummary(prjName, totalTime, fileStats, resultStats, score) {
        const summary = {
            projectName: prjName,
            totalTime,
            score
        };

        if (resultStats && Object.keys(resultStats).length > 0) {
            summary.resultStats = { ...resultStats };
        }

        if (fileStats && Object.keys(fileStats).length > 0) {
            summary.fileStats = { ...fileStats };
        }

        return { summary };
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

        const summary = this._formatSummary(prjName, totalTime, fileStats, resultStats, score);
        const result = this._formatResult(results, errorsOnly);
        const final = { ...summary, ...result };

        return JSON.stringify(final, null, 2) + "\n";
        //return JSON.stringify(final);
    }
}

export default webOSJsonFormatter;