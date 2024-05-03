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

    // Check if the JSON has the key "arrFile"
    if let Some(arr) = v.get("arrFile") {

        // Check if the value of "arrFile" is an array
        if let Some(array) = arr.as_array() {
            for (_i, item) in array.iter().enumerate() {

                // Check if the item is a string
                if let Some(string_item) = item.as_str(){
                    let option_values: Vec<&str> = string_item.split(':').collect();

                    // Check if the string contains " my_trailer"
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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, find_my_trailer_id])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
