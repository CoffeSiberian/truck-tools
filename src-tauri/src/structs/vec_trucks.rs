use serde::{Deserialize, Serialize};

pub struct VecTrucksId {
    pub index: usize,
    pub id: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct TruckBrandsATS {
    pub kenworth: Vec<Models>,
    pub freightliner: Vec<Models>,
    pub volvo: Vec<Models>,
    pub westernstar: Vec<Models>,
    pub peterbilt: Vec<Models>,
    pub intnational: Vec<Models>,
    pub mack: Vec<Models>,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct TruckBrandsETS2 {
    pub mercedes: Vec<Models>,
    pub daf: Vec<Models>,
    pub man: Vec<Models>,
    pub renault: Vec<Models>,
    pub scania: Vec<Models>,
    pub volvo: Vec<Models>,
    pub iveco: Vec<Models>,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Models {
    pub model: String,
    pub engines: Vec<Engine>,
    pub transmissions: Vec<Transmission>,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Engine {
    pub name: String,
    pub cv: String,
    pub nm: String,
    pub code: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Transmission {
    pub name: String,
    pub speeds: String,
    pub retarder: bool,
    pub ratio: String,
    pub code: String,
}
