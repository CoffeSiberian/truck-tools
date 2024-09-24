use super::license_plate::get_license_plate_formated;

use crate::structs::vec_items_find::VecItemsFind;
use crate::structs::vec_trucks::VecTrucksId;

fn get_vec_truck_wear(
    arr_val: &Vec<String>,
    wear: &str,
    index: usize,
) -> Option<Vec<VecItemsFind>> {
    let mut result: Vec<VecItemsFind> = Vec::new();

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        let option_values: Vec<&str> = item.split(':').collect();

        match option_values[0] {
            "}" => break,
            " engine_wear" => {
                result.push(VecItemsFind {
                    index: i,
                    value: format!(" engine_wear: {}", wear),
                });
            }
            " transmission_wear" => {
                result.push(VecItemsFind {
                    index: i,
                    value: format!(" transmission_wear: {}", wear),
                });
            }
            " cabin_wear" => {
                result.push(VecItemsFind {
                    index: i,
                    value: format!(" cabin_wear: {}", wear),
                });
            }
            " engine_wear_unfixable" => {
                result.push(VecItemsFind {
                    index: i,
                    value: format!(" engine_wear_unfixable: {}", wear),
                });
            }
            " transmission_wear_unfixable" => {
                result.push(VecItemsFind {
                    index: i,
                    value: format!(" transmission_wear_unfixable: {}", wear),
                });
            }
            " cabin_wear_unfixable" => {
                result.push(VecItemsFind {
                    index: i,
                    value: format!(" cabin_wear_unfixable: {}", wear),
                });
            }
            " chassis_wear" => {
                result.push(VecItemsFind {
                    index: i,
                    value: format!(" chassis_wear: {}", wear),
                });
            }
            " chassis_wear_unfixable" => {
                result.push(VecItemsFind {
                    index: i,
                    value: format!(" chassis_wear_unfixable: {}", wear),
                });
            }
            _ => (),
        }
    }

    if result.len() > 0 {
        return Some(result);
    }
    return None;
}

fn get_vec_truck_wear_wheels(
    arr_val: &Vec<String>,
    wear: &str,
    index: usize,
) -> Option<Vec<VecItemsFind>> {
    let mut result: Vec<VecItemsFind> = Vec::new();

    let mut wheel_wear_number: u16 = 0;
    let mut wheel_wear_unfixable_number: u16 = 0;

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        let option_values: Vec<&str> = item.split('[').collect();

        match option_values[0] {
            "}" => break,
            " wheels_wear" => {
                result.push(VecItemsFind {
                    index: i,
                    value: format!(" wheels_wear[{}]: {}", wheel_wear_number, wear),
                });
                wheel_wear_number += 1;
            }
            " wheels_wear_unfixable" => {
                result.push(VecItemsFind {
                    index: i,
                    value: format!(
                        " wheels_wear_unfixable[{}]: {}",
                        wheel_wear_unfixable_number, wear
                    ),
                });
                wheel_wear_unfixable_number += 1;
            }
            _ => (),
        }
    }

    if result.len() > 0 {
        return Some(result);
    }
    return None;
}

fn get_truck_fuel(arr_val: &Vec<String>, fuel: &str, index: usize) -> Option<VecItemsFind> {
    for (i, item) in arr_val.iter().enumerate().skip(index) {
        if item.contains(" fuel_relative:") {
            return Some(VecItemsFind {
                index: i,
                value: format!(" fuel_relative: {}", fuel),
            });
        }
        if item == "}" {
            return None;
        }
    }

    return None;
}

fn get_truck_accessorie_index(
    arr_val: &Vec<String>,
    accessory_id: &str,
    index: usize,
) -> Option<usize> {
    let value_find: String = format!("{} {}", accessory_id, "{");

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        if item.contains(&value_find) {
            return Some(i);
        }
    }

    return None;
}

fn get_list_trucks_id(arr_val: &Vec<String>) -> Option<Vec<VecTrucksId>> {
    let mut result: Vec<VecTrucksId> = Vec::new();
    let mut truck_enum: u16 = 0;
    let mut truck_string_find: String = format!(" trucks[{}]", truck_enum);

    for (i, item) in arr_val.iter().enumerate() {
        if item.contains(&truck_string_find) {
            let option_values: Vec<&str> = item.split(':').collect();

            let truck_index =
                match get_truck_vehicle_index(arr_val, option_values[1].to_string(), i) {
                    Some(truck_index) => truck_index,
                    None => {
                        truck_enum += 1;
                        truck_string_find = format!(" trucks[{}]", truck_enum);
                        continue;
                    }
                };
            result.push(VecTrucksId {
                index: truck_index,
                id: option_values[1].to_string(),
            });
            truck_enum += 1;
            truck_string_find = format!(" trucks[{}]", truck_enum);
        }

        if truck_enum > 0 && item == "}" {
            break;
        }
    }

    if !result.is_empty() {
        return Some(result);
    }
    return None;
}

