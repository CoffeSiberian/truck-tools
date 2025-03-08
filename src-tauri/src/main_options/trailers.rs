use super::accessories::{get_accessories_data_path, get_list_trucks_accessories_id};
use super::license_plate::get_license_plate_formated;
use super::trucks::get_model_name_data_path;

use crate::structs::vec_items_find::VecItemsFind;
use crate::structs::vec_trailers::{VecSaveTrailers, VecTrailersId, VecTrailersNoSlaveId};

const COUNTRY_VALIDITY: &str = " country_validity: 0";
const COUNTRY_VALIDITY_NULL: &str = " source_name: null";

fn get_vec_trailers(
    arr_val: &Vec<String>,
    trailer_index_base: Option<usize>,
) -> Option<Vec<VecItemsFind>> {
    let max_counter: u16 = 20;
    let mut counter: u16 = 0;
    let mut result: Vec<VecItemsFind> = Vec::new();
    let mut current_slave_trailer_index: usize;

    match trailer_index_base {
        Some(trailer_index_base) => current_slave_trailer_index = trailer_index_base,
        None => {
            let (trailer_id, index): (String, usize) = match get_my_trailer_id(&arr_val) {
                Some((trailer_id, index)) => (trailer_id, index),
                None => return None,
            };

            match get_trailer_index(arr_val, &trailer_id, &index) {
                Some(index) => current_slave_trailer_index = index,
                None => return None,
            };
            result.push(VecItemsFind {
                index: current_slave_trailer_index,
                value: trailer_id,
            });
        }
    }

    loop {
        counter += 1;
        if counter >= max_counter {
            break;
        }

        let (slave_trailer_id, index_slave): (String, usize) =
            match get_slave_trailers_id(&arr_val, current_slave_trailer_index) {
                Some((slave_trailer_id, index)) => (slave_trailer_id, index),
                None => break,
            };

        let slave_trailer_index: usize =
            match get_trailer_index(arr_val, &slave_trailer_id, &index_slave) {
                Some(slave_trailer_index) => slave_trailer_index,
                None => break,
            };

        current_slave_trailer_index = slave_trailer_index;
        result.push(VecItemsFind {
            index: slave_trailer_index,
            value: slave_trailer_id,
        });
    }

    if !result.is_empty() {
        return Some(result);
    }
    return None;
}

fn get_list_trailers_id(arr_val: &Vec<String>) -> Option<Vec<VecTrailersId>> {
    let mut result: Vec<VecTrailersId> = Vec::new();
    let mut trailer_enum: u16 = 0;
    let mut trailer_string_find: String = format!(" trailers[{}]", trailer_enum);

    for (i, item) in arr_val.iter().enumerate() {
        if item.contains(&trailer_string_find) {
            let option_values: Vec<&str> = item.split(':').collect();

            let truck_index = match get_trailer_index(arr_val, &option_values[1].to_string(), &i) {
                Some(truck_index) => truck_index,
                None => {
                    trailer_enum += 1;
                    trailer_string_find = format!(" trailers[{}]", trailer_enum);
                    continue;
                }
            };

            let slave_trailers = get_vec_trailers(arr_val, Some(truck_index));

            if slave_trailers.is_none() {
                result.push(VecTrailersId { index: truck_index });
            } else {
                let unwrapped_slave_trailers = slave_trailers.unwrap();
                result.push(VecTrailersId { index: truck_index });

                for item in unwrapped_slave_trailers.iter() {
                    result.push(VecTrailersId { index: item.index });
                }
            }

            trailer_enum += 1;
            trailer_string_find = format!(" trailers[{}]", trailer_enum);
        }

        if trailer_enum > 0 && item == "}" {
            break;
        }
    }

    if !result.is_empty() {
        return Some(result);
    }
    return None;
}

