use std::collections::{HashMap, HashSet};

use serde::{Deserialize, Serialize};

use super::trucks::{set_truck_license_plate, set_truck_wear};

#[path = "coaches/jobs.rs"]
pub mod jobs;

#[derive(Serialize)]
pub struct Coach {
    pub id: String,
    pub model: String,
    pub odometer: Option<u32>,
    pub license_plate: String,
    pub paint_job: Option<String>,
    pub paint_color: Option<String>,
    pub paint_jobs: Vec<PaintJob>,
    pub engine: Option<String>,
    pub transmission: Option<String>,
    pub engines: Vec<CoachPart>,
    pub transmissions: Vec<CoachPart>,
}

#[derive(Deserialize, Serialize)]
pub struct CoachPart {
    pub path: String,
    pub name: String,
    pub model: String,
}

#[derive(Clone, Deserialize, Serialize)]
pub struct PaintJob {
    pub path: String,
    pub name: String,
    pub cabins: Vec<String>,
    pub colors: HashMap<String, String>,
}

#[derive(Serialize)]
pub struct CoachesResponse {
    pub res: bool,
    pub current_coach_id: Option<String>,
    pub coaches: Vec<Coach>,
}

#[derive(Deserialize)]
#[serde(tag = "action", rename_all = "snake_case", deny_unknown_fields)]
pub enum CoachEdit {
    Repair,
    RepairAll,
    Engine {
        path: String,
    },
    Transmission {
        path: String,
    },
    Odometer {
        km: u32,
    },
    LicensePlate {
        text: String,
        background: String,
        foreground: String,
        margin: bool,
    },
    PaintJob {
        path: String,
        color: Option<String>,
    },
}

struct Unit<'a> {
    kind: &'a str,
    id: &'a str,
    start: usize,
    end: usize,
}

// Index only decoded save units; the existing read/decrypt/save pipeline is unchanged.
fn units(lines: &[String]) -> Option<HashMap<&str, Unit<'_>>> {
    let mut result = HashMap::new();
    let mut i = 0;
    while i < lines.len() {
        if let Some(header) = lines[i].trim().strip_suffix('{') {
            if let Some((kind, id)) = header.split_once(':') {
                let start = i;
                i += 1;
                while i < lines.len() && lines[i].trim() != "}" {
                    i += 1;
                }
                if i == lines.len() {
                    return None;
                }
                let id = id.trim();
                if result
                    .insert(
                        id,
                        Unit {
                            kind: kind.trim(),
                            id,
                            start,
                            end: i,
                        },
                    )
                    .is_some()
                {
                    return None;
                }
            }
        }
        i += 1;
    }
    Some(result)
}

fn fields<'a>(lines: &'a [String], unit: &Unit) -> impl Iterator<Item = (usize, &'a str, &'a str)> {
    (unit.start + 1..unit.end).filter_map(move |i| {
        let (key, value) = lines[i].trim().split_once(':')?;
        Some((i, key.trim(), value.trim()))
    })
}

fn value<'a>(lines: &'a [String], unit: &Unit, key: &str) -> Option<&'a str> {
    fields(lines, unit)
        .find(|(_, k, _)| *k == key)
        .map(|(_, _, v)| v)
}

fn accessories<'a>(
    lines: &[String],
    unit: &Unit,
    index: &'a HashMap<&str, Unit<'a>>,
) -> Vec<&'a Unit<'a>> {
    fields(lines, unit)
        .filter(|(_, k, _)| k.starts_with("accessories["))
        .filter_map(|(_, _, id)| index.get(id))
        .collect()
}

fn coach_ids<'a>(lines: &[String], index: &'a HashMap<&str, Unit<'a>>) -> Option<Vec<&'a str>> {
    let player = index.values().find(|u| u.kind == "player")?;
    let mut candidates = Vec::new();
    for (_, key, id) in fields(lines, player) {
        if key.starts_with("buses[") {
            candidates.push(id);
        } else if key.starts_with("my_vehicles[") || key == "assigned_vehicles" {
            if let Some(slot) = index.get(id).filter(|u| u.kind == "player_vehicles") {
                if let Some(vehicle) = value(lines, slot, "vehicle") {
                    candidates.push(vehicle);
                }
            }
        } else if key == "current_bus_job" {
            if let Some(job) = index.get(id).filter(|u| u.kind == "player_bus_job") {
                if let Some(vehicle) = value(lines, job, "company_bus") {
                    candidates.push(vehicle);
                }
            }
        }
    }
    let mut seen = HashSet::new();
    Some(
        candidates
            .into_iter()
            .filter_map(|id| {
                let unit = index.get(id).filter(|u| u.kind == "vehicle")?;
                let is_coach = value(lines, unit, "license_plate_type") == Some("bus")
                    || accessories(lines, unit, index).iter().any(|a| {
                        value(lines, a, "data_path").is_some_and(|p| {
                            p.starts_with("\"/def/vehicle/bus/") && p.ends_with("/data.sii\"")
                        })
                    });
                (is_coach && seen.insert(unit.id)).then_some(unit.id)
            })
            .collect(),
    )
}

