use std::fs::{File, write, read_dir};
use std::io::prelude::*;
use tauri::api::process::{Command, CommandEvent};
use tauri::async_runtime::Receiver;
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

async fn execute_command(mut command_rx: Receiver<CommandEvent>) -> bool {
    while let Some(event) = command_rx.recv().await {
        match event {
            CommandEvent::Terminated(_) => {
                return true;
            }
            _ => {}
        }
    }
    return false;
}

async fn descript_sii_file(path: String) -> bool {
    match Command::new_sidecar("SII_Decrypt") {
        Ok(command) => {
            match command.args([path]).spawn() {
                Ok((rx, _child)) => {
                    return execute_command(rx).await;
                },
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

pub async fn get_list_save_game(path: String) -> Option<Vec<VecSaveGames>> {
    let dir_saves_content: Vec<String> = match get_dir_content(path + "/save") {
        Some(dir_content) => dir_content,
        None => return None,
    };

    let mut result: Vec<VecSaveGames> = Vec::new();
    for item in dir_saves_content.iter() {
        let item_path: String = item.to_string().replace("\\", "/");

        let descripted: bool = descript_sii_file(format!("{}/info.sii", item_path)).await;

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