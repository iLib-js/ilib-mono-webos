# ilib-loctool-webos-dart

ilib-webos-loctool-dart is a plugin for the loctool that
allows it to read and localize [Dart](https://docs.fileformat.com/programming/dart/) files. This plugin is optimized for the webOS platform.

### Dart FileType
This plugin expects the code uses the [flutter_translate](https://pub.dev/packages/flutter_translate) library.  

However, it has some different behavior on webOS.   
This is because we are using the `flutter_translate` library with some modifications to meet the needs of webOS.   
**The key of translation() must not be split by dot(.) symbol.**   
because webOS localization is plain-text based (not text-IDased).  
The localization tool doesn't generate resources in nested JSON format except for the case of the plural.

It extracts string usages used in the examples below by considering them as strings that need to be translated.

```dart
translate("High")
translate("High", key: "home_connect_210")
translate("{arg1} app cannot be deleted.", args:{"arg1": "Settings"})
translate("The lowest temperature is {arg1} and the highest temperature is {arg2}.", args:{"arg1": 15, "arg2": 30})

translatePlural('plural.demo', _counter);
translatePlural('1#At least 1 letter|#At least {num} letters', num);
```

#### Sample
The simple sample is provided in the [ilib-loctool-samples](https://github.com/iLib-js/ilib-loctool-samples) repository.
Please check the [webos-dart](https://github.com/iLib-js/ilib-loctool-samples/tree/main/webos-dart) sample to see how the JavaScript file type is localized.

## License

Copyright (c) 2023-2024, JEDLSoft

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

### v1.0.0
* initial version