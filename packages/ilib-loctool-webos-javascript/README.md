# ilib-loctool-webos-javascript

ilib-webos-loctool-javascript is a plugin for the loctool that
allows it to read and localize JavaScript files. This plugin is optimized for the webOS platform.

### JavaScript FileType
This plugin expects to be used [iLib](https://github.com/iLib-js/iLib) library directory or [Enact](https://enactjs.com/) framework to internationalize your JavaScript code.   
It extracts string usages used in the examples below by considering them as strings that need to be translated.
* [getString](https://ilib-js.github.io/iLib/docs/api/jsdoc/ResBundle.html#getString) from iLib
* [$L](https://enactjs.com/docs/modules/i18n/$L/) from Enact framework
```javascript
getString("Hello");
getString("Channel", "speaker_channel");
$L("Hello");
$L({value: "Channel", key: "speaker_channel"});
```

#### Sample
The simple sample is provided in the [samples-loctool](https://github.com/iLib-js/ilib-mono-webos/tree/main/packages/samples-loctool).
Please check the [webos-js](https://github.com/iLib-js/ilib-mono-webos/tree/main/packages/samples-loctool/webos-js) sample to see how the JavaScript file type is localized.

## License

Copyright (c) 2019-2025, JEDLSoft

This plugin is license under Apache2. See the [LICENSE](https://github.com/iLib-js/ilib-mono-webos/blob/main/packages/ilib-loctool-webos-javascript/LICENSE)
file for more details.

## Release Notes

See the [CHANGELOG.md](https://github.com/iLib-js/ilib-mono-webos/blob/main/packages/ilib-loctool-webos-javascript/CHANGELOG.md) file.