fn get_list_trailers_no_slave_id(arr_val: &Vec<String>) -> Option<Vec<VecTrailersNoSlaveId>> {
    let mut result: Vec<VecTrailersNoSlaveId> = Vec::new();
    let mut trailer_enum: u16 = 0;
    let mut trailer_string_find: String = format!(" trailers[{}]", trailer_enum);
    let mut player_found: bool = false;

    for (i, item) in arr_val.iter().enumerate() {
        if !player_found && item.contains("player :") {
            player_found = true;
        }

        if item.contains(&trailer_string_find) {
            let option_values: Vec<&str> = item.split(':').collect();
            let id = option_values[1].to_string();

            let trailer_index = match get_trailer_index(arr_val, &id, &i) {
                Some(truck_index) => truck_index,
                None => {
                    trailer_enum += 1;
                    trailer_string_find = format!(" trailers[{}]", trailer_enum);
                    continue;
                }
            };

            result.push(VecTrailersNoSlaveId {
                id,
                trailer_number: trailer_enum,
                index: trailer_index,
            });
            trailer_enum += 1;
            trailer_string_find = format!(" trailers[{}]", trailer_enum);
        }

        if player_found && item == "}" {
            break;
        }
    }

    if !result.is_empty() {
        return Some(result);
    }
    return None;
}

fn get_vec_license_plate_edit(
    arr_val: &Vec<String>,
    index: usize,
    bg_plate_color: &str,
    text_plate_color: &str,
    license_plate: &str,
    color_margin: bool,
) -> Option<VecItemsFind> {
    let value: String = get_license_plate_formated(
        bg_plate_color,
        text_plate_color,
        license_plate,
        color_margin,
    );
    let value_put: String = format!(" license_plate: \"{}\"", value);

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        if item.contains(" license_plate:") {
            return Some(VecItemsFind {
                index: i,
                value: value_put,
            });
        }

        if item == "}" {
            return None;
        }
    }

    return None;
}

