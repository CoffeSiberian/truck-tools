use std::fs::File;
use std::fs::write;
use std::fs::read_dir;
use std::io::prelude::*;
use tauri::api::process::Command;
use crate::structs::vec_items_replace::VecItemsReplace;
use crate::structs::vec_save_games::VecSaveGames;

fn read_file(path: &str) -> Option<File> {
    let file = File::open(path);

    match file {
        Ok(file) => return Some(file),
        Err(_) => return None,
    };
}

fn get_dir_content(path: String) -> Option<Vec<String>> {
    let mut result: Vec<String> = Vec::new();

    let paths = match read_dir(path) {
        Ok(paths) => paths,
        Err(_) => return None,
    }; 

    for path in paths {
        let path = match path {
            Ok(path) => path,
            Err(_) => return None,
        };
        result.push(path.path().display().to_string());
    }
    return Some(result);
}

fn descript_sii_file(path: String) -> bool {
    match Command::new_sidecar("SII_Decrypt") {
        Ok(command) => {
            match command.args([path]).spawn() {
                Ok(_) => return true,
                Err(_) =>  return false,
            }
        }
        Err(_) => return false,
    }
}

pub fn save_file(path: String, content: Vec<String>) -> bool {
    match write(path, content.join("\r\n")) {
        Ok(_) => return true,
        Err(_) => return false,
    }
}