fn catalog() -> Vec<PaintJob> {
    serde_json::from_str(include_str!("../embeds/coach_paint_jobs.json")).unwrap_or_default()
}

fn part_catalog(kind: &str) -> Vec<CoachPart> {
    let catalog: Vec<CoachPart> =
        serde_json::from_str(include_str!("../embeds/coach_powertrain.json")).unwrap_or_default();
    catalog
        .into_iter()
        .filter(|p| {
            p.path
                .starts_with(&format!("/def/vehicle/bus/{}/{kind}/", p.model))
        })
        .collect()
}

fn part_accessory<'a>(
    lines: &[String],
    unit: &Unit,
    index: &'a HashMap<&str, Unit<'a>>,
    kind: &str,
) -> Option<&'a Unit<'a>> {
    let segment = format!("/{kind}/");
    let mut matches = accessories(lines, unit, index).into_iter().filter(|a| {
        a.kind == "vehicle_accessory"
            && value(lines, a, "data_path")
                .is_some_and(|p| p.starts_with("\"/def/vehicle/bus/") && p.contains(&segment))
    });
    let part = matches.next()?;
    matches.next().is_none().then_some(part)
}

fn coach_model(lines: &[String], unit: &Unit, index: &HashMap<&str, Unit<'_>>) -> Option<String> {
    accessories(lines, unit, index).into_iter().find_map(|a| {
        value(lines, a, "data_path")?
            .trim_matches('"')
            .strip_prefix("/def/vehicle/bus/")?
            .strip_suffix("/data.sii")
            .map(str::to_owned)
    })
}

fn paint_accessory<'a>(
    lines: &[String],
    unit: &Unit,
    index: &'a HashMap<&str, Unit<'a>>,
) -> Option<&'a Unit<'a>> {
    accessories(lines, unit, index)
        .into_iter()
        .find(|a| a.kind == "vehicle_paint_job_accessory")
}

fn paint_jobs(lines: &[String], unit: &Unit, index: &HashMap<&str, Unit<'_>>) -> Vec<PaintJob> {
    let cabin = accessories(lines, unit, index).into_iter().find_map(|a| {
        let path = value(lines, a, "data_path")?.trim_matches('"');
        path.contains("/cabin/").then_some(path)
    });
    let Some(cabin) = cabin else {
        return Vec::new();
    };
    catalog()
        .into_iter()
        .filter(|p| p.cabins.iter().any(|c| c == cabin))
        .collect()
}

fn linear_to_hex(color: &str) -> Option<String> {
    let components: Vec<_> = color
        .trim_matches(['(', ')'])
        .split(',')
        .map(|v| {
            let v = v.trim();
            if let Some(bits) = v.strip_prefix('&') {
                u32::from_str_radix(bits, 16).ok().map(f32::from_bits)
            } else {
                v.parse::<f32>().ok()
            }
        })
        .collect::<Option<Vec<_>>>()?;
    if components.len() != 3 || components.iter().any(|v| !v.is_finite()) {
        return None;
    }
    let rgb: Vec<_> = components
        .iter()
        .map(|v| {
            let v = v.clamp(0.0, 1.0);
            let srgb = if v <= 0.0031308 {
                v * 12.92
            } else {
                1.055 * v.powf(1.0 / 2.4) - 0.055
            };
            (srgb * 255.0).round() as u8
        })
        .collect();
    Some(format!("#{:02x}{:02x}{:02x}", rgb[0], rgb[1], rgb[2]))
}

