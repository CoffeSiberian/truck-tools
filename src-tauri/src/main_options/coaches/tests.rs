use super::*;

fn fixture() -> Vec<String> {
    let mut lines: Vec<String> = "SiiNunit\n{\nplayer : player.id {\n buses: 1\n buses[0]: coach.owned\n trucks: 1\n trucks[0]: truck.id\n my_vehicles: 2\n my_vehicles[0]: slot.truck\n my_vehicles[1]: slot.coach\n assigned_vehicles: slot.coach\n current_bus_job: job.id\n}\nplayer_vehicles : slot.truck {\n vehicle: truck.id\n}\nplayer_vehicles : slot.coach {\n vehicle: coach.current\n}\nplayer_bus_job : job.id {\n company_bus: coach.current\n}\n".lines().map(str::to_owned).collect();
    for (id, kind) in [
        ("coach.owned", "bus"),
        ("coach.current", "bus"),
        ("truck.id", "truck"),
        ("coach.offer", "bus"),
        ("trailer.id", "trailer"),
    ] {
        lines.extend(format!("vehicle : {id} {{\n license_plate_type: {kind}\n license_plate: \"TEST|germany\"\n engine_wear: 0.4\n engine_wear_unfixable: 0.2\n transmission_wear: 0.3\n transmission_wear_unfixable: 0.1\n cabin_wear: 0.3\n cabin_wear_unfixable: 0.1\n chassis_wear: 0.5\n chassis_wear_unfixable: 0.2\n wheels_wear: 2\n wheels_wear[0]: 0.6\n wheels_wear[1]: 0.7\n wheels_wear_unfixable: 2\n wheels_wear_unfixable[0]: 0.1\n wheels_wear_unfixable[1]: 0.2\n odometer: 210361\n integrity_odometer: 210361\n odometer_float_part: &36b4eddc\n integrity_odometer_float_part: &36b4eddc\n trip_distance_km: 12\n fuel_relative: 0.7\n passenger_mass: 2925\n accessories: 3\n accessories[0]: {id}.data\n accessories[1]: {id}.cabin\n accessories[2]: {id}.paint\n}}\nvehicle_accessory : {id}.data {{\n data_path: \"/def/vehicle/bus/scania.touring_23/data.sii\"\n}}\nvehicle_accessory : {id}.cabin {{\n data_path: \"/def/vehicle/bus/scania.touring_23/cabin/137h6.sii\"\n}}\nvehicle_paint_job_accessory : {id}.paint {{\n data_path: \"/def/vehicle/bus/scania.touring_23/paint_job/color0_b.sii\"\n base_color: (1, 0, 0)\n mask_r_color: (0.4, 0.2, 0.1)\n refund: 0\n}}\n").lines().map(str::to_owned));
    }
    // The truck must have a truck definition despite sharing the vehicle structure.
    let index = units(&lines).unwrap();
    let truck_data = index["truck.id.data"].start + 1;
    lines[truck_data] = " data_path: \"/def/vehicle/truck/scania.s_2016/data.sii\"".to_owned();
    lines.push("}".to_owned());
    lines
}

fn block(lines: &[String], id: &str) -> Vec<String> {
    let index = units(lines).unwrap();
    let u = &index[id];
    lines[u.start..=u.end].to_vec()
}

#[test]
fn list_includes_owned_and_current_coach_once_but_excludes_market_and_truck() {
    let response = list_coaches(&fixture()).unwrap();
    assert!(response.res);
    assert_eq!(response.current_coach_id.as_deref(), Some("coach.current"));
    assert_eq!(
        response
            .coaches
            .iter()
            .map(|c| c.id.as_str())
            .collect::<Vec<_>>(),
        ["coach.owned", "coach.current"]
    );
    assert_eq!(response.coaches[0].odometer, Some(210361));
    assert_eq!(response.coaches[0].paint_color.as_deref(), Some("#ff0000"));
    assert!(!response.coaches[0].paint_jobs.is_empty());
}

