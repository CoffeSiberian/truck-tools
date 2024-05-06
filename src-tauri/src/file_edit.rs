use std::fs::File;
use std::fs::write;
use std::io::prelude::*;

fn read_file(path: &str) -> Option<File> {
    let file = File::open(path);

    match file {
        Ok(file) => return Some(file),
        Err(_) => return None,
    };
}

pub fn save_file(path: String, content: Vec<String>) -> bool {
    match write(path, content.join("\r\n")) {
        Ok(_) => return true,
        Err(_) => return false,
    }
}

pub fn read_file_text(path: &str) -> Option<Vec<String>> {
    let readed_file = read_file(path);

    if !readed_file.is_none() {
        let mut file = readed_file.unwrap();
        let mut contents = String::new();
        file.read_to_string(&mut contents).unwrap();
        return Some(contents.split("\r\n").map(|x| x.to_string()).collect());
    } return None;
}

pub fn set_cargo_mass_trailer(arr_val: &Vec<String>, index: usize, cargo_mass: &str) -> Option<Vec<String>> {
    let value_find: String = format!(" cargo_mass: {}", cargo_mass);
    let mut arr_val_clone = arr_val.clone();

    for (i, item) in arr_val_clone.iter().enumerate().skip(index) {
        let option_values: Vec<&str> = item.split(':').collect();
        
        if option_values.len() >= 2 {
            if option_values[0] ==  " cargo_mass"{
                let cargo_mass_value = value_find;
                arr_val_clone[i] = cargo_mass_value;
                break;
            }
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
    let mut resultado: String = String::new();

        for (_i, item) in arr_val.iter().enumerate().skip(index) {
            let option_values: Vec<&str> = item.split(':').collect();

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

    if !resultado.is_empty() {
        return Some(resultado);
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

pub fn get_my_trailer_id(arr_val: &Vec<String>) -> Option<String> {
    let mut resultado: String = String::new();

    for (_i, item) in arr_val.iter().enumerate() {
        let option_values: Vec<&str> = item.split(':').collect();
        
        if option_values[0] == " my_trailer" {
            if option_values[1] == " null" {
                break;
            }
            resultado.push_str(option_values[1]);
            break;
        }
    }

    if !resultado.is_empty() {
        return Some(resultado);
    } return None;
}