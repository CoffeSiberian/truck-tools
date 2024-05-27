use serde::Serialize;

#[derive(Serialize)]
pub struct VecSaveGames {
    pub id: String,
    pub name: String,
    pub dir: String,
}
