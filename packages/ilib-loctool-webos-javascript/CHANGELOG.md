# ilib-loctool-webos-javascript

## 1.10.8

### Patch Changes

- 3a33a2a: Updated dependencies. (loctool: 2.28.2, ilib: 14.21.1)
- Updated dependencies [3a33a2a]
  - ilib-loctool-webos-json-resource@1.7.2

## 1.10.7

### Patch Changes

- 079439a: Updated dependencies. (loctool: 2.28.1)
- 96e8bf4: Update dependencies. (loctool: 2.28.1)
- Updated dependencies [079439a]
  - ilib-loctool-webos-json-resource@1.7.1

## 1.10.6

- Updated dependencies. (loctool: 2.24.0)
- Converted all the unit tests from `nodeunit` to `jest`.
- Modified to use the same variable name as the `ilib-loctool-webos-json-resource` package name in code.

## 1.10.5

- Removed `npm-shrinkwrap.json`. It takes a bigger memory size than I expected on webOS. so I decided not to maintain the file here.

## 1.10.4

- Updated loctool dependency information to be written both `peerDependencies` and `devDependencies`.

## 1.10.3

- Moved `loctool` package to `peerDependencies` in `package.json`.

## 1.10.2

- Moved `loctool` package to `dependencies` in `package.json` because it is actually used in codes.

## 1.10.1

- Updated dependencies. (loctool: 2.23.1)
- Updated to be included `npm-shrinkwrap.json` in the published files.

## 1.10.0

- Updated dependencies. (loctool: 2.22.0)
- Added ability to disable pseudo-localization in plugin when a project's pseudo-localization is enabled.
  ```
     "settings": {
          "javascript": {
              "disablePseudo": true
          }
      }
  ```

## 1.9.0

- Updated dependencies. (loctool: 2.21.0)
- Updated not to load common data repeatedly if it's loaded from another plugin in a project.

## 1.8.2

- Updated dependencies.

## 1.8.1

- Updated dependencies.

## 1.8.0

- Updated dependencies. (loctool: 2.20.2)
- Fixed an issue where common's locale inheritance data values were not checked.
- Updated to match translation's reskey and resource's reskey when they are different.
- Updated to check common data's as well when getting base translation.

## 1.7.0

- Updated to custom locale inheritance feature work properly in `generate` mode.
- Added guard code to prevent errors when the common data path is incorrect.
- Updated to generate resources by comparing base translation data even in `generate` mode.
- Fixed an issue where localeinherit related data was not created properly according to the order of locales.
- Fixed an issue where data is duplicated when it is the same as base translation in `generate` mode.

## 1.6.0

- Updated dependencies. (loctool: 2.20.0)
- Added ability to define custom locale inheritance.
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
- Fixed an issue where multi-space could not be properly parsed in key-value use cases.

## 1.5.0

- Updated dependencies. (loctool: 2.18.0)
- Added ability to override language default locale.
  ```
     "settings": {
          "localeMap": {
              "es-CO": "es"
          }
      }
  ```
- Updated generate mode to use loctool's new public method.

## 1.4.7

- Updated to check language default locale translation not to generate duplicate resources.
- Updated to make source and key policy clear to avoid confusion.

## 1.4.6

- Updated dependencies. (loctool: 2.16.3)
- Used the logger provided by the loctool instead of using log4js directly.
- Added node 16 version testing for circleCI. (minimum version of node is v10.0.0)
- Fixed an issue where the $L(key,value) usage could not be parsed properly.

## 1.4.5

- Update dependent module version to have the latest one.(loctool: 2.16.2)

## 1.4.4

- Fixed pseudo localization to work properly
- Updated dependent module version to have the latest one.(loctool: 2.14.1)

## 1.4.3

- Updated dependent module version to have the latest one.(loctool: 2.13.0)

## 1.4.2

- Updated dependent module version to have the latest one.(loctool: 2.12.0)

## 1.4.1

- Updated dependent module version to have the latest one.(loctool: 2.10.3)

## 1.4.0

- Removed commented lines before parsing so that strings in the comments will not be extracted.
- Updated dependent module version to have the latest one.

## 1.3.0

- Updated regular Expression to extract case when resbundle object name is not `rb` or `RB`.
- Updated code to print log with log4js.
- Supported loctool's generate mode.

## 1.2.0

- Supported pseudo localization

## 1.1.0

- Supported xliff 2.0 style
  - Update code to return translation data properly with xliff 2.0 format
