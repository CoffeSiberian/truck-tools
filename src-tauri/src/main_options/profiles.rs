use crate::main_options::trucks::get_truck_id;
use crate::main_options::vehicles_player::get_player_vehicles_data_have_same_vehicle_id;
use crate::structs::experience_skills::ExperienceSkills;
use crate::structs::vec_items_find::VecItemsFind;
use crate::structs::vec_items_replace::{VecGaragesReplace, VecItemsReplace};
use crate::utils::file_edit::copy_single_file;
use std::collections::HashSet;
use std::path::Path;
use std::vec;

const GARAGE_STATUS_VEHICLES_6: [&str; 2] = [" vehicles: 1", " vehicles[0]: null"];

const GARAGE_STATUS_DRIVERS_6: [&str; 2] = [" drivers: 1", " drivers[0]: null"];

const GARAGE_STATUS_VEHICLES_2: [&str; 4] = [
    " vehicles: 3",
    " vehicles[0]: null",
    " vehicles[1]: null",
    " vehicles[2]: null",
];

const GARAGE_STATUS_DRIVERS_2: [&str; 4] = [
    " drivers: 3",
    " drivers[0]: null",
    " drivers[1]: null",
    " drivers[2]: null",
];

const GARAGE_STATUS_VEHICLES_3: [&str; 6] = [
    " vehicles: 5",
    " vehicles[0]: null",
    " vehicles[1]: null",
    " vehicles[2]: null",
    " vehicles[3]: null",
    " vehicles[4]: null",
];

const GARAGE_STATUS_DRIVERS_3: [&str; 6] = [
    " drivers: 5",
    " drivers[0]: null",
    " drivers[1]: null",
    " drivers[2]: null",
    " drivers[3]: null",
    " drivers[4]: null",
];

const CITIES_VISITED_FALSE: [&str; 2] = [" visited_cities: 0", " visited_cities_count: 0"];
const DEALER_DISCOVERED_FALSE: &str = " unlocked_dealers: 0";

const PROFILES_CONFIGS_FILES_NAMES: [&str; 3] = ["config.cfg", "config_local.cfg", "controls.sii"];
const ETS2_COMPANY_NAME_KEY: &str = "company_name";

fn get_bank_id(arr_val: &Vec<String>) -> Option<VecItemsFind> {
    let mut bank_id: Option<VecItemsFind> = None;

    for (i, item) in arr_val.iter().enumerate() {
        if item.contains("bank :") {
            let split_item: Vec<&str> = item.split(":").collect();

            bank_id = Some(VecItemsFind {
                index: i,
                value: split_item[1].to_string(),
            });
        }
    }

    return bank_id;
}

fn get_index_element_rev(arr_val: &Vec<String>, element: &String) -> Option<usize> {
    for (i, item) in arr_val.iter().enumerate().rev() {
        if item.contains(element) {
            return Some(i);
        }
    }

    return None;
}

fn get_number_from_binary_string(binary_string: &str) -> Option<String> {
    // The string needs to have the 6 bits
    // necessary for the transformation but must not be reversed.
    let bin_rev = binary_string.chars().rev().collect::<String>();

    let number = match isize::from_str_radix(&bin_rev, 2) {
        Ok(val) => val,
        Err(_) => return None,
    };

    return Some(number.to_string());
}

fn get_all_city_names(arr_val: &Vec<String>) -> HashSet<String> {
    let mut city_names: HashSet<String> = HashSet::new();

    for item in arr_val.iter() {
        if item.contains(" companies[") {
            let split_item: Vec<&str> = item.split(":").collect();
            let split_names: Vec<&str> = split_item[1].split(".").collect();
            city_names.insert(split_names[3].to_owned());
        } else if item.contains(" garages") {
            break;
        }
    }

    return city_names;
}

fn get_index_element(
    arr_val: &Vec<String>,
    element: &String,
    rev: bool,
    index: usize,
) -> Option<usize> {
    if rev {
        return get_index_element_rev(arr_val, element);
    }

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        if item.contains(element) {
            return Some(i);
        }
    }

    return None;
}

