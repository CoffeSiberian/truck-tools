use crate::structs::vec_trucks::{VecTrucksId, VecTrucksWearSet};

fn get_vec_truck_wear(
    arr_val: &Vec<String>,
    wear: &str,
    index: usize,
) -> Option<Vec<VecTrucksWearSet>> {
    let mut result: Vec<VecTrucksWearSet> = Vec::new();

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        let option_values: Vec<&str> = item.split(':').collect();

        match option_values[0] {
            "}" => break,
            " engine_wear" => {
                result.push(VecTrucksWearSet {
                    index: i,
                    value: format!(" engine_wear: {}", wear),
                });
            }
            " transmission_wear" => {
                result.push(VecTrucksWearSet {
                    index: i,
                    value: format!(" transmission_wear: {}", wear),
                });
            }
            " cabin_wear" => {
                result.push(VecTrucksWearSet {
                    index: i,
                    value: format!(" cabin_wear: {}", wear),
                });
            }
            " engine_wear_unfixable" => {
                result.push(VecTrucksWearSet {
                    index: i,
                    value: format!(" engine_wear_unfixable: {}", wear),
                });
            }
            " transmission_wear_unfixable" => {
                result.push(VecTrucksWearSet {
                    index: i,
                    value: format!(" transmission_wear_unfixable: {}", wear),
                });
            }
            " cabin_wear_unfixable" => {
                result.push(VecTrucksWearSet {
                    index: i,
                    value: format!(" cabin_wear_unfixable: {}", wear),
                });
            }
            " chassis_wear" => {
                result.push(VecTrucksWearSet {
                    index: i,
                    value: format!(" chassis_wear: {}", wear),
                });
            }
            " chassis_wear_unfixable" => {
                result.push(VecTrucksWearSet {
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
) -> Option<Vec<VecTrucksWearSet>> {
    let mut result: Vec<VecTrucksWearSet> = Vec::new();

    let mut wheel_wear_number: i16 = 0;
    let mut wheel_wear_unfixable_number: i16 = 0;

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        let option_values: Vec<&str> = item.split('[').collect();

        match option_values[0] {
            "}" => break,
            " wheels_wear" => {
                result.push(VecTrucksWearSet {
                    index: i,
                    value: format!(" wheels_wear[{}]: {}", wheel_wear_number, wear),
                });
                wheel_wear_number += 1;
            }
            " wheels_wear_unfixable" => {
                result.push(VecTrucksWearSet {
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

fn get_vec_truck_fuel(
    arr_val: &Vec<String>,
    wear: &str,
    index: usize,
) -> Option<Vec<VecTrucksWearSet>> {
    for (i, item) in arr_val.iter().enumerate().skip(index) {
        let option_values: Vec<&str> = item.split(':').collect();

        if option_values[0] == " fuel_relative" {
            return Some(vec![VecTrucksWearSet {
                index: i,
                value: format!(" fuel_relative: {}", wear),
            }]);
        }
        if option_values[0] == "}" {
            return None;
        }
    }
    return None;
}

fn get_list_trucks_id(arr_val: &Vec<String>) -> Option<Vec<VecTrucksId>> {
    let mut result: Vec<VecTrucksId> = Vec::new();
    let mut truck_enum: i16 = 0;
    let mut truck_string_find: String = format!(" trucks[{}]", truck_enum);

    for (i, item) in arr_val.iter().enumerate() {
        let option_values: Vec<&str> = item.split(':').collect();

        if option_values[0] == truck_string_find {
            let truck_index =
                match get_truck_vehicle_index(arr_val, option_values[1].to_string(), i) {
                    Some(truck_index) => truck_index,
                    None => continue,
                };
            result.push(VecTrucksId {
                index: truck_index,
                id: option_values[1].to_string(),
            });
            truck_enum += 1;
            truck_string_find = format!(" trucks[{}]", truck_enum);
        }

        if option_values[0] == "}" && truck_enum > 0 {
            break;
        }
    }

    if !result.is_empty() {
        return Some(result);
    }
    return None;
}

pub fn get_truck_id(arr_val: &Vec<String>) -> Option<(String, usize)> {
    let mut result: String = String::new();
    let mut index: usize = 0;

    for (i, item) in arr_val.iter().enumerate() {
        let option_values: Vec<&str> = item.split(':').collect();

        if option_values[0] == " assigned_truck" {
            if option_values[1] == " null" {
                break;
            }

            index = i;
            result.push_str(option_values[1]);
            break;
        }
    }

    if !result.is_empty() {
        return Some((result, index));
    }
    return None;
}

pub fn get_truck_vehicle_index(
    arr_val: &Vec<String>,
    truck_id: String,
    index: usize,
) -> Option<usize> {
    let value_find: String = format!("{} {}", truck_id, "{");
    let mut result: String = String::new();

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        let option_values: Vec<&str> = item.split(':').collect();

        if option_values.len() >= 2 {
            if option_values[1] == value_find {
                result.push_str(format!("{}", i).as_str());
                break;
            }
        }
    }

    if !result.is_empty() {
        return Some(result.parse::<usize>().unwrap());
    }
    return None;
}

pub fn set_truck_wear(arr_val: &Vec<String>, wear: &str, index: usize) -> Option<Vec<String>> {
    let mut arr_val_clone: Vec<String> = arr_val.clone();

    let set_truck_wear = match get_vec_truck_wear(&arr_val, wear, index) {
        Some(set_truck_wear) => set_truck_wear,
        None => return None,
    };

    for (_i, item) in set_truck_wear.iter().enumerate() {
        arr_val_clone[item.index] = item.value.to_string();
    }

    let set_truck_wear_wheels = match get_vec_truck_wear_wheels(&arr_val, wear, index) {
        Some(set_truck_wear_wheels) => set_truck_wear_wheels,
        None => return None,
    };

    for (_i, item) in set_truck_wear_wheels.iter().enumerate() {
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

    for (_i, item) in trucks_list.iter().enumerate() {
        let set_truck_wear = match get_vec_truck_wear(&arr_val, wear, item.index) {
            Some(set_truck_wear) => set_truck_wear,
            None => continue,
        };

        for (_i, item) in set_truck_wear.iter().enumerate() {
            arr_val_clone[item.index] = item.value.to_string();
        }

        let set_truck_wear_wheels = match get_vec_truck_wear_wheels(&arr_val, wear, item.index) {
            Some(set_truck_wear_wheels) => set_truck_wear_wheels,
            None => continue,
        };

        for (_i, item) in set_truck_wear_wheels.iter().enumerate() {
            arr_val_clone[item.index] = item.value.to_string();
        }
    }

    return Some(arr_val_clone);
}

pub fn set_truck_fuel(arr_val: &Vec<String>, fuel: &str, index: usize) -> Option<Vec<String>> {
    let mut arr_val_clone: Vec<String> = arr_val.clone();

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        let option_values: Vec<&str> = item.split(':').collect();

        if option_values[0] == " fuel_relative" {
            arr_val_clone[i] = format!(" fuel_relative: {}", fuel);
            break;
        }
        if option_values[0] == "}" {
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

    for (_i, item) in trucks_list.iter().enumerate() {
        let set_truck_fuel = match get_vec_truck_fuel(&arr_val, fuel, item.index) {
            Some(set_truck_fuel) => set_truck_fuel,
            None => continue,
        };

        for (_i, item) in set_truck_fuel.iter().enumerate() {
            arr_val_clone[item.index] = item.value.to_string();
        }
    }

    return Some(arr_val_clone);
}

pub fn set_infinite_fuel_truck(arr_val: &Vec<String>, index: usize) -> Option<Vec<String>> {
    let mut arr_val_clone: Vec<String> = arr_val.clone();

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        let option_values: Vec<&str> = item.split(':').collect();

        if option_values[0] == " fuel_relative" {
            arr_val_clone[i] = format!(" fuel_relative: {}", "9999");
            break;
        }
        if option_values[0] == "}" {
            break;
        }
    }

    return Some(arr_val_clone);
}
