/*
 * utils.js - Common utility functions for webos plugins are commonly used.
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

/**
* Add a resource to this file
*
* @param {resFileType} resFileType a filetype of the resource to be added
* @param {Resource} translated a translation resource to add to this file
* @param {Resource} res a source resource for the translation resource
* @param {String} locale a resource of the locale
* @param {String} resPath localization resource path. It is optional
*
* @returns {boolean} true if the resource is added succesfully.
*/
module.exports.addResource = function (resFileType, translated, res, locale, resPath) {
    if (!(resFileType && translated && res && locale)) return false;
    var file;
    // if reskeys don't match, we matched on cleaned string.
    // so we need to overwrite reskey of the translated resource to match
    if (translated.reskey !== res.reskey) {
        translated.reskey = res.reskey;
    }

    var resource = translated.clone();
    resource.project = res.getProject();
    resource.datatype = res.getDataType();
    resource.setTargetLocale(locale);
    resource.pathName = res.getPath();
    resource.context = res.getContext() || res.getPath().replace(/^.*[\\\/]/, '').replace(/\.(qml|js)/, "");
    file = resFileType.getResourceFile(locale, resPath);
    file.addResource(resource);

    return true;
}

/**
* Add a resource to this file
*
* @param {TranslationSet} newresSet translationset for the new resources
* @param {Resource} res a resource to add to this new translation set
* @param {String} locale the target locale of the resource
*
* @returns {boolean} true if the resource is successfully added.
*/
module.exports.addNewResource = function (newresSet, res, locale) {
    if (!(newresSet && res && locale)) return false;

    var note = "No translation for " + res.reskey + " to " + locale;
    var newres = res.clone();
    newres.setTargetLocale(locale);
    newres.setTarget(res.getSource());
    newres.setState("new");
    newres.setComment(note);
    newresSet.add(newres);

    return true;
};