/*
 * lookupByPolicy.js - Policy-based DB translation lookup for webOS loctool plugins
 *
 * Copyright (c) 2026 JEDLSoft
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

var ResourceString = require("loctool/lib/ResourceString.js");

/**
 * Build the DB key for a given resource, locale, and policy entry.
 * Returns undefined if the key cannot be built (e.g. missing project name),
 * which causes lookupByPolicy to silently skip that step.
 *
 * When adding a new policy step to buildPolicy(), add a matching branch here
 * that handles the new entry.project value. A missing branch means lookupByPolicy
 * returns undefined for that step even when the entry is present.
 *
 * @param {Resource} resource
 * @param {string} locale
 * @param {Object} entry - policy entry from buildPolicy()
 * @param {string} [commonPrjName]
 * @param {string} [commonPrjType]
 * @returns {string|undefined}
 */
function buildKey(resource, locale, entry, commonPrjName, commonPrjType) {

    if (entry.project === "current" && entry.datatype === "universal") {
        var project = resource.getProject && resource.getProject();
        if (!project) return undefined;
        return ResourceString.cleanHashKey(project, locale, resource.getKey(), entry.datatype, resource.getFlavor());
    }

    if (entry.project === "common") {
        if (!commonPrjName || !commonPrjType) return undefined;
        return ResourceString.hashKey(commonPrjName, locale, resource.getKey(), commonPrjType, resource.getFlavor());
    }

    return undefined;
}

/**
 * Build a LOOKUP_POLICY array for a plugin.
 *
 * Step 0 (locale direct via cleanHashKeyForTranslation) is NOT included here —
 * callers perform that lookup themselves, then call lookupByPolicy on miss.
 *
 * To add a new fallback step:
 *   1. Push a new entry object here (e.g. { keyType: "hashKey", project: "brand", datatype: "..." }).
 *   2. Add a matching `if (entry.project === "brand")` branch in buildKey() above.
 *   3. If the step needs extra context fields, add them to the makeLookupParams factory in buildResolver().
 *
 * @param {Object} [options] - reserved for future step configuration; currently unused
 * @returns {Array<{keyType: string, project: string, datatype: string}>}
 */
function buildPolicy(options) {
    var policy = [];

    if (options && options.includeUniversal) {
        policy.push({
            keyType: "hashKey",
            project: "current",
            datatype: "universal"
        });
    }

    policy.push({
        keyType: "hashKey",
        project: "common",
        datatype: "common"
    });

    return policy;
}

/**
 * Walk a policy array performing successive DB lookups until a translation is found.
 *
 * The direct-key lookup (step 0: cleanHashKeyForTranslation) is NOT included;
 * callers do that themselves, then call this on miss.
 *
 * @param {Object} params
 * @param {Object}   params.db                 - project.db handle
 * @param {Resource} params.resource            - source resource being looked up
 * @param {string}   params.locale              - target locale
 * @param {Array}    params.policy              - policy array from buildPolicy()
 * @param {string}   [params.commonPrjName]     - common project name (e.g. "common")
 * @param {string}   [params.commonPrjType]     - common project datatype
 * @param {number}   [params.startIndex=0]      - internal recursion index; callers omit this
 * @param {function(Resource|undefined): void} callback
 */
function lookupByPolicy(params, callback) {
    var step = typeof params.startIndex === "number" ? params.startIndex : 0;
    var policy = params.policy;

    if (step >= policy.length) {
        callback(undefined);
        return;
    }

    var entry = policy[step];

    var key = buildKey(params.resource, params.locale, entry, params.commonPrjName, params.commonPrjType);
    if (!key) {
        lookupByPolicy(Object.assign({}, params, { startIndex: step + 1 }), callback);
        return;
    }

    params.db.getResourceByCleanHashKey(key, function(err, translated) {
        if (translated) {
            callback(translated);
        } else {
            lookupByPolicy(Object.assign({}, params, { startIndex: step + 1 }), callback);
        }
    });
}

module.exports = {
    buildPolicy: buildPolicy,
    lookupByPolicy: lookupByPolicy
};
