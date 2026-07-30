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
 * Supported entry branches:
 *   - "current" + datatype "universal": datatype-independent translation stored
 *     under the *current* project. The key is built from the resource's own
 *     project (resource.getProject()); the step is skipped when that is absent.
 *   - "common": translation stored in the shared common project pool. Requires
 *     commonPrjName/commonPrjType (captured at buildResolver() time); the step
 *     is skipped when either is missing.
 *
 * Key-builder choice: the "universal" branch uses ResourceString.cleanHashKey()
 * while the "common" branch uses ResourceString.hashKey(). Both keys are later
 * queried via db.getResourceByCleanHashKey() in lookupByPolicy() — the common
 * branch intentionally mirrors the pre-refactor behavior, where a hashKey()
 * value was passed to getResourceByCleanHashKey(). Do not "normalize" the two
 * builders to match without verifying against the DB key format.
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
 * Policy steps are tried in array order (index 0 first). The first hit wins
 * and terminates the lookup. When adding new steps, place more specific /
 * higher-priority entries earlier in the array:
 *
 *   priority high → low:
 *     universal (current project, datatype-independent) → common (shared pool)
 *
 * Current options:
 *   - options.includeUniversal {boolean} — when true, prepends a "universal"
 *     step that looks up a datatype-independent translation within the current
 *     project before falling back to the common project pool.
 *
 * To add a new fallback step:
 *   1. Add a new entry object (see the "universal" entry above as a reference).
 *   2. Add a matching branch in buildKey() (see the existing
 *      `if (entry.project === "current")` and `if (entry.project === "common")` branches).
 *   3. If the step needs extra context fields, add them to the makeLookupParams factory in buildResolver().
 *   4. Consider priority: insert the entry at the appropriate position in the
 *      array so that more specific lookups are tried before broader ones.
 *
 * @param {Object} [options] - plugin-specific policy configuration
 * @param {boolean} [options.includeUniversal] - prepend universal (current project) lookup step
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
