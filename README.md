# ilib-mono-webos

This repository is a monorepo for the iLib-js project. It is designed to include **webOS-related** packages that are part of iLib-js, even though each package is published to npm as a separate package.

The monorepo is managed using pnpm workspaces and Turborepo.

All packages are placed in the packages/ directory. Each package has its own README.md and package.json, which are located in the package root directory.

## General
The basic purpose and operation method are the same as [ilib-mono](https://github.com/iLib-js/ilib-mono).   
For more details, please see the ilib-mono's [README.md](https://github.com/iLib-js/ilib-mono/blob/main/README.md) file.   

### Project Structure
The project is structured as follows:
- `packages/` - Contains all the packages that are part of the monorepo. Each package is a separate directory containing its own `package.json` file. Each package is published to npm as a separate package.
- `package.json` - Contains the root project configuration.
- `pnpm-workspace.yaml` - Contains the configuration for pnpm workspaces.
- `turbo.json` - Contains the configuration for Turborepo.
- `pnpm-lock.yaml` - Contains the lockfile for pnpm.

## Packages
Here is the list of packages.  
Plugins are optimized for the webOS platform.
name|description|
|:------|:---|
| ilib-loctool-webos-c | C filetype handler. |
| ilib-loctool-webos-cpp |  Cpp filetype handler. |
| ilib-loctool-webos-qml |  QML filetype handler.|
| ilib-loctool-webos-javascript |  JavaScript filetype handler.|
| ilib-loctool-webos-json |  JSON filetype handler.|
| ilib-loctool-webos-json-resource |  JSON resource filetype handler.|
| ilib-loctool-webos-ts-resource |  [TS](https://doc.qt.io/qt-6/linguist-ts-file-format.html) resource filetype handler.|
| ilib-loctool-webos-dart | [Dart](https://docs.fileformat.com/programming/dart/) filetype handler.|
| ilib-lint-webos | provides the ability to parse webOS xliff files and provides rules to check.|
| ilib-loctool-webos-dist | for the purpose of distribution for webOS platform.|
| samples-loctool | sample apps written for each app type to validate the webOS loctool plugins.|
| samples-lint | sample app to validate the webOS lint plugin.|

## License
This project is licensed under the Apache 2.0 License. See the [LICENSE](./LICENSE) file for details.