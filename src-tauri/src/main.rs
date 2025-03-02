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
    get_my_trailer_id, get_trailer_def_id, get_trailer_def_index, get_trailer_index,
    set_any_slave_trailers_weight, set_any_trailers_wear, set_chassis_and_body_mass_def_trailers,
    set_remove_trailer_restricted_areas, set_trailer_license_plate, set_trailer_wear,
};
use main_options::trucks::{
    get_list_trucks_info, get_truck_brand_models_ets2, get_truck_brands_models_ats, get_truck_id,
    get_truck_number, get_truck_profit_log_id, get_truck_vehicle_index, remove_truck_badge,
    set_any_trucks_fuel, set_any_trucks_wear, set_infinite_fuel_truck, set_player_driver_truck,
    set_player_truck_file, set_truck_engine, set_truck_fuel, set_truck_km_edit,
    set_truck_license_plate, set_truck_transmissions, set_truck_wear,
};

use std::path::Path;

use structs::experience_skills::ExperienceSkills;
use structs::responses::{
    DefaultResponse, DeveloperValues, ListProfilesResponse, ListTrucksResponse,
    SaveGameCountResponse, SaveGameResponse, SystemThemeResponse, TruckBrandModelsResponse,
};
use structs::vec_save_games::VecSaveGames;

use tauri::{Theme, Window};

use utils::compress_folder::compress_folder_files;
use utils::decrypt_saves::decrypt_file_to_save;
use utils::file_edit::{
    copy_folder, get_developer_value, get_list_save_count, get_list_save_game,
    get_list_save_game_dirs, get_rgb_hex_to_game_format, read_file_text, rename_folder, save_file,
    set_convoy_mode_status, set_developer_value,
};

const IGNORED_FOLDERS: [&str; 1] = ["album"];

#[tauri::command]
async fn decrypt_to_save(dir_save: &str) -> Result<DefaultResponse, ()> {
    let result: bool = decrypt_file_to_save(dir_save).await;

    if result {
        return Ok(DefaultResponse { res: true });
    }

    return Ok(DefaultResponse { res: false });
}

