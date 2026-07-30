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
 *
 * Each policy entry contains the concrete project name and datatype resolved
 * at buildPolicy() time. This function simply delegates to
 * ResourceString.cleanHashKey() without branching.
 *
 * @param {Resource} resource
 * @param {string} locale
 * @param {Object} entry - policy entry from buildPolicy(); must have .project and .datatype
 * @returns {string}
 */
function buildKey(resource, locale, entry) {
    return ResourceString.cleanHashKey(
        entry.project, locale, resource.getKey(), entry.datatype, resource.getFlavor()
    );
}

/**
 * Build a LOOKUP_POLICY array for a plugin.
 *
 * Step 0 (locale direct via cleanHashKeyForTranslation) is NOT included here —
 * callers perform that lookup themselves, then call lookupByPolicy on miss.
 *
 * Policy steps are tried in array order (index 0 first). The first hit wins
 * and terminates the lookup. When adding new steps, place more specific /
 * higher-priority entries earlier in the array:
 *
 *   priority high → low:
 *     universal (own project, datatype-independent) → common (shared pool)
 *
 * Concrete project names and datatypes are resolved at policy-creation time
 * and stored directly in the entry objects. This eliminates runtime branching
 * in buildKey() and makes the policy array self-describing — you can inspect
 * it to see exactly which DB keys will be queried.
 *
 * @param {string} projectName - the current project name (e.g. from project.getProjectId())
 * @param {{commonPrjName: (string|undefined), commonPrjType: (string|undefined)}} common
 *   - detected common project data from detectCommonData()
 * @param {Object} [options] - plugin-specific policy configuration
 * @param {boolean} [options.includeUniversal] - prepend universal (own project) lookup step
 * @returns {Array<{project: string, datatype: string}>}
 */
function buildPolicy(projectName, common, options) {
    var policy = [];

    if (options && options.includeUniversal && projectName) {
        policy.push({
            project: projectName,
            datatype: "universal"
        });
    }

    if (common && common.commonPrjName && common.commonPrjType) {
        policy.push({
            project: common.commonPrjName,
            datatype: common.commonPrjType
        });
    }

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
    var key = buildKey(params.resource, params.locale, entry);

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
