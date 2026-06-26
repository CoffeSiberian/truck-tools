#[allow(dead_code)]
pub struct PlayerVehiclesData {
    pub player_vehicles_id: String,
    pub player_vehicles_id_index: usize,
    pub vehicle_id: String,
    pub vehicle_id_index: usize,
    pub stored_vehicle_placement: String,
    pub stored_vehicle_placement_index: usize,
    pub trailer_id: String,
    pub trailer_id_index: usize,
    pub trailer_placements: Vec<VecPlayerTrailersPlacements>,
    pub stored_trailer_attached: String,
    pub stored_trailer_attached_index: usize,
}

#[allow(dead_code)]
pub struct VecPlayerTrailersPlacements {
    pub index: usize,
    pub value: String,
}