pub fn list_coaches(lines: &[String]) -> Option<CoachesResponse> {
    let index = units(lines)?;
    let ids = coach_ids(lines, &index)?;
    let player = index.values().find(|u| u.kind == "player")?;
    let current = value(lines, player, "assigned_vehicles")
        .and_then(|id| index.get(id))
        .and_then(|slot| value(lines, slot, "vehicle"));
    let coaches = ids
        .iter()
        .filter_map(|id| {
            let unit = index.get(id)?;
            let model = coach_model(lines, unit, &index).unwrap_or_else(|| (*id).to_owned());
            let paint = paint_accessory(lines, unit, &index);
            Some(Coach {
                id: (*id).to_owned(),
                engines: part_catalog("engine"),
                transmissions: part_catalog("transmission"),
                model,
                engine: part_accessory(lines, unit, &index, "engine")
                    .and_then(|a| value(lines, a, "data_path"))
                    .map(|p| p.trim_matches('"').to_owned()),
                transmission: part_accessory(lines, unit, &index, "transmission")
                    .and_then(|a| value(lines, a, "data_path"))
                    .map(|p| p.trim_matches('"').to_owned()),
                odometer: value(lines, unit, "odometer").and_then(|v| v.parse().ok()),
                license_plate: value(lines, unit, "license_plate")
                    .unwrap_or("\"\"")
                    .trim_matches('"')
                    .to_owned(),
                paint_job: paint
                    .and_then(|a| value(lines, a, "data_path"))
                    .map(|p| p.trim_matches('"').to_owned()),
                paint_color: paint
                    .and_then(|a| value(lines, a, "base_color"))
                    .and_then(linear_to_hex),
                paint_jobs: paint_jobs(lines, unit, &index),
            })
        })
        .collect();
    Some(CoachesResponse {
        res: true,
        current_coach_id: current.filter(|id| ids.contains(id)).map(str::to_owned),
        coaches,
    })
}

fn valid_hex(color: &str) -> bool {
    color.len() == 7 && color.starts_with('#') && color[1..].bytes().all(|c| c.is_ascii_hexdigit())
}

fn hex_to_linear(color: &str) -> Option<String> {
    if !valid_hex(color) {
        return None;
    }
    let mut rgb = Vec::new();
    for start in [1, 3, 5] {
        let v = u8::from_str_radix(&color[start..start + 2], 16).ok()? as f32 / 255.0;
        rgb.push(if v <= 0.04045 {
            v / 12.92
        } else {
            ((v + 0.055) / 1.055).powf(2.4)
        });
    }
    Some(format!("({}, {}, {})", rgb[0], rgb[1], rgb[2]))
}

fn repair_vehicle(lines: &mut Vec<String>, unit: &Unit) -> Option<()> {
    // Reuse truck repairs on just this unit, so formatting cannot make them escape its boundary.
    let vehicle = lines[unit.start..=unit.end].to_vec();
    if let Some(repaired) = set_truck_wear(&vehicle, "0", 0) {
        lines[unit.start..=unit.end].clone_from_slice(&repaired);
        return Some(());
    }
    // Newly bought coaches have empty wheel wear arrays. The truck helper requires
    // wheel entries, but these vehicles still have valid component wear to repair.
    if value(lines, unit, "wheels_wear") != Some("0")
        || value(lines, unit, "wheels_wear_unfixable") != Some("0")
    {
        return None;
    }
    let wear_keys = [
        "engine_wear",
        "transmission_wear",
        "cabin_wear",
        "chassis_wear",
        "engine_wear_unfixable",
        "transmission_wear_unfixable",
        "cabin_wear_unfixable",
        "chassis_wear_unfixable",
    ];
    let replacements: Vec<_> = fields(lines, unit)
        .filter(|(_, key, _)| wear_keys.contains(key))
        .map(|(i, key, _)| (i, format!(" {key}: 0")))
        .collect();
    if replacements.is_empty() {
        return None;
    }
    for (i, replacement) in replacements {
        lines[i] = replacement;
    }
    Some(())
}

