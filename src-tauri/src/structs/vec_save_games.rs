use serde::Serialize;

#[derive(Serialize)]
pub struct VecSaveGames {
    pub name: String,
    pub dir: String,
}
