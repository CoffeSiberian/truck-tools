use super::accessories::{
    get_accessories_data_path, get_list_trucks_accessories_id, remove_accessorie,
};
use super::license_plate::get_license_plate_formated;

use crate::structs::vec_items_find::VecItemsFind;
use crate::structs::vec_trucks::{
    Models, TruckBrandsATS, TruckBrandsETS2, VecTruckProfitLog, VecTrucksId, VecTrucksListId,
};
use cached::proc_macro::cached;
use serde_json::from_str;

const ETS2_TRUCK_BRANDS: &str = include_str!("../embeds/trucks_data_ets2.json");
const ATS_TRUCK_BRANDS: &str = include_str!("../embeds/trucks_data_ats.json");

#[cached]
fn get_trucks_data_ets2() -> Option<TruckBrandsETS2> {
    let truck_brands: TruckBrandsETS2 = match from_str(ETS2_TRUCK_BRANDS) {
        Ok(truck_brands) => truck_brands,
        Err(_) => return None,
    };

    return Some(truck_brands);
}

#[cached]
fn get_trucks_data_ats() -> Option<TruckBrandsATS> {
    let truck_brands: TruckBrandsATS = match from_str(ATS_TRUCK_BRANDS) {
        Ok(truck_brands) => truck_brands,
        Err(_) => return None,
    };

    return Some(truck_brands);
}

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

