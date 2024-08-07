// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod main_options;
mod structs;
mod utils;

use hex::encode_upper;
use main_options::profiles::{
    copy_profile_configs, set_any_status_garage, set_bank_money, set_dealerships_discovered_status,
    set_experience, set_experience_skills, set_profile_name, set_visited_cities,
};
use main_options::trailers::{
    get_my_trailer_id, get_slave_trailers_id, get_trailer_def_id, get_trailer_def_index,
    get_trailer_index, set_any_slave_trailers_weight, set_cargo_mass_trailer,
    set_chassis_and_body_mass_def_trailers, set_remove_trailer_restricted_areas,
    set_trailer_license_plate,
};
use main_options::truck_engines::{
    SCANIA_R_2009_ENGINES, SCANIA_R_ENGINES, SCANIA_STREAMLINE_ENGINES, SCANIA_S_ENGINES, VOLVO_FK,
    VOLVO_FK_CLASSIC,
};
use main_options::truck_transmissions::{
    SCANIA_R_2009_TRANSMISSION, SCANIA_R_TRANSMISSION, SCANIA_STREAMLINE_TRANSMISSION,
    SCANIA_S_TRANSMISSION, VOLVO_FH_CLASSIC_TRANSMISSION, VOLVO_FH_TRANSMISSION,
};
use main_options::trucks::{
    get_truck_id, get_truck_vehicle_index, set_any_trucks_fuel, set_any_trucks_wear,
    set_infinite_fuel_truck, set_truck_engine, set_truck_fuel, set_truck_license_plate,
    set_truck_transmissions, set_truck_wear,
};
use serde_json::json;
use std::path::Path;
use structs::experience_skills::ExperienceSkills;
use structs::vec_save_games::VecSaveGames;
use utils::compress_folder::compress_folder_files;
use utils::decrypt_saves::decrypt_file_to_save;
use utils::file_edit::{
    copy_folder, get_list_save_count, get_list_save_game, get_list_save_game_dirs,
    get_rgb_hex_to_game_format, read_file_text, save_file,
};

const RESPONSE_FALSE: &str = r#"{"res": false}"#;
const RESPONSE_TRUE: &str = r#"{"res": true}"#;
const IGNORED_FOLDERS: [&str; 1] = ["album"];

#[tauri::command]
async fn decrypt_to_save(dir_save: &str) -> Result<String, ()> {
    let result: bool = decrypt_file_to_save(dir_save).await;

    if result {
        return Ok(RESPONSE_TRUE.to_string());
    }

    return Ok(RESPONSE_FALSE.to_string());
}

