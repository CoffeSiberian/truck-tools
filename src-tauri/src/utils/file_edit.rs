use super::decrypt_saves::decrypt_file;
use crate::structs::vec_save_games::{VecProfileDir, VecSaveGames};
use std::fs::{read_dir, write, File};
use uuid::Uuid;

#[allow(dead_code)]
async fn read_file(path: &str) -> Option<File> {
    // currently not in use but will be used with future functionalities
    let file = File::open(path);

    match file {
        Ok(file) => return Some(file),
        Err(_) => return None,
    };
}

async fn get_dir_content(path: String) -> Option<Vec<String>> {
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

pub async fn save_file(path: String, content: Vec<String>) -> bool {
    match write(path, content.join("\r\n")) {
        Ok(_) => return true,
        Err(_) => return false,
    }
}

pub async fn read_file_text(path: &str) -> Option<Vec<String>> {
    let readed_file: Option<String> = decrypt_file(path).await;

    match readed_file {
        Some(res) => {
            return Some(res.split("\r\n").map(|s| s.to_owned()).collect());
        }
        None => return None,
    }
}

pub fn get_rgb_hex_to_game_format(color: &str) -> String {
    let color_replace: String = color.replace("#", "");
    let mut chunks: Vec<String> = color_replace
        .chars()
        .collect::<Vec<char>>()
        .chunks(2)
        .map(|chunk| chunk.iter().collect::<String>())
        .collect();

    chunks.swap(0, 2);
    let result: String = chunks.join("");

    return result;
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

pub async fn get_list_save_game(
    path: String,
    ignore_auto_saves: bool,
) -> Option<Vec<VecSaveGames>> {
    let dir_saves_content: Vec<String> = match get_dir_content(path + "/save").await {
        Some(dir_content) => dir_content,
        None => return None,
    };

    let mut result: Vec<VecSaveGames> = Vec::new();
    for item in dir_saves_content.iter() {
        let item_path: String = item.to_string().replace("\\", "/");
        let item_path_split: Vec<&str> = item_path.split("/").collect();
        let save_path_name: &str = item_path_split[item_path_split.len() - 1];

        if ignore_auto_saves {
            if save_path_name.contains("autosave_job")
                || save_path_name.contains("multiplayer_backup")
                || save_path_name.contains("autosave_drive")
            {
                continue;
            }
        }

        let file: Vec<String> =
            match read_file_text(format!("{}/info.sii", item_path).as_str()).await {
                Some(file) => file,
                None => continue,
            };

        let save_game_name: String = match get_save_name(&file, save_path_name) {
            Some(save_game_name) => save_game_name,
            None => continue,
        };

        let uuid: String = Uuid::new_v4().to_string();
        result.push(VecSaveGames {
            id: uuid,
            name: save_game_name,
            dir: item.to_string(),
        });
    }

    return Some(result);
}

pub async fn get_list_save_game_dirs(path: String) -> Option<Vec<VecProfileDir>> {
    let dir_saves_content: Vec<String> = match get_dir_content(path).await {
        Some(dir_content) => dir_content,
        None => return None,
    };

    let mut result: Vec<VecProfileDir> = Vec::new();
    for item in dir_saves_content.iter() {
        let item_path: String = item.to_string().replace("\\", "/");
        let item_path_split: Vec<&str> = item_path.split("/").collect();
        let profile_path_name: &str = item_path_split[item_path_split.len() - 1];

        result.push(VecProfileDir {
            name: profile_path_name.to_string(),
            dir: item_path,
        });
    }

    return Some(result);
}

pub async fn get_list_save_count(path: String, ignore_auto_saves: bool) -> usize {
    let dir_saves_content: Vec<String> = match get_dir_content(path + "/save").await {
        Some(dir_content) => dir_content,
        None => return 0,
    };

    if ignore_auto_saves {
        let mut index: usize = 0;

        for item in dir_saves_content.iter() {
            let item_path: String = item.to_string().replace("\\", "/");
            let item_path_split: Vec<&str> = item_path.split("/").collect();
            let save_path_name: &str = item_path_split[item_path_split.len() - 1];

            if save_path_name.contains("autosave_job")
                || save_path_name.contains("multiplayer_backup")
                || save_path_name.contains("autosave_drive")
            {
                continue;
            }

            index += 1;
        }

        return index;
    }

    return dir_saves_content.len();
}
