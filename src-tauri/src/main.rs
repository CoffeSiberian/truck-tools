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
    let response_null: String = json!({
        "res": false
    }).to_string();

    let file: Option<Vec<String>> = file_edit::read_file_text(dir_save);
    if file.is_none() {
        return response_null;
    }

    let trailer_id: Option<String> = file_edit::get_my_trailer_id(file.clone().unwrap());
    if trailer_id.is_none() {
        return response_null;
    }

    let trailer_index: Option<usize> = file_edit::get_trailer_index(file.clone().unwrap(), trailer_id.clone().unwrap());
    if trailer_index.is_none() {
        return response_null;
    }

    let cargo_mass_save: Option<Vec<String>> = file_edit::set_cargo_mass_trailer(file.clone().unwrap(), trailer_index.clone().unwrap(), cargo_mass);
    if cargo_mass_save.is_none() {
        return response_null;
    }

    let slave_trailer_id: Option<String> = file_edit::get_slave_trailers_id(file.clone().unwrap(), trailer_index.clone().unwrap());
    if slave_trailer_id.is_none() {
        return response_null;
    }

    let slave_trailer_index: Option<usize> = file_edit::get_trailer_index(file.clone().unwrap(), slave_trailer_id.clone().unwrap());
    if slave_trailer_index.is_none() {
        return response_null;
    }

    let cargo_mass_save_slave: Vec<String> = file_edit::set_any_slave_trailers_weight(file.clone().unwrap(), slave_trailer_id.clone().unwrap(), cargo_mass.to_string());
    
    file_edit::save_file(dir_save.to_string(), cargo_mass_save_slave);
    return json!({
        "res": true
    }).to_string();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, set_cargo_mass_trailers_and_slave])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
