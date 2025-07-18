# ilib-loctool-webos-qml

## 1.8.2

### Patch Changes

- 1970707: Updated the examples to use the new option `translationDir` instead of the deprecated option `xliffDir`.
- e244b3a: Fix the broken documentation links after each plugin is published to npm
- 7163edd: Updated dependencies. (loctool: 2.30.0)
- Updated dependencies [e244b3a]
- Updated dependencies [7163edd]
  - ilib-loctool-webos-ts-resource@1.5.7
  - ilib-loctool-webos-common@1.1.1

## 1.8.1

### Patch Changes

- 10d6351: Added integration test cases to improve Jest code coverage.
- Updated dependencies [10d6351]
  - ilib-loctool-webos-common@1.1.0

## 1.8.0

### Minor Changes

- 2bd79c9: Created the `ilib-loctool-webos-common` package, which can be commonly used in plugins.
  - Added `addResource()` and `addNewResource()` methods in it. and have also enabled its usage within the plugins.

### Patch Changes

- Updated dependencies [2bd79c9]
  - ilib-loctool-webos-common@1.0.0

## 1.7.7

### Patch Changes

- 3a33a2a: Updated dependencies. (loctool: 2.28.2, ilib: 14.21.1)
- Updated dependencies [3a33a2a]
  - ilib-loctool-webos-ts-resource@1.5.6

## 1.7.6

### Patch Changes

- 079439a: Updated dependencies. (loctool: 2.28.1)
- Updated dependencies [079439a]
  - ilib-loctool-webos-ts-resource@1.5.5

## 1.7.5

- Fixed newline issues where resources of source string containing '\n' were not generated

## 1.7.4

- Updated dependencies. (loctool: 2.24.0)
- Converted all the unit tests from `nodeunit` to `jest`.

## 1.7.3

- Removed `npm-shrinkwrap.json`. It takes a bigger memory size than I expected on webOS. so I decided not to maintain the file here.

## 1.7.2

- Added `loctool` package to `peerDependencies` in `package.json`.

## 1.7.1

- Updated dependencies. (loctool: 2.23.1)
- Updated to be included `npm-shrinkwrap.json` in the published files.

## 1.7.0

- Updated dependencies. (loctool: 2.22.0)
- Updated to use first argument of `qsTranslate()` as a context value instead of file name.
- Added ability to disable pseudo-localization in plugin when a project's pseudo-localization is enabled.
  ```
     "settings": {
          "json": {
              "disablePseudo": true
          }
      }
  ```

## 1.6.0

- Updated dependencies. (loctool: 2.21.0)
- Updated not to load common data repeatedly if it's loaded from another plugin in a project.

## 1.5.1

- Fixed issues where didn't handle single quotes and multi-line properly.

## 1.5.0

- Updated dependencies. (loctool: 2.20.2)
- Fixed an issue where common's locale inheritance data values were not checked.

## 1.4.1

- Added guard code to prevent errors when the common data path is incorrect.
- Fixed an issue where localeInherit related data was not created properly.

## 1.4.0

- Updated dependencies. (loctool: 2.20.0)
- Added ability to define custom locale inheritance.
  - e.g. en-AU inherits translations from en-GB
    ```
       "settings": {
            "localeInherit": {
                "en-AU": "en-GB"
            }
        }
    ```
- Added ability to use common locale data.
  - App's xliff data has a higher priority, if there's no matched string there, then loctool checks data in the commonXliff directory.
    ```
       "settings": {
            "webos": {
                "commonXliff": "./common"
            }
        }
    ```

## 1.3.7

- Updated dependencies. (loctool: 2.18.0)

## 1.3.6

- Updated dependencies. (loctool: 2.17.0)

## 1.3.5

- Updated dependencies. (loctool: 2.16.3)
- Added node 16 version testing for circleCI. ( minimum version of node is v10.0.0)
- Added `js` to the list of file extensions that this plugin handles.
- Used the logger provided by the loctool instead of using log4js directly.
- Fixed an issue not to filter newline character for window.

## 1.3.4

- Updated dependent module version to have the latest one. (loctool: 2.16.2)

## 1.3.3

- Fixed pseudo localization to work properly
- Updated dependent module version to have the latest one. (loctool: 2.14.1)

## 1.3.2

- Updated dependent module version to have the latest one. (loctool: 2.13.0)

## 1.3.1

- Updated dependent module version to have the latest one. (loctool: 2.12.0)

## 1.3.0

- Updated code to extract the i18n comment part more appropriately. If webOS style comments exist, The [general comment style](https://doc.qt.io/qt-5/qtquick-internationalization.html) is ignored.
- Updated dependent module version to have the latest one. (loctool: 2.10.3)

## 1.2.0

- Removed commented lines before parsing so that strings in the comments will not be extracted.
- Updated dependent module version to have the latest one.

## 1.1.1

- Updated code to print log with log4js.

## 1.1.0

- Implemented to pseudo localization properly.
- Used `SourceContextResourceString` in qml file string to solve an issue regarding duplicated keys are exist in the same file

## 1.0.0

- Implemented to parse properly regarding resource bundle usage of qml files.
