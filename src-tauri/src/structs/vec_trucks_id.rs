use serde::Serialize;

#[derive(Serialize)]
pub struct VecTrucksId {
    pub index: usize,
    pub id: String,
}
