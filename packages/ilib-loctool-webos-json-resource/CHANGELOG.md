# ilib-loctool-webos-json-resource

## 1.7.1

### Patch Changes

- 079439a: Updated dependencies. (loctool: 2.28.1)

## 1.7.0

- Updated to generate the plural pseudo data for the DartFileType correctly.

## 1.6.1

- Updated dependencies. (loctool: 2.24.0)

## 1.6.0

- Updated to support Dart filetype localization output.
  - The following settings value is need in your `project.json` file to get proper ouput.
  ```json
  "settings": {
    "dart": {
        "mappings": {
            "**/*.dart": {
                "template": "[dir]/assets/i18n/[localeUnder].json"
            }
        }
    },
  }
  ```
- Converted all the unit tests from `nodeunit` to `jest`.

## 1.5.8

- Updated to use ilib's Locale class for locale parsing.
- Removed `npm-shrinkwrap.json`. It takes a bigger memory size than I expected on webOS. so I decided not to maintain the file here.

## 1.5.7

- Updated loctool dependency information to be written both `peerDependencies` and `devDependencies`.

## 1.5.6

- Moved `loctool` package to `peerDependencies` in `package.json`.

## 1.5.5

- Moved `loctool` packages to `dependencies` in `package.json` because it is actually used in codes.

## 1.5.4

- Updated dependencies. (loctool: 2.23.1)
- Updated to be included `npm-shrinkwrap.json` in the published files.

## 1.5.3

- Updated dependencies. (loctool: 2.22.0)

## 1.5.2

- Updated dependencies. (loctool: 2.21.0)

## 1.5.1

- Fixed to generate `ilibmanifest.json` file correctly even when a dummy file exists.

## 1.5.0

- Added a timestamp in `ilibmanifest.json` file to support wee localization.
- Updated to skip writing `ilibmanifest.json` creation logic if it has already been done in another plugin.

## 1.4.2

- Updated dependent module version to have the latest one.(loctool: 2.20.2)

## 1.4.1

- Updated dependent module version to have the latest one.(loctool: 2.20.0)

## 1.4.0

- Updated dependencies. (loctool: 2.18.0)
- Added ability to override language default locale.

## 1.3.11

- Updated dependencies. (loctool: 2.17.0)
- Removed source and target comparison code when generating resources.
  - en(en-US) (source: Programme, target: Channel)
  - en/GB (source: Programme, target: Programme)

## 1.3.10

- Updated dependencies. (loctool: 2.16.3)
- Used the logger provided by the loctool instead of using log4js directly.
- Added node 16 version testing for circleCI. (minimum version of node is v10.0.0)
- Fixed not to generate empty directory if content is empty even locale is in target list.

## 1.3.9

- Updated dependent module version to have the latest one.(loctool: 2.16.2)

## 1.3.8

- Updated dependent module version to have the latest one.(loctool: 2.14.1)

## 1.3.7

- Updated dependent module version to have the latest one.(loctool: 2.13.0)

## 1.3.6

- Fixed `newFile()` to get locale parameter for convert feature
- Updated dependent module version to have the latest one.(loctool: 2.12.0)

## 1.3.5

- Updated dependent module version to have the latest one.(loctool: 2.10.3)

## 1.3.4

- Updated dependent module version to have the latest one.

## 1.3.3

- Changed en-US translation data to be located in the resource root directory.
- Fixed not to generate resource file when the content is empty.
- Fixed to generate `ilibmanifest.json` file properly in the nested project localization case.

## 1.3.2

- Changed the default Resource output directory to `resources`

## 1.3.1

- Fixed dependent loctool module version

## 1.3.0

- Fixed code in order not to inherit from FileType.
- Fixed resource target path for the output to go to the project's target location properly.
- Updated code to print log with log4js.

## 1.2.0

- Supported various resourceOutput file name. It can be specified according to project type.
  - If the project type is c or cpp program, it should be written in project configuration.
    ```json
    "settings": {
        "locales": ["en-US", "ko-KR", "zh-Hans-CN"],
        "resourceFileNames": {
            "c": "cstrings.json",
            "cpp": "cppstrings.json"
        }
    }
    ```

## 1.1.1

- Changed the way of generating manifestfile. it scans the resource output directory then add a list if the file exists.

## 1.1.0

- Generated `ilibmanifest.json` file.
  - Updated code to generate `ilibmanifest.json` file not to load unnecessary locale directories.
    It's implemented in projectClose()
