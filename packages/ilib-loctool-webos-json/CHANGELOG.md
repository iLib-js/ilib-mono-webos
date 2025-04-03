# ilib-loctool-webos-json

## 1.1.7

### Patch Changes

- 3a33a2a: Updated dependencies. (loctool: 2.28.2, ilib: 14.21.1)

## 1.1.6

### Patch Changes

- 079439a: Updated dependencies. (loctool: 2.28.1)

## 1.1.5

- Updated dependencies. (loctool: 2.24.0)
- Converted all the unit tests from `nodeunit` to `jest`.

## 1.1.4

- Removed `npm-shrinkwrap.json`. It takes a bigger memory size than I expected on webOS. so I decided not to maintain the file here.
- Updated to use ilib's Locale class for locale parsing.

## 1.1.3

- Added `loctool` package to `peerDependencies` in `package.json` as well.
- Moved `micromatch` package to `dependencies` in `package.json` because these are actually used in codes.
- Removed `ilib` package to `dependencies` in `package.json` because it is not used in codes.

## 1.1.2

- Updated dependencies. (loctool: 2.23.1)
- Updated to be included `npm-shrinkwrap.json` in the published files.

## 1.1.1

- Updated to skip the pseudo localization process when the `--nopseudo` option is true.
  If not, it occurs an error when the pseudo locale is not defined on the project.

## 1.1.0

- Updated dependencies. (loctool: 2.22.0)
- Supported the pseudo localization.
- Added ability to disable pseudo-localization in plugin when a project's pseudo-localization is enabled.
  ```
     "settings": {
          "json": {
              "disablePseudo": true
          }
      }
  ```

## 1.0.0

- Implemented for webOS json file type (appinfo.json and qcardinfo.json) of localization.  
  Most of the code is the same as the [ilib-loctool-webos-appinfo-json](https://github.com/iLib-js/ilib-loctool-webos-appinfo-json) plugin.
  This plugin, however, expands upon the other plugin to support many different types of json files as used in webOS.
  - The plugin contains a built-in version of the schema file for the appinfo.json file type.
  - For other json file types such as qcardinfo.json, the plugin looks for the schema file in the same directory as the json file.
  ```
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