#[tauri::command]
async fn set_cargo_mass_trailers_and_slave(
    cargo_mass: &str,
    dir_save: &str,
) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let cargo_mass_save_slave: Vec<String> = match set_any_slave_trailers_weight(&file, cargo_mass)
    {
        Some(cargo_mass_save_slave) => cargo_mass_save_slave,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(dir_save.to_string(), cargo_mass_save_slave).await;
    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn set_unlock_current_trailers(dir_save: &str) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let (trailer_id, current_index): (String, usize) = match get_my_trailer_id(&file) {
        Some((trailer_id, current_index)) => (trailer_id, current_index),
        None => return Ok(DefaultResponse { res: false }),
    };

    let trailer_index: usize = match get_trailer_index(&file, &trailer_id, &current_index) {
        Some(trailer_index) => trailer_index,
        None => return Ok(DefaultResponse { res: false }),
    };

    let trailer_def_id: String = match get_trailer_def_id(&file, trailer_index) {
        Some(trailer_def_id) => trailer_def_id,
        None => return Ok(DefaultResponse { res: false }),
    };

    let trailer_def_index: usize = match get_trailer_def_index(&file, trailer_def_id) {
        Some(trailer_def_index) => trailer_def_index,
        None => return Ok(DefaultResponse { res: false }),
    };

    let trailer_unlocked: Vec<String> =
        match set_remove_trailer_restricted_areas(&file, trailer_def_index) {
            Some(trailer_unlocked) => trailer_unlocked,
            None => return Ok(DefaultResponse { res: false }),
        };

    save_file(dir_save.to_string(), trailer_unlocked).await;
    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn set_cargo_mass_def_trailers(
    dir_save: &str,
    body_mass: &str,
    chassis_mass: &str,
) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let (trailer_id, current_index): (String, usize) = match get_my_trailer_id(&file) {
        Some((trailer_id, current_index)) => (trailer_id, current_index),
        None => return Ok(DefaultResponse { res: false }),
    };

    let trailer_index: usize = match get_trailer_index(&file, &trailer_id, &current_index) {
        Some(trailer_index) => trailer_index,
        None => return Ok(DefaultResponse { res: false }),
    };

    let trailer_def_id: String = match get_trailer_def_id(&file, trailer_index) {
        Some(trailer_def_id) => trailer_def_id,
        None => return Ok(DefaultResponse { res: false }),
    };

    let trailer_def_index: usize = match get_trailer_def_index(&file, trailer_def_id) {
        Some(trailer_def_index) => trailer_def_index,
        None => return Ok(DefaultResponse { res: false }),
    };

    let chassis_and_body_mass = match set_chassis_and_body_mass_def_trailers(
        &file,
        trailer_def_index,
        body_mass,
        chassis_mass,
    ) {
        Some(chassis_mass_and_body_mass) => chassis_mass_and_body_mass,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(dir_save.to_string(), chassis_and_body_mass).await;
    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn get_save_game_name(
    dir_save: &str,
    ignore_auto_saves: bool,
) -> Result<SaveGameResponse, ()> {
    let mut save_games_name: Vec<VecSaveGames> =
        match get_list_save_game(dir_save.to_string(), ignore_auto_saves).await {
            Some(save_games_name) => save_games_name,
            None => {
                return Ok(SaveGameResponse {
                    res: false,
                    save_games: vec![],
                });
            }
        };

    save_games_name.reverse();

    return Ok(SaveGameResponse {
        res: true,
        save_games: save_games_name,
    });
}

#[tauri::command]
async fn get_save_game_count(
    dir_save: &str,
    ignore_auto_saves: bool,
) -> Result<SaveGameCountResponse, ()> {
    let save_games: usize = get_list_save_count(dir_save.to_string(), ignore_auto_saves).await;

    return Ok(SaveGameCountResponse {
        res: true,
        saves: save_games,
    });
}

#[tauri::command]
async fn get_brand_models_ets2(brand: &str) -> Result<TruckBrandModelsResponse, ()> {
    match get_truck_brand_models_ets2(brand) {
        Some(models) => return Ok(TruckBrandModelsResponse { res: true, models }),
        None => {
            return Ok(TruckBrandModelsResponse {
                res: false,
                models: vec![],
            });
        }
    };
}

#[tauri::command]
async fn get_brand_models_ats(brand: &str) -> Result<TruckBrandModelsResponse, ()> {
    match get_truck_brands_models_ats(brand) {
        Some(models) => return Ok(TruckBrandModelsResponse { res: true, models }),
        None => {
            return Ok(TruckBrandModelsResponse {
                res: false,
                models: vec![],
            });
        }
    };
}

#[tauri::command]
async fn repait_truck(dir_save: &str, wear: &str) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_find = match get_truck_id(&file) {
        Some(truck_find) => truck_find,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_index: usize = match get_truck_vehicle_index(&file, &truck_find.id, truck_find.index)
    {
        Some(truck_index) => truck_index,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_wear: Vec<String> = match set_truck_wear(&file, wear, truck_index) {
        Some(truck_wear) => truck_wear,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(dir_save.to_string(), truck_wear).await;
    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn repait_all_trucks(dir_save: &str, wear: &str) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let trucks_wear: Vec<String> = match set_any_trucks_wear(&file, wear) {
        Some(trucks_wear) => trucks_wear,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(dir_save.to_string(), trucks_wear).await;
    Ok(DefaultResponse { res: true })
}

#[tauri::command]
async fn fill_fuel_truck(dir_save: &str, fuel: &str) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_find = match get_truck_id(&file) {
        Some(truck_find) => truck_find,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_index: usize = match get_truck_vehicle_index(&file, &truck_find.id, truck_find.index)
    {
        Some(truck_index) => truck_index,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_fuel: Vec<String> = match set_truck_fuel(&file, fuel, truck_index) {
        Some(truck_fuel) => truck_fuel,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(dir_save.to_string(), truck_fuel).await;
    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn fill_any_trucks_fuel(dir_save: &str, fuel: &str) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let trucks_fuel: Vec<String> = match set_any_trucks_fuel(&file, fuel) {
        Some(trucks_fuel) => trucks_fuel,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(dir_save.to_string(), trucks_fuel).await;
    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn set_infinite_fuel(dir_save: &str) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_find = match get_truck_id(&file) {
        Some(truck_find) => truck_find,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_index: usize = match get_truck_vehicle_index(&file, &truck_find.id, truck_find.index)
    {
        Some(truck_index) => truck_index,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_fuel: Vec<String> = match set_infinite_fuel_truck(&file, truck_index) {
        Some(truck_fuel) => truck_fuel,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(dir_save.to_string(), truck_fuel).await;
    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn set_license_plate_trailer(
    dir_save: &str,
    license_plate: &str,
    bg_plate_color: &str,
    text_plate_color: &str,
    color_margin: bool,
) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let bg_plate_color_game: String = get_rgb_hex_to_game_format(bg_plate_color);
    let text_plate_color_game: String = get_rgb_hex_to_game_format(text_plate_color);

    let trailer_plate: Vec<String> = match set_trailer_license_plate(
        &file,
        license_plate,
        &bg_plate_color_game,
        &text_plate_color_game,
        color_margin,
    ) {
        Some(trailer_plate) => trailer_plate,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(dir_save.to_string(), trailer_plate).await;
    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn set_license_plate_truck(
    dir_save: &str,
    license_plate: &str,
    bg_plate_color: &str,
    text_plate_color: &str,
    color_margin: bool,
) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let bg_plate_color_game: String = get_rgb_hex_to_game_format(bg_plate_color);
    let text_plate_color_game: String = get_rgb_hex_to_game_format(text_plate_color);

    let truck_find = match get_truck_id(&file) {
        Some(truck_find) => truck_find,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_index: usize = match get_truck_vehicle_index(&file, &truck_find.id, truck_find.index)
    {
        Some(truck_index) => truck_index,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_plate: Vec<String> = match set_truck_license_plate(
        &file,
        truck_index,
        &bg_plate_color_game,
        &text_plate_color_game,
        license_plate,
        color_margin,
    ) {
        Some(truck_plate) => truck_plate,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(dir_save.to_string(), truck_plate).await;
    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn set_truck_engine_def(dir_save: &str, engine_code: &str) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_find = match get_truck_id(&file) {
        Some(truck_find) => truck_find,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_index: usize = match get_truck_vehicle_index(&file, &truck_find.id, truck_find.index)
    {
        Some(truck_index) => truck_index,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_engine: Vec<String> = match set_truck_engine(&file, truck_index, engine_code) {
        Some(truck_engine) => truck_engine,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(dir_save.to_string(), truck_engine).await;
    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn set_truck_transmissions_def(
    dir_save: &str,
    transmissions_code: &str,
) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_find = match get_truck_id(&file) {
        Some(truck_find) => truck_find,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_index: usize = match get_truck_vehicle_index(&file, &truck_find.id, truck_find.index)
    {
        Some(truck_index) => truck_index,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_transmissions: Vec<String> =
        match set_truck_transmissions(&file, truck_index, transmissions_code) {
            Some(truck_engine) => truck_engine,
            None => return Ok(DefaultResponse { res: false }),
        };

    save_file(dir_save.to_string(), truck_transmissions).await;
    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn get_list_dir_profile(dir_profile: &str) -> Result<ListProfilesResponse, ()> {
    let dirs = match get_list_save_game_dirs(dir_profile.to_string()).await {
        Some(dirs) => dirs,
        None => {
            return Ok(ListProfilesResponse {
                res: false,
                profiles: vec![],
            });
        }
    };

    return Ok(ListProfilesResponse {
        res: true,
        profiles: dirs,
    });
}

#[tauri::command]
async fn set_profile_money(dir_save: &str, money: &str) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let bank_money: Vec<String> = match set_bank_money(&file, money) {
        Some(bank_money) => bank_money,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(dir_save.to_string(), bank_money).await;

    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn set_profile_experience(dir_save: &str, experience: &str) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let profile_experience: Vec<String> = match set_experience(&file, experience) {
        Some(profile_experience) => profile_experience,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(dir_save.to_string(), profile_experience).await;

    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn set_any_garage_status(dir_save: &str, status: &str) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let garage_status: Vec<String> = match set_any_status_garage(&file, status) {
        Some(garage_status) => garage_status,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(dir_save.to_string(), garage_status).await;

    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn set_cities_visited(dir_save: &str, cities_visited: bool) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let visited_cities: Vec<String> = match set_visited_cities(&file, cities_visited) {
        Some(visited_cities) => visited_cities,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(dir_save.to_string(), visited_cities).await;

    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn set_dealerships_discovered(
    dir_save: &str,
    discovered: bool,
) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let discovered_dealerships: Vec<String> =
        match set_dealerships_discovered_status(&file, discovered) {
            Some(discovered_dealerships) => discovered_dealerships,
            None => return Ok(DefaultResponse { res: false }),
        };

    save_file(dir_save.to_string(), discovered_dealerships).await;

    return Ok(DefaultResponse { res: true });
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
) -> Result<DefaultResponse, ()> {
    if adr_bin.chars().count() != 6 {
        return Ok(DefaultResponse { res: false });
    }

    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
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
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(dir_save.to_string(), experience_skills).await;

    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn backup_profile(dir_profile: &str, dest_dir_zip: &str) -> Result<DefaultResponse, ()> {
    let result: bool = compress_folder_files(
        Path::new(dir_profile),
        Path::new(dest_dir_zip),
        IGNORED_FOLDERS.to_vec(),
    )
    .await;

    return Ok(DefaultResponse { res: result });
}

#[tauri::command]
async fn copy_profile(dir_profile: &str, new_profile_name: &str) -> Result<DefaultResponse, ()> {
    if new_profile_name.chars().count() == 0 || new_profile_name.chars().count() > 20 {
        return Ok(DefaultResponse { res: false });
    }

    let profile_name_hex: String = encode_upper(new_profile_name);
    let dir_profile_path = Path::new(dir_profile);
    let dest_dir_path = dir_profile_path.join("..").join(profile_name_hex);

    if dest_dir_path.exists() {
        return Ok(DefaultResponse { res: false });
    }

    let result: bool = copy_folder(
        dir_profile_path,
        dest_dir_path.as_path(),
        IGNORED_FOLDERS.to_vec(),
    )
    .await;

    if !result {
        return Ok(DefaultResponse { res: false });
    }

    let dest_dir_path_str: &str = match dest_dir_path.to_str() {
        Some(dest_dir_path_str) => dest_dir_path_str,
        None => return Ok(DefaultResponse { res: false }),
    };

    let file: Vec<String> =
        match read_file_text(&format!("{}/profile.sii", dest_dir_path_str)).await {
            Some(file) => file,
            None => return Ok(DefaultResponse { res: false }),
        };

    let profile_name: Vec<String> = match set_profile_name(&file, new_profile_name) {
        Some(profile_name) => profile_name,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(format!("{}/profile.sii", dest_dir_path_str), profile_name).await;

    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn copy_controls_config(
    dir_profile: &str,
    dest_dir_profile: &str,
) -> Result<DefaultResponse, ()> {
    let dir_profile_path = Path::new(dir_profile);
    let dest_dir_profile_path = Path::new(dest_dir_profile);

    let result: bool = copy_profile_configs(&dir_profile_path, &dest_dir_profile_path).await;

    if !result {
        return Ok(DefaultResponse { res: false });
    }

    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
fn get_os_theme(window: Window) -> SystemThemeResponse {
    match window.theme() {
        Ok(Theme::Dark) => {
            return SystemThemeResponse {
                res: true,
                theme: "dark",
            };
        }
        Ok(Theme::Light) => {
            return SystemThemeResponse {
                res: true,
                theme: "light",
            };
        }
        _ => {
            return SystemThemeResponse {
                res: true,
                theme: "dark",
            };
        }
    }
}

#[tauri::command]
async fn get_developer_game_status(dir_docs_game_folder: &str) -> Result<DeveloperValues, ()> {
    let (developer_status, console_status, active_max_convoy_mode) =
        match get_developer_value(dir_docs_game_folder).await {
            Some(res) => res,
            None => {
                return Ok(DeveloperValues {
                    res: false,
                    developer: false,
                    console: false,
                    active_max_convoy_mode: false,
                });
            }
        };

    return Ok(DeveloperValues {
        res: true,
        developer: developer_status,
        console: console_status,
        active_max_convoy_mode,
    });
}

#[tauri::command]
async fn set_developer_game_status(
    dir_docs_game_folder: &str,
    status_developer: bool,
) -> Result<DefaultResponse, ()> {
    let file = match set_developer_value(dir_docs_game_folder, status_developer).await {
        Some(res) => res,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(format!("{}/config.cfg", dir_docs_game_folder), file).await;

    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn set_convoy_size(
    dir_docs_game_folder: &str,
    convoy_status: bool,
) -> Result<DefaultResponse, ()> {
    let file = match set_convoy_mode_status(dir_docs_game_folder, convoy_status).await {
        Some(res) => res,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(format!("{}/config.cfg", dir_docs_game_folder), file).await;

    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn set_new_profile_name(
    dir_profile: &str,
    new_profile_name: &str,
) -> Result<DefaultResponse, ()> {
    if new_profile_name.chars().count() == 0 || new_profile_name.chars().count() > 20 {
        return Ok(DefaultResponse { res: false });
    }

    let file: Vec<String> = match read_file_text(&format!("{}/profile.sii", &dir_profile)).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let profile_name: Vec<String> = match set_profile_name(&file, new_profile_name) {
        Some(profile_name) => profile_name,
        None => return Ok(DefaultResponse { res: false }),
    };

    let res_file = save_file(format!("{}/profile.sii", &dir_profile), profile_name).await;

    if !res_file {
        return Ok(DefaultResponse { res: false });
    }

    let dir_profile_path = Path::new(&dir_profile);
    let profile_name_hex: String = encode_upper(new_profile_name);

    let res_rename_folder = rename_folder(dir_profile_path, profile_name_hex).await;

    if !res_rename_folder {
        return Ok(DefaultResponse { res: false });
    }

    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn repair_trailer(dir_save: &str, wear: &str) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let trailer_wear: Vec<String> = match set_trailer_wear(&file, wear) {
        Some(trailer_wear) => trailer_wear,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(dir_save.to_string(), trailer_wear).await;
    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn repair_all_trailers(dir_save: &str, wear: &str) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let trailer_wear: Vec<String> = match set_any_trailers_wear(&file, wear) {
        Some(trailer_wear) => trailer_wear,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(dir_save.to_string(), trailer_wear).await;
    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn set_remove_truck_badge(dir_save: &str) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_find = match get_truck_id(&file) {
        Some(truck_find) => truck_find,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_index: usize = match get_truck_vehicle_index(&file, &truck_find.id, truck_find.index)
    {
        Some(truck_index) => truck_index,
        None => return Ok(DefaultResponse { res: false }),
    };

    let no_truck_badge: Vec<String> = match remove_truck_badge(&file, truck_index) {
        Some(no_truck_badge) => no_truck_badge,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(dir_save.to_string(), no_truck_badge).await;
    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn set_truck_km(dir_save: &str, km: &str) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_find = match get_truck_id(&file) {
        Some(truck_find) => truck_find,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_index: usize = match get_truck_vehicle_index(&file, &truck_find.id, truck_find.index)
    {
        Some(truck_index) => truck_index,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_number = match get_truck_number(&file, &truck_find.id) {
        Some(truck_number) => truck_number,
        None => return Ok(DefaultResponse { res: false }),
    };

    let profit_log_index = match get_truck_profit_log_id(&file, truck_find.index, truck_number) {
        Some(profit_log_index) => profit_log_index,
        None => return Ok(DefaultResponse { res: false }),
    };

    let truck_km: Vec<String> = match set_truck_km_edit(&file, profit_log_index, truck_index, km) {
        Some(truck_km) => truck_km,
        None => return Ok(DefaultResponse { res: false }),
    };

    save_file(dir_save.to_string(), truck_km).await;

    return Ok(DefaultResponse { res: true });
}

#[tauri::command]
async fn get_save_list_trucks(dir_save: &str) -> Result<ListTrucksResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => {
            return Ok(ListTrucksResponse {
                res: false,
                trucks: Vec::new(),
            });
        }
    };

    let truck_list = match get_list_trucks_info(&file) {
        Some(truck_list) => truck_list,
        None => {
            return Ok(ListTrucksResponse {
                res: false,
                trucks: Vec::new(),
            });
        }
    };

    return Ok(ListTrucksResponse {
        res: true,
        trucks: truck_list,
    });
}

#[tauri::command]
async fn set_player_truck(
    dir_save: &str,
    current_truck_id: &str,
    replace_truck_id: &str,
) -> Result<DefaultResponse, ()> {
    let file: Vec<String> = match read_file_text(dir_save).await {
        Some(file) => file,
        None => return Ok(DefaultResponse { res: false }),
    };

    let (player_truck, truck_index) = match set_player_truck_file(&file, replace_truck_id) {
        Some(player_truck) => player_truck,
        None => return Ok(DefaultResponse { res: false }),
    };

    let player_driver_truck =
        match set_player_driver_truck(&file, truck_index, current_truck_id, replace_truck_id) {
            Some(player_driver_truck) => player_driver_truck,
            None => return Ok(DefaultResponse { res: false }),
        };

    let mut arr_val_clone = file.clone();

    for item in player_truck.iter() {
        arr_val_clone[item.index] = item.value.to_string();
    }

    for item in player_driver_truck.iter() {
        arr_val_clone[item.index] = item.value.to_string();
    }

    save_file(dir_save.to_string(), arr_val_clone).await;
    return Ok(DefaultResponse { res: true });
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            decrypt_to_save,
            set_cargo_mass_trailers_and_slave,
            set_unlock_current_trailers,
            set_cargo_mass_def_trailers,
            get_save_game_name,
            get_save_game_count,
            get_brand_models_ets2,
            get_brand_models_ats,
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
            get_os_theme,
            get_developer_game_status,
            set_developer_game_status,
            set_convoy_size,
            set_new_profile_name,
            repair_trailer,
            repair_all_trailers,
            set_remove_truck_badge,
            set_truck_km,
            get_save_list_trucks,
            set_player_truck,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