fn get_trailer_wear(arr_val: &Vec<String>, wear: &str, index: usize) -> Option<Vec<VecItemsFind>> {
    let mut result: Vec<VecItemsFind> = Vec::new();

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        let option_values: Vec<&str> = item.split(':').collect();

        match option_values[0] {
            "}" => break,
            " trailer_body_wear" => {
                result.push(VecItemsFind {
                    index: i,
                    value: format!(" trailer_body_wear: {}", wear),
                });
            }
            " trailer_body_wear_unfixable" => {
                result.push(VecItemsFind {
                    index: i,
                    value: format!(" trailer_body_wear_unfixable: {}", wear),
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

fn get_trailer_wear_wheels(
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

pub fn get_slave_trailers_id(arr_val: &Vec<String>, index: usize) -> Option<(String, usize)> {
    for (i, item) in arr_val.iter().enumerate().skip(index) {
        if item.contains(" slave_trailer:") {
            if item.contains(" null") {
                return None;
            }
            let option_values: Vec<&str> = item.split(':').collect();
            return Some((option_values[1].to_string(), i));
        }

        if item == "}" {
            return None;
        }
    }

    return None;
}

pub fn get_trailer_index(
    arr_val: &Vec<String>,
    trailer_id: &String,
    index: &usize,
) -> Option<usize> {
    let value_find: String = format!("{} {}", trailer_id, "{");

    for (i, item) in arr_val.iter().enumerate().skip(*index) {
        if item.contains(value_find.as_str()) {
            return Some(i);
        }
    }

    return None;
}

pub fn get_trailer_def_id(arr_val: &Vec<String>, index: usize) -> Option<String> {
    for item in arr_val.iter().skip(index) {
        if item.contains(" trailer_definition:") {
            if item.contains(" null") {
                return None;
            }
            let option_values: Vec<&str> = item.split(':').collect();
            return Some(option_values[1].to_string());
        }
    }

    return None;
}

pub fn get_trailer_def_index(arr_val: &Vec<String>, trailer_def_id: String) -> Option<usize> {
    let value_find: String = format!("{} {}", trailer_def_id, "{");

    for (i, item) in arr_val.iter().enumerate() {
        if item.contains(value_find.as_str()) {
            return Some(i);
        }
    }

    return None;
}

pub fn get_my_trailer_id(arr_val: &Vec<String>) -> Option<(String, usize)> {
    for (i, item) in arr_val.iter().enumerate() {
        if item.contains(" assigned_trailer:") {
            if item.contains(" null") {
                return None;
            }
            let option_values: Vec<&str> = item.split(':').collect();
            return Some((option_values[1].to_string(), i));
        }
    }

    return None;
}

pub fn get_trailer_model_name(arr_val: &Vec<String>, index: usize) -> Option<String> {
    let accessories = match get_list_trucks_accessories_id(&arr_val, index) {
        Some(accessories) => accessories,
        None => return None,
    };

    for item in accessories.iter() {
        let data_path: VecItemsFind = match get_accessories_data_path(&arr_val, item.index) {
            Some(data_path) => data_path,
            None => continue,
        };

        let value_filter = data_path.value.replace('"', "");

        if value_filter.contains("data.sii") {
            match get_model_name_data_path(value_filter) {
                Some(model_name) => return Some(model_name),
                None => continue,
            };
        }
    }

    return None;
}

pub fn get_trailer_to_list_info(
    arr_varl: &Vec<String>,
    trailer_info: &VecTrailersNoSlaveId,
    index: usize,
) -> Option<VecSaveTrailers> {
    let truck_index = match get_trailer_index(&arr_varl, &trailer_info.id, &index) {
        Some(truck_id) => truck_id,
        None => return None,
    };

    let model_name = match get_trailer_model_name(&arr_varl, truck_index) {
        Some(model_name) => model_name,
        None => return None,
    };

    return Some(VecSaveTrailers {
        trailer_id: trailer_info.id.to_string().replace(" ", ""),
        trailer_number: trailer_info.trailer_number,
        brand_name: model_name,
    });
}

pub fn get_list_trailers_info(arr_val: &Vec<String>) -> Option<Vec<VecSaveTrailers>> {
    let mut result: Vec<VecSaveTrailers> = Vec::new();

    let trailers_index = match get_list_trailers_no_slave_id(&arr_val) {
        Some(trailers_index) => trailers_index,
        None => return None,
    };

    for item in trailers_index.iter() {
        match get_trailer_to_list_info(&arr_val, item, item.index) {
            Some(trailer_info) => result.push(trailer_info),
            None => continue,
        };
    }

    return Some(result);
}

pub fn set_cargo_mass_trailer(
    arr_val: &Vec<String>,
    index: usize,
    cargo_mass: &str,
) -> Option<Vec<VecItemsFind>> {
    let value_find: String = format!(" cargo_mass: {}", cargo_mass);
    let mut result: Vec<VecItemsFind> = Vec::new();

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        if item.contains(" cargo_mass:") {
            result.push(VecItemsFind {
                index: i,
                value: value_find.to_string(),
            });
            break;
        } else if item == "}" {
            break;
        }
    }

    if result.is_empty() {
        return None;
    }

    return Some(result);
}

pub fn set_chassis_and_body_mass_def_trailers(
    arr_val: &Vec<String>,
    index: usize,
    body_mass: &str,
    chassis_mass: &str,
) -> Option<Vec<String>> {
    let value_find_chassis: String = format!(" chassis_mass: {}", chassis_mass);
    let value_find_body: String = format!(" body_mass: {}", body_mass);
    let mut arr_val_clone: Vec<String> = arr_val.clone();

    let mut chassis_index: usize = 0;
    let mut body_index: usize = 0;
    for (i, item) in arr_val_clone.iter().enumerate().skip(index) {
        if chassis_index == 0 && item.contains(" chassis_mass:") {
            chassis_index = i;
            continue;
        }

        if body_index == 0 && item.contains(" body_mass:") {
            body_index = i;
            continue;
        }

        if chassis_index != 0 && body_index != 0 {
            break;
        }

        if item == "}" {
            break;
        }
    }

    if chassis_index == 0 || body_index == 0 {
        return None;
    }

    arr_val_clone[chassis_index] = value_find_chassis;
    arr_val_clone[body_index] = value_find_body;

    return Some(arr_val_clone);
}

pub fn set_remove_trailer_restricted_areas(
    arr_val: &Vec<String>,
    index: usize,
) -> Option<Vec<String>> {
    let mut arr_val_clone: Vec<String> = arr_val.clone();

    let mut index_start: usize = 0;
    let mut index_end: usize = 0;
    let mut index_source_name: usize = 0;

    for (i, item) in arr_val_clone.iter().enumerate().skip(index) {
        if index_start == 0 && item.contains(" country_validity:") {
            index_start = i;
        }

        if item.contains(" country_validity[") {
            index_end = i;
        }

        if item.contains(" source_name:") {
            index_source_name = i;
        }

        if item == "}" {
            break;
        }
    }

    if index_start == 0 || index_end == 0 || index_source_name == 0 {
        return None;
    }

    arr_val_clone[index_source_name] = COUNTRY_VALIDITY_NULL.to_string();
    arr_val_clone.drain(index_start..index_end + 1);
    arr_val_clone[index_start] = COUNTRY_VALIDITY.to_string();

    return Some(arr_val_clone);
}

pub fn set_any_slave_trailers_weight(
    arr_val: &Vec<String>,
    cargo_mass: &str,
) -> Option<Vec<String>> {
    let mut arr_val_clone: Vec<String> = arr_val.clone();

    let list_trailes_id = match get_vec_trailers(&arr_val_clone, None) {
        Some(list_trailes_id) => list_trailes_id,
        None => return None,
    };

    let mut cargo_mass_to_edit: Vec<VecItemsFind> = Vec::new();
    for item in list_trailes_id.iter() {
        match set_cargo_mass_trailer(&arr_val_clone, item.index, cargo_mass) {
            Some(cargo_mass_edit) => cargo_mass_to_edit.extend(cargo_mass_edit),
            None => (),
        };
    }

    if cargo_mass_to_edit.is_empty() {
        return None;
    }

    for item in cargo_mass_to_edit.iter() {
        arr_val_clone[item.index] = item.value.to_string();
    }

    return Some(arr_val_clone);
}

pub fn set_trailer_license_plate(
    arr_val: &Vec<String>,
    license_plate: &str,
    bg_plate_color: &str,
    text_plate_color: &str,
    color_margin: bool,
) -> Option<Vec<String>> {
    let mut arr_val_clone: Vec<String> = arr_val.clone();
    let get_trailers: Vec<VecItemsFind> = match get_vec_trailers(&arr_val, None) {
        Some(get_trailers) => get_trailers,
        None => return None,
    };
    let mut license_plate_to_edit: Vec<VecItemsFind> = Vec::new();

    for item in get_trailers.iter() {
        let license_plate_edit: VecItemsFind = match get_vec_license_plate_edit(
            &arr_val_clone,
            item.index,
            bg_plate_color,
            text_plate_color,
            license_plate,
            color_margin,
        ) {
            Some(license_plate_edit) => license_plate_edit,
            None => break,
        };
        license_plate_to_edit.push(license_plate_edit);
    }

    for item in license_plate_to_edit.iter() {
        arr_val_clone[item.index] = item.value.to_string();
    }

    return Some(arr_val_clone);
}

pub fn set_trailer_wear(arr_val: &Vec<String>, wear: &str) -> Option<Vec<String>> {
    let mut arr_val_clone: Vec<String> = arr_val.clone();

    let get_trailers: Vec<VecItemsFind> = match get_vec_trailers(&arr_val, None) {
        Some(get_trailers) => get_trailers,
        None => return None,
    };
    let mut wear_to_edit: Vec<VecItemsFind> = Vec::new();

    for item in get_trailers.iter() {
        match get_trailer_wear(&arr_val_clone, wear, item.index) {
            Some(wear_edit) => wear_to_edit.extend(wear_edit),
            None => (),
        };

        match get_trailer_wear_wheels(&arr_val_clone, wear, item.index) {
            Some(wear_edit) => wear_to_edit.extend(wear_edit),
            None => (),
        };
    }

    if wear_to_edit.is_empty() {
        return None;
    }

    for item in wear_to_edit.iter() {
        arr_val_clone[item.index] = item.value.to_string();
    }

    return Some(arr_val_clone);
}

pub fn set_any_trailers_wear(arr_val: &Vec<String>, wear: &str) -> Option<Vec<String>> {
    let mut arr_val_clone: Vec<String> = arr_val.clone();

    let get_trailers: Vec<VecTrailersId> = match get_list_trailers_id(&arr_val_clone) {
        Some(get_trailers) => get_trailers,
        None => return None,
    };
    let mut wear_to_edit: Vec<VecItemsFind> = Vec::new();

    for item in get_trailers.iter() {
        match get_trailer_wear(&arr_val_clone, wear, item.index) {
            Some(wear_edit) => wear_to_edit.extend(wear_edit),
            None => (),
        };

        match get_trailer_wear_wheels(&arr_val_clone, wear, item.index) {
            Some(wear_edit) => wear_to_edit.extend(wear_edit),
            None => (),
        };
    }

    if wear_to_edit.is_empty() {
        return None;
    }

    for item in wear_to_edit.iter() {
        arr_val_clone[item.index] = item.value.to_string();
    }

    return Some(arr_val_clone);
}