fn check_garage_vehicle_exists(arr_val: &Vec<String>, index: usize) -> bool {
    for item in arr_val.iter().skip(index) {
        if item.contains(" vehicles[") {
            if !item.contains(" null") {
                return true;
            }
        }

        if item == "}" {
            break;
        }
    }

    return false;
}

fn check_garage_drivers_exists(arr_val: &Vec<String>, index: usize) -> bool {
    for item in arr_val.iter().skip(index) {
        if item.contains(" drivers[") {
            if !item.contains(" null") {
                return true;
            }
        }

        if item == "}" {
            break;
        }
    }

    return false;
}

fn check_garage_trailers_exists(arr_val: &Vec<String>, index: usize) -> bool {
    for item in arr_val.iter().skip(index) {
        if item.contains(" trailers[") {
            if !item.contains(" null") {
                return true;
            }
        }

        if item == "}" {
            break;
        }
    }

    return false;
}

fn is_editable_garage(arr_val: &Vec<String>, garage_index: usize) -> bool {
    return !check_garage_vehicle_exists(arr_val, garage_index)
        && !check_garage_drivers_exists(arr_val, garage_index)
        && !check_garage_trailers_exists(arr_val, garage_index);
}

fn is_valid_status(status: &str) -> bool {
    return status == "1" || status == "2" || status == "3" || status == "6";
}

fn delete_vehicles_and_drivers_garage_range(
    arr_val: &Vec<String>,
    garage_index: usize,
) -> Option<(usize, usize)> {
    let mut first_index: usize = 0;
    let mut last_index: usize = 0;

    for (i, item) in arr_val.iter().enumerate().skip(garage_index) {
        if first_index == 0 && item.contains(" vehicles") {
            first_index = i;
            continue;
        }
        if item.contains(" drivers") {
            last_index = i;
            continue;
        }

        if item == "}" {
            break;
        }
    }

    if first_index == 0 || first_index == 0 {
        return None;
    }
    return Some((first_index, last_index));
}

fn delete_visited_cities(arr_val: &Vec<String>) -> Option<(usize, usize)> {
    let mut first_index: usize = 0;
    let mut last_index: usize = 0;

    for (i, item) in arr_val.iter().enumerate() {
        if first_index == 0 && item.starts_with(" visited_cities:") {
            first_index = i;
            continue;
        }

        if item.starts_with(" last_visited_city:") {
            last_index = i;
            break;
        }

        if item == "}" {
            break;
        }
    }

    if first_index == 0 || first_index == 0 {
        return None;
    }
    return Some((first_index, last_index));
}

fn delete_visited_dealership(arr_val: &Vec<String>) -> Option<(usize, usize)> {
    let mut first_index: usize = 0;
    let mut last_index: usize = 0;

    for (i, item) in arr_val.iter().enumerate() {
        if first_index == 0 && item.starts_with(" unlocked_dealers:") {
            first_index = i;
            continue;
        }

        if item.starts_with(" unlocked_recruitments:") {
            last_index = i;
            break;
        }

        if item == "}" {
            break;
        }
    }

    if first_index == 0 || first_index == 0 {
        return None;
    }
    return Some((first_index, last_index));
}

