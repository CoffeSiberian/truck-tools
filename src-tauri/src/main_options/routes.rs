use std::collections::{HashMap, HashSet};
use std::sync::OnceLock;
use crate::main_options::trucks::get_truck_id;
use crate::main_options::vehicles_player::get_player_vehicles_data_have_same_vehicle_id;
use crate::structs::vec_routes::{
    CityCompany, CurrentJobInfo, CustomRoutePayload, OwnTrailerInfo, RouteCatalog,
    SaveRouteDataResponse, TrailerDefinitionOption,
};

const ETS2_ROUTE_CATALOG: &str = include_str!("../embeds/route_catalog_ets2.json");
const ATS_ROUTE_CATALOG: &str = include_str!("../embeds/route_catalog_ats.json");

// Placement the game itself writes for unload spots a company doesn't have.
const NO_PLACEMENT: &str = "(0, &60ad78ec, 0) (1; 0, 0, 0)";

pub fn get_route_catalog(game: &str) -> Option<&'static RouteCatalog> {
    static ETS2: OnceLock<Option<RouteCatalog>> = OnceLock::new();
    static ATS: OnceLock<Option<RouteCatalog>> = OnceLock::new();

    match game {
        "ets2" => ETS2
            .get_or_init(|| serde_json::from_str(ETS2_ROUTE_CATALOG).ok())
            .as_ref(),
        "ats" => ATS
            .get_or_init(|| serde_json::from_str(ATS_ROUTE_CATALOG).ok())
            .as_ref(),
        _ => None,
    }
}

fn format_definition_label(def_raw: &str) -> String {
    let clean = def_raw
        .replace("trailer_def.", "")
        .replace("trailer.", "")
        .replace("scs.", "")
        .replace('_', " ");
    
    let words: Vec<String> = clean
        .split('.')
        .flat_map(|part| part.split_whitespace())
        .map(|w| {
            let mut c = w.chars();
            match c.next() {
                None => String::new(),
                Some(first) => first.to_uppercase().collect::<String>() + c.as_str(),
            }
        })
        .collect();
    words.join(" ")
}

struct SavedFreightOffer {
    cargo: String,
    definition: String,
    variant: String,
    company_truck: String,
    units_count: u32,
}

struct ResolvedFreightTrailer {
    definition: String,
    variant: String,
    company_truck: String,
    units_count: u32,
}

fn is_set_sii_value(value: &str) -> bool {
    !value.is_empty() && value != "null" && value != "\"\""
}

// Live offers the game wrote into this save. Everything a route writes has to come
// from here: a cargo or trailer token the installed game can't resolve breaks the
// save on load. Expired slots are skipped because they keep a stale trailer but
// have an empty target.
fn parse_saved_freight_offers(arr_val: &[String]) -> Vec<SavedFreightOffer> {
    let mut offers: Vec<SavedFreightOffer> = Vec::new();

    let mut i = 0;
    while i < arr_val.len() {
        if !arr_val[i].trim().starts_with("job_offer_data :") {
            i += 1;
            continue;
        }

        let mut target = "";
        let mut cargo = "";
        let mut definition = "";
        let mut variant = "";
        let mut company_truck = "";
        let mut units_count: u32 = 0;

        i += 1;
        while i < arr_val.len() && arr_val[i].trim() != "}" {
            if let Some((key, value)) = arr_val[i].trim().split_once(':') {
                let value = value.trim();
                match key {
                    "target" => target = value,
                    "cargo" => cargo = value,
                    "trailer_definition" => definition = value,
                    "trailer_variant" => variant = value,
                    // Keep the quotes of special truck paths such as "heavy/...".
                    "company_truck" => company_truck = value,
                    "units_count" => units_count = value.parse::<u32>().unwrap_or(0),
                    _ => {}
                }
            }
            i += 1;
        }
        i += 1;

        let cargo = cargo.trim_matches('"').trim_start_matches("cargo.");
        let definition = definition.trim_matches('"');
        let variant = variant.trim_matches('"');

        if is_set_sii_value(target)
            && is_set_sii_value(company_truck)
            && is_set_sii_value(cargo)
            && is_safe_sii_token(cargo)
            && is_safe_sii_token(definition)
            && is_safe_sii_token(variant)
            && definition != "null"
            && variant != "null"
            && !definition.starts_with("_nameless.")
            && !variant.starts_with("_nameless.")
            && units_count > 0
        {
            offers.push(SavedFreightOffer {
                cargo: cargo.to_string(),
                definition: definition.to_string(),
                variant: variant.to_string(),
                company_truck: company_truck.to_string(),
                units_count,
            });
        }
    }

    offers
}

fn build_cargo_trailers(
    offers: &[SavedFreightOffer],
) -> HashMap<String, Vec<TrailerDefinitionOption>> {
    let mut cargo_trailers: HashMap<String, Vec<TrailerDefinitionOption>> = HashMap::new();

    for offer in offers {
        let trailers = cargo_trailers.entry(offer.cargo.clone()).or_default();
        match trailers
            .iter_mut()
            .find(|t| t.definition == offer.definition && t.variant == offer.variant)
        {
            Some(trailer) => trailer.max_units = trailer.max_units.max(offer.units_count),
            None => trailers.push(TrailerDefinitionOption {
                definition: offer.definition.clone(),
                variant: offer.variant.clone(),
                label: format_definition_label(&offer.definition),
                max_units: offer.units_count,
            }),
        }
    }

    for trailers in cargo_trailers.values_mut() {
        trailers.sort_by(|a, b| a.label.cmp(&b.label).then_with(|| a.variant.cmp(&b.variant)));
    }

    cargo_trailers
}

// Only companies that already own an offer slot can receive a route, because the
// slot and its expiry event are reused instead of creating new units.
fn get_origin_companies(arr_val: &[String]) -> Vec<CityCompany> {
    let mut companies_map: HashMap<String, Vec<String>> = HashMap::new();

    for (i, line) in arr_val.iter().enumerate() {
        let Some(name) = line
            .trim()
            .strip_prefix("company : company.volatile.")
            .and_then(|rest| rest.strip_suffix(" {"))
        else {
            continue;
        };
        let Some((company, city)) = name.split_once('.') else {
            continue;
        };

        let has_offer_slot = arr_val
            .iter()
            .skip(i + 1)
            .take_while(|item| item.trim() != "}")
            .any(|item| item.trim().starts_with("job_offer[0]:"));

        if has_offer_slot {
            companies_map
                .entry(city.to_string())
                .or_default()
                .push(company.to_string());
        }
    }

    let mut origin_companies: Vec<CityCompany> = companies_map
        .into_iter()
        .map(|(city, mut companies)| {
            companies.sort();
            CityCompany { city, companies }
        })
        .collect();
    origin_companies.sort_by(|a, b| a.city.cmp(&b.city));

    origin_companies
}

