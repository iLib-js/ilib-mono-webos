# ilib-loctool-webos-json

ilib-loctool-webos-json is a plugin for the loctool that allows it to read and localize json type of file.   
i.e. `appinfo.json`, `qcardinfo.json`   
This plugin is optimized for webOS platform

## Release Notes
v1.0.0
* Implement for webOS json file (appinfo.json and qcardinfo.json) of localization.  
  Most of the code is the same as the [ilib-loctool-webos-appinfo-json](https://github.com/iLib-js/ilib-loctool-webos-appinfo-json) plugin.
  This plugin, however, expands upon the other plugin to support many different types of json files as used in webOS.
  * The plugin contains a built-in version of the schema file for the appinfo.json file type.
  * For other json file types such as qcardinfo.json, the plugin looks for the schema file in the same directory as the json file.
  ~~~~
    "settings": {
        "mappings": {
            "**/appinfo.json": {
                "template": "[dir]/[resourceDir]/[localeDir]/[filename]"
            },
            "**/qcardinfo.json": {
                "template": "[dir]/[resourceDir]/[localeDir]/[filename]"
           }
       }
    }
  ~~~~

## License

Copyright (c) 2023, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.