# ilib-loctool-webos-rs

ilib-loctool-webos-rs is a plugin for loctool that allows it to read and localize Rust files. This plugin is optimized for the webOS platform.
### Rust FileType
This plugin expects to be used [libwebosi18n](https://github.com/webosose/libwebosi18n) library to internationalize your Rust code.  
It extracts string usages used in the examples below by considering them as strings that need to be translated.
```rust
get_loc_string(res_bundle, "Yes");
get_loc_string_with_key(res_bundle, "PictureMode.Standard", "Standard");

// method-call style on a bundle receiver is also supported
bundle.get_loc_string("Yes");
bundle.get_loc_string_with_key("PictureMode.Standard", "Standard");
```

#### Sample
The simple sample is provided in the [samples-loctool](https://github.com/iLib-js/ilib-mono-webos/tree/main/packages/samples-loctool).

## License

Copyright (c) 2026, JEDLSoft

This plugin is licensed under Apache2. See the [LICENSE](https://github.com/iLib-js/ilib-mono-webos/blob/main/packages/ilib-loctool-webos-rs/LICENSE)
file for more details.

## Release Notes

See the [CHANGELOG.md](https://github.com/iLib-js/ilib-mono-webos/blob/main/packages/ilib-loctool-webos-rs/CHANGELOG.md) file.
