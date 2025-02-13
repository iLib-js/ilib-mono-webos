# ilib-loctool-webos-qml
ilib-webos-loctool-qml is a plugin for the loctool allows it to read and localize QML files. This plugin is optimized for the webOS platform.

### QML FileType
This plugin expects the strings to be marked by using proper APIs from QT suggested.
 - [qsTr()](https://doc.qt.io/qt-6/qml-qtqml-qt.html#qsTr-method)
 - [qsTranslate()](https://doc.qt.io/qt-6/qml-qtqml-qt.html#qsTranslate-method)
 - [qsTrId](https://doc.qt.io/qt-6/qml-qtqml-qt.html#qsTrId-method)
 - [qsTrIdNoOp](https://doc.qt.io/qt-6/qml-qtqml-qt.html#qsTrIdNoOp-method)
 - [qsTrNoOp](https://doc.qt.io/qt-6/qml-qtqml-qt.html#qsTrNoOp-method)
 - [qsTranslate](https://doc.qt.io/qt-6/qml-qtqml-qt.html#qsTranslate-method)
 - [qsTranslateNoOp](https://doc.qt.io/qt-6/qml-qtqml-qt.html#qsTranslateNoOp-method)

```qml
Text { text: qsTr("hello") }
Text { text: qsTranslate("CustomContext", "hello") }
```

#### Sample
The simple sample is provided in [ilib-loctool-samples](https://github.com/iLib-js/ilib-loctool-samples) repository.
Please check the [webos-qml](https://github.com/iLib-js/ilib-loctool-samples/tree/main/webos-qml) sample to see how the qml file type is localized.

## License

Copyright (c) 2019-2025, JEDLSoft

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

See the [CHANGELOG.md](./CHANGELOG.md) file.
