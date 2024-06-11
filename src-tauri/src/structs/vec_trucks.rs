use serde::Serialize;
pub struct VecTrucksId {
    pub index: usize,
    pub id: String,
}

#[derive(Serialize)]
pub struct EngineStruct<'a> {
    pub name_id: &'a str,
    pub name: &'a str,
    pub cv: &'a str,
    pub nm: &'a str,
    pub code: &'a str,
}

#[derive(Serialize)]
pub struct TransmissionStruct<'a> {
    pub name_id: &'a str,
    pub name: &'a str,
    pub speeds: &'a str,
    pub retarder: bool,
    pub ratio: &'a str,
    pub code: &'a str,
}
