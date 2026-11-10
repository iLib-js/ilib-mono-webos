//! list.rs - sample Rust source for the webOS loctool rs plugin.
//! Uses the method-call style on a bundle receiver and keyed strings.

pub fn list_strings(bundle: &ResBundle) -> Vec<String> {
    vec![
        bundle.get_loc_string("Ivory Coast"),
        bundle.get_loc_string("Programme"),
        bundle.get_loc_string("Sound Out"),
        bundle.get_loc_string("TV Program Locks"),
        bundle.get_loc_string("Service Area Zip Code"),
        bundle.get_loc_string("Time Settings"),
        bundle.get_loc_string("Please enter password."),
        bundle.get_loc_string("Others"),
        bundle.get_loc_string("Game Optimizer"),
        bundle.get_loc_string("HDMI Deep Color"),
        bundle.get_loc_string("Exit"),
        bundle.get_loc_string("Do you want to change the settings from 'Digital Sound Output' to 'Pass Through' to minimize audio delay while playing game?"),
        bundle.get_loc_string_with_key("PictureMode.Standard", "Standard"),
    ]
}
