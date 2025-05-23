# ilib-loctool-webos-c

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
- Updated dependencies [1d6b5fb]
- Updated dependencies [57de2c8]
  - ilib-loctool-webos-common@1.0.0
  - ilib-loctool-webos-json-resource@1.7.3

## 1.7.7

### Patch Changes

- 7cc51ae: Fix the issue where localizable strings are not extracted when the string value is empty ("").

## 1.7.6

### Patch Changes

- 3a33a2a: Updated dependencies. (loctool: 2.28.2, ilib: 14.21.1)
- Updated dependencies [3a33a2a]
  - ilib-loctool-webos-json-resource@1.7.2

## 1.7.5

### Patch Changes

- 079439a: Updated dependencies. (loctool: 2.28.1)
- Updated dependencies [079439a]
  - ilib-loctool-webos-json-resource@1.7.1

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
- Added ability to disable pseudo-localization in plugin when a project's pseudo-localization is enabled.
  ```
     "settings": {
          "c": {
              "disablePseudo": true
          }
      }
  ```

## 1.6.0

- Updated dependencies. (loctool: 2.21.0)
- Fixed an issue where didn't handle single quotes properly.
- Supported pseudo localization.
- Updated not to load common data repeatedly if it's loaded from another plugin in a project.

## 1.5.2

- Updated dependencies.

## 1.5.1

- Updated dependencies.

## 1.5.0

- Updated dependencies. (loctool: 2.20.2)
- Fixed an issue where common's locale inheritance data values were not checked.
- Updated to check common data's as well when getting base translation.

## 1.4.0

- Updated to custom locale inheritance feature work properly in generate mode.
- Added guard code to prevent errors when the common data path is incorrect.
- Updated to generate resources by comparing base translation data even in generate mode.
- Fixed an issue where localeinherit related data was not created properly according to the order of locales.
- Fixed an issue where data is duplicated when it is the same as base translation in generate mode.

## 1.3.0

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

## 1.2.0

- Updated dependencies. (loctool: 2.18.0)
- Updated to support loctool's generate mode.
- Added ability to override language default locale.
  ```
     "settings": {
          "localeMap": {
              "es-CO": "es"
          }
      }
  ```

## 1.1.7

- Updated dependencies. (loctool: 2.17.0)
- Fixed an issue where strings are not extracted due to incorrect deletion of commented lines.
- Updated to check language default locale translation not to generate duplicate resources.

## 1.1.6

- Updated dependencies. (loctool: 2.16.3)
- Used the logger provided by the loctool instead of using log4js directly.
- Added node 16 version testing for circleCI. (minimum version of node is v10.0.0)

## 1.1.5

- Updated dependent module version to have the latest one. (loctool: 2.16.2)

## 1.1.4

- Updated dependent module version to have the latest one. (loctool: 2.14.1)

## 1.1.3

- Updated dependent module version to have the latest one. (loctool: 2.13.0)

## 1.1.2

- Updated dependent module version to have the latest one. (loctool: 2.12.0)

## 1.1.1

- Updated dependent module version to have the latest one. (loctool: 2.10.3)

## 1.1.0

- Removed commented lines before parsing so that strings in the comments will not be extracted.
- Updated dependent module version to have the latest one.

## 1.0.1

- Updated code to print log with log4js.

## 1.0.0

- Implemented to parse properly regarding resource bundle usage of C files.
