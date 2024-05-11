// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::json;
mod utils;
mod structs;

const RESPONSE_FALSE: &str = r#"{"res": false}"#;
const RESPONSE_TRUE: &str = r#"{"res": true}"#;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn set_cargo_mass_trailers_and_slave(cargo_mass: &str, dir_save: &str) -> String {    
    // 100 ms
    let file: Vec<String> = match utils::file_edit::read_file_text(dir_save) {
        Some(file) => file,
        None => return RESPONSE_FALSE.to_string(),
    };

    // 25 ms
    let trailer_id: String = match utils::file_edit::get_my_trailer_id(&file) {
        Some(trailer_id) => trailer_id,
        None => return RESPONSE_FALSE.to_string(),
    };
    
    // 25 ms
    let trailer_index: usize = match utils::file_edit::get_trailer_index(&file, trailer_id) {
        Some(trailer_index) => trailer_index,
        None => return RESPONSE_FALSE.to_string(),
    };
    
    // 30 ms
    let cargo_mass_save: Vec<String> = match utils::file_edit::set_cargo_mass_trailer(&file, trailer_index, cargo_mass) {
        Some(cargo_mass_save) => cargo_mass_save,
        None => return RESPONSE_FALSE.to_string(),
    };

    // 0 ms
    let slave_trailer_id: String = match utils::file_edit::get_slave_trailers_id(&file, trailer_index) {
        Some(slave_trailer_id) => slave_trailer_id,
        None => {
            utils::file_edit::save_file(dir_save.to_string(), cargo_mass_save);
            return RESPONSE_TRUE.to_string();
        },
    };
    
    // 185 ms
    let cargo_mass_save_slave: Vec<String> = utils::file_edit::set_any_slave_trailers_weight(&cargo_mass_save, slave_trailer_id, cargo_mass.to_string());
    
    // 60 ms
    utils::file_edit::save_file(dir_save.to_string(), cargo_mass_save_slave);
    return RESPONSE_TRUE.to_string();
}

#[tauri::command]
fn set_unlock_current_trailers(dir_save: &str) -> String {
    let file: Vec<String> = match utils::file_edit::read_file_text(dir_save) {
        Some(file) => file,
        None => return RESPONSE_FALSE.to_string(),
    };

    let trailer_id: String = match utils::file_edit::get_my_trailer_id(&file) {
        Some(trailer_id) => trailer_id,
        None => return RESPONSE_FALSE.to_string(),
    };

    let trailer_index: usize = match utils::file_edit::get_trailer_index(&file, trailer_id) {
        Some(trailer_index) => trailer_index,
        None => return RESPONSE_FALSE.to_string(),
    };

    let trailer_def_id: String = match utils::file_edit::get_trailer_def_id(&file, trailer_index) {
        Some(trailer_def_id) => trailer_def_id,
        None => return RESPONSE_FALSE.to_string(),
    };

    let trailer_def_index: usize = match utils::file_edit::get_trailer_def_index(&file, trailer_def_id) {
        Some(trailer_def_index) => trailer_def_index,
        None => return RESPONSE_FALSE.to_string(),
    };

    let trailer_unlocked: Vec<String> = match utils::file_edit::set_remove_trailer_restricted_areas(&file, trailer_def_index) {
        Some(trailer_unlocked) => trailer_unlocked,
        None => return RESPONSE_FALSE.to_string(),
    };

    utils::file_edit::save_file(dir_save.to_string(), trailer_unlocked);
    return RESPONSE_TRUE.to_string();
}

#[tauri::command]
fn set_cargo_mass_def_trailers(dir_save: &str, body_mass: &str, chassis_mass: &str) -> String {
    let file: Vec<String> = match utils::file_edit::read_file_text(dir_save) {
        Some(file) => file,
        None => return RESPONSE_FALSE.to_string(),
    };

    let trailer_id: String = match utils::file_edit::get_my_trailer_id(&file) {
        Some(trailer_id) => trailer_id,
        None => return RESPONSE_FALSE.to_string(),
    };

    let trailer_index: usize = match utils::file_edit::get_trailer_index(&file, trailer_id) {
        Some(trailer_index) => trailer_index,
        None => return RESPONSE_FALSE.to_string(),
    };

    let trailer_def_id: String = match utils::file_edit::get_trailer_def_id(&file, trailer_index) {
        Some(trailer_def_id) => trailer_def_id,
        None => return RESPONSE_FALSE.to_string(),
    };

    let trailer_def_index: usize = match utils::file_edit::get_trailer_def_index(&file, trailer_def_id) {
        Some(trailer_def_index) => trailer_def_index,
        None => return RESPONSE_FALSE.to_string(),
    };

    let chassis_and_body_mass = match utils::file_edit::set_chassis_and_body_mass_def_trailers(&file, trailer_def_index, body_mass, chassis_mass) {
        Some(chassis_mass_and_body_mass) => chassis_mass_and_body_mass,
        None => return RESPONSE_FALSE.to_string(),
    };

    utils::file_edit::save_file(dir_save.to_string(), chassis_and_body_mass);
    return RESPONSE_TRUE.to_string();
}

#[tauri::command]
fn get_save_game_name(dir_save: &str) -> String {
    let save_games_name = match utils::file_edit::get_list_save_game(dir_save.to_string()) {
        Some(save_games_name) => save_games_name,
        None => return RESPONSE_FALSE.to_string(),
    };

    let response = json!({
        "res": true,
        "saves": save_games_name,
    });

    return response.to_string();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, set_cargo_mass_trailers_and_slave, set_unlock_current_trailers, set_cargo_mass_def_trailers, get_save_game_name])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
