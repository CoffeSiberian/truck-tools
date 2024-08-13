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
pub struct TruckValues {
    pub engines: Vec<EngineStruct>,
    pub transmissions: Vec<TransmissionStruct>,
}

#[derive(Serialize)]
pub struct BrandScania {
    pub scania_r: TruckValues,
    pub scania_s: TruckValues,
    pub scania_streamline: TruckValues,
    pub scania_r_2009: TruckValues,
}

#[derive(Serialize)]
pub struct BrandVolvo {
    pub volvo_fh: TruckValues,
    pub volvo_fh_classic: TruckValues,
}

#[derive(Serialize)]
pub struct TruckBrands {
    pub scania: BrandScania,
    pub volvo: BrandVolvo,
}
