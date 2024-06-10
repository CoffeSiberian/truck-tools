pub struct VecTrucksId {
    pub index: usize,
    pub id: String,
}

pub struct EngineStruct<'a> {
    pub name_id: &'a str,
    pub name: &'a str,
    pub cv: &'a str,
    pub nm: &'a str,
    pub code: &'a str,
}

pub struct TransmissionStruct<'a> {
    pub name_id: &'a str,
    pub name: &'a str,
    pub speeds: &'a str,
    pub ratio: &'a str,
    pub price: &'a str,
}