fn add_vehicles_and_drivers_garage(status: &str) -> Option<VecGaragesReplace> {
    let mut vec_items_vehicles: Vec<VecItemsReplace> = Vec::new();
    let mut vec_items_drivers: Vec<VecItemsReplace> = Vec::new();

    if status == "2" {
        for item in GARAGE_STATUS_VEHICLES_2.iter() {
            vec_items_vehicles.push(VecItemsReplace {
                value: item.to_string(),
            });
        }

        for item in GARAGE_STATUS_DRIVERS_2.iter() {
            vec_items_drivers.push(VecItemsReplace {
                value: item.to_string(),
            });
        }
    } else if status == "3" {
        for item in GARAGE_STATUS_VEHICLES_3.iter() {
            vec_items_vehicles.push(VecItemsReplace {
                value: item.to_string(),
            });
        }

        for item in GARAGE_STATUS_DRIVERS_3.iter() {
            vec_items_drivers.push(VecItemsReplace {
                value: item.to_string(),
            });
        }
    } else if status == "6" {
        for item in GARAGE_STATUS_VEHICLES_6.iter() {
            vec_items_vehicles.push(VecItemsReplace {
                value: item.to_string(),
            });
        }

        for item in GARAGE_STATUS_DRIVERS_6.iter() {
            vec_items_drivers.push(VecItemsReplace {
                value: item.to_string(),
            });
        }
    } else {
        return None;
    }

    return Some(VecGaragesReplace {
        veicles: vec_items_vehicles,
        drivers: vec_items_drivers,
    });
}

fn set_garage_status(
    arr_val: &Vec<String>,
    garage_index: usize,
    status: &str,
) -> Option<VecItemsFind> {
    if check_garage_vehicle_exists(arr_val, garage_index) {
        return None;
    }
    if check_garage_drivers_exists(arr_val, garage_index) {
        return None;
    }

    for (i, item) in arr_val.iter().enumerate().skip(garage_index) {
        if item.contains(" status:") {
            return Some(VecItemsFind {
                index: i,
                value: format!(" status: {}", status),
            });
        }

        if item == "}" {
            break;
        }
    }

    return None;
}

pub fn set_profile_name(arr_val: &Vec<String>, name: &str) -> Option<Vec<String>> {
    let mut arr_val_clone = arr_val.clone();

    for (i, item) in arr_val.iter().enumerate() {
        if item.contains(" profile_name:") {
            arr_val_clone[i] = format!(" profile_name: \"{}\"", name);
            break;
        }
    }

    return Some(arr_val_clone);
}

fn parse_quoted_sii_value(value: &str) -> Result<String, String> {
    let value = value.trim();

    if !value.starts_with('"') {
        return Err("company_name is not a quoted SII string".to_string());
    }

    let mut escaped = false;
    let mut result = String::new();
    let mut closing_quote_index: Option<usize> = None;

    for (index, ch) in value.char_indices().skip(1) {
        if escaped {
            result.push(ch);
            escaped = false;
            continue;
        }

        match ch {
            '\\' => escaped = true,
            '"' => {
                closing_quote_index = Some(index);
                break;
            }
            _ => result.push(ch),
        }
    }

    let closing_quote_index = match closing_quote_index {
        Some(index) => index,
        None => return Err("company_name has an unterminated quoted value".to_string()),
    };

    if escaped {
        return Err("company_name ends with an incomplete escape sequence".to_string());
    }

    if !value[closing_quote_index + 1..].trim().is_empty() {
        return Err("company_name has unexpected text after the quoted value".to_string());
    }

    return Ok(result);
}

fn get_company_name_line(arr_val: &Vec<String>) -> Result<(usize, String, String), String> {
    let mut result: Option<(usize, String, String)> = None;

    for (index, item) in arr_val.iter().enumerate() {
        let trimmed_start = item.trim_start();
        let indentation_len = item.len() - trimmed_start.len();

        if !trimmed_start.starts_with(ETS2_COMPANY_NAME_KEY) {
            continue;
        }

        let after_key = &trimmed_start[ETS2_COMPANY_NAME_KEY.len()..];
        if !after_key.starts_with(':') {
            continue;
        }

        if result.is_some() {
            return Err("profile.sii contains more than one company_name property".to_string());
        }

        result = Some((
            index,
            item[..indentation_len].to_string(),
            after_key[1..].to_string(),
        ));
    }

    match result {
        Some(result) => Ok(result),
        None => Err("profile.sii does not contain a company_name property".to_string()),
    }
}

