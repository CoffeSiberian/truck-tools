use crate::structs::accessories_strucs::Accessories;
use crate::structs::vec_items_find::VecItemsFind;

fn get_accessorie_index(
    arr_val: &Vec<String>,
    accessory_id: &str,
    index_end_block: usize,
) -> Option<usize> {
    let value_find: String = format!("{} {}", accessory_id, "{");

    for (i, item) in arr_val.iter().enumerate().skip(index_end_block) {
        if item.contains(&value_find) {
            return Some(i);
        }
    }

    return None;
}

pub fn remove_accessorie(
    arr_val: &Vec<String>,
    accessory_id: &String,
    accessories: &Vec<Accessories>,
    index_end_block: usize,
) -> Option<Vec<String>> {
    let accessorie_index = match get_accessorie_index(arr_val, accessory_id, index_end_block) {
        Some(accessorie_index) => accessorie_index,
        None => return None,
    };
    let mut arr_val_clone: Vec<String> = arr_val.clone();
    let mut end_block_accessorie_index: usize = 0;

    // Remove accessories block
    for (i, item) in arr_val_clone.iter().enumerate().skip(accessorie_index) {
        if item == "}" {
            end_block_accessorie_index = i;
            break;
        }
    }

    let firts_accessorie_total_index: usize = match accessories.first() {
        Some(firts_accessorie) => firts_accessorie.index_accessorie_in_array - 1,
        None => return None,
    };
    let last_accessorie_index: usize = match accessories.last() {
        Some(last_accessorie) => last_accessorie.index_accessorie_in_array,
        None => return None,
    };

    arr_val_clone.drain(accessorie_index..=end_block_accessorie_index + 1);
    arr_val_clone.drain(firts_accessorie_total_index..=last_accessorie_index);

    // Update accessories number
    let mut new_accessories: Vec<String> = Vec::new();
    let mut accessories_enum: u16 = 0;
    for item in accessories.iter() {
        let new_value: String = format!(" accessories[{}]: {}", accessories_enum, item.id);

        if accessory_id.clone() == item.id {
            continue;
        }

        accessories_enum += 1;
        new_accessories.push(new_value);
    }

    new_accessories.insert(0, format!(" accessories: {}", accessories_enum));
    arr_val_clone.splice(
        firts_accessorie_total_index..firts_accessorie_total_index,
        new_accessories,
    );

    return Some(arr_val_clone);
}

pub fn get_accessories_data_path(arr_val: &Vec<String>, index: usize) -> Option<VecItemsFind> {
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

pub fn get_list_trucks_accessories_id(
    arr_val: &Vec<String>,
    index_end_block: usize,
) -> Option<Vec<Accessories>> {
    let mut result: Vec<Accessories> = Vec::new();
    let mut accessories_enum: u16 = 0;
    let mut truck_accessories_find: String = format!(" accessories[{}]", accessories_enum);

    for (i, item) in arr_val.iter().enumerate().skip(index_end_block) {
        if item.contains(&truck_accessories_find) {
            let option_values: Vec<&str> = item.split(':').collect();

            let truck_accessories_index = match get_accessorie_index(arr_val, option_values[1], i) {
                Some(truck_accessories_index) => truck_accessories_index,
                None => continue,
            };

            result.push(Accessories {
                index_accessorie_in_array: i,
                index: truck_accessories_index,
                number: accessories_enum,
                id: option_values[1].trim().to_string(),
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
