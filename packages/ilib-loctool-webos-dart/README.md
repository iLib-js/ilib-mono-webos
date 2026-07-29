# ilib-loctool-webos-dart

ilib-loctool-webos-dart is a plugin for loctool that
allows it to read and localize [Dart](https://docs.fileformat.com/programming/dart/) files. This plugin is optimized for the webOS platform.

### Dart FileType
This plugin expects the code to use the [flutter_translate](https://pub.dev/packages/flutter_translate) library.  

However, it has some different behavior on webOS.   
This is because we are using the `flutter_translate` library with some modifications to meet the needs of webOS.   
**The key of translation() must not be split by dot(.) symbol.**   
because webOS localization is plain-text based (not text-ID based).  
The localization tool does not generate resources in nested JSON format, except for plural cases.

Also, this plugin intentionally keeps locale entries even when the translated value is the same as the base locale translation.
Because `flutter_translate` does not provide locale fallback behavior in this workflow, removing entries that duplicate base locale values could cause missing runtime strings.

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
The simple sample is provided in the [samples-loctool](https://github.com/iLib-js/ilib-mono-webos/tree/main/packages/samples-loctool).
Please check the [webos-dart](https://github.com/iLib-js/ilib-mono-webos/tree/main/packages/samples-loctool/webos-dart) sample to see how the Dart file type is localized.

## License

Copyright (c) 2023-2026, JEDLSoft

This plugin is licensed under Apache 2.0. See the [LICENSE](https://github.com/iLib-js/ilib-mono-webos/blob/main/packages/ilib-loctool-webos-dart/LICENSE) file for details.

## Release Notes

See the [CHANGELOG.md](https://github.com/iLib-js/ilib-mono-webos/blob/main/packages/ilib-loctool-webos-dart/CHANGELOG.md) file.