#[test]
fn repair_selected_and_bulk_do_not_touch_other_vehicles_or_vehicle_stats() {
    let original = fixture();
    let single = edit_coach(&original, &CoachEdit::Repair).unwrap();
    assert_eq!(
        block(&single, "coach.owned"),
        block(&original, "coach.owned")
    );
    let bulk = edit_coach(&original, &CoachEdit::RepairAll).unwrap();
    for result in [&single, &bulk] {
        for id in ["truck.id", "coach.offer", "trailer.id"] {
            assert_eq!(block(result, id), block(&original, id));
        }
        let current = block(result, "coach.current");
        assert!(current.iter().any(|l| l == " wheels_wear: 2"));
        assert!(current.iter().any(|l| l == " odometer: 210361"));
        assert!(current.iter().any(|l| l == " passenger_mass: 2925"));
        for line in &current {
            if let Some((key, value)) = line.split_once(':') {
                if key.contains("wear") && (key.contains('[') || !key.contains("wheels")) {
                    assert_eq!(value.trim(), "0");
                }
            }
        }
    }
    assert!(
        block(&bulk, "coach.owned")
            .iter()
            .any(|l| l == " engine_wear: 0")
    );
}

#[test]
fn edits_reject_trucks_market_vehicles_bad_values_and_missing_units() {
    let original = fixture();
    for target in ["truck.id", "null", "missing"] {
        let mut changed = original.clone();
        let index = units(&changed).unwrap();
        let slot = &index["slot.coach"];
        let field = fields(&changed, slot)
            .find(|(_, key, _)| *key == "vehicle")
            .unwrap()
            .0;
        changed[field] = format!(" vehicle: {target}");
        assert!(edit_coach(&changed, &CoachEdit::Repair).is_none());
    }
    assert!(edit_coach(&original, &CoachEdit::Odometer { km: u32::MAX }).is_none());
    for text in ["", "BAD\n}", "BAD\"", "<img>"] {
        assert!(
            edit_coach(
                &original,
                &CoachEdit::LicensePlate {
                    text: text.into(),
                    background: "#ffffff".into(),
                    foreground: "#000000".into(),
                    margin: false
                }
            )
            .is_none()
        );
    }
    let mut malformed = original.clone();
    malformed.push("vehicle : unfinished {".into());
    assert!(edit_coach(&malformed, &CoachEdit::RepairAll).is_none());
}

#[test]
fn mileage_and_plate_change_only_selected_coach() {
    let original = fixture();
    let mileage = edit_coach(&original, &CoachEdit::Odometer { km: 12345 }).unwrap();
    let index = units(&mileage).unwrap();
    let current = &index["coach.current"];
    assert_eq!(value(&mileage, current, "odometer"), Some("12345"));
    assert_eq!(
        value(&mileage, current, "integrity_odometer"),
        Some("12345")
    );
    assert_eq!(value(&mileage, current, "odometer_float_part"), Some("0"));
    assert_eq!(
        block(&mileage, "coach.owned"),
        block(&original, "coach.owned")
    );
    let plate = edit_coach(
        &original,
        &CoachEdit::LicensePlate {
            text: "COACH 123".into(),
            background: "#123456".into(),
            foreground: "#ffffff".into(),
            margin: true,
        },
    )
    .unwrap();
    assert!(
        block(&plate, "coach.current")
            .iter()
            .any(|l| l.contains("COACH 123|belgium"))
    );
    assert_eq!(block(&plate, "truck.id"), block(&original, "truck.id"));
}

