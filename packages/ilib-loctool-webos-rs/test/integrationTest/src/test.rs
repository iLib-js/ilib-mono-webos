fn localize(res_bundle: &ResBundle, bundle: &ResBundle) {
    let yes = get_loc_string(res_bundle, "Yes");
    let no = get_loc_string(res_bundle, "No");
    let ok = get_loc_string(res_bundle, "OK");
    let programme = get_loc_string(res_bundle, "Programme");
    let sound_out = get_loc_string(res_bundle, "Sound Out");
    let not_available = get_loc_string(res_bundle, "NOT AVAILABLE");
    let tv_name = get_loc_string(res_bundle, "TV Name");
    let morning = get_loc_string(res_bundle, "Good      Morning"); // multispaces
    let exit_app = bundle.get_loc_string("EXIT APP"); // method-call style
    let retry = bundle.get_loc_string("RETRY");
    let later = get_loc_string(res_bundle, "See   you   later"); // multispaces - common cleanHashKey
    let standard = get_loc_string_with_key(res_bundle, "PictureMode.Standard", "Standard");
}