pub fn edit_coach(lines: &Vec<String>, edit: &CoachEdit) -> Option<Vec<String>> {
    let index = units(lines)?;
    let ids = coach_ids(lines, &index)?;
    if matches!(edit, CoachEdit::RepairAll) {
        if ids.is_empty() {
            return None;
        }
        let mut result = lines.clone();
        for id in ids {
            repair_vehicle(&mut result, index.get(id)?)?;
        }
        return Some(result);
    }
    let player = index.values().find(|u| u.kind == "player")?;
    let slot = index.get(value(lines, player, "assigned_vehicles")?)?;
    if slot.kind != "player_vehicles" {
        return None;
    }
    let id = value(lines, slot, "vehicle")?;
    if !ids.contains(&id) {
        return None;
    }
    let unit = index.get(id)?;
    let mut result = lines.clone();
    match edit {
        CoachEdit::Engine { path } | CoachEdit::Transmission { path } => {
            let kind = if matches!(edit, CoachEdit::Engine { .. }) {
                "engine"
            } else {
                "transmission"
            };
            if !part_catalog(kind).iter().any(|p| p.path == *path) {
                return None;
            }
            let part = part_accessory(lines, unit, &index, kind)?;
            if index
                .values()
                .filter(|u| u.kind == "vehicle" && u.id != unit.id)
                .any(|u| {
                    fields(lines, u)
                        .any(|(_, key, id)| key.starts_with("accessories[") && id == part.id)
                })
            {
                return None;
            }
            // Match truck powertrain edits: replace only the referenced accessory's definition.
            let line = fields(lines, part)
                .find(|(_, key, _)| *key == "data_path")?
                .0;
            result[line] = format!(" data_path: \"{}\"", path);
            Some(result)
        }
        CoachEdit::Repair => {
            repair_vehicle(&mut result, unit)?;
            Some(result)
        }
        CoachEdit::Odometer { km, .. } => {
            if *km > i32::MAX as u32 || value(lines, unit, "odometer").is_none() {
                return None;
            }
            for (i, key, _) in fields(lines, unit) {
                let replacement = match key {
                    "odometer" | "integrity_odometer" | "trip_distance_km" => Some(km.to_string()),
                    "odometer_float_part" | "integrity_odometer_float_part" => Some("0".to_owned()),
                    _ => None,
                };
                if let Some(v) = replacement {
                    result[i] = format!(" {}: {}", key, v);
                }
            }
            Some(result)
        }
        CoachEdit::LicensePlate {
            text,
            background,
            foreground,
            margin,
            ..
        } => {
            if text.is_empty()
                || text.len() > 128
                || text
                    .chars()
                    .any(|c| c.is_control() || ['"', '\\', '<', '>', '|'].contains(&c))
                || !valid_hex(background)
                || !valid_hex(foreground)
            {
                return None;
            }
            let convert = |color: &str| format!("{}{}{}", &color[5..7], &color[3..5], &color[1..3]);
            let vehicle = lines[unit.start..=unit.end].to_vec();
            let updated = set_truck_license_plate(
                &vehicle,
                0,
                &convert(background),
                &convert(foreground),
                text,
                *margin,
            )?;
            result[unit.start..=unit.end].clone_from_slice(&updated);
            Some(result)
        }
        CoachEdit::PaintJob { path, color, .. } => {
            let paint = paint_accessory(lines, unit, &index)?;
            if index
                .values()
                .filter(|u| u.kind == "vehicle" && u.id != unit.id)
                .any(|u| {
                    fields(lines, u)
                        .any(|(_, key, id)| key.starts_with("accessories[") && id == paint.id)
                })
            {
                return None;
            }
            // Only known paints for this exact cabin; never accept an arbitrary definition path.
            let selected = paint_jobs(lines, unit, &index)
                .into_iter()
                .find(|p| p.path == *path)?;
            let mut colors = if value(lines, paint, "data_path").map(|p| p.trim_matches('"'))
                == Some(path.as_str())
            {
                HashMap::new()
            } else {
                selected.colors
            };
            if let Some(color) = color {
                if selected.name != "pj_custom_colour"
                    && selected.name != "pj_custom_metallic_colour"
                {
                    return None;
                }
                colors.insert("base_color".to_owned(), hex_to_linear(color)?);
            }
            let path_line = fields(lines, paint).find(|(_, k, _)| *k == "data_path")?.0;
            result[path_line] = format!(" data_path: \"{}\"", path);
            let mut missing = colors.clone();
            for (i, key, _) in fields(lines, paint) {
                if let Some(color) = colors.get(key) {
                    result[i] = format!(" {}: {}", key, color);
                    missing.remove(key);
                }
            }
            let mut additions: Vec<_> = missing.into_iter().collect();
            additions.sort_by(|a, b| a.0.cmp(&b.0));
            result.splice(
                paint.end..paint.end,
                additions.into_iter().map(|(k, v)| format!(" {}: {}", k, v)),
            );
            Some(result)
        }
        CoachEdit::RepairAll => None,
    }
}

#[cfg(test)]
#[path = "coaches/tests.rs"]
mod tests;
