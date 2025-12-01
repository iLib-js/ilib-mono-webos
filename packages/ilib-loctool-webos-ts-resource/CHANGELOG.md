# ilib-loctool-webos-ts-resource

## 1.5.10

### Patch Changes

- 8c93a03: Update dependencies (loctool: 2.31.7)

## 1.5.9

### Patch Changes

- fce7199: Update dependencies. (loctool: 2.31.3)

## 1.5.8

### Patch Changes

- 7ea2310: Updated dependencies. (loctool: 2.31.0)
- 4f25215: Updated dependencies. (loctool: 2.31.1)

## 1.5.7

### Patch Changes

- e244b3a: Fix the broken documentation links after each plugin is published to npm
- 7163edd: Updated dependencies. (loctool: 2.30.0)

## 1.5.6

### Patch Changes

- 3a33a2a: Updated dependencies. (loctool: 2.28.2, ilib: 14.21.1)

## 1.5.5

### Patch Changes

- 079439a: Updated dependencies. (loctool: 2.28.1)

## 1.5.4

- Updated dependencies. (loctool: 2.24.0)
- Converted all the unit tests from `nodeunit` to `jest`.

## 1.5.3

- Removed `npm-shrinkwrap.json`. It takes a bigger memory size than I expected on webOS. so I decided not to maintain the file here.
- Updated to use the path's `basename()` to get filename from the path.

## 1.5.2

- Added `loctool` package to `peerDependencies` in `package.json`.

## 1.5.1

- Updated dependencies. (loctool: 2.23.1)
- Updated to be included `npm-shrinkwrap.json` in the published files.

## 1.5.0

- Updated dependencies. (loctool: 2.22.0)
- Updated to set context name value properly which is not always a file name.

## 1.4.2

- Updated dependencies. (loctool: 2.21.0)
- Fixed not to have file extension in name element with js file.

## 1.4.1

- Updated dependencies. (loctool: 2.20.2)

## 1.4.0

- Replaced dependent `xml2json` package to `xml-js`

## 1.3.1

- Updated dependencies. (loctool: 2.20.0)

## 1.3.0

- Updated dependencies. (loctool: 2.18.0)
- Added ability to override language default locale.
  ```
     "settings": {
          "localeMap": {
              "es-CO": "es"
          }
      }
  ```

## 1.2.10

- Updated dependencies. (loctool: 2.17.0)

## 1.2.9

- Updated dependencies. (loctool: 2.16.3)
- Used the logger provided by the loctool instead of using log4js directly.
- Added node 16 version testing for circleCI. (minimum version of node is v10)

## 1.2.8

- Updated dependent module version to have the latest one. (loctool: 2.16.2)

## 1.2.7

- Updated dependent module version to have the latest one. (loctool: 2.14.1)

## 1.2.6

- Updated dependent module version to have the latest one. (loctool: 2.13.0)

## 1.2.5

- Fixed `newFile()` to get locale parameter for convert feature
- Updated dependent module version to have the latest one. (loctool: 2.12.0)

## 1.2.4

- Updated dependent module version to have the latest one. (loctool: 2.10.3)

## 1.2.3

- Updated dependent module version to have the latest one.

## 1.2.2

- Updated code to generate resource even though source and target are the same.

## 1.2.1

- Fixed resource target path
- Updated code to print log with log4js.

## 1.2.0

- Changed default sourcelanguage to `en-KR`.

## 1.1.0

- Fixed an issue case which a `key` value is not written to TS file.

## 1.0.0

- Implemented to generate [TS](https://doc.qt.io/qt-5/linguist-ts-file-format.html) style resource file.
  Here's simple output example.
  ```
  <?xml version="1.0" encoding="utf-8"?>
  <!DOCTYPE TS>
  <TS version="2.1" language="ko-KR" sourcelanguage="en-US">
  <context>
   <name>Intro</name>
      <message>
          <location filename="Intro.qml"></location>
          <source>Hello!</source>
          <translation>안녕</translation>
      </message>
  </context>
  </TS
  ```
