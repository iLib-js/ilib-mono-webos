# ilib-loctool-webos-ts-resource
ilib-loctool-webos-ts-resource is a plugin for the loctool that
allows it to read and localize TS resource files. This plugin is optimized for the webOS platform.

### TSResource FileType
This plugin is for generating [TS](https://doc.qt.io/qt-6/linguist-ts-file-format.html) type of resource file from the QML application.   
The TS file format used by Qt Linguist. The TS file is an intermediate output for QML localization. *.qm files are required for the application. Converting ts file to qm file work happens during a webOS build. Here's a simple ts file example.
```xml
   <?xml version="1.0" encoding="utf-8"?>
   <!DOCTYPE TS>
   <TS version="2.1" language="ko-KR" sourcelanguage="en-US">
   <context>
    <name>Intro</name>
       <message>
           <location filename="Intro.qml"></location>
           <source>Hello</source>
           <translation>안녕하세요</translation>
       </message>
   </context>
   </TS
```

#### Sample
The simple sample is provided in [samples-loctool](https://github.com/iLib-js/ilib-mono-webos/tree/main/packages/samples-loctool).
Please check the [webos-qml](https://github.com/iLib-js/ilib-mono-webos/tree/main/packages/samples-loctool/webos-qml) sample to see what TS file looks like.

## License

Copyright (c) 2019-2025, JEDLSoft

This plugin is license under Apache2. See the [LICENSE](https://github.com/iLib-js/ilib-mono-webos/blob/main/packages/ilib-loctool-webos-ts-resource/LICENSE)
file for more details.

## Release Notes

See the [CHANGELOG.md](https://github.com/iLib-js/ilib-mono-webos/blob/main/packages/ilib-loctool-webos-ts-resource/CHANGELOG.md) file.