pub fn get_save_game_route_data(
    arr_val: &Vec<String>,
    catalog: Option<&RouteCatalog>,
) -> SaveRouteDataResponse {
    let mut visited_cities: Vec<String> = Vec::new();
    let mut all_cities_set: HashSet<String> = HashSet::new();
    let mut companies_map: HashMap<String, HashSet<String>> = HashMap::new();
    let mut active_job_id: Option<String> = None;

    // 1. First pass: extract economy info, companies, visited cities and player selected job
    for (i, item) in arr_val.iter().enumerate() {
        if item.contains(" visited_cities[") {
            if let Some(val_str) = item.split(':').nth(1) {
                let city = val_str
                    .trim()
                    .replace('"', "")
                    .replace("city.", "")
                    .to_string();
                if !city.is_empty() && !visited_cities.contains(&city) {
                    visited_cities.push(city);
                }
            }
        }

        if item.contains(" companies[") {
            if let Some(val_str) = item.split(':').nth(1) {
                let clean_val = val_str.trim().replace('"', "");
                let parts: Vec<&str> = clean_val.split('.').collect();
                if parts.len() >= 4 {
                    let company_name = parts[2].to_string();
                    let city_name = parts[3].to_string();

                    all_cities_set.insert(city_name.clone());
                    companies_map
                        .entry(city_name)
                        .or_insert_with(HashSet::new)
                        .insert(company_name);
                }
            }
        }

        if item.starts_with("player :") {
            for line in arr_val.iter().skip(i + 1) {
                if line.trim() == "}" {
                    break;
                }
                let tr = line.trim();
                if tr.starts_with("selected_job:") {
                    if let Some(val_str) = line.split(':').nth(1) {
                        let job_val = val_str.trim().to_string();
                        if job_val != "null" && !job_val.is_empty() {
                            active_job_id = Some(job_val);
                        }
                    }
                } else if tr.starts_with("current_job:") && active_job_id.is_none() {
                    if let Some(val_str) = line.split(':').nth(1) {
                        let job_val = val_str.trim().to_string();
                        if job_val != "null" && !job_val.is_empty() {
                            active_job_id = Some(job_val);
                        }
                    }
                }
            }
        }
    }

    // 2. Parse active / selected job if found
    let mut current_job: Option<CurrentJobInfo> = None;
    if let Some(job_id) = &active_job_id {
        let needle_info = format!("job_info : {}", job_id);
        let needle_player = format!("player_job : {}", job_id);
        let needle_short = format!("{} {{", job_id);

        let mut job_index: Option<usize> = None;
        for (i, item) in arr_val.iter().enumerate() {
            if item.contains(&needle_info) || item.contains(&needle_player) || item.contains(&needle_short) {
                job_index = Some(i);
                break;
            }
        }

        if let Some(start_idx) = job_index {
            let mut cargo = String::new();
            let mut source_city = String::new();
            let mut source_company = String::new();
            let mut target_city = String::new();
            let mut target_company = String::new();
            let mut units_count: u32 = 0;
            let mut urgency: u8 = 0;
            let mut distance_km: u32 = 0;

            for item in arr_val.iter().skip(start_idx + 1) {
                if item.trim() == "}" {
                    break;
                }
                let trimmed = item.trim();
                if trimmed.starts_with("cargo:") {
                    if let Some(val) = item.split(':').nth(1) {
                        cargo = val.trim().replace("cargo.", "").replace('"', "");
                    }
                } else if trimmed.starts_with("source_company:") {
                    if let Some(val) = item.split(':').nth(1) {
                        let clean = val.trim().replace('"', "");
                        let parts: Vec<&str> = clean.split('.').collect();
                        if parts.len() >= 4 {
                            source_company = parts[2].to_string();
                            source_city = parts[3].to_string();
                        }
                    }
                } else if trimmed.starts_with("target_company:") {
                    if let Some(val) = item.split(':').nth(1) {
                        let clean = val.trim().replace('"', "");
                        let parts: Vec<&str> = clean.split('.').collect();
                        if parts.len() >= 4 {
                            target_company = parts[2].to_string();
                            target_city = parts[3].to_string();
                        }
                    }
                } else if trimmed.starts_with("units_count:") {
                    if let Some(val) = item.split(':').nth(1) {
                        units_count = val.trim().parse::<u32>().unwrap_or(0);
                    }
                } else if trimmed.starts_with("urgency:") {
                    if let Some(val) = item.split(':').nth(1) {
                        urgency = val.trim().parse::<u8>().unwrap_or(0);
                    }
                } else if trimmed.starts_with("planned_distance_km:") || trimmed.starts_with("shortest_distance_km:") {
                    if let Some(val) = item.split(':').nth(1) {
                        distance_km = val.trim().parse::<u32>().unwrap_or(0);
                    }
                }
            }

            if !cargo.is_empty() {
                current_job = Some(CurrentJobInfo {
                    cargo,
                    source_city,
                    source_company,
                    target_city,
                    target_company,
                    units_count,
                    urgency,
                    distance_km,
                });
            }
        }
    }

    let mut all_cities: Vec<String> = all_cities_set.into_iter().collect();
    all_cities.sort();
    visited_cities.sort();

    let mut companies_by_city: Vec<CityCompany> = Vec::new();
    for (city, companies_set) in companies_map {
        let mut comps: Vec<String> = companies_set.into_iter().collect();
        comps.sort();
        companies_by_city.push(CityCompany {
            city,
            companies: comps,
        });
    }
    companies_by_city.sort_by(|a, b| a.city.cmp(&b.city));

    let origin_companies_by_city = get_origin_companies(arr_val);

    // 3. Cargos and trailers the game itself uses in this save
    let cargo_trailers = build_cargo_trailers(&parse_saved_freight_offers(arr_val));
    let mut cargos: Vec<String> = cargo_trailers.keys().cloned().collect();
    cargos.sort();

    // 4. Names and coordinates of the selected game, plus what the player's trailer can carry
    let own_trailer = get_own_trailer_info(arr_val, catalog, &cargos);
    let cargo_names = catalog
        .map(|data| {
            data.cargos
                .iter()
                .map(|(token, cargo)| (token.clone(), cargo.name.clone()))
                .collect()
        })
        .unwrap_or_default();
    let positions = catalog
        .map(|data| {
            data.places
                .iter()
                .map(|(key, place)| (key.clone(), [place.x, place.y]))
                .collect()
        })
        .unwrap_or_default();

    SaveRouteDataResponse {
        res: true,
        visited_cities,
        all_cities,
        companies_by_city,
        origin_companies_by_city,
        cargos,
        current_job,
        cargo_trailers,
        own_trailer,
        companies: catalog.map(|data| data.companies.clone()).unwrap_or_default(),
        cities: catalog.map(|data| data.cities.clone()).unwrap_or_default(),
        cargo_names,
        positions,
    }
}