pub fn get_company_name(arr_val: &Vec<String>) -> Result<String, String> {
    let (_, _, value) = get_company_name_line(arr_val)?;
    return parse_quoted_sii_value(&value);
}

fn validate_company_name(name: &str) -> Result<String, String> {
    let trimmed_name = name.trim();

    if trimmed_name.is_empty() {
        return Err("Company name cannot be empty".to_string());
    }

    if trimmed_name
        .chars()
        .any(|ch| ch == '\r' || ch == '\n' || ch == '\0')
    {
        return Err("Company name cannot contain line breaks or null characters".to_string());
    }

    // The verified local ETS2 profile values are simple quoted strings. Until the project has
    // broader SII string escaping examples, reject characters that would require serialization.
    if trimmed_name.chars().any(|ch| ch == '"' || ch == '\\') {
        return Err("Company name cannot contain quotes or backslashes".to_string());
    }

    return Ok(trimmed_name.to_string());
}

pub fn set_company_name(arr_val: &Vec<String>, name: &str) -> Result<Vec<String>, String> {
    let validated_name = validate_company_name(name)?;
    let (index, indentation, value) = get_company_name_line(arr_val)?;

    parse_quoted_sii_value(&value)?;

    let mut arr_val_clone = arr_val.clone();
    arr_val_clone[index] = format!(
        "{}{}: \"{}\"",
        indentation, ETS2_COMPANY_NAME_KEY, validated_name
    );

    return Ok(arr_val_clone);
}

pub fn get_garage_vec_names(arr_val: &Vec<String>) -> Option<Vec<VecItemsFind>> {
    let mut garage_vec_string: Vec<&str> = Vec::new();
    let mut garage_count: u16 = 0;
    let mut garage_string_find = format!(" garages[{}]", garage_count);

    for item in arr_val {
        if item.contains(&garage_string_find) {
            let split_item: Vec<&str> = item.split(":").collect();

            garage_vec_string.push(split_item[1]);

            garage_count += 1;
            garage_string_find = format!(" garages[{}]", garage_count);
        }

        if garage_count > 0 && !item.contains(" garages") {
            break;
        }
    }

    let mut last_index: usize = 0;
    let mut garage_rev_complete: bool = false;
    let mut garage_vec: Vec<VecItemsFind> = Vec::new();

    for item in garage_vec_string {
        let item_find = format!("garage :{} {}", item, "{");

        let index_element =
            match get_index_element(&arr_val, &item_find, !garage_rev_complete, last_index) {
                Some(val) => val,
                None => continue,
            };

        if !garage_rev_complete {
            garage_rev_complete = true;
        }

        last_index = index_element;

        garage_vec.push(VecItemsFind {
            index: last_index.clone(),
            value: item.to_string(),
        });
    }

    if garage_vec.len() == 0 {
        return None;
    }

    return Some(garage_vec);
}

pub fn set_any_status_garage(arr_val: &Vec<String>, status: &str) -> Option<Vec<String>> {
    if !is_valid_status(status) {
        return None;
    }
    let mut arr_val_clone = arr_val.clone();

    let list_garage = match get_garage_vec_names(&arr_val_clone) {
        Some(val) => val,
        None => return None,
    };

    for item in list_garage.iter().rev() {
        let garage_index = item.index;

        if !is_editable_garage(&arr_val_clone, garage_index) {
            continue;
        }

        if status == "1" {
            let garage_status = match set_garage_status(&arr_val_clone, garage_index, status) {
                Some(val) => val,
                None => continue,
            };

            arr_val_clone[garage_status.index] = garage_status.value;
            continue;
        }

        match delete_vehicles_and_drivers_garage_range(&arr_val_clone, garage_index) {
            Some(val) => {
                let index_vehicle_number = val.0;
                let index_driver_number = val.1;

                arr_val_clone.drain(index_vehicle_number..index_driver_number + 1);
            }
            None => continue,
        };

        let items_add_vehicles_and_drivers = match add_vehicles_and_drivers_garage(status) {
            Some(val) => val,
            None => continue,
        };

        let garage_status = match set_garage_status(&arr_val_clone, garage_index, status) {
            Some(val) => val,
            None => continue,
        };

        arr_val_clone[garage_status.index] = garage_status.value;
        let vehicles = items_add_vehicles_and_drivers
            .veicles
            .into_iter()
            .map(|x| x.value)
            .collect::<Vec<String>>();

        let drivers = items_add_vehicles_and_drivers
            .drivers
            .into_iter()
            .map(|x| x.value)
            .collect::<Vec<String>>();

        let garage_index_to_splice = garage_index + 1;
        let mut vehicles_and_drivers = vehicles.clone();
        vehicles_and_drivers.extend(drivers.clone());

        arr_val_clone.splice(
            garage_index_to_splice..garage_index_to_splice,
            vehicles_and_drivers.into_iter(),
        );
    }

    return Some(arr_val_clone);
}

