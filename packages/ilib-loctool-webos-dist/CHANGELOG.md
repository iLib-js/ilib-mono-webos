## 1.16.1
* **Fixes in plugins**
    * webos-qml
      * Fixed newline issues where resources of source string containing '\n' were not generated.
    * webos-dart
      * Fixed to generate the pseudo localization data correctly.
      * Fixed a bug where strings were not extracted when there were spaces between } and ).
~~~
  "ilib-loctool-webos-c": "1.7.4",
  "ilib-loctool-webos-cpp": "1.7.4",
  "ilib-loctool-webos-dart": "1.1.0",
  "ilib-loctool-webos-javascript": "1.10.6",
  "ilib-loctool-webos-json": "1.1.5",
  "ilib-loctool-webos-json-resource": "1.6.1",
  "ilib-loctool-webos-qml": "1.7.5",
  "ilib-loctool-webos-ts-resource": "1.5.4",
  "loctool": "2.24.0"
~~~

## 1.16.0
* Added the new `ilib-loctool-webos-dart` plugin which is for the Dart filetype localization.
* Updated fixed plugins version
* Converted all the unit tests from nodeunit to jest.
* **loctool**
  * Added a new `getProjectType()` method on the Project class.
  * Removed the npm-shrinkwrap.json in repository.
* **Fixes in plugins**
    * webos-json-resouce
      * Updated to support the Dart filetype localization output.
~~~
  "ilib-loctool-webos-c": "1.7.4",
  "ilib-loctool-webos-cpp": "1.7.4",
  "ilib-loctool-webos-dart": "1.0.1",
  "ilib-loctool-webos-javascript": "1.10.6",
  "ilib-loctool-webos-json": "1.1.5",
  "ilib-loctool-webos-json-resource": "1.6.1",
  "ilib-loctool-webos-qml": "1.7.4",
  "ilib-loctool-webos-ts-resource": "1.5.4",
  "loctool": "2.24.0"
~~~

## 1.15.4
* Removed `ilib-loctool-webos-appinfo-json` in the dependencies.
* Updated fixed plugins version
  * Removed `npm-shrinkwrap.json` file in every webOS plugin itself.
~~~
  "ilib-loctool-webos-c": "1.7.3",
  "ilib-loctool-webos-cpp": "1.7.3",
  "ilib-loctool-webos-javascript": "1.10.5",
  "ilib-loctool-webos-json": "1.1.4",
  "ilib-loctool-webos-json-resource": "1.5.8",
  "ilib-loctool-webos-qml": "1.7.3",
  "ilib-loctool-webos-ts-resource": "1.5.3",
  "loctool": "2.23.1"
~~~

## 1.15.3
* Updated fixed plugins version
  * Updated loctool dependency information in all of webOS Plugins to be written both peerDependencies and devDependencies
~~~
  "ilib-loctool-webos-appinfo-json": "1.7.5",
  "ilib-loctool-webos-c": "1.7.2",
  "ilib-loctool-webos-cpp": "1.7.2",
  "ilib-loctool-webos-javascript": "1.10.4",
  "ilib-loctool-webos-json": "1.1.3",
  "ilib-loctool-webos-json-resource": "1.5.7",
  "ilib-loctool-webos-qml": "1.7.2",
  "ilib-loctool-webos-ts-resource": "1.5.2",
  "loctool": "2.23.1"
~~~

## 1.15.2
* Updated fixed loctool and plugins version
* **loctool**
  * Changed the zxx-Hans-XX pseudo style name to `debug-han-simplified`.
* **Fixes in plugins**
  * Update to be included `npm-shrinkwrap.json` in the published files.
~~~
  "ilib-loctool-webos-appinfo-json": "1.7.1",
  "ilib-loctool-webos-c": "1.7.1",
  "ilib-loctool-webos-cpp": "1.7.1",
  "ilib-loctool-webos-javascript": "1.10.1",
  "ilib-loctool-webos-json": "1.1.2",
  "ilib-loctool-webos-json-resource": "1.5.4",
  "ilib-loctool-webos-qml": "1.7.1",
  "ilib-loctool-webos-ts-resource": "1.5.1",
  "loctool": "2.23.1"
~~~

## 1.15.1
* Updated fixed loctool and plugins version
* **Fixes in plugins**
  * webos-json
    * Update to skip the pseudo localization process when the `--nopseudo` option is true. If not, it occurs an error when the pseudo locale is not defined on the project.