pub fn cancel_current_job(arr_val: &Vec<String>) -> Option<Vec<String>> {
    let mut arr_val_clone = arr_val.clone();
    let mut player_found = false;
    let mut replaced = false;

    for i in 0..arr_val_clone.len() {
        if !player_found && arr_val_clone[i].starts_with("player :") {
            player_found = true;
            continue;
        }

        if player_found {
            let is_close = arr_val_clone[i].trim() == "}";
            if arr_val_clone[i].starts_with(" current_job:") {
                arr_val_clone[i] = " current_job: null".to_string();
                replaced = true;
            } else if arr_val_clone[i].starts_with(" selected_job:") {
                arr_val_clone[i] = " selected_job: null".to_string();
                replaced = true;
            }
            if is_close {
                break;
            }
        }
    }

    if replaced {
        Some(arr_val_clone)
    } else {
        None
    }
}

fn resolve_freight_trailer(
    offers: &[SavedFreightOffer],
    cargo: &str,
    definition: Option<&str>,
    variant: Option<&str>,
    units_count: u32,
) -> Option<ResolvedFreightTrailer> {
    let matches_trailer = |offer: &SavedFreightOffer| {
        definition.map_or(true, |value| offer.definition == value)
            && variant.map_or(true, |value| offer.variant == value)
    };

    if !offers.iter().any(|offer| offer.cargo == cargo) {
        return None;
    }

    if let Some(first) = offers
        .iter()
        .find(|offer| offer.cargo == cargo && matches_trailer(offer))
    {
        let max_units = offers
            .iter()
            .filter(|offer| {
                offer.cargo == cargo
                    && offer.definition == first.definition
                    && offer.variant == first.variant
            })
            .map(|offer| offer.units_count)
            .max()
            .unwrap_or(first.units_count);

        return Some(ResolvedFreightTrailer {
            definition: first.definition.clone(),
            variant: first.variant.clone(),
            company_truck: first.company_truck.clone(),
            units_count: units_count.min(max_units),
        });
    }

    // A convoy code may name a trailer this cargo hasn't drawn in this save yet.
    // Both tokens still have to exist here, so a missing DLC is rejected.
    let (definition, variant) = (definition?, variant?);
    let offer = offers
        .iter()
        .find(|offer| offer.definition == definition && offer.variant == variant)?;

    Some(ResolvedFreightTrailer {
        definition: offer.definition.clone(),
        variant: offer.variant.clone(),
        company_truck: offer.company_truck.clone(),
        units_count,
    })
}

// The game keeps economy_event_queue sorted by time, so changing an event's time
// also has to move it to its new position in the queue.
fn reschedule_economy_event(lines: &mut [String], event_id: &str, new_time: u64) -> Option<()> {
    let mut event_times: HashMap<String, u64> = HashMap::new();
    let mut time_line: Option<usize> = None;

    let mut i = 0;
    while i < lines.len() {
        let Some(id) = lines[i]
            .trim()
            .strip_prefix("economy_event : ")
            .and_then(|rest| rest.strip_suffix(" {"))
        else {
            i += 1;
            continue;
        };
        let id = id.to_string();

        i += 1;
        while i < lines.len() && lines[i].trim() != "}" {
            if let Some(value) = lines[i].trim().strip_prefix("time:") {
                if let Ok(time) = value.trim().parse::<u64>() {
                    event_times.insert(id.clone(), time);
                }
                if id == event_id {
                    time_line = Some(i);
                }
            }
            i += 1;
        }
    }

    lines[time_line?] = format!(" time: {}", new_time);
    event_times.insert(event_id.to_string(), new_time);

    let queue_start = lines
        .iter()
        .position(|line| line.trim().starts_with("economy_event_queue :"))?;

    let mut slots: Vec<usize> = Vec::new();
    let mut queue: Vec<String> = Vec::new();
    for (k, line) in lines.iter().enumerate().skip(queue_start + 1) {
        let trimmed = line.trim();
        if trimmed == "}" {
            break;
        }
        if trimmed.starts_with("data[") {
            let (_, id) = trimmed.split_once(':')?;
            slots.push(k);
            queue.push(id.trim().to_string());
        }
    }

    let current = queue.iter().position(|id| id == event_id)?;
    queue.remove(current);
    let insert_at = queue
        .iter()
        .position(|id| event_times.get(id).is_some_and(|time| *time > new_time))
        .unwrap_or(queue.len());
    queue.insert(insert_at, event_id.to_string());

    for (position, (slot, id)) in slots.iter().zip(queue.iter()).enumerate() {
        lines[*slot] = format!(" data[{}]: {}", position, id);
    }

    Some(())
}

fn is_safe_sii_token(value: &str) -> bool {
    !value.is_empty()
        && value
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || b"._-".contains(&byte))
}

fn get_block_field(lines: &[String], unit_type: &str, id: &str, field: &str) -> Option<String> {
    let header = format!("{} : {} {{", unit_type, id);
    let start = lines.iter().position(|line| line.trim() == header)?;
    lines
        .iter()
        .skip(start + 1)
        .take_while(|line| line.trim() != "}")
        .find_map(|line| {
            let (key, value) = line.trim().split_once(':')?;
            (key == field).then(|| value.trim().to_string())
        })
}