#[tauri::command]
async fn set_cargo_mass_trailers_and_slave(cargo_mass: &str, dir_save: &str) -> Result<String, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let (trailer_id, index): (String, usize) = match get_my_trailer_id(&file) {
        Some((trailer_id, index)) => (trailer_id, index),
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let trailer_index: usize = match get_trailer_index(&file, &trailer_id, &index) {
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

    let trailer_index: usize = match get_trailer_index(&file, &trailer_id, &current_index) {
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

    let trailer_index: usize = match get_trailer_index(&file, &trailer_id, &current_index) {
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
async fn get_save_game_name(dir_save: &str, ignore_auto_saves: bool) -> Result<String, ()> {
    let mut save_games_name: Vec<VecSaveGames> =
        match get_list_save_game(dir_save.to_string(), ignore_auto_saves).await {
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
async fn get_save_game_count(dir_save: &str, ignore_auto_saves: bool) -> Result<String, ()> {
    let save_games: usize = get_list_save_count(dir_save.to_string(), ignore_auto_saves).await;

    let response: String = json!({
        "res": true,
        "saves": save_games,
    })
    .to_string();

    return Ok(response);
}

#[tauri::command]
async fn get_list_engines() -> Result<String, ()> {
    let response: String = json!({
        "res": true,
        "engines": {
            "scania": {
                "scania_r": SCANIA_R_ENGINES,
                "scania_s": SCANIA_S_ENGINES,
                "scania_r_2009": SCANIA_R_2009_ENGINES,
                "scania_streamline": SCANIA_STREAMLINE_ENGINES,
            },
            "volvo": {
                "volvo_fh_classic": VOLVO_FK_CLASSIC,
                "volvo_fh": VOLVO_FK,
            }
        },
    })
    .to_string();

    return Ok(response);
}

#[tauri::command]
async fn get_list_transmissions() -> Result<String, ()> {
    let response: String = json!({
        "res": true,
        "transmissions": {
            "scania": {
                "scania_r": SCANIA_R_TRANSMISSION,
                "scania_s": SCANIA_S_TRANSMISSION,
                "scania_r_2009": SCANIA_R_2009_TRANSMISSION,
                "scania_streamline": SCANIA_STREAMLINE_TRANSMISSION,
            },
            "volvo": {
                "volvo_fh_classic": VOLVO_FH_CLASSIC_TRANSMISSION,
                "volvo_fh": VOLVO_FH_TRANSMISSION,
            }
        },
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

    let truck_find = match get_truck_id(&file) {
        Some(truck_find) => truck_find,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let truck_index: usize = match get_truck_vehicle_index(&file, truck_find.id, truck_find.index) {
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

    let truck_find = match get_truck_id(&file) {
        Some(truck_find) => truck_find,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let truck_index: usize = match get_truck_vehicle_index(&file, truck_find.id, truck_find.index) {
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

#[tauri::command]
async fn fill_any_trucks_fuel(dir_save: &str, fuel: &str) -> Result<String, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let trucks_fuel: Vec<String> = match set_any_trucks_fuel(&file, fuel) {
        Some(trucks_fuel) => trucks_fuel,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    save_file(dir_save.to_string(), trucks_fuel).await;
    return Ok(RESPONSE_TRUE.to_string());
}

#[tauri::command]
async fn set_infinite_fuel(dir_save: &str) -> Result<String, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let truck_find = match get_truck_id(&file) {
        Some(truck_find) => truck_find,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let truck_index: usize = match get_truck_vehicle_index(&file, truck_find.id, truck_find.index) {
        Some(truck_index) => truck_index,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let truck_fuel: Vec<String> = match set_infinite_fuel_truck(&file, truck_index) {
        Some(truck_fuel) => truck_fuel,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    save_file(dir_save.to_string(), truck_fuel).await;
    return Ok(RESPONSE_TRUE.to_string());
}

#[tauri::command]
async fn set_license_plate_trailer(
    dir_save: &str,
    license_plate: &str,
    bg_plate_color: &str,
    text_plate_color: &str,
) -> Result<String, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let bg_plate_color_game: String = get_rgb_hex_to_game_format(bg_plate_color);
    let text_plate_color_game: String = get_rgb_hex_to_game_format(text_plate_color);

    let trailer_plate: Vec<String> = match set_trailer_license_plate(
        &file,
        license_plate,
        &bg_plate_color_game,
        &text_plate_color_game,
    ) {
        Some(trailer_plate) => trailer_plate,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    save_file(dir_save.to_string(), trailer_plate).await;
    return Ok(RESPONSE_TRUE.to_string());
}

#[tauri::command]
async fn set_license_plate_truck(
    dir_save: &str,
    license_plate: &str,
    bg_plate_color: &str,
    text_plate_color: &str,
) -> Result<String, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let bg_plate_color_game: String = get_rgb_hex_to_game_format(bg_plate_color);
    let text_plate_color_game: String = get_rgb_hex_to_game_format(text_plate_color);

    let truck_find = match get_truck_id(&file) {
        Some(truck_find) => truck_find,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let truck_index: usize = match get_truck_vehicle_index(&file, truck_find.id, truck_find.index) {
        Some(truck_index) => truck_index,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let truck_plate: Vec<String> = match set_truck_license_plate(
        &file,
        truck_index,
        &bg_plate_color_game,
        &text_plate_color_game,
        license_plate,
    ) {
        Some(truck_plate) => truck_plate,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    save_file(dir_save.to_string(), truck_plate).await;
    return Ok(RESPONSE_TRUE.to_string());
}

#[tauri::command]
async fn set_truck_engine_def(dir_save: &str, engine_code: &str) -> Result<String, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let truck_find = match get_truck_id(&file) {
        Some(truck_find) => truck_find,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let truck_index: usize = match get_truck_vehicle_index(&file, truck_find.id, truck_find.index) {
        Some(truck_index) => truck_index,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let truck_engine: Vec<String> = match set_truck_engine(&file, truck_index, engine_code) {
        Some(truck_engine) => truck_engine,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    save_file(dir_save.to_string(), truck_engine).await;
    return Ok(RESPONSE_TRUE.to_string());
}

#[tauri::command]
async fn set_truck_transmissions_def(
    dir_save: &str,
    transmissions_code: &str,
) -> Result<String, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let truck_find = match get_truck_id(&file) {
        Some(truck_find) => truck_find,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let truck_index: usize = match get_truck_vehicle_index(&file, truck_find.id, truck_find.index) {
        Some(truck_index) => truck_index,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let truck_transmissions: Vec<String> =
        match set_truck_transmissions(&file, truck_index, transmissions_code) {
            Some(truck_engine) => truck_engine,
            None => return Ok(RESPONSE_FALSE.to_string()),
        };

    save_file(dir_save.to_string(), truck_transmissions).await;
    return Ok(RESPONSE_TRUE.to_string());
}

#[tauri::command]
async fn get_list_dir_profile(dir_profile: &str) -> Result<String, ()> {
    let dirs = match get_list_save_game_dirs(dir_profile.to_string()).await {
        Some(dirs) => dirs,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let response: String = json!({
        "res": true,
        "dirs": dirs,
    })
    .to_string();

    return Ok(response);
}

#[tauri::command]
async fn set_profile_money(dir_save: &str, money: &str) -> Result<String, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let bank_money: Vec<String> = match set_bank_money(&file, money) {
        Some(bank_money) => bank_money,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    save_file(dir_save.to_string(), bank_money).await;

    Ok(RESPONSE_TRUE.to_string())
}

#[tauri::command]
async fn set_profile_experience(dir_save: &str, experience: &str) -> Result<String, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let profile_experience: Vec<String> = match set_experience(&file, experience) {
        Some(profile_experience) => profile_experience,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    save_file(dir_save.to_string(), profile_experience).await;

    Ok(RESPONSE_TRUE.to_string())
}

#[tauri::command]
async fn set_any_garage_status(dir_save: &str, status: &str) -> Result<String, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let garage_status: Vec<String> = match set_any_status_garage(&file, status) {
        Some(garage_status) => garage_status,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    save_file(dir_save.to_string(), garage_status).await;

    return Ok(RESPONSE_TRUE.to_string());
}

#[tauri::command]
async fn set_cities_visited(dir_save: &str, cities_visited: bool) -> Result<String, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let visited_cities: Vec<String> = match set_visited_cities(&file, cities_visited) {
        Some(visited_cities) => visited_cities,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    save_file(dir_save.to_string(), visited_cities).await;

    return Ok(RESPONSE_TRUE.to_string());
}

#[tauri::command]
async fn set_dealerships_discovered(dir_save: &str, discovered: bool) -> Result<String, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let discovered_dealerships: Vec<String> =
        match set_dealerships_discovered_status(&file, discovered) {
            Some(discovered_dealerships) => discovered_dealerships,
            None => return Ok(RESPONSE_FALSE.to_string()),
        };

    save_file(dir_save.to_string(), discovered_dealerships).await;

    return Ok(RESPONSE_TRUE.to_string());
}

#[tauri::command]
async fn set_profile_experience_skills(
    dir_save: &str,
    adr_bin: &str,
    long_dist: &str,
    heavy: &str,
    fragile: &str,
    urgent: &str,
    mechanical: &str,
) -> Result<String, ()> {
    if adr_bin.chars().count() != 6 {
        return Ok(RESPONSE_FALSE.to_string());
    }

    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let experience_skills: ExperienceSkills = ExperienceSkills {
        adr_number: adr_bin.to_string(),
        long_dist: long_dist.to_string(),
        heavy: heavy.to_string(),
        fragile: fragile.to_string(),
        urgent: urgent.to_string(),
        mechanical: mechanical.to_string(),
    };

    let experience_skills: Vec<String> = match set_experience_skills(&file, experience_skills) {
        Some(experience_skills) => experience_skills,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    save_file(dir_save.to_string(), experience_skills).await;

    return Ok(RESPONSE_TRUE.to_string());
}

#[tauri::command]
async fn backup_profile(dir_profile: &str, dest_dir_zip: &str) -> Result<String, ()> {
    let result: bool = compress_folder_files(
        Path::new(dir_profile),
        Path::new(dest_dir_zip),
        IGNORED_FOLDERS.to_vec(),
    )
    .await;

    if result {
        return Ok(RESPONSE_TRUE.to_string());
    }

    return Ok(RESPONSE_FALSE.to_string());
}

#[tauri::command]
async fn copy_profile(dir_profile: &str, new_profile_name: &str) -> Result<String, ()> {
    if new_profile_name.chars().count() == 0 || new_profile_name.chars().count() > 20 {
        return Ok(RESPONSE_FALSE.to_string());
    }

    let profile_name_hex: String = encode_upper(new_profile_name);
    let dir_profile_path = Path::new(dir_profile);
    let dest_dir_path = dir_profile_path.join("..").join(profile_name_hex);

    if dest_dir_path.exists() {
        return Ok(RESPONSE_FALSE.to_string());
    }

    let result: bool = copy_folder(
        dir_profile_path,
        dest_dir_path.as_path(),
        IGNORED_FOLDERS.to_vec(),
    )
    .await;

    if !result {
        return Ok(RESPONSE_FALSE.to_string());
    }

    let dest_dir_path_str: &str = match dest_dir_path.to_str() {
        Some(dest_dir_path_str) => dest_dir_path_str,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    let file: Vec<String> =
        match read_file_text(&format!("{}/profile.sii", dest_dir_path_str)).await {
            Some(file) => file,
            None => return Ok(RESPONSE_FALSE.to_string()),
        };

    let profile_name: Vec<String> = match set_profile_name(&file, new_profile_name) {
        Some(profile_name) => profile_name,
        None => return Ok(RESPONSE_FALSE.to_string()),
    };

    save_file(format!("{}/profile.sii", dest_dir_path_str), profile_name).await;

    return Ok(RESPONSE_TRUE.to_string());
}

#[tauri::command]
async fn copy_controls_config(dir_profile: &str, dest_dir_profile: &str) -> Result<String, ()> {
    let dir_profile_path = Path::new(dir_profile);
    let dest_dir_profile_path = Path::new(dest_dir_profile);

    let result: bool = copy_profile_configs(&dir_profile_path, &dest_dir_profile_path).await;

    if !result {
        return Ok(RESPONSE_FALSE.to_string());
    }

    return Ok(RESPONSE_TRUE.to_string());
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            decrypt_to_save,
            set_cargo_mass_trailers_and_slave,
            set_unlock_current_trailers,
            set_cargo_mass_def_trailers,
            get_save_game_name,
            get_save_game_count,
            get_list_engines,
            get_list_transmissions,
            get_list_dir_profile,
            repait_truck,
            repait_all_trucks,
            fill_fuel_truck,
            fill_any_trucks_fuel,
            set_infinite_fuel,
            set_license_plate_trailer,
            set_license_plate_truck,
            set_truck_engine_def,
            set_truck_transmissions_def,
            set_profile_money,
            set_profile_experience,
            set_any_garage_status,
            set_cities_visited,
            set_dealerships_discovered,
            set_profile_experience_skills,
            backup_profile,
            copy_profile,
            copy_controls_config,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