~~~
  "ilib-loctool-webos-c": "1.7.0",
  "ilib-loctool-webos-cpp": "1.7.0",
  "ilib-loctool-webos-javascript": "1.10.0",
  "ilib-loctool-webos-json": "1.1.1",
  "ilib-loctool-webos-json-resource": "1.5.3",
  "ilib-loctool-webos-qml": "1.7.0",
  "ilib-loctool-webos-ts-resource": "1.5.0",
  "loctool": "2.22.0"
~~~

## 1.14.1
* Updated to have a fixed version on the `ilib-loctool-webos-json` plugin.
  * All of the plugins must have a fixed version for webOS distribution.
~~~
  "ilib-loctool-webos-appinfo-json": "1.7.0",
  "ilib-loctool-webos-c": "1.6.0",
  "ilib-loctool-webos-cpp": "1.6.0",
  "ilib-loctool-webos-javascript": "1.9.0",
  "ilib-loctool-webos-json": "1.0.0",
  "ilib-loctool-webos-json-resource": "1.5.2",
  "ilib-loctool-webos-qml": "1.6.0",
  "ilib-loctool-webos-ts-resource": "1.4.2",
  "loctool": "2.21.0"
~~~

## 1.15.0
* Updated fixed loctool and plugins version
* **loctool**
  * added new debug-font pseudoLocale style. It transform the source strings into strings of characters that require a different font. This allows you to test out whether or not the font works in your UI without having a real translation.
* **Fixes in plugins**
  * webos-javascript/webos-qml/webos-c/webos-cpp/webos-json
    *  Added ability to disable pseudo-localization in plugin when a project's pseudo-localization is enabled.
  * webos-cpp
    * Updated to support more file extsnsions.
  * webos-qml
    * Update to use first argument of qsTranslate() as a context value instead of file name.
  * webos-ts-resource
    * Update to set context name value properly which is not always a file name.
  * webos-json
    * Support the pseudo localization.
~~~
    "ilib-loctool-webos-c": "1.7.0",
    "ilib-loctool-webos-cpp": "1.7.0",
    "ilib-loctool-webos-javascript": "1.10.0",
    "ilib-loctool-webos-json": "^1.1.0",
    "ilib-loctool-webos-json-resource": "1.5.3",
    "ilib-loctool-webos-qml": "1.7.0",
    "ilib-loctool-webos-ts-resource": "1.5.0",
    "loctool": "2.22.0"
~~~

## 1.14.0
* Updated fixed loctool and plugins version
* note) The last release of `ilib-loctool-webos-appinfo-json` plugin. `ilib-loctool-webos-json` plugin is going to cover `appinfo.json` file localization features as well.
* **loctool**
  * added new `resourceDir` parameter support to util's `formatPath()` which is for modifying the resource root path.
* **Fixes in plugins**
  * webos-javascript/webos-qml/webos-c/webos-cpp/webos-appinfo-json
    * Updated not to load common data repeatedly if it's loaded from another plugin in a project.
  * webos-c/webos-cpp
    * Fixed an issue where didn't handle single quotes properly.
    * Supported pseudo localization.
  * webos-ts-resource
    *  Fixed not to have file extension in name element with js file.
  * webos-appinfo-json
    * Added feature not to do localization if the file is already located in the localization directory.
    * Added the mappings configuration of the mapping which is a mapping between a file and an object that gives info used to localize the files that match it.
  * webos-json
    *  Implement for webOS json file (appinfo.json and qcardinfo.json) of localization.
      * Most of the code is the same as the ilib-loctool-webos-appinfo-json plugin.
    This plugin, however, expands upon the other plugin to support many different types of json files as used in webOS.
      * The plugin contains a built-in version of the schema file for the appinfo.json file type.
      * For other json file types such as qcardinfo.json, the plugin looks for the schema file in the same directory as the json file.
~~~
    "ilib-loctool-webos-appinfo-json": "1.7.0",
    "ilib-loctool-webos-c": "1.6.0",
    "ilib-loctool-webos-cpp": "1.6.0",
    "ilib-loctool-webos-javascript": "1.9.0",
    "ilib-loctool-webos-json": "^1.0.0",
    "ilib-loctool-webos-json-resource": "1.5.2",
    "ilib-loctool-webos-qml": "1.6.0",
    "ilib-loctool-webos-ts-resource": "1.4.2",
    "loctool": "2.21.0"
