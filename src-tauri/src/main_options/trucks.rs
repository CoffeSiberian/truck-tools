pub fn get_truck_id(arr_val: &Vec<String>) -> Option<String> {
    let mut result: String = String::new();

    for (_i, item) in arr_val.iter().enumerate() {
        let option_values: Vec<&str> = item.split(':').collect();
        
        if option_values[0] == " assigned_truck" {
            if option_values[1] == " null" {
                break;
            }
            result.push_str(option_values[1]);
            break;
        }
    }

    if !result.is_empty() {
        return Some(result);
    } return None;
}

pub fn get_truck_vehicle_index(arr_val: &Vec<String>, truck_id: String) -> Option<usize> {
    let value_find: String = format!("{} {}", truck_id, "{");
    let mut result: String = String::new();

    for (i, item) in arr_val.iter().enumerate() {
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
    } return None;
}

pub fn set_truck_wear(arr_val: &Vec<String>, wear: &str, index: usize) -> Option<Vec<String>> {
    let mut arr_val_clone: Vec<String> = arr_val.clone();

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        let option_values: Vec<&str> = item.split(':').collect();
        
        if option_values[0] == " engine_wear" {
            arr_val_clone[i] = format!(" engine_wear: {}", wear);
        }
        
        if option_values[0] == " transmission_wear" {
            arr_val_clone[i] = format!(" transmission_wear: {}", wear);
        }

        if option_values[0] == " cabin_wear" {
            arr_val_clone[i] = format!(" cabin_wear: {}", wear);
        }

        if option_values[0] == " engine_wear_unfixable" {
            arr_val_clone[i] = format!(" engine_wear_unfixable: {}", wear);
        }

        if option_values[0] == " transmission_wear_unfixable" {
            arr_val_clone[i] = format!(" transmission_wear_unfixable: {}", wear);
        }

        if option_values[0] == " cabin_wear_unfixable" {
            arr_val_clone[i] = format!(" cabin_wear_unfixable: {}", wear);
        }

        if option_values[0] == " chassis_wear" {
            arr_val_clone[i] = format!(" chassis_wear: {}", wear);
        }

        if option_values[0] == " chassis_wear_unfixable" {
            arr_val_clone[i] = format!(" chassis_wear_unfixable: {}", wear);
        }

        if option_values[0] == "}" {
            break;
        }
    }

    return Some(arr_val_clone);
}