fn get_truck_km(arr_val: &Vec<String>, km: &str, index: usize) -> Option<Vec<VecItemsFind>> {
    let mut result: Vec<VecItemsFind> = Vec::new();

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        let option_values: Vec<&str> = item.split(':').collect();

        match option_values[0] {
            "}" => break,
            " odometer" => {
                result.push(VecItemsFind {
                    index: i,
                    value: format!(" odometer: {}", km),
                });
            }
            " integrity_odometer" => {
                result.push(VecItemsFind {
                    index: i,
                    value: format!(" integrity_odometer: {}", km),
                });
            }
            " trip_distance_km" => {
                result.push(VecItemsFind {
                    index: i,
                    value: format!(" trip_distance_km: {}", km),
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

fn get_truck_km_profit(arr_val: &Vec<String>, km: &str, index: usize) -> Option<Vec<VecItemsFind>> {
    let mut result: Vec<VecItemsFind> = Vec::new();

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        let option_values: Vec<&str> = item.split(':').collect();

        match option_values[0] {
            "}" => break,
            " acc_distance_on_job" => {
                result.push(VecItemsFind {
                    index: i,
                    value: format!(" acc_distance_on_job: {}", km),
                });
            }
            " acc_distance_free" => {
                result.push(VecItemsFind {
                    index: i,
                    value: format!(" acc_distance_free: {}", "0"),
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

fn get_list_trucks_id(
    arr_val: &Vec<String>,
    skip_find_truck_index: bool,
) -> Option<Vec<VecTrucksListId>> {
    let mut result: Vec<VecTrucksListId> = Vec::new();
    let mut truck_enum: u16 = 0;
    let mut truck_string_find: String = format!(" trucks[{}]", truck_enum);

    for (i, item) in arr_val.iter().enumerate() {
        if item.contains(&truck_string_find) {
            let option_values: Vec<&str> = item.split(':').collect();
            let id = option_values[1].to_string();
            let mut truck_index: usize = 0;

            if !skip_find_truck_index {
                truck_index = match get_truck_vehicle_index(arr_val, &id, i) {
                    Some(truck_index) => truck_index,
                    None => {
                        truck_enum += 1;
                        truck_string_find = format!(" trucks[{}]", truck_enum);
                        continue;
                    }
                };
            }

            result.push(VecTrucksListId {
                truck_number: truck_enum,
                index: truck_index,
                id,
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

fn is_badge(value_split: &String) -> bool {
    let value_split: Vec<&str> = value_split.split('/').collect();

    for item in value_split.iter() {
        if item == &"badge" {
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
    truck_id: &String,
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

pub fn get_truck_number(arr_val: &Vec<String>, truck_id: &String) -> Option<u16> {
    let trucks = match get_list_trucks_id(&arr_val, true) {
        Some(trucks) => trucks,
        None => return None,
    };

    for item in trucks.iter() {
        if item.id == *truck_id {
            return Some(item.truck_number);
        };
    }

    return None;
}

pub fn get_truck_profit_log_index(
    arr_val: &Vec<String>,
    profit_log_id: &String,
    index: usize,
) -> Option<usize> {
    let value_find: String = format!("{} {}", profit_log_id, "{");

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        if item.contains(&value_find) {
            return Some(i);
        }
    }

    return None;
}

pub fn get_truck_profit_log_id(
    arr_val: &Vec<String>,
    index: usize,
    truck_number: u16,
) -> Option<VecTruckProfitLog> {
    let truck_jobs_string_find: String = format!(" truck_profit_logs[{}]", truck_number);

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        if item.contains(&truck_jobs_string_find) {
            let option_values: Vec<&str> = item.split(':').collect();
            let id = option_values[1].to_string();

            let profit_log_id_index = match get_truck_profit_log_index(arr_val, &id, i) {
                Some(profit_log_id) => profit_log_id,
                None => return None,
            };

            return Some(VecTruckProfitLog {
                index: profit_log_id_index,
                id,
            });
        }

        if item == "}" {
            break;
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

    let trucks_list: Vec<VecTrucksListId> = match get_list_trucks_id(&arr_val, false) {
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

    let trucks_list: Vec<VecTrucksListId> = match get_list_trucks_id(&arr_val, false) {
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
    index_end_block: usize,
    engine_code: &str,
) -> Option<Vec<String>> {
    let truck_accessories = match get_list_trucks_accessories_id(&arr_val, index_end_block) {
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
    index_end_block: usize,
    transmissions_code: &str,
) -> Option<Vec<String>> {
    let truck_accessories = match get_list_trucks_accessories_id(&arr_val, index_end_block) {
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

pub fn remove_truck_badge(arr_val: &Vec<String>, index_end_block: usize) -> Option<Vec<String>> {
    let truck_accessories = match get_list_trucks_accessories_id(&arr_val, index_end_block) {
        Some(truck_accessories) => truck_accessories,
        None => return None,
    };

    for item in truck_accessories.iter() {
        let data_path: VecItemsFind = match get_accessories_data_path(&arr_val, item.index) {
            Some(data_path) => data_path,
            None => continue,
        };

        let is_badge = is_badge(&data_path.value);

        if is_badge {
            let removed_accessorie =
                match remove_accessorie(&arr_val, &item.id, &truck_accessories, index_end_block) {
                    Some(removed_accessorie) => removed_accessorie,
                    None => continue,
                };

            return Some(removed_accessorie);
        }
    }

    return None;
}

pub fn set_truck_km_edit(
    arr_val: &Vec<String>,
    profit_log: VecTruckProfitLog,
    truck_index: usize,
    km: &str,
) -> Option<Vec<String>> {
    let mut arr_val_clone: Vec<String> = arr_val.clone();

    let set_truck_km_vec = match get_truck_km(&arr_val, km, truck_index) {
        Some(set_truck_km) => set_truck_km,
        None => return None,
    };

    for item in set_truck_km_vec.iter() {
        arr_val_clone[item.index] = item.value.to_string();
    }

    let set_truck_km_profit_vec = match get_truck_km_profit(&arr_val, km, profit_log.index) {
        Some(set_truck_km_profit_vec) => set_truck_km_profit_vec,
        None => return None,
    };

    for item in set_truck_km_profit_vec.iter() {
        arr_val_clone[item.index] = item.value.to_string();
    }

    return Some(arr_val_clone);
}

pub fn get_truck_brand_models_ets2(brand: &str) -> Option<Vec<Models>> {
    let truck_brands: TruckBrandsETS2 = match get_trucks_data_ets2() {
        Some(truck_brands) => truck_brands,
        None => return None,
    };

    match brand {
        "mercedes" => return Some(truck_brands.mercedes.clone()),
        "daf" => return Some(truck_brands.daf.clone()),
        "man" => return Some(truck_brands.man.clone()),
        "renault" => return Some(truck_brands.renault.clone()),
        "scania" => return Some(truck_brands.scania.clone()),
        "volvo" => return Some(truck_brands.volvo.clone()),
        "iveco" => return Some(truck_brands.iveco.clone()),
        _ => return None,
    }
}

pub fn get_truck_brands_models_ats(brand: &str) -> Option<Vec<Models>> {
    let truck_brands: TruckBrandsATS = match get_trucks_data_ats() {
        Some(truck_brands) => truck_brands,
        None => return None,
    };

    match brand {
        "kenworth" => return Some(truck_brands.kenworth.clone()),
        "freightliner" => return Some(truck_brands.freightliner.clone()),
        "volvo" => return Some(truck_brands.volvo.clone()),
        "westernstar" => return Some(truck_brands.westernstar.clone()),
        "peterbilt" => return Some(truck_brands.peterbilt.clone()),
        "intnational" => return Some(truck_brands.intnational.clone()),
        "mack" => return Some(truck_brands.mack.clone()),
        _ => return None,
    }
}