pub fn read_file_text(path: &str) -> Option<Vec<String>> {
    let readed_file: Option<File> = read_file(path);

    match readed_file {
        Some(mut file) => {
            let mut contents = String::new();
            
            match file.read_to_string(&mut contents) {
                Ok(_) => return Some(contents.split("\r\n").map(|x| x.to_string()).collect()),
                Err(_) => return None,
            }
        }
        None => return None,
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Profile options ///////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

pub fn get_save_name(arr_val: &Vec<String>, default_name: &str) -> Option<String> {
    for item in arr_val.iter() {
        let option_values: Vec<&str> = item.split(':').collect();
        
        if option_values[0] == " name" {
            if option_values[1] == " \"\"" {
                return Some(default_name.to_owned());
            }
            return Some(option_values[1].replace("\"", "").trim().to_string());
        }
    }
    
    return None;
}

pub fn get_list_save_game(path: String) -> Option<Vec<VecSaveGames>> {
    let dir_saves_content: Vec<String> = match get_dir_content(path + "/save") {
        Some(dir_content) => dir_content,
        None => return None,
    };

    let mut result: Vec<VecSaveGames> = Vec::new();
    for item in dir_saves_content.iter() {
        let item_path: String = item.to_string().replace("\\", "/");

        let descripted: bool = descript_sii_file(format!("{}/info.sii", item_path));

        if !descripted {
            continue;
        }

        let file: Vec<String> = match read_file_text(format!("{}/info.sii", item_path).as_str()) {
            Some(file) => file,
            None => continue,
        };

        let mut default_name: Vec<&str> = item_path.split("/").collect();
        default_name.reverse();

        let save_game_name: String = match get_save_name(&file, default_name[0]) {
            Some(save_game_name) => save_game_name,
            None => continue,
        };
        result.push(VecSaveGames{name: save_game_name, dir: item.to_string()});
    }

    return Some(result);
}

pub fn get_list_save_count(path: String) -> usize {
    let dir_saves_content: Vec<String> = match get_dir_content(path + "/save") {
        Some(dir_content) => dir_content,
        None => return 0,
    };

    return dir_saves_content.len();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////// These functions are related to the trailers /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

pub fn set_cargo_mass_trailer(arr_val: &Vec<String>, index: usize, cargo_mass: &str) -> Option<Vec<String>> {
    let value_find: String = format!(" cargo_mass: {}", cargo_mass);
    let mut arr_val_clone: Vec<String> = arr_val.clone();

    for (i, item) in arr_val_clone.iter().enumerate().skip(index) {
        let option_values: Vec<&str> = item.split(':').collect();
        
        if option_values.len() >= 2 {
            if option_values[0] ==  " cargo_mass"{
                arr_val_clone[i] = value_find;
                break;
            }
        }
    }
    return Some(arr_val_clone);
}

pub fn set_chassis_and_body_mass_def_trailers(arr_val: &Vec<String>, index: usize, body_mass: &str, chassis_mass: &str) -> Option<Vec<String>> {
    let value_find_chassis: String = format!(" chassis_mass: {}", chassis_mass);
    let value_find_body: String = format!(" body_mass: {}", body_mass);
    let mut arr_val_clone: Vec<String> = arr_val.clone();

    for (i, item) in arr_val_clone.iter().enumerate().skip(index) {
        let option_values: Vec<&str> = item.split(':').collect();
        
        if option_values.len() >= 2 {
            if option_values[0] ==  " chassis_mass"{
                arr_val_clone[i] = value_find_chassis;
                break;
            }
        }
    }

    for (i, item) in arr_val_clone.iter().enumerate().skip(index) {
        let option_values: Vec<&str> = item.split(':').collect();
        
        if option_values.len() >= 2 {
            if option_values[0] ==  " body_mass"{
                arr_val_clone[i] = value_find_body;
                break;
            }
        }
    }

    return Some(arr_val_clone);
}

pub fn set_remove_trailer_restricted_areas(arr_val: &Vec<String>, index: usize) -> Option<Vec<String>> {
    let mut arr_val_clone: Vec<String> = arr_val.clone();
    let mut counter_areas: i16 = 0;
    let mut items_to_edit: Vec<VecItemsReplace> = Vec::new();

    for (i, item) in arr_val_clone.iter().enumerate().skip(index) {
        let option_values: Vec<&str> = item.split(':').collect();
        
        if option_values.len() >= 2 {
            if option_values[0] ==  " country_validity" {
                if option_values[1] == " 0"{
                    break;
                }
                items_to_edit.push(VecItemsReplace{index: i, value: " country_validity: 0".to_string(), to_delete: false});
                continue;
            }

            if option_values[0] == format!(" country_validity[{}]", counter_areas) {
                items_to_edit.push(VecItemsReplace{index: i, value: "".to_string(), to_delete: true});
                counter_areas += 1;
                let next_element: Vec<&str> = arr_val_clone[i + 1].split('[').collect();
                if next_element[0] != " country_validity".to_string() {
                    break;
                }
            }
        }
    }

    items_to_edit.reverse();
    for item in items_to_edit.iter() {
        if item.to_delete {
            arr_val_clone.remove(item.index);
        } else {
            arr_val_clone[item.index] = item.value.clone();
        }
    }

    return Some(arr_val_clone);
}

pub fn set_any_slave_trailers_weight(arr_val: &Vec<String>, first_slave_id: String, cargo_mass: String) -> Vec<String> {
    let mut counter: i16 = 0;
    let mut next_slave_trailer: String = first_slave_id;
    let mut next_slave_trailer_index: usize = 0;
    let mut current_arr_val: Vec<String> = arr_val.to_vec();
    let max_counter: i16 = 20;

    loop {
        counter += 1;
        if counter >= max_counter {
            break;
        }

        let slave_index: usize = match get_trailer_index(&current_arr_val, next_slave_trailer) {
            Some(slave_index) => slave_index,
            None => break,
        };
        next_slave_trailer_index = slave_index;

        let cargo_mass_save:Vec<String> = match set_cargo_mass_trailer(&current_arr_val, next_slave_trailer_index, cargo_mass.as_str()) {
            Some(cargo_mass_save) => cargo_mass_save,
            None => break,
        };
        current_arr_val = cargo_mass_save;

        let slave_trailer_id: String = match get_slave_trailers_id(&current_arr_val, next_slave_trailer_index) {
            Some(slave_trailer_id) => slave_trailer_id,
            None => break,
        };
        next_slave_trailer = slave_trailer_id;
    }

    return current_arr_val;
}

pub fn get_slave_trailers_id(arr_val: &Vec<String>, index: usize) -> Option<String> {
    let mut result: String = String::new();

        for (_i, item) in arr_val.iter().enumerate().skip(index) {
            let option_values: Vec<&str> = item.split(':').collect();

            if option_values.len() >= 2 {
                if option_values[0] ==  " slave_trailer"{
                    if option_values[1] == " null" {
                        break;
                    } else {                            
                        result.push_str(option_values[1]);
                        break;
                    }
                }
            }
        }

    if !result.is_empty() {
        return Some(result);
    } return None;
}

pub fn get_trailer_index(arr_val: &Vec<String>, trailer_id: String) -> Option<usize> {
    let value_find: String = format!("{} {}", trailer_id, "{");
    let mut result: String = String::new();

    for (i, item) in arr_val.iter().enumerate() {
            let option_values: Vec<&str> = item.split(':').collect();

            if option_values.len() >= 2 {
                if option_values[1] ==  value_find{
                    result.push_str(format!("{}", i).as_str());
                    break;
                }
            }
    }

    if !result.is_empty() {
        return Some(result.parse::<usize>().unwrap());
    } return None;
}

pub fn get_trailer_def_id(arr_val: &Vec<String>, index: usize) -> Option<String> {
    let mut result: String = String::new();

    for (_i, item) in arr_val.iter().enumerate().skip(index) {
        let option_values: Vec<&str> = item.split(':').collect();

        if option_values.len() >= 2 {
            if option_values[0] ==  " trailer_definition"{
                if option_values[1] == " null" {
                    break;
                } else {                          
                    result.push_str(option_values[1]);
                    break;
                }
            }
        }
    }

    if !result.is_empty() {
        return Some(result);
    } return None;
}

pub fn get_trailer_def_index(arr_val: &Vec<String>, trailer_def_id: String) -> Option<usize> {
    let value_find: String = format!("{} {}", trailer_def_id, "{");
    let mut result: String = String::new();

    for (i, item) in arr_val.iter().enumerate() {
            let option_values: Vec<&str> = item.split(':').collect();

            if option_values.len() >= 2 {
                if option_values[1] ==  value_find{
                    result.push_str(format!("{}", i).as_str());
                    break;
                }
            }
    }

    if !result.is_empty() {
        return Some(result.parse::<usize>().unwrap());
    } return None;
}

pub fn get_my_trailer_id(arr_val: &Vec<String>) -> Option<String> {
    let mut result: String = String::new();

    for (_i, item) in arr_val.iter().enumerate() {
        let option_values: Vec<&str> = item.split(':').collect();
        
        if option_values[0] == " my_trailer" {
            if option_values[1] == " null" {
                break;
            }
            result.push_str(option_values[1]);
            break;
        }
    }

    if !result.is_empty() {
        return Some(result);
    } return None;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////