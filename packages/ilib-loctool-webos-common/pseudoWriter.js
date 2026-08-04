/*
 * pseudoWriter.js - Pseudo resource write utility for localize mode
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

var pluginUtils = require("./utils.js");

/**
 * Collect, filter, and write pseudo resources to their resource files in localize mode.
 *
 * Collects pseudo resources from the pseudo bundle, filters by datatype and the
 * disablePseudo setting, then writes each qualifying resource to its resource file.
 *
 * @param {Object} pseudo - plugin's pseudo bundle (this.pseudo)
 * @param {Object} settings - project settings (project.settings)
 * @param {string} settingsKey - key into settings for this plugin type (usually this.type;
 *   for Dart use this.type.replace("x-", ""))
 * @param {string} datatype - plugin's own datatype for filtering (this.datatype)
 * @param {Object} resFileType - resource file type from project.getResourceFileType()
 * @param {string} sourceLocale - project source locale
 * @param {string} deviceType - device type for target resolution
 * @param {Function} [resPathFn] - optional callback(res) returning localized resource path.
 *   Required for plugins where getResourceFile() takes a path argument (e.g. Dart).
 */
function writePseudoResources(pseudo, settings, settingsKey, datatype, resFileType, sourceLocale, deviceType, resPathFn) {
    var pseudoResources = [];
    if (settings[settingsKey] === undefined ||
        (settings[settingsKey] && !(settings[settingsKey].disablePseudo === true))) {
        pseudoResources = pseudo.getAll().filter(function(res) {
            return res.datatype === datatype;
        });
    }

    pseudoResources.forEach(function(res) {
        if (res.getTargetLocale() !== sourceLocale &&
            res.getSource() !== pluginUtils.getTarget(res, deviceType)) {
            var resPath = resPathFn ? resPathFn(res) : undefined;
            res.setTarget(pluginUtils.getTarget(res, deviceType));
            resFileType.getResourceFile(res.getTargetLocale(), resPath).addResource(res);
        }
    });
}

module.exports = {
    writePseudoResources: writePseudoResources
};
