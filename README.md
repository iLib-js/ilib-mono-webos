# ilib-loctool-webos-dart

ilib-webos-loctool-dart is a plugin for the loctool that
allows it to read and localize Dart files. This plugin is optimized for the webOS platform.

### Dart FileType
This plugin expects to be used [flutter_translate](https://pub.dev/packages/flutter_translate) library.  
However, it has some different behavior on webOS.   
This is because we are using the `flutter_translate` library with some modifications to meet the needs of webOS.   
The key of translateion() must not be split by dot(.) symboe. because webOS localization is plain-text based (not text-IDased)  
The localization tool doesn't generate resources in nested format except plurals.

It extracts string usages used in the examples below by considering them as strings that need to be translated.

```dart

translate("High")
translate("High", key: "home_connect_210") // will be supported for webos
translate("{arg1} app cannot be deleted.", arg:{"arg1": "Settings"})
translate("The lowest temperature is {arg1} and the highest temperature is {arg2}.", arg:{"arg1": 15, "arg2": 30})
```

#### Sample
The simple sample is provided in the [ilib-loctool-samples](https://github.com/iLib-js/ilib-loctool-samples) repository.
Please check the [webos-dart](https://github.com/iLib-js/ilib-loctool-samples/tree/main/webos-dart) sample to see how the JavaScript file type is localized.

## License

Copyright (c) 2023, JEDLSoft

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

### v1.1.0
* initial version