fn get_player_field(lines: &[String], field: &str) -> Option<String> {
    let start = lines.iter().position(|line| line.starts_with("player :"))?;
    lines
        .iter()
        .skip(start + 1)
        .take_while(|line| line.trim() != "}")
        .find_map(|line| {
            let (key, value) = line.trim().split_once(':')?;
            (key == field).then(|| value.trim().to_string())
        })
}

fn parse_sii_number(value: &str) -> Option<f64> {
    let value = value.trim();
    match value.strip_prefix('&') {
        Some(hex) => u32::from_str_radix(hex, 16)
            .ok()
            .map(|bits| f32::from_bits(bits) as f64),
        None => value.parse::<f64>().ok(),
    }
}

fn format_sii_number(value: f64) -> String {
    if value.fract() == 0.0 && value.abs() < 1e7 {
        return format!("{}", value as i64);
    }
    format!("&{:08x}", (value as f32).to_bits())
}

// Moves a "(x, y, z) (w; qx, qy, qz)" placement along the direction it faces.
fn move_placement_forward(placement: &str, distance: f64) -> Option<String> {
    let (position, rotation) = placement.split_once(") (")?;
    let position: Vec<f64> = position
        .trim_start_matches('(')
        .split(',')
        .map(parse_sii_number)
        .collect::<Option<_>>()?;
    let (w, vector) = rotation.trim_end_matches(')').split_once(';')?;
    let w = parse_sii_number(w)?;
    let vector: Vec<f64> = vector
        .split(',')
        .map(parse_sii_number)
        .collect::<Option<_>>()?;
    if position.len() != 3 || vector.len() != 3 {
        return None;
    }
    let (x, y, z) = (vector[0], vector[1], vector[2]);

    // Rotates the game's forward axis (0, 0, -1) by the placement quaternion.
    let forward_x = -2.0 * (x * z + w * y);
    let forward_z = -(1.0 - 2.0 * (x * x + y * y));

    Some(format!(
        "({}, {}, {}) ({}; {}, {}, {})",
        format_sii_number(position[0] + forward_x * distance),
        format_sii_number(position[1]),
        format_sii_number(position[2] + forward_z * distance),
        format_sii_number(w),
        format_sii_number(x),
        format_sii_number(y),
        format_sii_number(z),
    ))
}

// Trailer attached to the player's current truck, with the data the game keeps in the save.
fn get_own_trailer_data(lines: &[String]) -> Option<(String, f64, f64, f64)> {
    let vehicles_id = get_player_field(lines, "assigned_vehicles")?;
    if get_block_field(lines, "player_vehicles", &vehicles_id, "stored_trailer_attached")? != "true"
    {
        return None;
    }
    let trailer_id = get_block_field(lines, "player_vehicles", &vehicles_id, "trailer")?;
    let definition = get_block_field(lines, "trailer", &trailer_id, "trailer_definition")?;

    let field = |name: &str| get_block_field(lines, "trailer_def", &definition, name);
    // Unit counts are only known for a single trailer, not for doubles.
    if field("chain_type")? != "single" {
        return None;
    }
    let number = |name: &str| field(name).and_then(|value| parse_sii_number(&value));
    let payload = number("gross_trailer_weight_limit")?
        - number("chassis_mass").unwrap_or(0.0)
        - number("body_mass").unwrap_or(0.0);

    Some((field("body_type")?, number("length")?, number("volume")?, payload))
}

fn get_own_trailer_info(
    lines: &[String],
    catalog: Option<&RouteCatalog>,
    save_cargos: &[String],
) -> Option<OwnTrailerInfo> {
    let (body_type, _, volume, payload) = get_own_trailer_data(lines)?;
    let catalog = catalog?;

    let mut cargo_units: HashMap<String, u32> = HashMap::new();
    // Cargos seen in this save are the ones whose DLC is installed.
    for token in save_cargos {
        let Some(cargo) = catalog.cargos.get(token) else {
            continue;
        };
        if !cargo.body_types.contains(&body_type) || cargo.volume <= 0.0 {
            continue;
        }
        let mut units = (volume / cargo.volume).floor();
        if cargo.mass > 0.0 {
            units = units.min((payload / cargo.mass).floor());
        }
        if units >= 1.0 {
            cargo_units.insert(token.clone(), units as u32);
        }
    }

    Some(OwnTrailerInfo { cargo_units })
}

// Writes the player's position the way a save stores it: stored_vehicle_placement of every
// player_vehicles using the truck and truck_placement, which is where the game spawns it.
fn teleport_player(lines: &mut Vec<String>, spot: &str) -> Option<()> {
    let trailer_length = get_own_trailer_data(lines).map(|(_, length, _, _)| length);
    let truck_placement = match trailer_length {
        Some(length) => move_placement_forward(spot, length)?,
        None => spot.to_string(),
    };

    let truck_id = get_truck_id(&lines.to_vec())?;
    let vehicles = get_player_vehicles_data_have_same_vehicle_id(&lines.to_vec(), &truck_id.id)?;
    for item in vehicles.iter() {
        lines[item.stored_vehicle_placement_index] =
            format!(" stored_vehicle_placement: {}", truck_placement);

        if item.stored_trailer_attached.trim() == "true" {
            for (position, trailer) in item.trailer_placements.iter().enumerate().skip(1) {
                lines[trailer.index] =
                    format!(" stored_trailer_placements[{}]: {}", position - 1, spot);
            }
        }
    }

    let player = lines.iter().position(|line| line.starts_with("player :"))?;
    let line = lines
        .iter()
        .skip(player + 1)
        .take_while(|line| line.trim() != "}")
        .position(|line| line.trim().starts_with("truck_placement:"))?;
    lines[player + 1 + line] = format!(" truck_placement: {}", truck_placement);

    Some(())
}

