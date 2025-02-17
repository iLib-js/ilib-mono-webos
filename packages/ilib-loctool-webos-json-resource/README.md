# ilib-loctool-webos-json-resource
ilib-loctool-webos-json-resource is a plugin for the loctool that
allows it to read and localize JSON resource files. This plugin is optimized for the webOS platform.

### JSONResource FileType
This plugin is for generating JSON type resource files from JavaScript, C, and Cpp source file types. The default JSON resource file name is `strings.json` which is for a JavaScript type. In order to generate other resource file names, The following setting is needed in your `project.json` file.
```json
 "settings": {
    "resourceFileNames": {
        "c": "cstrings.json",
        "cpp": "cppstrings.json"
    }
}
```
#### Sample
The simple sample is provided in the [ilib-loctool-samples](https://github.com/iLib-js/ilib-loctool-samples) repository.
Please check the [webos-js](https://github.com/iLib-js/ilib-loctool-samples/tree/main/webos-js), [webos-c](https://github.com/iLib-js/ilib-loctool-samples/tree/main/webos-c), [webos-cpp](https://github.com/iLib-js/ilib-loctool-samples/tree/main/webos-cpp), and [webos-dart](https://github.com/iLib-js/ilib-loctool-samples/tree/main/webos-dart) samples to see what JSON files look like.

## License

Copyright (c) 2019-2025, JEDLSoft

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

See the [CHANGELOG.md](./CHANGELOG.md) file.
