# ilib-loctool-webos-javascript

ilib-webos-loctool-javascript is a plugin for the loctool that
allows it to read and localize javascript files. This plugins is optimized for webOS platform.

## Release Notes
v1.5.0
* Added ability to override language default locale.

v1.4.7
* Updated to check language default locale translation not to generate duplicate resources.
* Updated to make source and key policy clear to avoid confusion.

v1.4.6
* Updated dependencies. (loctool: 2.16.3)
* Used the logger provided by the loctool instead of using log4js directly.
* Added node 16 version testing for circleCI. (minimum version of node is v10.0.0)
* Fixed an issue where the $L(key,value) usage could not be parsed properly.

v1.4.5
* Update dependent module version to have the latest one.(loctool: 2.16.2)

v1.4.4
* Fixed pseudo localization to work properly
* Updated dependent module version to have the latest one.(loctool: 2.14.1)

v1.4.3
* Updated dependent module version to have the latest one.(loctool: 2.13.0)

v1.4.2
* Updated dependent module version to have the latest one.(loctool: 2.12.0)

v1.4.1
* Updated dependent module version to have the latest one.(loctool: 2.10.3)

v1.4.0
* Removed commented lines before parsing so that strings in the comments will not be extracted.
* Updated dependent module version to have the latest one.

v1.3.0
* Updated regular Expression to extract case when resbundle object name is not `rb` or `RB`.
* Updated code to print log with log4js.
* Supported loctool's generate mode.

v1.2.0
* Supported pseudo localization

v1.1.0
* Supported xliff 2.0 style
   * Update code to return translation data properly with xliff 2.0 format


## License

Copyright (c) 2019-2022, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.
