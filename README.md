# ilib-loctool-webos-json

ilib-loctool-webos-json is a plugin for the loctool that allows it to read and localize json type of file.   
i.e. `appinfo.json`, `qcardinfo.json`   
This plugin is optimized for webOS platform

### JSON FileType

#### schema
For JSON file type localization, the schema file is needed. 
The plugin contains a built-in version of the schema file for the appinfo.json file type. For other json file types such as qcardinfo.json, the plugin looks for the schema file in the same directory as the json file.  
Here's a example for schema file
```json
{
    "id": "QCardDescription",
    "type": "object",
    "properties": {
        "title": {
            "type": "string",
            "description": "The title of the application.",
            "localizable": true
        },
    }
}
```
#### configuration
The plugin will look for the `mapping` property within the settings of your project.json file. The following settings are used within the json property:

 - template: a path template to use to generate the path to the translated output files. The template replaces strings in square brackets with special values, and keeps any characters intact that are not in square brackets. The default template, if not specified is "[dir]]/[resourceDir]/[localeDir]/[filename]". 
 Please check the all available template. [link](https://github.com/iLib-js/loctool/blob/development/lib/utils.js#L1893).    
 The plugin recognizes and replaces the following strings in template strings:
   - [dir] the original directory where the matched source file came from. This is given as a directory that is relative to the root of the project.
   - [filename] the file name of the matching file.
   - [localeDir] the full locale where each portion of the locale is a directory in this order: [langage], [script], [region].
   - [resourceDir] the root of the resource directory.
```json
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
```

#### Sample
The simple sample is provided in [ilib-loctool-samples](https://github.com/iLib-js/ilib-loctool-samples) repository.
Please check the [webos-json](https://github.com/iLib-js/ilib-loctool-samples/tree/main/webos-json) sample to see how the JSON file type is localized.


## License

Copyright (c) 2019-2023, JEDLSoft

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes
### v1.1.3
* Added `loctool` package to `peerDependencies` in `package.json` as well.
* Moved `micromatch` package to `dependencies` in `package.json` because these are actually used in codes.
* Removed `ilib` package to `dependencies` in `package.json` because it is not used in codes.

### v1.1.2
* Updated dependencies. (loctool: 2.23.1)
* Update to be included `npm-shrinkwrap.json` in the published files.

v1.1.1
* Update to skip the pseudo localization process when the `--nopseudo` option is true.
  If not, it occurs an error when the pseudo locale is not defined on the project.

### v1.1.0
* Updated dependencies. (loctool: 2.22.0)
* Support the pseudo localization.
* Added ability to disable pseudo-localization in plugin when a project's pseudo-localization is enabled.
    ~~~~
       "settings": {
            "json": {
                "disablePseudo": true
            }
        }
    ~~~~

### v1.0.0
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