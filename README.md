# ilib-lint-webos
An ilib-lint plugin that provides the ability to parse webOS xliff files and provides rules to check .

## Installation

```
npm install --save-dev ilib-lint-webos
```

Then, in your `ilib-lib-config.json`, add a script:

```
    "plugins": [
        "ilib-lint-webos"
    ],
```

Please note: nodejs version 14 or above is required to run ilib-lint, as it
is written with ESM modules.

## License

Copyright (c) 2024-2025, JEDLSoft

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes
### v1.0.1
- Add the missing `log4js` to the dependencies in the `package.son` file.

### v1.0.0
- Implement the HtmlFormatter to write the output into a html file.