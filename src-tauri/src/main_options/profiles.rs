use crate::structs::vec_items_find::{VecItemsFind, VecItemsFindGarages};

const GARAGE_STATUS_2: [&str; 10] = [
    " vehicles: 3",
    " vehicles[0]: null",
    " vehicles[1]: null",
    " vehicles[2]: null",
    " drivers: 5",
    " drivers[0]: null",
    " drivers[1]: null",
    " drivers[2]: null",
    " drivers[3]: null",
    " drivers[4]: null",
];

const GARAGE_STATUS_3: [&str; 12] = [
    " vehicles: 5",
    " vehicles[0]: null",
    " vehicles[1]: null",
    " vehicles[2]: null",
    " vehicles[3]: null",
    " vehicles[4]: null",
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

fn get_number_vehicle(arr_val: &Vec<String>, garage_index: usize) -> Option<String> {
    for item in arr_val.iter().skip(garage_index) {
        if item.contains(" vehicles:") {
            let split_item: Vec<&str> = item.split(":").collect();
            return Some(split_item[1].to_string().replace(" ", ""));
        }

        if item.contains("}") {
            break;
        }
    }

    return None;
}

fn set_garage_status(
    arr_val: &Vec<String>,
    garage_index: usize,
    status: &str,
) -> Option<VecItemsFindGarages> {
    if check_garage_vehicle_exists(arr_val, garage_index) {
        return None;
    }
    if check_garage_drivers_exists(arr_val, garage_index) {
        return None;
    }

    let number_vehicle = match get_number_vehicle(arr_val, garage_index) {
        Some(val) => val,
        None => return None,
    };

    for (i, item) in arr_val.iter().enumerate().skip(garage_index) {
        if item.contains(" status:") {
            return Some(VecItemsFindGarages {
                index: i,
                value: format!(" status: {}", status),
                veicle_number: number_vehicle,
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
    let mut arr_val = arr_val.clone();

    let list_garage = match get_garage_vec_names(&arr_val) {
        Some(val) => val,
        None => return None,
    };

    let mut index_sum: usize = 0;

    for item in list_garage {
        let garage_index = item.index + index_sum;
        let mut replace_index: bool = false;
        let mut replace_index_value: usize = 0;

        let garage_status = match set_garage_status(&arr_val, garage_index, status) {
            Some(val) => val,
            None => continue,
        };

        if garage_status.veicle_number.contains("0") {
            let items_to_insert = match status {
                "2" => {
                    replace_index = true;
                    index_sum += 10;
                    replace_index_value += 10;
                    GARAGE_STATUS_2
                        .iter()
                        .map(|x| x.to_string())
                        .collect::<Vec<String>>()
                }
                "3" => {
                    replace_index = true;
                    index_sum += 12;
                    replace_index_value += 12;
                    GARAGE_STATUS_3
                        .iter()
                        .map(|x| x.to_string())
                        .collect::<Vec<String>>()
                }
                _ => Vec::new(),
            };

            if !items_to_insert.is_empty() {
                arr_val.splice(garage_index..garage_index, items_to_insert.into_iter());
            }
        }

        if replace_index {
            arr_val[garage_status.index + replace_index_value] = garage_status.value;
            continue;
        }
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