fn take_job_now(
    arr_val: &Vec<String>,
    payload: &CustomRoutePayload,
    catalog: &RouteCatalog,
) -> Option<Vec<String>> {
    if !is_valid_route_payload(payload) {
        return None;
    }
    if get_player_field(arr_val, "current_job").is_none_or(|job| job != "null") {
        return None;
    }

    let source_key = format!("{}.{}", payload.source_company, payload.source_city);
    let target_key = format!("{}.{}", payload.target_company, payload.target_city);
    let source = catalog.places.get(&source_key)?;
    let target = catalog.places.get(&target_key)?;
    let source_placement = source.trailer.first().or(source.long_trailer.first())?;
    let target_placement = target.easy.as_ref()?;

    let cargo = payload.cargo.replace("cargo.", "");
    let save_cargos: Vec<String> = parse_saved_freight_offers(arr_val)
        .into_iter()
        .map(|offer| offer.cargo)
        .collect();
    let own_trailer = get_own_trailer_info(arr_val, Some(catalog), &save_cargos)?;
    let units_count = payload.units_count.min(*own_trailer.cargo_units.get(&cargo)?);

    let mut game_time: u64 = 0;
    for line in arr_val.iter() {
        if let Some(value) = line.trim().strip_prefix("game_time:") {
            game_time = value.trim().parse::<u64>().ok()?;
            break;
        }
    }

    let mut job_id = "_nameless.aaa.aaaa.aaaa".to_string();
    let mut suffix = 0;
    while arr_val
        .iter()
        .any(|line| line.trim() == format!("player_job : {} {{", job_id))
    {
        suffix += 1;
        job_id = format!("_nameless.aaa.aaaa.a{:03x}", suffix);
    }

    let delivery_minutes = payload.distance_km as u64
        * match payload.urgency {
            0 => 4,
            1 => 2,
            _ => 3,
        }
        / if payload.urgency == 2 { 2 } else { 1 };
    let time_lower_limit = game_time + delivery_minutes;
    let or_none = |place: &Option<String>| place.clone().unwrap_or(NO_PLACEMENT.to_string());

    let job_lines = vec![
        String::new(),
        format!("player_job : {} {{", job_id),
        " company_truck: null".to_string(),
        " company_trailer: null".to_string(),
        format!(" target_placement: {}", target_placement),
        format!(" target_placement_medium: {}", or_none(&target.medium)),
        format!(" target_placement_hard: {}", or_none(&target.hard)),
        format!(" target_placement_rigid: {}", or_none(&target.rigid)),
        format!(" source_placement: {}", source_placement),
        " selected_target: nil".to_string(),
        format!(" time_lower_limit: {}", time_lower_limit),
        format!(" time_upper_limit: {}", time_lower_limit + 300),
        " job_distance: 0".to_string(),
        " fuel_consumed: 0".to_string(),
        " last_reported_fuel: 0".to_string(),
        " total_fines: 0".to_string(),
        " is_trailer_loaded: false".to_string(),
        " online_job_id: nil".to_string(),
        " online_job_trailer_model: null".to_string(),
        " autoload_used: false".to_string(),
        format!(" cargo: cargo.{}", cargo),
        format!(
            " source_company: company.volatile.{}.{}",
            payload.source_company, payload.source_city
        ),
        format!(
            " target_company: company.volatile.{}.{}",
            payload.target_company, payload.target_city
        ),
        " cargo_model_index: 0".to_string(),
        " is_articulated: false".to_string(),
        " is_cargo_market_job: true".to_string(),
        format!(" start_time: {}", game_time),
        format!(" planned_distance_km: {}", payload.distance_km),
        " ferry_time: 0".to_string(),
        " ferry_price: 0".to_string(),
        format!(" urgency: {}", payload.urgency),
        " special: null".to_string(),
        " car: null".to_string(),
        format!(" units_count: {}", units_count),
        " fill_ratio: 1".to_string(),
        "}".to_string(),
    ];

    let mut lines = arr_val.clone();
    let player = lines.iter().position(|line| line.starts_with("player :"))?;
    let player_end = player + 1 + lines.iter().skip(player + 1).position(|line| line.trim() == "}")?;
    let current_job = player + 1
        + lines
            .iter()
            .skip(player + 1)
            .position(|line| line.trim().starts_with("current_job:"))?;
    lines[current_job] = format!(" current_job: {}", job_id);
    lines.splice(player_end + 1..player_end + 1, job_lines);

    teleport_player(&mut lines, source_placement)?;

    Some(lines)
}

pub fn start_route(
    arr_val: &Vec<String>,
    payload: &CustomRoutePayload,
    catalog: Option<&RouteCatalog>,
) -> Option<Vec<String>> {
    match payload.start_mode.as_deref().unwrap_or("offer") {
        "offer" => set_custom_route(arr_val, payload),
        "teleport" => {
            let key = format!("{}.{}", payload.source_company, payload.source_city);
            let place = catalog?.places.get(&key)?;
            // The offer's trailer waits on the first spot, so park on another one.
            let spot = place
                .trailer
                .last()
                .or(place.long_trailer.last())
                .or(place.easy.as_ref())?;

            let mut lines = set_custom_route(arr_val, payload)?;
            teleport_player(&mut lines, spot)?;
            Some(lines)
        }
        "take_now" => take_job_now(arr_val, payload, catalog?),
        _ => None,
    }
}

fn is_valid_route_payload(payload: &CustomRoutePayload) -> bool {
    // A running job is a `player_job` with game-generated placement data.
    // set_custom_route only creates job offers and lets the game create the
    // active player job when the player accepts that offer; take_job_now writes
    // the placements itself, so both share this validation.
    //
    // Offers always carry a company trailer. The game builds the cargo market
    // ("own" trailer) from cargo_offer_seeds, so it can't be written as an offer.
    payload.apply_mode == "offer"
        && is_safe_sii_token(&payload.source_city)
        && is_safe_sii_token(&payload.source_company)
        && is_safe_sii_token(&payload.target_city)
        && is_safe_sii_token(&payload.target_company)
        && is_safe_sii_token(payload.cargo.strip_prefix("cargo.").unwrap_or(&payload.cargo))
        && !(payload.source_city == payload.target_city
            && payload.source_company == payload.target_company)
        && payload.units_count != 0
        && payload.urgency <= 2
        && payload.distance_km != 0
        && !payload
            .trailer_mode
            .as_deref()
            .is_some_and(|mode| mode != "freight")
        && !payload
            .trailer_definition
            .as_deref()
            .is_some_and(|value| value != "null" && !is_safe_sii_token(value))
        && !payload
            .trailer_variant
            .as_deref()
            .is_some_and(|value| value != "null" && !is_safe_sii_token(value))
}