fn get_list_trucks_accessories_id(
    arr_val: &Vec<String>,
    index: usize,
) -> Option<Vec<VecItemsFind>> {
    let mut result: Vec<VecItemsFind> = Vec::new();
    let mut accessories_enum: u16 = 0;
    let mut truck_accessories_find: String = format!(" accessories[{}]", accessories_enum);

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        if item.contains(&truck_accessories_find) {
            let option_values: Vec<&str> = item.split(':').collect();

            let truck_accessories_index =
                match get_truck_accessorie_index(arr_val, option_values[1], i) {
                    Some(truck_accessories_index) => truck_accessories_index,
                    None => continue,
                };

            result.push(VecItemsFind {
                index: truck_accessories_index,
                value: option_values[1].to_string(),
            });

            accessories_enum += 1;
            truck_accessories_find = format!(" accessories[{}]", accessories_enum);
        }

        if item == "}" && accessories_enum > 0 {
            break;
        }
    }

    if !result.is_empty() {
        return Some(result);
    }

    return None;
}

fn get_accessories_data_path(arr_val: &Vec<String>, index: usize) -> Option<VecItemsFind> {
    for (i, item) in arr_val.iter().enumerate().skip(index) {
        let option_values: Vec<&str> = item.split(':').collect();

        if option_values[0] == " data_path" {
            return Some(VecItemsFind {
                index: i,
                value: option_values[1].to_string(),
            });
        }

        if option_values[0] == "}" {
            return None;
        }
    }

    return None;
}

fn is_engine(value_split: &String) -> bool {
    let value_split: Vec<&str> = value_split.split('/').collect();

    for item in value_split.iter() {
        if item == &"engine" {
            return true;
        }
    }
    return false;
}

fn is_transmissions(value_split: &String) -> bool {
    let value_split: Vec<&str> = value_split.split('/').collect();

    for item in value_split.iter() {
        if item == &"transmission" {
            return true;
        }
    }
    return false;
}

pub fn get_truck_id(arr_val: &Vec<String>) -> Option<VecTrucksId> {
    for (i, item) in arr_val.iter().enumerate() {
        if item.contains(" assigned_truck") {
            if item.contains(" null") {
                return None;
            }
            let option_values: Vec<&str> = item.split(':').collect();

            return Some(VecTrucksId {
                index: i,
                id: option_values[1].to_string(),
            });
        }
    }

    return None;
}

pub fn get_truck_vehicle_index(
    arr_val: &Vec<String>,
    truck_id: String,
    index: usize,
) -> Option<usize> {
    let value_find: String = format!("{} {}", truck_id, "{");

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        if item.contains(&value_find) {
            return Some(i);
        }
    }

    return None;
}

pub fn set_truck_wear(arr_val: &Vec<String>, wear: &str, index: usize) -> Option<Vec<String>> {
    let mut arr_val_clone: Vec<String> = arr_val.clone();

    let set_truck_wear = match get_vec_truck_wear(&arr_val, wear, index) {
        Some(set_truck_wear) => set_truck_wear,
        None => return None,
    };

    for item in set_truck_wear.iter() {
        arr_val_clone[item.index] = item.value.to_string();
    }

    let set_truck_wear_wheels = match get_vec_truck_wear_wheels(&arr_val, wear, index) {
        Some(set_truck_wear_wheels) => set_truck_wear_wheels,
        None => return None,
    };

    for item in set_truck_wear_wheels.iter() {
        arr_val_clone[item.index] = item.value.to_string();
    }

    return Some(arr_val_clone);
}

pub fn set_any_trucks_wear(arr_val: &Vec<String>, wear: &str) -> Option<Vec<String>> {
    let mut arr_val_clone: Vec<String> = arr_val.clone();

    let trucks_list: Vec<VecTrucksId> = match get_list_trucks_id(&arr_val) {
        Some(trucks_list) => trucks_list,
        None => return None,
    };

    for item in trucks_list.iter() {
        let set_truck_wear = match get_vec_truck_wear(&arr_val, wear, item.index) {
            Some(set_truck_wear) => set_truck_wear,
            None => continue,
        };

        for item in set_truck_wear.iter() {
            arr_val_clone[item.index] = item.value.to_string();
        }

        let set_truck_wear_wheels = match get_vec_truck_wear_wheels(&arr_val, wear, item.index) {
            Some(set_truck_wear_wheels) => set_truck_wear_wheels,
            None => continue,
        };

        for item in set_truck_wear_wheels.iter() {
            arr_val_clone[item.index] = item.value.to_string();
        }
    }

    return Some(arr_val_clone);
}

