// Sample Rust source file for testing the webOS loctool rs plugin.

fn localization(res_bundle: &ResBundle) {
    let yes = get_loc_string(res_bundle, "Yes");
    let no = get_loc_string(res_bundle, "No");
    let ok = get_loc_string(res_bundle, "OK");
    let cancel = get_loc_string(res_bundle, "Cancel");

    // This string has a key associated with it.
    let standard = get_loc_string_with_key(res_bundle, "PictureMode.Standard", "Standard");

    // i18n This is a translator comment.
    let greeting = get_loc_string(res_bundle, "Hello, world!");

    // method-call style on a bundle receiver
    let picture = bundle.get_loc_string("Picture");
    let energy = bundle.get_loc_string_with_key("EnergyMode.Low", "Low");
}
