use serde::Serialize;

pub struct VecTrailersId {
    pub index: usize,
}

pub struct VecTrailersNoSlaveId {
    pub id: String,
    pub trailer_number: u16,
    pub index: usize,
}

#[derive(Serialize)]
pub struct VecSaveTrailers {
    pub trailer_id: String,
    pub trailer_number: u16,
    pub brand_name: String,
}
