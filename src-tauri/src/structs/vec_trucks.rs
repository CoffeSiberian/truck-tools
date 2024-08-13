use serde::Serialize;
pub struct VecTrucksId {
    pub index: usize,
    pub id: String,
}

#[derive(Serialize, Clone)]
pub struct EngineStruct {
    pub name_id: &'static str,
    pub name: &'static str,
    pub cv: &'static str,
    pub nm: &'static str,
    pub code: &'static str,
}

#[derive(Serialize, Clone)]
pub struct TransmissionStruct {
    pub name_id: &'static str,
    pub name: &'static str,
    pub speeds: &'static str,
    pub retarder: bool,
    pub ratio: &'static str,
    pub code: &'static str,
}

#[derive(Serialize, Clone)]
pub struct truck_values {
    pub engines: Vec<EngineStruct>,
    pub transmissions: Vec<TransmissionStruct>,
}

#[derive(Serialize)]
pub struct brand_scania {
    pub scania_r: truck_values,
    pub scania_s: truck_values,
    pub scania_streamline: truck_values,
    pub scania_r_2009: truck_values,
}

#[derive(Serialize)]
pub struct brand_volvo {
    pub volvo_fh: truck_values,
    pub volvo_fh_classic: truck_values,
}

#[derive(Serialize)]
pub struct truck_brands {
    pub scania: brand_scania,
    pub volvo: brand_volvo,
}
