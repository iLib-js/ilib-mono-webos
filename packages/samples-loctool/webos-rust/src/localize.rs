//! localize.rs - sample Rust source for the webOS loctool rust plugin.

pub enum ButtonLabelType {
    No,
    Yes,
    Ok,
    Cancel,
    Agree,
}

pub fn get_button_label(res_bundle: &ResBundle, button: ButtonLabelType) -> String {
    match button {
        ButtonLabelType::No => res_bundle.get_loc_string("No"), // i18n
        ButtonLabelType::Yes => res_bundle.get_loc_string("Yes"), // i18n
        ButtonLabelType::Ok => res_bundle.get_loc_string("OK"), // i18n
        ButtonLabelType::Cancel => res_bundle.get_loc_string("Cancel"), // i18n
        ButtonLabelType::Agree => res_bundle.get_loc_string("Agree"), // i18n
    }
}
