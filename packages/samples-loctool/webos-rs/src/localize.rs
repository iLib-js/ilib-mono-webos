//! localize.rs - sample Rust source for the webOS loctool rs plugin.

use webosi18n::ResBundle;

pub enum ButtonLabelType {
    No,
    Yes,
    Ok,
    Cancel,
    Agree,
}

pub fn get_button_label(res_bundle: &ResBundle, button: ButtonLabelType) -> String {
    match button {
        ButtonLabelType::No => get_loc_string(res_bundle, "No"), // i18n
        ButtonLabelType::Yes => get_loc_string(res_bundle, "Yes"), // i18n
        ButtonLabelType::Ok => get_loc_string(res_bundle, "OK"), // i18n
        ButtonLabelType::Cancel => get_loc_string(res_bundle, "Cancel"), // i18n
        ButtonLabelType::Agree => get_loc_string(res_bundle, "Agree"), // i18n
    }
}
