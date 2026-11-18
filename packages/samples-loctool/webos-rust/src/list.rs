//! list.rs - sample Rust source for the webOS loctool rust plugin.
//! Uses plain and keyed strings of the resource bundle.

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
        // unicode escapes
        bundle.get_loc_string("\u{28}{num}\u{29} items selected"),
        bundle.get_loc_string("Press \u{2018}OK\u{2019} to continue."),
        bundle.get_loc_string("\u{1F3AE} Game Mode"),
        bundle.get_loc_string("Copyright \u{00_A9} 2026"),
        bundle.get_loc_string_with_key("PictureMode.Standard", "Standard"),
    ]
}
