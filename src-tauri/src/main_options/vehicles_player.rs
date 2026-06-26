use crate::structs::vec_items_find::VecItemsFind;

pub fn get_assigned_vehicles_player(arr_val: &Vec<String>) -> Option<VecItemsFind> {
    let mut result: String = String::new();
    let mut index_result: usize = 0;

    for (i, item) in arr_val.iter().enumerate() {
        if item.contains(" assigned_vehicles:") {
            let option_values: Vec<&str> = item.split(':').collect();
            let id = option_values[1].to_string();

            if id.contains(" null") {
                return None;
            }

            index_result = i;
            result = id;
            break;
        }
    }

    if !result.is_empty() {
        return Some(VecItemsFind {
            index: index_result,
            value: result,
        });
    }
    return None;
}

pub fn get_player_vehicles_index(
    arr_val: &Vec<String>,
    player_vehicles_id: &String,
    index: usize,
) -> Option<usize> {
    for (i, item) in arr_val.iter().enumerate().skip(index + 1) {
        if item.contains(player_vehicles_id) {
            return Some(i);
        }
    }

    return None;
}

pub fn get_vehicle_id_from_player_vehicles(
    arr_val: &Vec<String>,
    index: usize,
) -> Option<VecItemsFind> {
    for (i, item) in arr_val.iter().enumerate().skip(index) {
        if item.contains(" vehicle") {
            if item.contains("null") {
                return None;
            }
            let option_values: Vec<&str> = item.split(':').collect();

            return Some(VecItemsFind {
                index: i,
                value: option_values[1].to_string(),
            });
        }

        if item == "}" {
            return None;
        }
    }

    return None;
}

pub fn get_trailer_id_from_player_vehicles(
    arr_val: &Vec<String>,
    index: usize,
) -> Option<VecItemsFind> {
    for (i, item) in arr_val.iter().enumerate().skip(index) {
        if item.contains(" trailer") {
            if item.contains("null") {
                return None;
            }
            let option_values: Vec<&str> = item.split(':').collect();

            return Some(VecItemsFind {
                index: i,
                value: option_values[1].to_string(),
            });
        }

        if item == "}" {
            return None;
        }
    }

    return None;
}