~~~

## 1.13.1
* Updated plugins version
* (webos-json-resource/webos-appinfo-json) Fixed to generate `ilibmanifest.json` file correctly even when a dummy file exists.
~~~
    "ilib-loctool-webos-appinfo-json": "1.6.1",
    "ilib-loctool-webos-c": "1.5.2",
    "ilib-loctool-webos-cpp": "1.5.2",
    "ilib-loctool-webos-javascript": "1.8.2",
    "ilib-loctool-webos-json-resource": "1.5.1",
    "ilib-loctool-webos-qml": "1.5.1",
    "ilib-loctool-webos-ts-resource": "1.4.1",
    "loctool": "2.20.2"
~~~

## 1.13.0
* Updated plugins version
  * (webos-json-resource/webos-appinfo-json) Added a timestamp in `ilibmanifest.json` file to support wee localization.
  * (webos-json-resource/webos-appinfo-json) Updated to skip writing `ilibmanifest json` creation logic if it has already been done in another plugin.
  * (webos-json-resource/webos-appinfo-json) Set to have more spaces in `ilibmanifest.json` file.
  * (webos-qml) Fixed issues where didn't handle single quotes and multi-line properly.
~~~
    "ilib-loctool-webos-appinfo-json": "1.6.0",
    "ilib-loctool-webos-c": "1.5.1",
    "ilib-loctool-webos-cpp": "1.5.1",
    "ilib-loctool-webos-javascript": "1.8.1",
    "ilib-loctool-webos-json-resource": "1.5.0",
    "ilib-loctool-webos-qml": "1.5.1",
    "ilib-loctool-webos-ts-resource": "1.4.1",
    "loctool": "2.20.2"
~~~

## 1.12.0
* Updated fixed loctool and plugins version
  * (webos-javascript/webos-c/webos-cpp/webos-qml) Fixed an issue where common's locale inheritance data values were not checked.
  * (webos-javascript/webos-c/webos-cpp) Updated to check common data as well when getting a base translation.
  * (webos-javascript) Updated to match translation's reskey and resource's reskey when they are different.
  * (webos-appinfo-json) Fixed not generating duplicated resources by comparing language default locale translation even if the locale follows the locale inheritance rule.

~~~
    "ilib-loctool-webos-appinfo-json": "1.5.0",
    "ilib-loctool-webos-c": "1.5.0",
    "ilib-loctool-webos-cpp": "1.5.0",
    "ilib-loctool-webos-javascript": "1.8.0",
    "ilib-loctool-webos-json-resource": "1.4.2",
    "ilib-loctool-webos-qml": "1.5.0",
    "ilib-loctool-webos-ts-resource": "1.4.1",
    "loctool": "2.20.2"
~~~

## 1.11.0
* Updated fixed plugins version
  * (webos-javascript/webos-c/webos-cpp) Updated to custom locale inheritance feature work properly in generate mode.
  * (webos-javascript/webos-c/webos-cpp) Added guard code to prevent errors when the common data path is incorrect.
  * (webos-javascript/webos-c/webos-cpp) Updated to generate resources by comparing base translation data even in generate mode.
  * (webos-javascript/webos-c/webos-cpp) Fixed an issue where localeinherit related data was not created properly according to the order of locales.
  * (webos-javascript/webos-c/webos-cpp) Fixed an issue where data is duplicated when it is the same as base translation in generate mode.
  * (webos-qml) Added guard code to prevent errors when the common data path is incorrect.
  * (webos-qml) Fixed an issue where localeInherit related data was not created properly.
  * (webos-ts-resource) Replaced dependent xml2json package to xml-js
  * (webos-appinfo-json) Added guard code to prevent errors when the common data path is incorrect.
~~~
    "ilib-loctool-webos-appinfo-json": "1.4.1",
    "ilib-loctool-webos-c": "1.4.0",
    "ilib-loctool-webos-cpp": "1.4.0",
    "ilib-loctool-webos-javascript": "1.7.0",
    "ilib-loctool-webos-json-resource": "1.4.1",
    "ilib-loctool-webos-qml": "1.4.1",
    "ilib-loctool-webos-ts-resource": "1.4.0",
    "loctool": "2.20.0"
