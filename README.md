# ilib-mono-webos

This repository is a monorepo for the iLib-js project. It is designed to include **webOS-related** packages that are part of iLib-js, even though each package is published to npm as a separate package.  
The monorepo is managed using pnpm workspaces and Turborepo.  
All packages are placed in the packages/ directory. Each package has its own README.md and package.json, which are located in the package root directory.  

The webOS-related repositories that existed under iLib-js have been migrated here to ilib-mono-webos.  
All the packages moved to ilib-mono-webos are marked as archived in their original GitHub repositories.

## Table of Contents
- [General](#general)
- [Project Structure](#project-structure)
- [Packages](#packages)
- [Setup](#setup)
- [Testing](#testing)
- [Debugging](#debugging)
- [Contributing](#contributing)
- [Publishing](#publishing)
- [License](#license)

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
- `codecov.yaml` - Contains the configuration for Codecove.


## Packages

Here is the list of packages. Plugins are optimized for the webOS platform.
<table>
  <tr>
    <td>Category</td><td>Name</td><td>Description</td>
  </tr>
  <tr>
    <td rowspan="10">localization</td>
    <td>ilib-loctool-webos-c</td>
    <td>C filetype handler.</td>
  </tr>
  <tr>
    <td>ilib-loctool-webos-cpp</td>
    <td>Cpp filetype handler.</td>
  </tr>
  <tr>
    <td>ilib-loctool-webos-javascript</td>
    <td>JavaScript filetype handler.</td>
  </tr>
  <tr>
    <td>ilib-loctool-webos-qml</td>
    <td>QML filetype handler.</td>
  </tr>
  <tr>
    <td>ilib-loctool-webos-dart</td>
    <td><a href="https://docs.fileformat.com/programming/dart/">Dart</a> filetype handler.</td>
  </tr>
  <tr>
    <td>ilib-loctool-webos-json</td>
    <td> JSON filetype handler.</td>
  </tr>
  <tr>
    <td>ilib-loctool-webos-json-resource</td>
    <td>JSON resource filetype handler.</td>
  </tr>
  <tr>
    <td>ilib-loctool-webos-ts-resource</td>
    <td><a href="https://doc.qt.io/qt-6/linguist-ts-file-format.html">TS</a> resource filetype handler.</td>
  </tr>
  <tr>
    <td>ilib-loctool-webos-dist</td>
    <td>for the purpose of distribution for webOS platform.</td>
  </tr>
  <tr>
    <td>samples-loctool</td>
    <td>sample apps written for each app type to validate the webOS loctool plugins.</td>
  </tr>
  <tr>
    <td rowspan="2">lint</td>
    <td>ilib-lint-webos</td>
    <td>provides the ability to parse webOS xliff files and provides rules to check.</td>
  </tr>
  <tr>
    <td>samples-lint</td>
    <td>sample app to validate the webOS lint plugin.</td>
  </tr>
</table>

## Setup
This project is developed using Node.js, nvm and pnpm.
Make sure you've got them installed before continuing.

- [pnpm.io](https://pnpm.io/): [installation](https://pnpm.io/installation)
    - The pnpm version is specified in `packageManager` property of `package.json` file.

#### 1. Installation

Clone the repository to your local machine with HTTPS:

```bash
git clone https://github.com/iLib-js/ilib-mono-webos.git
```

or with SSH:

```bash
git clone git@github.com:iLib-js/ilib-mono-webos.git
````

Navigate to the project root directory:

```bash
cd ilib-mono-webos
```
Every command from now on should be run in the root directory of the project, unless stated otherwise.


#### 2. Enabling pnpm

Since v16.13, Node.js ships [Corepack](https://nodejs.org/api/corepack.html) for managing package managers, so you
do not need to install Corepack separately.  
However, since this is an experimental feature, you need to enable it by running:

```bash
corepack enable pnpm
```

Optional: `pnpm` might be hard to type, so you may use a shorter alias like `pn` instead. See
guide [here](https://pnpm.io/installation#using-a-shorter-alias).

#### 3. Installing project dependencies

The final step is to install the project dependencies. Run:

```bash
pnpm install
```

You do NOT need to run `pnpm install` from package directories, as the monorepo is set up to handle dependencies for all
packages automatically.


## Testing

Tests are written using [Jest](https://jestjs.io/).
There are few ways to run tests:

* for an affected package(s) solely or
* for all packages in the monorepo.

#### 1. Run tests for affected package(s)

It is recommended to run tests only for projects impacted by recent changes. This saves time, resources, and optimizes the testing process by skipping tests for unmodified projects. To do so, simply run:

```bash
pnpm test
```

#### 2. Run tests for all packages

To run all the tests for all packages in the monorepo, use:

```bash
pnpm test:all
```

#### 3. Other options

These may be useful for development and/or debugging purposes.
These commands should be run from the root directory of the package you're interested in.

1. Run all the tests for a single package in the monorepo:

```bash
pnpm --filter ilib-loctool-webos-javascript test
```

or `cd` into the package directory and run:

```bash
# cd packages/ilib-loctool-webos-javascript
pnpm test
```

2. Run all tests for a single file, by passing the path to the file as an argument to the `pnpm test` command, like
   this:

```bash
pnpm --filter ilib-loctool-webos-javascript test -- JavaScriptFile.test.js
```

or `cd` into the package directory and run:

```bash
# cd packages/ilib-loctool-webos-javascript
pnpm test -- "JavaScriptFile.test.js"
```

## Debugging

Each package contains a command that can be used to run debug.  
To set a breakpoint, simply write `debugger` at the desired location, Start debugging with the following command.

```bash
# cd packages/ilib-loctool-webos-javascript
pnpm run debug
```

By using the `--filter` option, you can debug from the root of the monorepo.

```bash
pnpm -filter ilib-loctool-webos-javascript debug
```

## Contributing

Please see the [CONTRIBUTING.md](./CONTRIBUTING.md) file for guidelines on how to contribute to this project.

## Publishing
When a PR is merged, a new PR is created with the title `Version Packages`. [example](https://github.com/iLib-js/ilib-mono-webos/pull/25)  
This PR was generated by the Changeset Github action. If there is already a PR opened with the same name, the content will be automatically merged into that PR.  
- When packages are ready for release to npm, approve this PR to merge 
- then the packages with your changes will automatically be published to npm.  

This has been set in the `ilib-mono-webos` repo to automate the operation.

## License
This project is licensed under the Apache 2.0 License. See the [LICENSE](./LICENSE) file for details.