use crate::structs::vec_items_find::VecItemsFind;
use crate::structs::vec_vehicles_player::{PlayerVehiclesData, VecPlayerTrailersPlacements};

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
    // WARN: Skip the first index since we already found the assigned_vehicles index
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

pub fn get_stored_vehicle_placement_from_player_vehicles(
    arr_val: &Vec<String>,
    index: usize,
) -> Option<VecItemsFind> {
    for (i, item) in arr_val.iter().enumerate().skip(index) {
        if item.contains(" stored_vehicle_placement") {
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

pub fn get_stored_trailer_placements_from_player_vehicles(
    arr_val: &Vec<String>,
    index: usize,
) -> Option<Vec<VecPlayerTrailersPlacements>> {
    let mut trailers_placements: Vec<VecPlayerTrailersPlacements> = Vec::new();

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        if item.contains(" stored_trailer_placements") {
            let option_values: Vec<&str> = item.split(':').collect();

            trailers_placements.push(VecPlayerTrailersPlacements {
                index: i,
                value: option_values[1].to_string(),
            });
        }

        if item == "}" {
            return Some(trailers_placements);
        }
    }

    return None;
}

pub fn get_player_vehicle_trailer_status(
    arr_val: &Vec<String>,
    index: usize,
) -> Option<VecItemsFind> {
    for (i, item) in arr_val.iter().enumerate().skip(index) {
        if item.contains(" stored_trailer_attached") {
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

pub fn get_all_player_vehicles_data(
    arr_val: &Vec<String>,
    index: usize,
) -> Option<Vec<PlayerVehiclesData>> {
    let mut result: Vec<PlayerVehiclesData> = Vec::new();

    for (i, item) in arr_val.iter().enumerate().skip(index) {
        if item.contains("player_vehicles :") {
            let split_player_vehicles: Vec<&str> = item.split(':').collect();
            let player_vehicles_id = split_player_vehicles[1].to_string();
            let player_vehicles_id_index = i;

            let (vehicle_id, vehicle_id_index) =
                match get_vehicle_id_from_player_vehicles(arr_val, i) {
                    Some(vehicle_id) => (vehicle_id.value, vehicle_id.index),
                    None => (String::from("null"), 0),
                };

            let (stored_vehicle_placement, stored_vehicle_placement_index) =
                match get_stored_vehicle_placement_from_player_vehicles(arr_val, i) {
                    Some(stored_vehicle_placement) => (
                        stored_vehicle_placement.value,
                        stored_vehicle_placement.index,
                    ),
                    None => (String::from("0"), 0),
                };

            let (trailer_id, trailer_id_index) =
                match get_trailer_id_from_player_vehicles(arr_val, i) {
                    Some(trailer_id) => (trailer_id.value, trailer_id.index),
                    None => (String::from("null"), 0),
                };

            let stored_trailers_placements =
                match get_stored_trailer_placements_from_player_vehicles(arr_val, i) {
                    Some(stored_trailer_placements) => stored_trailer_placements,
                    None => Vec::new(),
                };

            let (stored_trailer_attached, stored_trailer_attached_index) =
                match get_player_vehicle_trailer_status(arr_val, i) {
                    Some(stored_trailer_attached) => {
                        (stored_trailer_attached.value, stored_trailer_attached.index)
                    }
                    None => (String::from("false"), 0),
                };

            let player_vehicles_data = PlayerVehiclesData {
                player_vehicles_id,
                player_vehicles_id_index,
                vehicle_id,
                vehicle_id_index,
                stored_vehicle_placement,
                stored_vehicle_placement_index,
                trailer_id,
                trailer_id_index,
                trailer_placements: stored_trailers_placements,
                stored_trailer_attached,
                stored_trailer_attached_index,
            };
            result.push(player_vehicles_data);
        }
    }

    if result.is_empty() {
        return None;
    }

    return Some(result);
}

pub fn get_player_vehicles_data_have_same_vehicle_id(
    arr_val: &Vec<String>,
    player_vehicles_id: &String,
) -> Option<Vec<PlayerVehiclesData>> {
    let (player_vehicles_index, _) = match get_assigned_vehicles_player(arr_val) {
        Some(assigned_vehicles) => (assigned_vehicles.index, assigned_vehicles.value),
        None => return None,
    };

    let all_player_vehicles_data =
        match get_all_player_vehicles_data(arr_val, player_vehicles_index) {
            Some(all_player_vehicles_data) => all_player_vehicles_data,
            None => return None,
        };

    let mut result: Vec<PlayerVehiclesData> = Vec::new();
    for player_vehicles_data in all_player_vehicles_data {
        if player_vehicles_data.vehicle_id == player_vehicles_id.to_string() {
            result.push(player_vehicles_data);
        }
    }

    if result.is_empty() {
        return None;
    }

    return Some(result);
}