pub fn set_bank_money(arr_val: &Vec<String>, money: &str) -> Option<Vec<String>> {
    let bank_id = match get_bank_id(arr_val) {
        Some(val) => val,
        None => return None,
    };
    let mut arr_val_clone = arr_val.clone();

    for (i, item) in arr_val_clone.iter().enumerate().skip(bank_id.index) {
        let split_item: Vec<&str> = item.split(":").collect();

        if split_item[0] == " money_account" {
            arr_val_clone[i] = format!(" money_account: {}", money);
            break;
        }
    }

    return Some(arr_val_clone);
}

pub fn set_experience(arr_val: &Vec<String>, experience: &str) -> Option<Vec<String>> {
    let mut arr_val_clone = arr_val.clone();

    for (i, item) in arr_val.iter().enumerate() {
        if item.contains(" experience_points:") {
            arr_val_clone[i] = format!(" experience_points: {}", experience);
            break;
        }
    }

    return Some(arr_val_clone);
}

pub fn set_visited_cities(arr_val: &Vec<String>, visited_cities: bool) -> Option<Vec<String>> {
    let mut arr_val_clone = arr_val.clone();
    let city_names = get_all_city_names(&arr_val_clone);

    let city_index_start: usize = match delete_visited_cities(&arr_val_clone) {
        Some((index_visited_cities_start, index_visited_cities_end)) => {
            arr_val_clone.drain(index_visited_cities_start..index_visited_cities_end);
            index_visited_cities_start
        }
        None => return None,
    };

    if !visited_cities {
        arr_val_clone.splice(
            city_index_start..city_index_start,
            CITIES_VISITED_FALSE.iter().map(|x| x.to_string()),
        );
        return Some(arr_val_clone);
    }

    let mut visited_cities_vec: Vec<String> =
        vec![format!(" visited_cities: {}", city_names.len())];

    let mut visited_cities_count_vec: Vec<String> =
        vec![format!(" visited_cities_count: {}", city_names.len())];

    let mut result_cities: Vec<String> = Vec::new();

    for (i, item) in city_names.iter().enumerate() {
        visited_cities_vec.push(format!(" visited_cities[{}]: {}", i, item));
        visited_cities_count_vec.push(format!(" visited_cities_count[{}]: 1", i));
    }

    result_cities.extend(visited_cities_vec);
    result_cities.extend(visited_cities_count_vec);

    arr_val_clone.splice(city_index_start..city_index_start, result_cities);

    return Some(arr_val_clone);
}