~~~

## 1.10.0
* Updated fixed loctool and plugins version
* loctool
  * Added a --localeInherit flag which could define custom locale inheritance.
  * Added a new getRepository() method on the Project class to get the local repository.
  * Added a new getTranslationSet() method on the LocalRepository class to get all of the translations.
* Fixes in plugins
  * Added ability to define custom locale inheritance.
  * Added ability to use common locale data.
  * (webos-javascript) Fixed an issue where multi-space could not be properly parsed in key-value use cases.

~~~
    "ilib-loctool-webos-appinfo-json": "1.4.0",
    "ilib-loctool-webos-c": "1.3.0",
    "ilib-loctool-webos-cpp": "1.3.0",
    "ilib-loctool-webos-javascript": "1.6.0",
    "ilib-loctool-webos-json-resource": "1.4.1",
    "ilib-loctool-webos-qml": "1.4.0",
    "ilib-loctool-webos-ts-resource": "1.3.1",
    "loctool": "2.20.0"
~~~

## 1.9.0
* Updated fixed loctool and plugins version
* loctool
  * Added the utility function to override language default locale.
  * Added new getTranslations() method on the Project calss to get all of the translations.
* Fixes in plugins
  * (webos-javascript/webos-c/webos-cpp/webos-ts-resource/webos-appinfo-json) Added ability to override language default locale.
  * (webos-c/webos-cpp) Updated to support loctool's generate mode.
  * (webos-javascript) Updated generate mode to use loctool's new public method.
~~~
    "ilib-loctool-webos-appinfo-json": "1.3.0",
    "ilib-loctool-webos-c": "1.2.0",
    "ilib-loctool-webos-cpp": "1.2.0",
    "ilib-loctool-webos-javascript": "1.5.0",
    "ilib-loctool-webos-json-resource": "1.4.0",
    "ilib-loctool-webos-qml": "1.3.7",
    "ilib-loctool-webos-ts-resource": "1.3.0",
    "loctool": "2.18.0"
~~~

## 1.8.0
* Updated fixed loctool and plugins version
* Fixes in plugins
  * (webos-appinfo-json) Fixed not to generate duplicated resource by comparing language default locale translation.
  * (webos-c/webos-cpp) Fixed an issue where strings are not extracted due to incorrect deletion of commented lines.
  * (webos-javascript/webos-c/webos-cpp) Updated to check language default locale translation not to generate duplicate resources.
  * (webos-javascript) Updated to make source and key policy clear to avoid confusion.
  * (webos-json-resource) Removed source and target comparison code when generating resources.
~~~
    "ilib-loctool-webos-appinfo-json": "1.2.12",
    "ilib-loctool-webos-c": "1.1.7",
    "ilib-loctool-webos-cpp": "1.1.7",
    "ilib-loctool-webos-javascript": "1.4.7",
    "ilib-loctool-webos-json-resource": "1.3.11",
    "ilib-loctool-webos-qml": "1.3.6",
    "ilib-loctool-webos-ts-resource": "1.2.10",
    "loctool": "2.17.0"
~~~

## 1.7.0
* Updated fixed loctool and plugins version 
* Used the logger provided by the loctool instead of using log4js directly.
* Fixes in plugins
  * (webos-javascript) Fixed an issue where the $L(key, value) usage could not be parsed properly.
  * (webos-json-resource) Fixed not to generate an empty directory if the content is empty even locale is in the target list.
  * (webos-appinfo-json) Fixed to set base locale correctly when calculating resource path.
  * (webos-qml) Added js to the list of file extensions that this plugin handles.
  * (webos-qml) Fixed an issue not to filter newline characters for a window.

~~~
    "ilib-loctool-webos-appinfo-json": "1.2.11",
    "ilib-loctool-webos-c": "1.1.6",
    "ilib-loctool-webos-cpp": "1.1.6",
    "ilib-loctool-webos-javascript": "1.4.6",
    "ilib-loctool-webos-json-resource": "1.3.10",
    "ilib-loctool-webos-qml": "1.3.5",
    "ilib-loctool-webos-ts-resource": "1.2.9",
    "loctool": "2.16.3"
~~~


