// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod file_edit;
use serde_json::json;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn set_cargo_mass_trailers_and_slave(cargo_mass: &str, dir_save: &str) -> String {
    let response_false: String = json!({
        "res": false
    }).to_string();
    let response_true: String = json!({
        "res": true
    }).to_string();
    
    // 100 ms
    let file: Vec<String> = match file_edit::read_file_text(dir_save) {
        Some(file) => file,
        None => return response_false,
    };

    // 25 ms
    let trailer_id: String = match file_edit::get_my_trailer_id(&file) {
        Some(trailer_id) => trailer_id,
        None => return response_false,
    };
    
    // 25 ms
    let trailer_index: usize = match file_edit::get_trailer_index(&file, trailer_id) {
        Some(trailer_index) => trailer_index,
        None => return response_false,
    };
    
    // 30 ms
    let cargo_mass_save: Vec<String> = match file_edit::set_cargo_mass_trailer(&file, trailer_index, cargo_mass) {
        Some(cargo_mass_save) => cargo_mass_save,
        None => return response_false,
    };

    // 0 ms
    let slave_trailer_id: String = match file_edit::get_slave_trailers_id(&file, trailer_index) {
        Some(slave_trailer_id) => slave_trailer_id,
        None => {
            file_edit::save_file(dir_save.to_string(), cargo_mass_save);
            return response_true;
        },
    };
    
    // 185 ms
    let cargo_mass_save_slave: Vec<String> = file_edit::set_any_slave_trailers_weight(&cargo_mass_save, slave_trailer_id, cargo_mass.to_string());
    
    // 60 ms
    file_edit::save_file(dir_save.to_string(), cargo_mass_save_slave);
    return response_true;
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, set_cargo_mass_trailers_and_slave])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