pub fn set_custom_route(
    arr_val: &Vec<String>,
    payload: &CustomRoutePayload,
) -> Option<Vec<String>> {
    if !is_valid_route_payload(payload) {
        return None;
    }

    let mut lines = arr_val.clone();

    // 1. Clean up old custom blocks (_nameless.tt_custom_off, truckyref.*, _nameless.tt_*)
    let mut cleaned: Vec<String> = Vec::with_capacity(lines.len());
    let mut removed_custom_job_ids: HashSet<String> = HashSet::new();
    let mut i = 0;
    while i < lines.len() {
        let line = &lines[i];
        let tr = line.trim();
        if tr.starts_with("job_offer_data : _nameless.tt_custom_off")
            || tr.starts_with("job_info : truckyref.")
            || tr.starts_with("job_info : _nameless.tt_")
            || tr.starts_with("player_job : _nameless.tt_")
        {
            if tr.starts_with("job_info : truckyref.")
                || tr.starts_with("job_info : _nameless.tt_")
                || tr.starts_with("player_job : _nameless.tt_")
            {
                if let Some(id) = tr.split_whitespace().nth(2) {
                    removed_custom_job_ids.insert(id.to_string());
                }
            }
            while i < lines.len() && lines[i].trim() != "}" {
                i += 1;
            }
            i += 1; // skip closing brace
            continue;
        }
        cleaned.push(line.clone());
        i += 1;
    }
    lines = cleaned;

    // 2. Parse game time
    let mut game_time: u64 = 1000;
    for item in lines.iter() {
        if item.contains("game_time:") {
            if let Some(val_str) = item.split(':').nth(1) {
                if let Ok(time_num) = val_str.trim().parse::<u64>() {
                    game_time = time_num;
                    break;
                }
            }
        }
    }

    // Expiration in realistic in-game minutes (around 24-48h in game)
    let time_limit = game_time.saturating_add(1500 + (payload.distance_km as u64 * 2));
    let cargo_raw = payload.cargo.replace("cargo.", "");
    let cargo_id = format!("cargo.{}", cargo_raw);

    // 3. Find source company block
    let comp_pattern = format!(
        "company : company.volatile.{}.{} {{",
        payload.source_company, payload.source_city
    );
    let mut comp_idx: Option<usize> = None;
    for (idx, line) in lines.iter().enumerate() {
        if line.trim().starts_with(&comp_pattern) {
            comp_idx = Some(idx);
            break;
        }
    }

    let comp_start = comp_idx?;

    let mut comp_offer_id: Option<String> = None;

    for line in lines.iter().skip(comp_start + 1) {
        if line.trim() == "}" {
            break;
        }
        let tr = line.trim();
        if tr.starts_with("job_offer[0]:") {
            if let Some(val) = line.split(':').nth(1) {
                comp_offer_id = Some(val.trim().replace('"', ""));
            }
        }
    }

    let offer_id = comp_offer_id?;

    let target_company_pattern = format!(
        "company : company.volatile.{}.{} {{",
        payload.target_company, payload.target_city
    );
    if !lines
        .iter()
        .any(|line| line.trim().starts_with(&target_company_pattern))
    {
        return None;
    }

    // 4. Resolve cargo, trailer and company truck from offers saved by the game
    let saved_offers = parse_saved_freight_offers(&lines);
    let trailer = resolve_freight_trailer(
        &saved_offers,
        &cargo_raw,
        payload
            .trailer_definition
            .as_deref()
            .filter(|value| is_set_sii_value(value)),
        payload
            .trailer_variant
            .as_deref()
            .filter(|value| is_set_sii_value(value)),
        payload.units_count,
    )?;

    // 5. Replace job_offer_data for comp_offer_id
    let offer_prefix = format!("job_offer_data : {}", offer_id);
    let mut offer_line_idx: Option<usize> = None;
    for (idx, line) in lines.iter().enumerate() {
        if line.trim() == format!("{} {{", offer_prefix) {
            offer_line_idx = Some(idx);
            break;
        }
    }

    let off_idx = offer_line_idx?;
    let mut end_idx: Option<usize> = None;
    for k in off_idx + 1..lines.len() {
        if lines[k].trim() == "}" {
            end_idx = Some(k);
            break;
        }
    }
    let end_idx = end_idx?;

    let target_company_str = format!("\"{}.{}\"", payload.target_company, payload.target_city);

    let new_offer_lines = vec![
        format!("job_offer_data : {} {{", offer_id),
        format!(" target: {}", target_company_str),
        format!(" expiration_time: {}", time_limit),
        format!(" urgency: {}", payload.urgency),
        format!(" shortest_distance_km: {}", payload.distance_km),
        " ferry_time: 0".to_string(),
        " ferry_price: 0".to_string(),
        format!(" cargo: {}", cargo_id),
        format!(" company_truck: {}", trailer.company_truck),
        format!(" trailer_variant: {}", trailer.variant),
        format!(" trailer_definition: {}", trailer.definition),
        format!(" units_count: {}", trailer.units_count),
        " fill_ratio: 1".to_string(),
        " trailer_place: 0".to_string(),
        "}".to_string(),
    ];

    lines.splice(off_idx..=end_idx, new_offer_lines);

    // 6. Move the expiry event of the source company's job offer 0 to the new expiration
    let event_unit_link = format!(
        "unit_link: company.volatile.{}.{}",
        payload.source_company, payload.source_city
    );
    let mut event_id: Option<String> = None;
    for i in 0..lines.len() {
        let Some(id) = lines[i]
            .trim()
            .strip_prefix("economy_event : ")
            .and_then(|rest| rest.strip_suffix(" {"))
        else {
            continue;
        };

        let mut has_unit_link = false;
        let mut has_param_0 = false;
        for line in lines.iter().skip(i + 1) {
            let tr = line.trim();
            if tr == "}" {
                break;
            }
            has_unit_link = has_unit_link || tr == event_unit_link;
            has_param_0 = has_param_0 || tr == "param: 0";
        }

        if has_unit_link && has_param_0 {
            event_id = Some(id.to_string());
            break;
        }
    }
    reschedule_economy_event(&mut lines, &event_id?, time_limit)?;

    // 7. Remove only stale references to custom job blocks removed above.
    // Preserve the game's current_job and every unrelated selected_job.
    if !removed_custom_job_ids.is_empty() {
        for i in 0..lines.len() {
            if lines[i].starts_with("player :") {
                for k in i + 1..lines.len() {
                    let is_close = lines[k].trim() == "}";
                    for key in ["selected_job", "current_job"] {
                        if let Some(id) = lines[k]
                            .trim()
                            .strip_prefix(key)
                            .and_then(|rest| rest.strip_prefix(':'))
                            .map(str::trim)
                        {
                            if removed_custom_job_ids.contains(id) {
                                lines[k] = format!(" {}: null", key);
                            }
                        }
                    }
                    if is_close {
                        break;
                    }
                }
                break;
            }
        }
    }

    Some(lines)
}

