// Sample Rust source file for testing the webOS loctool rust plugin.

fn localization(res_bundle: &ResBundle) {
    let yes = res_bundle.get_loc_string("Yes");
    let no = res_bundle.get_loc_string("No");
    let ok = res_bundle.get_loc_string("OK");
    let cancel = res_bundle.get_loc_string("Cancel");

    // This string has a key associated with it.
    let standard = res_bundle.get_loc_string_with_key("PictureMode.Standard", "Standard");

    // i18n This is a translator comment.
    let greeting = res_bundle.get_loc_string("Hello, world!");

    // arguments broken into lines by rustfmt, with a trailing comma
    let picture = res_bundle.get_loc_string(
        "Picture",
    );
    let energy = res_bundle
        .get_loc_string_with_key(
            "EnergyMode.Low",
            "Low",
        );
}
