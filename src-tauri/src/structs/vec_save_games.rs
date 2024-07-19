use serde::Serialize;

#[derive(Serialize)]
pub struct VecSaveGames {
    pub id: String,
    pub name: String,
    pub dir: String,
}

#[derive(Serialize)]
pub struct VecProfileDir {
    pub name: String,
    pub hex: String,
    pub dir: String,
}