pub fn set_dealerships_discovered_status(
    arr_val: &Vec<String>,
    discovered: bool,
) -> Option<Vec<String>> {
    let mut arr_val_clone = arr_val.clone();
    let city_names = get_all_city_names(&arr_val_clone);

    let dealer_index_start: usize = match delete_visited_dealership(&arr_val_clone) {
        Some((index_dealer_start, index_dealer_end)) => {
            arr_val_clone.drain(index_dealer_start..index_dealer_end);
            index_dealer_start
        }
        None => return None,
    };

    if !discovered {
        arr_val_clone.insert(dealer_index_start, DEALER_DISCOVERED_FALSE.to_string());
        return Some(arr_val_clone);
    }

    let mut dealer_discovered: Vec<String> =
        vec![format!(" unlocked_dealers: {}", city_names.len())];

    for (i, item) in city_names.iter().enumerate() {
        dealer_discovered.push(format!(" unlocked_dealers[{}]: {}", i, item));
    }

    arr_val_clone.splice(dealer_index_start..dealer_index_start, dealer_discovered);

    return Some(arr_val_clone);
}

pub fn set_experience_skills(
    arr_val: &Vec<String>,
    experience_skills: ExperienceSkills,
) -> Option<Vec<String>> {
    let adr_number_string = match get_number_from_binary_string(&experience_skills.adr_number) {
        Some(val) => val,
        None => return None,
    };
    let mut arr_val_clone = arr_val.clone();

    for (i, item) in arr_val.iter().enumerate() {
        let split_item: Vec<&str> = item.split(":").collect();

        match split_item[0] {
            " adr" => {
                arr_val_clone[i] = format!(" adr: {}", adr_number_string);
            }
            " long_dist" => {
                arr_val_clone[i] = format!(" long_dist: {}", experience_skills.long_dist);
            }
            " heavy" => {
                arr_val_clone[i] = format!(" heavy: {}", experience_skills.heavy);
            }
            " fragile" => {
                arr_val_clone[i] = format!(" fragile: {}", experience_skills.fragile);
            }
            " urgent" => {
                arr_val_clone[i] = format!(" urgent: {}", experience_skills.urgent);
            }
            " mechanical" => {
                arr_val_clone[i] = format!(" mechanical: {}", experience_skills.mechanical);
            }
            " user_colors" => {
                break;
            }
            _ => continue,
        }
    }

    return Some(arr_val_clone);
}

pub async fn copy_profile_configs(dir_profile: &Path, dest_dir_profile: &Path) -> bool {
    for item in PROFILES_CONFIGS_FILES_NAMES.iter() {
        let file_path = dir_profile.join(item);
        let dest_file_path = dest_dir_profile.join(item);

        if !file_path.exists() {
            return false;
        }

        if !copy_single_file(&file_path, &dest_file_path).await {
            return false;
        }
    }

    return true;
}

pub fn set_player_map_position(
    arr_val: &Vec<String>,
    location: &str,
    rotation: &str,
) -> Option<Vec<VecItemsFind>> {
    let mut vec_items_replace: Vec<VecItemsFind> = Vec::new();

    let truck_id = match get_truck_id(&arr_val) {
        Some(truck_id) => truck_id,
        None => return None,
    };

    let vehicles_list_same_truck_id =
        match get_player_vehicles_data_have_same_vehicle_id(arr_val, &truck_id.id) {
            Some(vehicles_list_same_truck_id) => vehicles_list_same_truck_id,
            None => return None,
        };

    for item in vehicles_list_same_truck_id.iter() {
        vec_items_replace.push(VecItemsFind {
            index: item.stored_vehicle_placement_index,
            value: format!(" stored_vehicle_placement: {} {}", location, rotation),
        });

        if item.trailer_placements.len() > 1 {
            for (i, trailer_item) in item.trailer_placements.iter().enumerate() {
                if i == 0 {
                    continue;
                }
                vec_items_replace.push(VecItemsFind {
                    index: trailer_item.index,
                    value: format!(
                        " stored_trailer_placements[{}]: {} {}",
                        i - 1,
                        location,
                        rotation
                    ),
                });
            }

            vec_items_replace.push(VecItemsFind {
                index: item.stored_trailer_attached_index,
                value: format!(" stored_trailer_attached: true"),
            });
        }
    }

    if vec_items_replace.is_empty() {
        return None;
    }

    return Some(vec_items_replace);
}
