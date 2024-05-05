// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::Value;
use serde_json::json;

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

#[tauri::command]
fn set_cargo_mass_trailer(arr_file_json: &str, index: usize, cargo_mass: &str) -> String {
    let v: Value = match serde_json::from_str(arr_file_json) {
        Ok(val) => val,
        Err(_) => return String::from("{\"res\": null}"),
    };

    let mut resultado: String = String::new();

    let arr_val: Option<&Vec<Value>> = v["arrFile"].as_array();

    if let Some(arr_val_s) = arr_val {
        let mut arr_val_clone = arr_val_s.clone();
        
        for (i, item) in arr_val_clone.iter().enumerate().skip(index) {
            if let Some(string_item) = item.as_str(){
                let option_values: Vec<&str> = string_item.split(':').collect();
                
                if option_values.len() >= 2 {
                    if option_values[0] ==  " cargo_mass"{
                        arr_val_clone[i] = Value::String(format!(" cargo_mass: {}", cargo_mass));
                        let json_res = json!({
                            "res": arr_val_clone
                        });
                        resultado.push_str(&serde_json::to_string(&json_res).unwrap());
                        break;
                    }
                }
            }
        }
    }
    if resultado.is_empty() {
        return String::from("{\"res\": null}");
    } else {
        return resultado;
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, find_my_trailer_id, find_trailer_index, get_slave_trailers_id, set_cargo_mass_trailer])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
