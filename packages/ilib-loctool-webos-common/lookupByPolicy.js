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
 * Returns undefined if the key cannot be built (e.g. missing project name).
 *
 * @param {Resource} resource
 * @param {string} locale
 * @param {Object} entry - policy entry
 * @param {string} [commonPrjName]
 * @param {string} [commonPrjType]
 * @returns {string|undefined}
 */
function buildKey(resource, locale, entry, commonPrjName, commonPrjType) {

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
 * @param {Object} [options]
 * @returns {Array<{keyType: string, project: string, datatype: string}>}
 */
function buildPolicy(options) {
    var policy = [];

    policy.push({
        keyType: "hashKey",
        project: "common",
        datatype: "common"
    });

    return policy;
}

/**
 * Detect whether common project data is present in a translations set and
 * populate the shared common-project fields on the FileType instance.
 *
 * Call once at the top of write(), before any DB lookups.
 *
 * @param {Object} fileType     - the plugin FileType instance (mutated in place)
 * @param {Object} translations - the translations set passed to write()
 */
function detectCommonData(fileType, translations) {
    if (
        typeof translations === "undefined" ||
        typeof translations.getProjects() === "undefined" ||
        translations.getProjects().indexOf("common") === -1
    ) {
        return;
    }

    var commonts = translations.getBy({ project: "common" });
    if (commonts.length > 0) {
        fileType.commonPrjName = "common";
        fileType.commonPrjType = commonts[0].getDataType();
    }
}

/**
 * Create a factory that builds params objects for {@link lookupByPolicy}.
 *
 * Plugins call this once in write() and reuse the returned function per
 * (resource, locale) lookup, so the shared context (db, policy, common
 * project info) is captured once instead of being reassembled at each call
 * site. The common project fields are read lazily from `fileType` on every
 * invocation so that changes made during write() (e.g. commonPrjName /
 * commonPrjType being populated after common data is detected) are reflected.
 *
 * @param {Object} fileType - the plugin FileType instance (provides
 *   commonPrjName, commonPrjType — read lazily on each call)
 * @param {Object} db - project.db handle
 * @param {Array}  policy - policy array from {@link buildPolicy}
 * @returns {function(Resource, string): Object} makeLookupParams(resource, locale)
 */
function createLookupParams(fileType, db, policy) {
    return function(resource, locale) {
        return {
            db: db,
            resource: resource,
            locale: locale,
            policy: policy,
            commonPrjName: fileType.commonPrjName,
            commonPrjType: fileType.commonPrjType
        };
    };
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
    lookupByPolicy: lookupByPolicy,
    createLookupParams: createLookupParams,
    detectCommonData: detectCommonData
};