#[cfg(test)]
mod tests {
    use super::{
        format_sii_number, get_route_catalog, get_save_game_route_data, move_placement_forward,
        parse_sii_number, set_custom_route, start_route,
    };
    use crate::structs::vec_routes::CustomRoutePayload;

    const DRYVAN: &str = "trailer_def.scs.box.single_53.dryvan";
    const DRYVAN_VARIANT: &str = "trailer.scs_box_53";

    fn sample_save() -> Vec<String> {
        [
            "SiiNunit {",
            " game_time: 12345",
            "company : company.volatile.src_co.source_city {",
            " job_offer: 1",
            " job_offer[0]: offer.source",
            " cargo_offer_seeds[0]: 1234",
            "}",
            "company : company.volatile.dst_co.target_city {",
            " job_offer: 1",
            " job_offer[0]: offer.live",
            "}",
            "company : company.volatile.no_slots.target_city {",
            " job_offer: 0",
            "}",
            "player : player.id {",
            " current_job: player_job.existing",
            " selected_job: truckyref.mtfdeadbeef",
            "}",
            "player_job : player_job.existing {",
            " cargo: cargo.existing",
            "}",
            "job_info : truckyref.mtfdeadbeef {",
            " cargo: cargo.old",
            "}",
            "job_offer_data : offer.source {",
            " target: \"\"",
            " expiration_time: nil",
            " urgency: nil",
            " shortest_distance_km: 0",
            " ferry_time: 0",
            " ferry_price: 0",
            " cargo: cargo.stale",
            " company_truck: stale_truck",
            " trailer_variant: trailer.stale",
            " trailer_definition: trailer_def.stale",
            " units_count: 0",
            " fill_ratio: 1",
            " trailer_place: 0",
            "}",
            "job_offer_data : offer.live {",
            " target: \"src_co.source_city\"",
            " expiration_time: 13000",
            " urgency: 0",
            " shortest_distance_km: 100",
            " ferry_time: 0",
            " ferry_price: 0",
            " cargo: cargo.computers",
            " company_truck: \"heavy/volvo_vnl\"",
            " trailer_variant: trailer.scs_box_53",
            " trailer_definition: trailer_def.scs.box.single_53.dryvan",
            " units_count: 24",
            " fill_ratio: 1",
            " trailer_place: 0",
            "}",
            "economy_event_queue : queue.id {",
            " data: 4",
            " data[0]: event.live",
            " data[1]: event.source",
            " data[2]: event.middle",
            " data[3]: event.last",
            "}",
            "economy_event : event.live {",
            " time: 13000",
            " unit_link: company.volatile.dst_co.target_city",
            " param: 0",
            "}",
            "economy_event : event.source {",
            " time: 14000",
            " unit_link: company.volatile.src_co.source_city",
            " param: 0",
            "}",
            "economy_event : event.middle {",
            " time: 14500",
            " unit_link: company.volatile.src_co.source_city2",
            " param: 0",
            "}",
            "economy_event : event.last {",
            " time: 20000",
            " unit_link: company.volatile.dst_co.target_city",
            " param: 1",
            "}",
            "}",
        ]
        .iter()
        .map(|line| line.to_string())
        .collect()
    }

    fn payload(apply_mode: &str) -> CustomRoutePayload {
        CustomRoutePayload {
            source_city: "source_city".to_string(),
            source_company: "src_co".to_string(),
            target_city: "target_city".to_string(),
            target_company: "dst_co".to_string(),
            cargo: "computers".to_string(),
            units_count: 24,
            urgency: 1,
            distance_km: 450,
            apply_mode: apply_mode.to_string(),
            trailer_mode: Some("freight".to_string()),
            trailer_definition: Some(DRYVAN.to_string()),
            trailer_variant: Some(DRYVAN_VARIANT.to_string()),
            start_mode: None,
            game: None,
        }
    }

    fn block_of(lines: &[String], header: &str) -> Vec<String> {
        lines
            .iter()
            .skip_while(|line| !line.starts_with(header))
            .take_while(|line| line.trim() != "}")
            .map(|line| line.trim().to_string())
            .collect()
    }

    #[test]
    fn offer_keeps_the_active_job_and_clears_only_its_removed_custom_selection() {
        let result = set_custom_route(&sample_save(), &payload("offer")).unwrap();

        assert!(result
            .iter()
            .any(|line| line.trim() == "current_job: player_job.existing"));
        assert!(result
            .iter()
            .any(|line| line.trim() == "selected_job: null"));
        assert!(!result
            .iter()
            .any(|line| line.contains("job_info : truckyref.mtfdeadbeef")));

        let offer = block_of(&result, "job_offer_data : offer.source");
        assert!(offer.contains(&"target: \"dst_co.target_city\"".to_string()));
        assert!(offer.contains(&"cargo: cargo.computers".to_string()));
        assert!(offer.contains(&"company_truck: \"heavy/volvo_vnl\"".to_string()));
        assert!(offer.contains(&format!("trailer_definition: {}", DRYVAN)));
        assert!(offer.contains(&format!("trailer_variant: {}", DRYVAN_VARIANT)));
    }