pub fn set_truck_fuel(arr_val: &Vec<String>, fuel: &str, index: usize) -> Option<Vec<String>> {
    let mut arr_val_clone: Vec<String> = arr_val.clone();

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        if item.contains(" fuel_relative:") {
            arr_val_clone[i] = format!(" fuel_relative: {}", fuel);
            break;
        }

        if item == "}" {
            break;
        }
    }

    return Some(arr_val_clone);
}

pub fn set_any_trucks_fuel(arr_val: &Vec<String>, fuel: &str) -> Option<Vec<String>> {
    let mut arr_val_clone: Vec<String> = arr_val.clone();

    let trucks_list: Vec<VecTrucksId> = match get_list_trucks_id(&arr_val) {
        Some(trucks_list) => trucks_list,
        None => return None,
    };

    for item in trucks_list.iter() {
        let set_truck_fuel = match get_truck_fuel(&arr_val, fuel, item.index) {
            Some(set_truck_fuel) => set_truck_fuel,
            None => continue,
        };

        arr_val_clone[set_truck_fuel.index] = set_truck_fuel.value.to_string();
    }

    return Some(arr_val_clone);
}

pub fn set_infinite_fuel_truck(arr_val: &Vec<String>, index: usize) -> Option<Vec<String>> {
    let mut arr_val_clone: Vec<String> = arr_val.clone();

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        if item.contains(" fuel_relative:") {
            arr_val_clone[i] = format!(" fuel_relative: {}", "9999");
            break;
        }

        if item == "}" {
            break;
        }
    }

    return Some(arr_val_clone);
}

pub fn set_truck_license_plate(
    arr_val: &Vec<String>,
    index: usize,
    bg_plate_color: &str,
    text_plate_color: &str,
    license_plate: &str,
    color_margin: bool,
) -> Option<Vec<String>> {
    let mut arr_val_clone: Vec<String> = arr_val.clone();
    let value: String = get_license_plate_formated(
        bg_plate_color,
        text_plate_color,
        license_plate,
        color_margin,
    );
    let value_put: String = format!(" license_plate: \"{}\"", value);

    for (i, item) in arr_val_clone.iter().enumerate().skip(index) {
        if item.contains(" license_plate:") {
            arr_val_clone[i] = value_put.to_string();
            return Some(arr_val_clone);
        }

        if item == "}" {
            break;
        }
    }

    return None;
}

pub fn set_truck_engine(
    arr_val: &Vec<String>,
    index: usize,
    engine_code: &str,
) -> Option<Vec<String>> {
    let truck_accessories: Vec<VecItemsFind> = match get_list_trucks_accessories_id(&arr_val, index)
    {
        Some(truck_accessories) => truck_accessories,
        None => return None,
    };
    let mut arr_val_clone: Vec<String> = arr_val.clone();
    let value_engine: String = format!(" data_path: \"{}\"", engine_code);

    for item in truck_accessories.iter() {
        let data_path: VecItemsFind = match get_accessories_data_path(&arr_val, item.index) {
            Some(data_path) => data_path,
            None => continue,
        };
        let is_engine = is_engine(&data_path.value);

        if is_engine {
            arr_val_clone[data_path.index] = value_engine;
            return Some(arr_val_clone);
        }
    }

    return None;
}

pub fn set_truck_transmissions(
    arr_val: &Vec<String>,
    index: usize,
    transmissions_code: &str,
) -> Option<Vec<String>> {
    let truck_accessories: Vec<VecItemsFind> = match get_list_trucks_accessories_id(&arr_val, index)
    {
        Some(truck_accessories) => truck_accessories,
        None => return None,
    };
    let mut arr_val_clone: Vec<String> = arr_val.clone();
    let value_transmissions: String = format!(" data_path: \"{}\"", transmissions_code);

    for item in truck_accessories.iter() {
        let data_path: VecItemsFind = match get_accessories_data_path(&arr_val, item.index) {
            Some(data_path) => data_path,
            None => continue,
        };
        let is_transmissions = is_transmissions(&data_path.value);

        if is_transmissions {
            arr_val_clone[data_path.index] = value_transmissions;
            return Some(arr_val_clone);
        }
    }

    return None;
}