#[test]
fn paint_must_match_cabin_and_preserves_current_masks_when_only_recoloring() {
    let original = fixture();
    for path in [
        "/def/vehicle/truck/invalid.sii",
        "/def/vehicle/bus/scania.touring_23/paint_job/color0_a.sii",
    ] {
        assert!(
            edit_coach(
                &original,
                &CoachEdit::PaintJob {
                    path: path.into(),
                    color: None
                }
            )
            .is_none()
        );
    }
    let edit = CoachEdit::PaintJob {
        path: "/def/vehicle/bus/scania.touring_23/paint_job/color0_b.sii".into(),
        color: Some("#00ff00".into()),
    };
    let result = edit_coach(&original, &edit).unwrap();
    let paint = block(&result, "coach.current.paint");
    assert!(paint.iter().any(|l| l == " base_color: (0, 1, 0)"));
    assert!(paint.iter().any(|l| l == " mask_r_color: (0.4, 0.2, 0.1)"));
    assert_eq!(
        block(&result, "coach.owned.paint"),
        block(&original, "coach.owned.paint")
    );
    let mut shared = original.clone();
    let index = units(&shared).unwrap();
    let line = fields(&shared, &index["truck.id"])
        .find(|(_, k, _)| *k == "accessories[2]")
        .unwrap()
        .0;
    shared[line] = " accessories[2]: coach.current.paint".into();
    assert!(edit_coach(&shared, &edit).is_none());
}

#[test]
fn empty_fleet_is_successful_to_read_but_cannot_be_repaired() {
    let lines = vec![
        "SiiNunit".into(),
        "{".into(),
        "player : player.id {".into(),
        " buses: 0".into(),
        "}".into(),
        "}".into(),
    ];
    assert!(list_coaches(&lines).unwrap().coaches.is_empty());
    assert!(edit_coach(&lines, &CoachEdit::RepairAll).is_none());
}

#[test]
fn repair_handles_new_coaches_with_empty_wheel_wear_arrays() {
    let original = fixture();
    let index = units(&original).unwrap();
    let owned = &index["coach.owned"];
    let fresh: Vec<_> = original
        .iter()
        .enumerate()
        .filter_map(|(i, line)| {
            if i > owned.start && i < owned.end {
                let key = line
                    .trim()
                    .split_once(':')
                    .map(|(key, _)| key)
                    .unwrap_or("");
                if key.starts_with("wheels_wear[") || key.starts_with("wheels_wear_unfixable[") {
                    return None;
                }
                if key == "wheels_wear" || key == "wheels_wear_unfixable" {
                    return Some(format!(" {key}: 0"));
                }
            }
            Some(line.clone())
        })
        .collect();
    let repaired = edit_coach(&fresh, &CoachEdit::RepairAll).unwrap();
    let index = units(&repaired).unwrap();
    for id in ["coach.owned", "coach.current"] {
        let u = &index[id];
        assert_eq!(value(&repaired, u, "engine_wear"), Some("0"));
        assert_eq!(value(&repaired, u, "transmission_wear"), Some("0"));
        assert_eq!(value(&repaired, u, "odometer"), Some("210361"));
    }
    let owned = &index["coach.owned"];
    assert_eq!(value(&repaired, owned, "wheels_wear"), Some("0"));
    assert!(!fields(&repaired, owned).any(|(_, key, _)| key.starts_with("wheels_wear[")));
    for id in ["truck.id", "coach.offer", "trailer.id"] {
        assert_eq!(block(&repaired, id), block(&fresh, id));
    }
    // The same new coach can be repaired when it becomes the current vehicle.
    let mut assigned = fresh;
    let index = units(&assigned).unwrap();
    let i = fields(&assigned, &index["slot.coach"])
        .find(|(_, key, _)| *key == "vehicle")
        .unwrap()
        .0;
    assigned[i] = " vehicle: coach.owned".into();
    assert!(edit_coach(&assigned, &CoachEdit::Repair).is_some());
}

#[test]
fn reused_truck_helpers_cannot_escape_units_with_noncanonical_closing_whitespace() {
    let mut original = fixture();
    for line in &mut original {
        if line == "}" {
            *line = "} \r".to_owned();
        }
    }
    let result = edit_coach(&original, &CoachEdit::Repair).unwrap();
    for id in ["coach.owned", "truck.id", "coach.offer", "trailer.id"] {
        assert_eq!(block(&result, id), block(&original, id));
    }
    let index = units(&original).unwrap();
    let plate = fields(&original, &index["coach.current"])
        .find(|(_, key, _)| *key == "license_plate")
        .unwrap()
        .0;
    original.remove(plate);
    assert!(
        edit_coach(
            &original,
            &CoachEdit::LicensePlate {
                text: "COACH".into(),
                background: "#ffffff".into(),
                foreground: "#000000".into(),
                margin: false
            }
        )
        .is_none()
    );
}

