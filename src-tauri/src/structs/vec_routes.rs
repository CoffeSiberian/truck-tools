use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CityCompany {
    pub city: String,
    pub companies: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CurrentJobInfo {
    pub cargo: String,
    pub source_city: String,
    pub source_company: String,
    pub target_city: String,
    pub target_company: String,
    pub units_count: u32,
    pub urgency: u8,
    pub distance_km: u32,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct TrailerDefinitionOption {
    pub definition: String,
    pub variant: String,
    pub label: String,
    pub max_units: u32,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct SaveRouteDataResponse {
    pub res: bool,
    pub visited_cities: Vec<String>,
    pub all_cities: Vec<String>,
    pub companies_by_city: Vec<CityCompany>,
    pub origin_companies_by_city: Vec<CityCompany>,
    pub cargos: Vec<String>,
    pub current_job: Option<CurrentJobInfo>,
    pub cargo_trailers: HashMap<String, Vec<TrailerDefinitionOption>>,
    pub own_trailer: Option<OwnTrailerInfo>,
    pub companies: HashMap<String, CatalogCompany>,
    pub cities: HashMap<String, CatalogCity>,
    pub cargo_names: HashMap<String, String>,
    pub positions: HashMap<String, [f64; 2]>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct OwnTrailerInfo {
    pub cargo_units: HashMap<String, u32>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CatalogCompany {
    pub name: String,
    pub cargo_out: Vec<String>,
    pub cargo_in: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CatalogCity {
    pub name: String,
    pub region: String,
}

#[derive(Deserialize, Clone, Debug)]
pub struct CatalogCargo {
    pub name: String,
    pub body_types: Vec<String>,
    pub volume: f64,
    pub mass: f64,
}

#[derive(Deserialize, Clone, Debug)]
pub struct CompanyPlaces {
    pub x: f64,
    pub y: f64,
    pub trailer: Vec<String>,
    pub long_trailer: Vec<String>,
    pub easy: Option<String>,
    pub medium: Option<String>,
    pub hard: Option<String>,
    pub rigid: Option<String>,
}

#[derive(Deserialize, Clone, Debug)]
pub struct RouteCatalog {
    pub companies: HashMap<String, CatalogCompany>,
    pub cargos: HashMap<String, CatalogCargo>,
    pub cities: HashMap<String, CatalogCity>,
    pub places: HashMap<String, CompanyPlaces>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CustomRoutePayload {
    pub source_city: String,
    pub source_company: String,
    pub target_city: String,
    pub target_company: String,
    pub cargo: String,
    pub units_count: u32,
    pub urgency: u8,
    pub distance_km: u32,
    pub apply_mode: String, // "active_job" or "offer"
    pub trailer_mode: Option<String>, // only "freight" can be written as an offer
    pub trailer_definition: Option<String>,
    pub trailer_variant: Option<String>,
    pub start_mode: Option<String>, // "offer" (default), "teleport" or "take_now"
    pub game: Option<String>,
}

