# ilib-loctool-webos-cpp

ilib-loctool-webos-cpp is a plugin for loctool that allows it to read and localize C++ files. This plugin is optimized for the webOS platform.

### Cpp FileType

This plugin expects to be used with the [libwebosi18n](https://github.com/webosose/libwebosi18n) library to internationalize your C++ code.  
It extracts string usages used in the examples below by considering them as strings that need to be translated.
```cpp
getLocString("Yes");
getLocStringWithKey("PictureMode.Standard", "Standard");
```

#### Sample
The simple sample is provided in the [samples-loctool](https://github.com/iLib-js/ilib-mono-webos/tree/main/packages/samples-loctool).
Please check the [webos-cpp](https://github.com/iLib-js/ilib-mono-webos/tree/main/packages/samples-loctool/webos-cpp) sample to see how the C++ file type is localized.

## License

Copyright (c) 2019-2026, JEDLSoft

This plugin is licensed under Apache2. See the [LICENSE](https://github.com/iLib-js/ilib-mono-webos/blob/main/packages/ilib-loctool-webos-cpp/LICENSE)
file for more details.

## Release Notes

See the [CHANGELOG.md](https://github.com/iLib-js/ilib-mono-webos/blob/main/packages/ilib-loctool-webos-cpp/CHANGELOG.md) file.