## 1.6.0
* Updated fixed loctool and plugins version
~~~
    "ilib-loctool-webos-appinfo-json": "1.2.10",
    "ilib-loctool-webos-c": "1.1.5",
    "ilib-loctool-webos-cpp": "1.1.5",
    "ilib-loctool-webos-javascript": "1.4.5",
    "ilib-loctool-webos-json-resource": "1.3.9",
    "ilib-loctool-webos-qml": "1.3.4",
    "ilib-loctool-webos-ts-resource": "1.2.8",
    "loctool": "2.16.2"
~~~

## 1.5.0
* Updated fixed loctool and plugins version
~~~
    "ilib-loctool-webos-appinfo-json": "1.2.9",
    "ilib-loctool-webos-c": "1.1.4",
    "ilib-loctool-webos-cpp": "1.1.4",
    "ilib-loctool-webos-javascript": "1.4.4",
    "ilib-loctool-webos-json-resource": "1.3.8",
    "ilib-loctool-webos-qml": "1.3.3",
    "ilib-loctool-webos-ts-resource": "1.2.7",
    "loctool": "2.14.1"
~~~

## 1.4.0
* Updated fixed loctool and plugins version
~~~
    "ilib-loctool-webos-appinfo-json": "1.2.8",
    "ilib-loctool-webos-c": "1.1.3",
    "ilib-loctool-webos-cpp": "1.1.3",
    "ilib-loctool-webos-javascript": "1.4.3",
    "ilib-loctool-webos-json-resource": "1.3.7",
    "ilib-loctool-webos-qml": "1.3.2",
    "ilib-loctool-webos-ts-resource": "1.2.6",
    "loctool": "2.13.0"
~~~

## 1.3.0
* Updated fixed loctool and plugins version
~~~
    "ilib-loctool-webos-appinfo-json": "1.2.7",
    "ilib-loctool-webos-c": "1.1.2",
    "ilib-loctool-webos-cpp": "1.1.2",
    "ilib-loctool-webos-javascript": "1.4.2",
    "ilib-loctool-webos-json-resource": "1.3.6",
    "ilib-loctool-webos-qml": "1.3.1",
    "ilib-loctool-webos-ts-resource": "1.2.5",
    "loctool": "2.12.0"
~~~

## 1.2.3
* Updated fixed loctool and plugins version
~~~
    "ilib-loctool-webos-appinfo-json": "1.2.6",
    "ilib-loctool-webos-c": "1.1.1",
    "ilib-loctool-webos-cpp": "1.1.1",
    "ilib-loctool-webos-javascript": "1.4.1",
    "ilib-loctool-webos-json-resource": "1.3.5",
    "ilib-loctool-webos-qml": "1.3.0",
    "ilib-loctool-webos-ts-resource": "1.2.4",
    "loctool": "2.10.3"
~~~


## 1.2.2
* Updated fixed plugins version
~~~
    "ilib-loctool-webos-appinfo-json": "1.2.5",
    "ilib-loctool-webos-c": "1.1.0",
    "ilib-loctool-webos-cpp": "1.1.0",
    "ilib-loctool-webos-javascript": "1.4.0",
    "ilib-loctool-webos-json-resource": "1.3.4",
    "ilib-loctool-webos-qml": "1.2.0",
    "ilib-loctool-webos-ts-resource": "1.2.3",
    "loctool": "2.10.2"
~~~

## 1.2.1
* Updated fixed plugins version
~~~
    "ilib-loctool-webos-appinfo-json": "1.2.4",
    "ilib-loctool-webos-json-resource": "1.3.3",
    "ilib-loctool-webos-ts-resource": "1.2.2"
~~~

## 1.2.0
* Updated fixed loctool and plugins version
~~~
    "ilib-loctool-webos-appinfo-json": "1.2.2",
    "ilib-loctool-webos-c": "1.0.1",
    "ilib-loctool-webos-cpp": "1.0.1",
    "ilib-loctool-webos-javascript": "1.3.0",
    "ilib-loctool-webos-json-resource": "1.3.2",
    "ilib-loctool-webos-qml": "1.1.1",
    "ilib-loctool-webos-ts-resource": "1.2.1",
    "loctool": "2.10.0"
~~~

## 1.0.0
* Release v1.0.0 for webOS OSE

## 0.0.3
* Removed node_modules directory. then Changed to be installed packages by running `npm install` during a webOS build.

## 0.0.2
* Updated `ilib-loctool-webos-appinfo-json` version to `1.2.1`

## 0.0.1
* Initial Commit