fn powertrain_fixture() -> Vec<String> {
    let mut lines = fixture();
    for id in [
        "coach.owned",
        "coach.current",
        "truck.id",
        "coach.offer",
        "trailer.id",
    ] {
        let index = units(&lines).unwrap();
        let u = &index[id];
        let count = fields(&lines, u)
            .find(|(_, k, _)| *k == "accessories")
            .unwrap()
            .0;
        let end = u.end;
        lines[count] = " accessories: 5".into();
        lines.splice(
            end..end,
            [
                format!(" accessories[3]: {id}.engine"),
                format!(" accessories[4]: {id}.transmission"),
            ],
        );
        for (kind, file) in [("engine", "dc13_450"), ("transmission", "grso895")] {
            lines.extend(format!("vehicle_accessory : {id}.{kind} {{\n data_path: \"/def/vehicle/bus/scania.touring_23/{kind}/{file}.sii\"\n refund: 100\n}}\n").lines().map(str::to_owned));
        }
    }
    lines
}

#[test]
fn powertrain_reads_current_configuration_and_lists_all_coach_brands() {
    let response = list_coaches(&powertrain_fixture()).unwrap();
    let coach = response
        .coaches
        .iter()
        .find(|c| Some(&c.id) == response.current_coach_id.as_ref())
        .unwrap();
    assert_eq!(coach.engines.len(), 6);
    assert_eq!(coach.transmissions.len(), 10);
    assert_eq!(
        coach.engine.as_deref(),
        Some("/def/vehicle/bus/scania.touring_23/engine/dc13_450.sii")
    );
    assert_eq!(
        coach.transmission.as_deref(),
        Some("/def/vehicle/bus/scania.touring_23/transmission/grso895.sii")
    );
    let models: HashSet<_> = coach.engines.iter().map(|p| p.model.as_str()).collect();
    assert_eq!(
        models,
        HashSet::from(["man.lions_24", "scania.touring_23", "volvo.9700_23"])
    );
}

#[test]
fn engine_and_transmission_change_only_current_accessory_and_preserve_other_fields() {
    let original: Vec<_> = powertrain_fixture()
        .into_iter()
        .map(|l| {
            l.replace("scania.touring_23", "volvo.9700_23")
                .replace("dc13_450.sii", "d13k460.sii")
                .replace("grso895.sii", "at2612f.sii")
        })
        .collect();
    for (kind, edit, path) in [
        (
            "engine",
            CoachEdit::Engine {
                path: "/def/vehicle/bus/volvo.9700_23/engine/d13k500.sii".into(),
            },
            "/def/vehicle/bus/volvo.9700_23/engine/d13k500.sii",
        ),
        (
            "transmission",
            CoachEdit::Transmission {
                path: "/def/vehicle/bus/volvo.9700_23/transmission/at2612f_r.sii".into(),
            },
            "/def/vehicle/bus/volvo.9700_23/transmission/at2612f_r.sii",
        ),
    ] {
        let changed = edit_coach(&original, &edit).unwrap();
        assert_eq!(original.len(), changed.len());
        assert_eq!(
            original
                .iter()
                .zip(&changed)
                .filter(|(a, b)| a != b)
                .count(),
            1
        );
        let index = units(&changed).unwrap();
        let part = &index[format!("coach.current.{kind}").as_str()];
        assert_eq!(
            value(&changed, part, "data_path"),
            Some(format!("\"{path}\"").as_str())
        );
        assert_eq!(value(&changed, part, "refund"), Some("100"));
        for id in [
            "coach.current",
            "coach.owned",
            "truck.id",
            "coach.offer",
            "trailer.id",
        ] {
            assert_eq!(block(&changed, id), block(&original, id));
        }
    }
}

