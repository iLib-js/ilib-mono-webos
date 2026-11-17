fn localize(res_bundle: &ResBundle, bundle: &ResBundle) {
    let yes = res_bundle.get_loc_string("Yes");
    let no = res_bundle.get_loc_string("No");
    let ok = res_bundle.get_loc_string("OK");
    let programme = res_bundle.get_loc_string("Programme");
    let sound_out = res_bundle.get_loc_string("Sound Out");
    let not_available = res_bundle.get_loc_string("NOT AVAILABLE");
    let tv_name = res_bundle.get_loc_string("TV Name");
    let morning = res_bundle.get_loc_string("Good      Morning"); // multispaces
    let exit_app = bundle.get_loc_string("EXIT APP");
    let retry = bundle.get_loc_string("RETRY");
    let later = res_bundle.get_loc_string("See   you   later"); // multispaces - common cleanHashKey
    let standard = res_bundle.get_loc_string_with_key("PictureMode.Standard", "Standard");
}
