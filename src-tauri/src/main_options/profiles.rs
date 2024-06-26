use crate::structs::vec_items_find::VecItemsFind;
use crate::structs::vec_items_replace::VecItemsReplace;

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
    let mut vehicle_count: u16 = 0;
    let mut vehicle_string_find = format!(" vehicles[{}]", vehicle_count);

    for item in arr_val.iter().skip(index) {
        if item.contains(&vehicle_string_find) {
            if !item.contains(" null") {
                return true;
            }
            vehicle_count += 1;
            vehicle_string_find = format!(" vehicles[{}]", vehicle_count);
        }

        if item.contains("}") {
            break;
        }
    }

    return false;
}

fn check_garage_drivers_exists(arr_val: &Vec<String>, index: usize) -> bool {
    let mut driver_count: u16 = 0;
    let mut driver_string_find = format!(" drivers[{}]", driver_count);

    for item in arr_val.iter().skip(index) {
        if item.contains(&driver_string_find) {
            if !item.contains(" null") {
                println!("{}", item);
                return true;
            }
            driver_count += 1;
            driver_string_find = format!(" drivers[{}]:", driver_count);
        }

        if item.contains("}") {
            break;
        }
    }

    return false;
}

fn set_garage_status(
    arr_val: &Vec<String>,
    garage_index: usize,
    status: &str,
) -> Option<VecItemsReplace> {
    if check_garage_vehicle_exists(arr_val, garage_index) {
        return None;
    }
    if check_garage_drivers_exists(arr_val, garage_index) {
        return None;
    }

    for (i, item) in arr_val.iter().enumerate().skip(garage_index) {
        if item.contains(" status:") {
            return Some(VecItemsReplace {
                index: i,
                value: format!(" status: {}", status),
                to_delete: false,
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
            index: index_element,
            value: item.to_string(),
        });
    }

    if garage_vec.len() == 0 {
        return None;
    }

    return Some(garage_vec);
}

pub fn set_any_status_garage(arr_val: &Vec<String>, status: &str) -> Option<Vec<String>> {
    let mut arr_val = arr_val.clone();

    let list_garage = match get_garage_vec_names(&arr_val) {
        Some(val) => val,
        None => return None,
    };

    for item in list_garage {
        let garage_index = item.index;

        let garage_status = match set_garage_status(&arr_val, garage_index, status) {
            Some(val) => val,
            None => continue,
        };

        arr_val[garage_status.index] = garage_status.value;
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
