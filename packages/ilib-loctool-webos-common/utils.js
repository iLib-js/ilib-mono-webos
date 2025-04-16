/*
 * utils.js - various utilities
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