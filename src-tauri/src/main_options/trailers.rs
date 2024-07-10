use crate::structs::vec_items_find::VecItemsFind;

const COUNTRY_VALIDITY: &str = " country_validity: 0";

fn get_vec_trailers(arr_val: &Vec<String>) -> Option<Vec<VecItemsFind>> {
    let max_counter: u16 = 20;
    let mut counter: u16 = 0;
    let mut result: Vec<VecItemsFind> = Vec::new();
    let (trailer_id, index): (String, usize) = match get_my_trailer_id(&arr_val) {
        Some((trailer_id, index)) => (trailer_id, index),
        None => return None,
    };
    let mut current_slave_trailer_index: usize =
        match get_trailer_index(arr_val, &trailer_id, &index) {
            Some(current_slave_trailer_index) => current_slave_trailer_index,
            None => return None,
        };
    result.push(VecItemsFind {
        index: current_slave_trailer_index,
        value: trailer_id,
    });

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

    return Some(result);
}

fn get_vec_license_plate_edit(
    arr_val: &Vec<String>,
    index: usize,
    bg_plate_color: &str,
    text_plate_color: &str,
    license_plate: &str,
) -> Option<VecItemsFind> {
    let value: String = format!("<color value=ff{}><margin left=-15><img src=/material/ui/white.mat xscale=stretch yscale=stretch><ret><margin left=2><align hstyle=left vstyle=center><font xscale=1 yscale=1 ><color value=ff{}>{}</align></margin>|belgium", bg_plate_color, text_plate_color, license_plate);
    let value_put: String = format!(" license_plate: \"{}\"", value);

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        if item.contains(" license_plate:") {
            return Some(VecItemsFind {
                index: i,
                value: value_put,
            });
        }

        if item.contains("}") {
            return None;
        }
    }

    return None;
}

pub fn set_cargo_mass_trailer(
    arr_val: &Vec<String>,
    index: usize,
    cargo_mass: &str,
) -> Option<Vec<String>> {
    let value_find: String = format!(" cargo_mass: {}", cargo_mass);
    let mut arr_val_clone: Vec<String> = arr_val.clone();

    for (i, item) in arr_val_clone.iter().enumerate().skip(index) {
        if item.contains(" cargo_mass:") {
            arr_val_clone[i] = value_find;
            break;
        }
    }

    return Some(arr_val_clone);
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

        if item.contains("}") {
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

    for (i, item) in arr_val_clone.iter().enumerate().skip(index) {
        if index_start == 0 && item.contains(" country_validity:") {
            index_start = i;
        }

        if item.contains(" country_validity[") {
            index_end = i;
        }
    }

    if index_start == 0 || index_end == 0 {
        return None;
    }

    arr_val_clone.drain(index_start..index_end + 1);
    arr_val_clone[index_start] = COUNTRY_VALIDITY.to_string();

    return Some(arr_val_clone);
}

pub fn set_any_slave_trailers_weight(
    arr_val: &Vec<String>,
    first_slave_id: String,
    first_slave_index: usize,
    cargo_mass: String,
) -> Vec<String> {
    let mut counter: u16 = 0;
    let mut next_slave_trailer: String = first_slave_id;
    let mut next_slave_trailer_index: usize = first_slave_index;
    let mut current_arr_val: Vec<String> = arr_val.to_vec();
    let max_counter: u16 = 20;

    loop {
        counter += 1;
        if counter >= max_counter {
            break;
        }

        let slave_index: usize = match get_trailer_index(
            &current_arr_val,
            &next_slave_trailer,
            &next_slave_trailer_index,
        ) {
            Some(slave_index) => slave_index,
            None => break,
        };
        next_slave_trailer_index = slave_index;

        let cargo_mass_save: Vec<String> = match set_cargo_mass_trailer(
            &current_arr_val,
            next_slave_trailer_index,
            cargo_mass.as_str(),
        ) {
            Some(cargo_mass_save) => cargo_mass_save,
            None => break,
        };
        current_arr_val = cargo_mass_save;

        let (slave_trailer_id, index_slave): (String, usize) =
            match get_slave_trailers_id(&current_arr_val, next_slave_trailer_index) {
                Some((slave_trailer_id, index)) => (slave_trailer_id, index),
                None => break,
            };
        next_slave_trailer = slave_trailer_id;
        next_slave_trailer_index = index_slave;
    }

    return current_arr_val;
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

        if item.contains("}") {
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

pub fn set_trailer_license_plate(
    arr_val: &Vec<String>,
    license_plate: &str,
    bg_plate_color: &str,
    text_plate_color: &str,
) -> Option<Vec<String>> {
    let mut arr_val_clone: Vec<String> = arr_val.clone();
    let get_trailers: Vec<VecItemsFind> = match get_vec_trailers(&arr_val) {
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
