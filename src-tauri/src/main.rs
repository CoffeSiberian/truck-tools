// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::Value;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn find_my_trailer_id(arr_file_json: &str) -> String {
    let v: Value = match serde_json::from_str(arr_file_json) {
        Ok(val) => val,
        Err(_) => return String::from("{\"res\": null}"),
    };

    let mut resultado: String = String::new();

    if let Some(arr) = v.get("arrFile") {

        if let Some(array) = arr.as_array() {
            for (_i, item) in array.iter().enumerate() {

                if let Some(string_item) = item.as_str(){
                    let option_values: Vec<&str> = string_item.split(':').collect();
                    
                    if option_values[0] == " my_trailer" {
                        if option_values[1] == " null" {
                            break;
                        }
                        resultado.push_str(option_values[1]);
                        break;
                    }
                }
            }
        }
    }

    if resultado.is_empty() {
        return String::from("{\"res\": null}");
    } else {
        return format!("{{\"res\": \"{}\"}}", resultado);
    }
}

#[tauri::command]
fn find_trailer_index(arr_file_json: &str, trailer_id: &str) -> String {
    let v: Value = match serde_json::from_str(arr_file_json) {
        Ok(val) => val,
        Err(_) => return String::from("{\"res\": null}"),
    };

    let mut resultado: String = String::new();

    let arr_val = v["arrFile"].as_array();

    if let Some(arr_val_s) = arr_val {
        for (i, item) in arr_val_s.iter().enumerate() {
            if let Some(string_item) = item.as_str(){
                let option_values: Vec<&str> = string_item.split(':').collect();

                if option_values.len() >= 2 {
                    if option_values[1] ==  format!("{} {}", trailer_id, "{"){
                        resultado.push_str(format!("{}", i).as_str());
                        break;
                    }
                }
            }
        }
    }

    if resultado.is_empty() {
        return String::from("{\"res\": null}");
    } else {
        return format!("{{\"res\": \"{}\"}}", resultado);
    }
}

#[tauri::command]
fn get_slave_trailers_id(arr_file_json: &str, index: usize) -> String {
    let v: Value = match serde_json::from_str(arr_file_json) {
        Ok(val) => val,
        Err(_) => return String::from("{\"res\": null}"),
    };

    let mut resultado: String = String::new();

    let arr_val = v["arrFile"].as_array();

    if let Some(arr_val_s) = arr_val {
        for (_i, item) in arr_val_s.iter().enumerate().skip(index) {
            if let Some(string_item) = item.as_str(){
                let option_values: Vec<&str> = string_item.split(':').collect();

                if option_values.len() >= 2 {
                    if option_values[0] ==  " slave_trailer"{
                        if option_values[1] == " null" {
                            break;
                        } else {                            
                            resultado.push_str(option_values[1]);
                            break;
                        }
                    }
                }
            }
        }
    }

    if resultado.is_empty() {
        return String::from("{\"res\": null}");
    } else {
        return format!("{{\"res\": \"{}\"}}", resultado);
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, find_my_trailer_id, find_trailer_index, get_slave_trailers_id])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
