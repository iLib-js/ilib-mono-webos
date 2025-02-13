# ilib-loctool-webos-c
ilib-webos-loctool-c is a plugin for the loctool allows it to read and localize C files. This plugin is optimized for the webOS platform.
### C FileType
This plugin expects to be used [libwebosi18n](https://github.com/webosose/libwebosi18n) library to internationalize your C code.  
It extracts string usages used in the examples below by considering them as strings that need to be translated.
```c
resBundle_getLocString(_gResBundle, "Yes");
resBundle_getLocStringWithKey(resBundle, "PictureMode.Standard", "Standard");
```

#### Sample
The simple sample is provided in the [ilib-loctool-samples](https://github.com/iLib-js/ilib-loctool-samples) repository.
Please check the [webos-c](https://github.com/iLib-js/ilib-loctool-samples/tree/main/webos-c) sample to see how the C file type is localized.

## License

Copyright (c) 2019-2025, JEDLSoft

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

See the [CHANGELOG.md](./CHANGELOG.md) file.
