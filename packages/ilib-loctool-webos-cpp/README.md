# ilib-loctool-webos-cpp
ilib-webos-loctool-cpp is a plugin for the loctool allows it to read and localize Cpp files. This plugin is optimized for the webOS platform.

### Cpp FileType
This plugin expects to be used [libwebosi18n](https://github.com/webosose/libwebosi18n) library to internationalize your Cpp code.  
It extracts string usages used in the examples below by considering them as strings that need to be translated.
```cpp
getLocString("Yes");
getLocStringWithKey("PictureMode.Standard", "Standard");
```

#### Sample
The simple sample is provided in the [ilib-loctool-samples](https://github.com/iLib-js/ilib-loctool-samples) repository.
Please check the [webos-cpp](https://github.com/iLib-js/ilib-loctool-samples/tree/main/webos-cpp) sample to see how the Cpp file type is localized.

## License

Copyright (c) 2019-2025, JEDLSoft

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

See the [CHANGELOG.md](./CHANGELOG.md) file.