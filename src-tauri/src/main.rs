// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod main_options;
mod structs;
mod utils;

use main_options::trailers::{
    get_my_trailer_id, get_slave_trailers_id, get_trailer_def_id, get_trailer_def_index,
    get_trailer_index, set_any_slave_trailers_weight, set_cargo_mass_trailer,
    set_chassis_and_body_mass_def_trailers, set_remove_trailer_restricted_areas,
};
use main_options::trucks::{
    get_truck_id, get_truck_vehicle_index, set_any_trucks_wear, set_truck_fuel, set_truck_wear,
};
use serde_json::json;
use structs::vec_save_games::VecSaveGames;
use utils::file_edit::{get_list_save_count, get_list_save_game, read_file_text, save_file};

const RESPONSE_FALSE: &str = r#"{"res": false}"#;
const RESPONSE_TRUE: &str = r#"{"res": true}"#;

#[tauri::command]
async fn set_cargo_mass_trailers_and_slave(cargo_mass: &str, dir_save: &str) -> Result<String, ()> {
    // 100 ms
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let (trailer_id, index): (String, usize) = match get_my_trailer_id(&file) {
        Some((trailer_id, index)) => (trailer_id, index),
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let trailer_index: usize = match get_trailer_index(&file, trailer_id, index) {
        Some(trailer_index) => trailer_index,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let cargo_mass_save: Vec<String> =
        match set_cargo_mass_trailer(&file, trailer_index, cargo_mass) {
            Some(cargo_mass_save) => cargo_mass_save,
            None => return Ok(RESPONSE_FALSE.to_string()),
        };

    let (slave_trailer_id, index_slave): (String, usize) =
        match get_slave_trailers_id(&file, trailer_index) {
            Some((slave_trailer_id, index)) => (slave_trailer_id, index),
            None => {
                save_file(dir_save.to_string(), cargo_mass_save).await;
                return Ok(RESPONSE_TRUE.to_string());
            }
        };

    let cargo_mass_save_slave: Vec<String> = set_any_slave_trailers_weight(
        &cargo_mass_save,
        slave_trailer_id,
        index_slave,
        cargo_mass.to_string(),
    );

    save_file(dir_save.to_string(), cargo_mass_save_slave).await;
    return Ok(RESPONSE_TRUE.to_string());
}

#[tauri::command]
async fn set_unlock_current_trailers(dir_save: &str) -> Result<String, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let (trailer_id, current_index): (String, usize) = match get_my_trailer_id(&file) {
        Some((trailer_id, current_index)) => (trailer_id, current_index),
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let trailer_index: usize = match get_trailer_index(&file, trailer_id, current_index) {
        Some(trailer_index) => trailer_index,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let trailer_def_id: String = match get_trailer_def_id(&file, trailer_index) {
        Some(trailer_def_id) => trailer_def_id,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let trailer_def_index: usize = match get_trailer_def_index(&file, trailer_def_id) {
        Some(trailer_def_index) => trailer_def_index,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let trailer_unlocked: Vec<String> =
        match set_remove_trailer_restricted_areas(&file, trailer_def_index) {
            Some(trailer_unlocked) => trailer_unlocked,
            None => return Ok(RESPONSE_FALSE.to_string()),
        };

    save_file(dir_save.to_string(), trailer_unlocked).await;
    return Ok(RESPONSE_TRUE.to_string());
}

#[tauri::command]
async fn set_cargo_mass_def_trailers(
    dir_save: &str,
    body_mass: &str,
    chassis_mass: &str,
) -> Result<String, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let (trailer_id, current_index): (String, usize) = match get_my_trailer_id(&file) {
        Some((trailer_id, current_index)) => (trailer_id, current_index),
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let trailer_index: usize = match get_trailer_index(&file, trailer_id, current_index) {
        Some(trailer_index) => trailer_index,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let trailer_def_id: String = match get_trailer_def_id(&file, trailer_index) {
        Some(trailer_def_id) => trailer_def_id,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let trailer_def_index: usize = match get_trailer_def_index(&file, trailer_def_id) {
        Some(trailer_def_index) => trailer_def_index,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let chassis_and_body_mass = match set_chassis_and_body_mass_def_trailers(
        &file,
        trailer_def_index,
        body_mass,
        chassis_mass,
    ) {
        Some(chassis_mass_and_body_mass) => chassis_mass_and_body_mass,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    save_file(dir_save.to_string(), chassis_and_body_mass).await;
    return Ok(RESPONSE_TRUE.to_string());
}

#[tauri::command]
async fn get_save_game_name(dir_save: &str) -> Result<String, ()> {
    let mut save_games_name: Vec<VecSaveGames> =
        match get_list_save_game(dir_save.to_string()).await {
            Some(save_games_name) => save_games_name,
            None => return Ok(RESPONSE_FALSE.to_string()),
        };

    save_games_name.reverse();
    let response = json!({
        "res": true,
        "saves": save_games_name,
    });

    return Ok(response.to_string());
}

#[tauri::command]
async fn get_save_game_count(dir_save: &str) -> Result<String, ()> {
    let save_games: usize = get_list_save_count(dir_save.to_string()).await;

    let response: String = json!({
        "res": true,
        "saves": save_games,
    })
    .to_string();

    return Ok(response);
}

#[tauri::command]
async fn repait_truck(dir_save: &str, wear: &str) -> Result<String, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let (truck_id, index): (String, usize) = match get_truck_id(&file) {
        Some((truck_id, index)) => (truck_id, index),
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let truck_index: usize = match get_truck_vehicle_index(&file, truck_id, index) {
        Some(truck_index) => truck_index,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let truck_wear: Vec<String> = match set_truck_wear(&file, wear, truck_index) {
        Some(truck_wear) => truck_wear,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    save_file(dir_save.to_string(), truck_wear).await;
    return Ok(RESPONSE_TRUE.to_string());
}

#[tauri::command]
async fn repait_all_trucks(dir_save: &str, wear: &str) -> Result<String, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let trucks_wear: Vec<String> = match set_any_trucks_wear(&file, wear) {
        Some(trucks_wear) => trucks_wear,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    save_file(dir_save.to_string(), trucks_wear).await;
    Ok(RESPONSE_TRUE.to_string())
}

#[tauri::command]
async fn fill_fuel_truck(dir_save: &str, fuel: &str) -> Result<String, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let (truck_id, index): (String, usize) = match get_truck_id(&file) {
        Some((truck_id, index)) => (truck_id, index),
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let truck_index: usize = match get_truck_vehicle_index(&file, truck_id, index) {
        Some(truck_index) => truck_index,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let truck_fuel: Vec<String> = match set_truck_fuel(&file, fuel, truck_index) {
        Some(truck_fuel) => truck_fuel,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    save_file(dir_save.to_string(), truck_fuel).await;
    return Ok(RESPONSE_TRUE.to_string());
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            set_cargo_mass_trailers_and_slave,
            set_unlock_current_trailers,
            set_cargo_mass_def_trailers,
            get_save_game_name,
            get_save_game_count,
            repait_truck,
            repait_all_trucks,
            fill_fuel_truck
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
