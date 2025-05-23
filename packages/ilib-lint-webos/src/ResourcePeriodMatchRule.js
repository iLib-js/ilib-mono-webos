/*
 * ResourcePeriodMatchRule.js - 
 *
 * Copyright (C) 2025 JEDLSoft
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

import { Rule, Result } from 'ilib-lint-common';

/**
 * @class Represent an i18nlint rule.
 */
class ResourcePeriodMatchRule extends Rule {
    constructor(options) {
        super(options);
        this.name = "resource-period-match";
        this.description = "Check if the period marks at the end of the strings in the source and target are the same.";
        this.sourceLocale = (options && options.sourceLocale) || "en-US";
    }

    getRuleType() {
        return "resource";
    }
    // [.,!]
    _getLastCharacter(str) {
        if (!str) return;
        return str.slice(-1);
    }
    
    checkString(src, tar, file, resource, lineNumber) {
        debugger;
        
        if (!tar) {
            // no target string means we don't have to do the matching
            return undefined;
        }
        let results = [], match;
        let problems = [];
        let sourceParams = [];
        let targetParams = [];

        const lastCharacter = {
            source: this._getLastCharacter(src),
            target: this._getLastCharacter(tar),
        };

        const resultMetaProps = {
            id: resource.getKey(),
            rule: this,
            pathName: file,
            //src,
            //locale: resource.getTargetLocale()
        };

        if (lastCharacter.source !== lastCharacter.target) {
            results.push(
                new Result({
                    ...resultMetaProps,
                    severity: "error",
                    description: "last Character in target does not match the lastCharacter in source",
                    highlight:
                        `Source: ` +
                        (src.slice(0, src.length - 1)) +
                        `<e0>${lastCharacter.source}</e0>` +
                        ` Target: ` +
                        (tar.slice(0, tar.length - 1)) +
                        `<e0>${lastCharacter.target}</e0>` 
                })
            )
        }

        if (results && results.length > 1) return results;
        else if (results &&  results.length ===1) results[0]
        else return undefined;
    }

    /**
     * @override
     */
    match(options) {
        debugger;
        const { ir, locale } = options;
        let problems = [];

        if (ir.getType() !== "resource") return;  // we can only process resources
        const resources = ir.getRepresentation();

        const results = resources.flatMap(resource => {
            switch (resource.getType()) {
                case 'string':
                    const tarString = resource.getTarget();
                    if (tarString) {
                        return this.checkString(resource.getSource(), tarString, ir.sourceFile.getPath(), resource, options.lineNumber);
                    }
                    break;

                /*case 'array':
                    const srcArray = resource.getSource();
                    const tarArray = resource.getTarget();
                    if (tarArray) {
                        return srcArray.flatMap((item, i) => {
                            if (i < tarArray.length && tarArray[i]) {
                                return this.checkString(srcArray[i], tarArray[i], ir.sourceFile.getPath(), resource, options.lineNumber);
                            }
                        }).filter(element => {
                            return element;
                        });
                    }
                    break;

                case 'plural':
                    const srcPlural = resource.getSource();
                    const tarPlural = resource.getTarget();
                    if (tarPlural) {
                        const categories = Array.from(new Set(Object.keys(srcPlural).concat(Object.keys(tarPlural))).values());
                        return categories.flatMap(category => {
                            return this.checkString(srcPlural[category] || srcPlural.other, tarPlural[category] || tarPlural.other, ir.sourceFile.getPath(), resource, options.lineNumber);
                        });
                    }
                    break;
                */
            }
            // no match
            return [];
        });
        return results.length > 1 ? results : results[0];
    }
}

export default ResourcePeriodMatchRule;
