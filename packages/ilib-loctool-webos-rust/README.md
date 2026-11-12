# ilib-loctool-webos-rust

ilib-loctool-webos-rust is a plugin for loctool that allows it to read and localize Rust files. This plugin is optimized for the webOS platform.
### Rust FileType
This plugin extracts string usages used in the examples below by considering them as strings that need to be translated.
```rust
get_loc_string(res_bundle, "Yes");
get_loc_string_with_key(res_bundle, "PictureMode.Standard", "Standard");

// method-call style on a bundle receiver is also supported
bundle.get_loc_string("Yes");
bundle.get_loc_string_with_key("PictureMode.Standard", "Standard");
```

Note: Only normal string literals (`"..."`) are extracted. Raw string literals such as `r#"..."#`
are not supported.

#### Comments for translators
An `i18n` comment on the same line as the call is extracted as the comment of the resource, so that
translators can see it. Both line comments and block comments are supported, and a colon after the
`i18n` keyword is optional.
```rust
get_loc_string(res_bundle, "OK"); // i18n button
get_loc_string(res_bundle, "Cancel"); /* i18n cancel button */
get_loc_string(res_bundle, "Power"); // i18n : Power button
```

Calls inside other comments are not extracted.
```rust
// get_loc_string(res_bundle, "NotExtracted");
```

### Resource file path
The location of the generated JSON resource files is configured with `mappings` in the `rust` section of
the `settings` in your `project.json` file. Each key of `mappings` is a glob pattern that is matched against
the path of the Rust source file, and the `template` of the first matching pattern decides the output path.
Only the Rust source files that match one of the patterns are localized. Rust files that do not match any
pattern are not extracted. In generate mode, there is no source file to match, so the first mapping is used.

Note: The JSON resource file type keeps one resource file per locale. If several mappings are configured,
all strings of a locale are written to the path of the mapping that is used first for that locale.

```json
"settings": {
    "rust": {
        "mappings": {
            "**/*.rs": {
                "template": "[resourceDir]/[localeDir]/rsstrings.json"
            }
        }
    }
}
```

If no `mappings` are configured, or `mappings` is an empty object, the default above is used,
which generates the files below:
```
resources/rsstrings.json        (en-US)
resources/ko/rsstrings.json     (ko-KR)
resources/en/GB/rsstrings.json  (en-GB)
```

The template supports the substitutions of loctool's path templates, such as `[dir]`, `[resourceDir]`,
`[locale]`, `[language]`, `[region]`, `[localeUnder]`. The `[localeDir]` keyword follows the webOS
resource directory layout:
* `en-US` is written at the root (the keyword becomes an empty string).
* A language default locale uses the language only (e.g. `ko-KR` -> `ko`).
* Other locales use each part of the locale as a directory (e.g. `en-GB` -> `en/GB`).

In the same way, `[locale]` and `[localeUnder]` use the language only for a language default locale
(e.g. `ko-KR` -> `ko`, `en-US` -> `en`), and the full locale for the others (e.g. `en-GB` -> `en-GB` / `en_GB`).

Note: In generate mode, there is no source file, so `[dir]` becomes an empty string. If the template
uses `[dir]`, the resource files of generate mode are written to a different path than in localize mode.

#### Sample
The simple sample is provided in the [samples-loctool](https://github.com/iLib-js/ilib-mono-webos/tree/main/packages/samples-loctool).

## License

Copyright (c) 2026, JEDLSoft

This plugin is licensed under Apache2. See the [LICENSE](https://github.com/iLib-js/ilib-mono-webos/blob/main/packages/ilib-loctool-webos-rust/LICENSE)
file for more details.

## Release Notes

See the [CHANGELOG.md](https://github.com/iLib-js/ilib-mono-webos/blob/main/packages/ilib-loctool-webos-rust/CHANGELOG.md) file.