    #[test]
    fn current_job_pointing_at_a_removed_custom_job_is_cleared() {
        let save: Vec<String> = sample_save()
            .into_iter()
            .map(|line| {
                if line == " current_job: player_job.existing" {
                    " current_job: truckyref.mtfdeadbeef".to_string()
                } else {
                    line
                }
            })
            .collect();

        let result = set_custom_route(&save, &payload("offer")).unwrap();

        assert!(result.iter().any(|line| line == " current_job: null"));
    }

    #[test]
    fn expiry_event_stays_sorted_in_the_economy_queue() {
        let result = set_custom_route(&sample_save(), &payload("offer")).unwrap();

        // 12345 + 1500 + 450 * 2
        assert!(block_of(&result, "economy_event : event.source")
            .contains(&"time: 14745".to_string()));
        assert_eq!(
            block_of(&result, "job_offer_data : offer.source")
                .iter()
                .find(|line| line.starts_with("expiration_time:"))
                .unwrap(),
            "expiration_time: 14745"
        );

        let queue = block_of(&result, "economy_event_queue :");
        assert_eq!(
            queue[2..].to_vec(),
            vec![
                "data[0]: event.live",
                "data[1]: event.middle",
                "data[2]: event.source",
                "data[3]: event.last",
            ]
        );
    }

    #[test]
    fn saving_a_route_twice_is_stable() {
        let once = set_custom_route(&sample_save(), &payload("offer")).unwrap();
        let twice = set_custom_route(&once, &payload("offer")).unwrap();

        assert_eq!(once, twice);
    }

    #[test]
    fn units_are_limited_to_what_the_game_loads_on_that_trailer() {
        let mut route = payload("offer");
        route.units_count = 60;

        let result = set_custom_route(&sample_save(), &route).unwrap();

        assert!(block_of(&result, "job_offer_data : offer.source")
            .contains(&"units_count: 24".to_string()));
    }

    #[test]
    fn cargo_market_routes_are_rejected() {
        let mut route = payload("offer");
        route.trailer_mode = Some("own".to_string());

        assert!(set_custom_route(&sample_save(), &route).is_none());
    }

    #[test]
    fn cargo_or_trailer_missing_from_the_save_is_rejected() {
        let mut unknown_cargo = payload("offer");
        unknown_cargo.cargo = "apples".to_string();
        assert!(set_custom_route(&sample_save(), &unknown_cargo).is_none());

        let mut unknown_trailer = payload("offer");
        unknown_trailer.trailer_definition = Some("trailer_def.scs.other".to_string());
        assert!(set_custom_route(&sample_save(), &unknown_trailer).is_none());

        let mut stale_cargo = payload("offer");
        stale_cargo.cargo = "stale".to_string();
        assert!(set_custom_route(&sample_save(), &stale_cargo).is_none());
    }

    #[test]
    fn route_to_the_same_company_is_rejected() {
        let mut route = payload("offer");
        route.target_city = route.source_city.clone();
        route.target_company = route.source_company.clone();

        assert!(set_custom_route(&sample_save(), &route).is_none());
    }

    #[test]
    fn company_without_offer_slots_is_rejected() {
        let mut route = payload("offer");
        route.source_company = "no_slots".to_string();
        route.source_city = "target_city".to_string();

        assert!(set_custom_route(&sample_save(), &route).is_none());
    }

    #[test]
    fn legacy_active_job_payload_is_rejected_without_changing_input() {
        let save = sample_save();
        let result = set_custom_route(&save, &payload("active_job"));

        assert!(result.is_none());
        assert!(save
            .iter()
            .any(|line| line.trim() == "current_job: player_job.existing"));
    }

    #[test]
    fn malformed_sii_identifiers_are_rejected() {
        let save = sample_save();
        let mut route = payload("offer");
        route.target_city = "target_city\n}".to_string();

        assert!(set_custom_route(&save, &route).is_none());
    }

    #[test]
    fn route_data_only_offers_what_the_save_can_resolve() {
        let data = get_save_game_route_data(&sample_save(), None);

        assert_eq!(data.cargos, vec!["computers".to_string()]);
        let trailers = &data.cargo_trailers["computers"];
        assert_eq!(trailers.len(), 1);
        assert_eq!(trailers[0].definition, DRYVAN);
        assert_eq!(trailers[0].max_units, 24);

        let target_city = data
            .origin_companies_by_city
            .iter()
            .find(|entry| entry.city == "target_city")
            .unwrap();
        assert_eq!(target_city.companies, vec!["dst_co".to_string()]);
    }

    #[test]
    fn route_catalogs_keep_each_game_apart() {
        let ats = get_route_catalog("ats").unwrap();
        let ets2 = get_route_catalog("ets2").unwrap();

        assert!(ats.cities.contains_key("ardmore") && !ets2.cities.contains_key("ardmore"));
        assert!(ets2.cities.contains_key("madrid") && !ats.cities.contains_key("madrid"));
        assert!(get_route_catalog("other").is_none());
    }

    #[test]
    fn sii_numbers_round_trip() {
        assert_eq!(parse_sii_number("&3f800000"), Some(1.0));
        assert_eq!(parse_sii_number("20"), Some(20.0));
        assert_eq!(format_sii_number(20.0), "20");
        assert_eq!(format_sii_number(0.5), "&3f000000");
    }

    #[test]
    fn truck_is_placed_ahead_of_the_trailer_along_its_heading() {
        // No rotation faces the game's forward axis, -Z.
        assert_eq!(
            move_placement_forward("(10, 5, 100) (1; 0, 0, 0)", 16.0).unwrap(),
            "(10, 5, 84) (1; 0, 0, 0)"
        );
        // A half turn around Y faces +Z.
        assert_eq!(
            move_placement_forward("(10, 5, 100) (0; 0, 1, 0)", 16.0).unwrap(),
            "(10, 5, 116) (0; 0, 1, 0)"
        );
    }

    #[test]
    fn unknown_start_mode_and_missing_catalog_are_rejected() {
        let mut route = payload("offer");
        route.start_mode = Some("anything".to_string());
        assert!(start_route(&sample_save(), &route, None).is_none());

        route.start_mode = Some("teleport".to_string());
        assert!(start_route(&sample_save(), &route, None).is_none());

        route.start_mode = Some("take_now".to_string());
        assert!(start_route(&sample_save(), &route, None).is_none());
    }
}