#[test]
fn powertrain_rejects_wrong_kind_arbitrary_paths_and_shared_accessories() {
    let original = powertrain_fixture();
    for path in [
        "/def/vehicle/bus/volvo.9700_23/engine/missing.sii",
        "/def/vehicle/truck/scania.s_2016/engine/dc13_450.sii",
        "/def/vehicle/bus/scania.touring_23/transmission/grso895.sii",
        "\"\n}",
    ] {
        assert!(edit_coach(&original, &CoachEdit::Engine { path: path.into() }).is_none());
    }
    for kind in ["engine", "transmission"] {
        let edit = if kind == "engine" {
            CoachEdit::Engine {
                path: part_catalog(kind)[0].path.clone(),
            }
        } else {
            CoachEdit::Transmission {
                path: part_catalog(kind)[0].path.clone(),
            }
        };
        let mut shared = original.clone();
        let index = units(&shared).unwrap();
        let key = if kind == "engine" {
            "accessories[3]"
        } else {
            "accessories[4]"
        };
        let i = fields(&shared, &index["truck.id"])
            .find(|(_, k, _)| *k == key)
            .unwrap()
            .0;
        shared[i] = format!(" {key}: coach.current.{kind}");
        assert!(edit_coach(&shared, &edit).is_none());
        let mut missing = original.clone();
        let index = units(&missing).unwrap();
        let i = fields(&missing, &index["coach.current"])
            .find(|(_, k, _)| *k == key)
            .unwrap()
            .0;
        missing[i] = format!(" {key}: missing");
        assert!(edit_coach(&missing, &edit).is_none());
        let mut truck = original.clone();
        let index = units(&truck).unwrap();
        let i = fields(&truck, &index["slot.coach"])
            .find(|(_, k, _)| *k == "vehicle")
            .unwrap()
            .0;
        truck[i] = " vehicle: truck.id".into();
        assert!(edit_coach(&truck, &edit).is_none());
    }
}

#[test]
fn every_coach_powertrain_can_be_installed_across_brands_and_reloaded() {
    let original = powertrain_fixture();
    for kind in ["engine", "transmission"] {
        for part in part_catalog(kind) {
            let edit = if kind == "engine" {
                CoachEdit::Engine {
                    path: part.path.clone(),
                }
            } else {
                CoachEdit::Transmission {
                    path: part.path.clone(),
                }
            };
            let changed = edit_coach(&original, &edit).unwrap();
            assert!(
                original
                    .iter()
                    .zip(&changed)
                    .filter(|(a, b)| a != b)
                    .count()
                    <= 1
            );
            let response = list_coaches(&changed).unwrap();
            let current = response
                .coaches
                .iter()
                .find(|c| c.id == "coach.current")
                .unwrap();
            assert_eq!(current.model, "scania.touring_23");
            let actual = if kind == "engine" {
                &current.engine
            } else {
                &current.transmission
            };
            assert_eq!(actual.as_deref(), Some(part.path.as_str()));
            for id in ["coach.owned", "truck.id", "coach.offer"] {
                assert_eq!(block(&changed, id), block(&original, id));
            }
        }
    }
}

#[test]
fn coach_plate_reuses_truck_markup_without_changing_bus_type() {
    let original = fixture();
    for margin in [false, true] {
        let edit = CoachEdit::LicensePlate {
            text: "COACH 42".into(),
            background: "#123456".into(),
            foreground: "#abcdef".into(),
            margin,
        };
        let changed = edit_coach(&original, &edit).unwrap();
        assert_eq!(
            original
                .iter()
                .zip(&changed)
                .filter(|(a, b)| a != b)
                .count(),
            1
        );
        let index = units(&changed).unwrap();
        let u = &index["coach.current"];
        assert_eq!(value(&changed, u, "license_plate_type"), Some("bus"));
        let expected = super::super::license_plate::get_license_plate_formated(
            "563412", "efcdab", "COACH 42", margin,
        );
        assert_eq!(
            value(&changed, u, "license_plate"),
            Some(format!("\"{expected}\"").as_str())
        );
    }
}
