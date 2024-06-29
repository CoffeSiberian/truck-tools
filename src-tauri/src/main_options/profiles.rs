use crate::structs::vec_items_find::VecItemsFind;
use crate::structs::vec_items_replace::{VecGaragesReplace, VecItemsReplace};

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

        if item.contains("}") {
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

        if item.contains("}") {
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

        if item.contains("}") {
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

        if item.contains("}") {
            break;
        }
    }

    if first_index == 0 || first_index == 0 {
        return None;
    }
    return Some((first_index, last_index));
}

fn add_vehicles_and_drivers_garage(garage_index: usize, status: &str) -> Option<VecGaragesReplace> {
    let mut vec_items_vehicles: Vec<VecItemsReplace> = Vec::new();
    let mut vec_items_drivers: Vec<VecItemsReplace> = Vec::new();

    if status == "2" {
        for item in GARAGE_STATUS_VEHICLES_2.iter() {
            vec_items_vehicles.push(VecItemsReplace {
                index: garage_index,
                value: item.to_string(),
                to_delete: false,
            });
        }

        for item in GARAGE_STATUS_DRIVERS_2.iter() {
            vec_items_drivers.push(VecItemsReplace {
                index: garage_index,
                value: item.to_string(),
                to_delete: false,
            });
        }
    } else if status == "3" {
        for item in GARAGE_STATUS_VEHICLES_3.iter() {
            vec_items_vehicles.push(VecItemsReplace {
                index: garage_index,
                value: item.to_string(),
                to_delete: false,
            });
        }

        for item in GARAGE_STATUS_DRIVERS_3.iter() {
            vec_items_drivers.push(VecItemsReplace {
                index: garage_index,
                value: item.to_string(),
                to_delete: false,
            });
        }
    } else if status == "6" {
        for item in GARAGE_STATUS_VEHICLES_6.iter() {
            vec_items_vehicles.push(VecItemsReplace {
                index: garage_index,
                value: item.to_string(),
                to_delete: false,
            });
        }

        for item in GARAGE_STATUS_DRIVERS_6.iter() {
            vec_items_drivers.push(VecItemsReplace {
                index: garage_index,
                value: item.to_string(),
                to_delete: false,
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

        if item.contains("}") {
            break;
        }
    }

    return None;
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
    let mut arr_val = arr_val.clone();

    let list_garage = match get_garage_vec_names(&arr_val) {
        Some(val) => val,
        None => return None,
    };

    for item in list_garage.iter().rev() {
        let garage_index = item.index;

        if !is_editable_garage(&arr_val, garage_index) {
            continue;
        }

        if status == "1" {
            let garage_status = match set_garage_status(&arr_val, garage_index, status) {
                Some(val) => val,
                None => continue,
            };

            arr_val[garage_status.index] = garage_status.value;
            continue;
        }

        match delete_vehicles_and_drivers_garage_range(&arr_val, garage_index) {
            Some(val) => {
                let index_vehicle_number = val.0;
                let index_driver_number = val.1;

                arr_val.drain(index_vehicle_number..index_driver_number + 1);
            }
            None => continue,
        };

        let items_add_vehicles_and_drivers =
            match add_vehicles_and_drivers_garage(garage_index, status) {
                Some(val) => val,
                None => continue,
            };

        let garage_status = match set_garage_status(&arr_val, garage_index, status) {
            Some(val) => val,
            None => continue,
        };

        arr_val[garage_status.index] = garage_status.value;
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

        arr_val.splice(
            garage_index_to_splice..garage_index_to_splice,
            vehicles_and_drivers.into_iter(),
        );
    }

    return Some(arr_val);
}

pub fn set_bank_money(arr_val: &Vec<String>, money: &str) -> Option<Vec<String>> {
    let bank_id = match get_bank_id(arr_val) {
        Some(val) => val,
        None => return None,
    };
    let mut arr_val = arr_val.clone();

    for (i, item) in arr_val.iter().enumerate().skip(bank_id.index) {
        let split_item: Vec<&str> = item.split(":").collect();

        if split_item[0] == " money_account" {
            arr_val[i] = format!(" money_account: {}", money);
            break;
        }
    }

    return Some(arr_val);
}

pub fn set_experience(arr_val: &Vec<String>, experience: &str) -> Option<Vec<String>> {
    let mut arr_val = arr_val.clone();

    for (i, item) in arr_val.iter().enumerate() {
        if item.contains(" experience_points:") {
            arr_val[i] = format!(" experience_points: {}", experience);
            break;
        }
    }

    return Some(arr_val);
}
