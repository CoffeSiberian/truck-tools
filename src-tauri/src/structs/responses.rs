use super::vec_save_games::VecProfileDir;
use super::vec_save_games::VecSaveGames;
use super::vec_trailers::VecSaveTrailers;
use super::vec_trucks::{Models, VecSaveTrucks};
use serde::Serialize;

#[derive(Serialize)]
pub struct DefaultResponse {
    pub res: bool,
}

#[derive(Serialize)]
pub struct SaveGameResponse {
    pub res: bool,
    pub save_games: Vec<VecSaveGames>,
}

#[derive(Serialize)]
pub struct SaveGameCountResponse {
    pub res: bool,
    pub saves: usize,
}

#[derive(Serialize)]
pub struct TruckBrandModelsResponse {
    pub res: bool,
    pub models: Vec<Models>,
}

#[derive(Serialize)]
pub struct ListProfilesResponse {
    pub res: bool,
    pub profiles: Vec<VecProfileDir>,
}

#[derive(Serialize)]
pub struct SystemThemeResponse {
    pub res: bool,
    pub theme: &'static str,
}

#[derive(Serialize)]
pub struct DeveloperValues {
    pub res: bool,
    pub developer: bool,
    pub console: bool,
    pub active_max_convoy_mode: bool,
}

#[derive(Serialize)]
pub struct ListTrucksResponse {
    pub res: bool,
    pub current_truck_id: Option<String>,
    pub trucks: Vec<VecSaveTrucks>,
}

#[derive(Serialize)]
pub struct ListTrailersResponse {
    pub res: bool,
    pub current_trailer_id: Option<String>,
    pub trailers: Vec<VecSaveTrailers>,
}
