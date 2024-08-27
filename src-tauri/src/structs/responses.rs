use super::vec_save_games::VecProfileDir;
use super::vec_save_games::VecSaveGames;
use super::vec_trucks::TruckBrands;
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
pub struct TrucksResponse {
    pub res: bool,
    pub trucks: TruckBrands,
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
}
