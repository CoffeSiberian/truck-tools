use super::*;

fn fixture() -> Vec<String> {
    let mut lines: Vec<String> = "SiiNunit\n{\neconomy : economy.id {\n game_time: 123000\n}\nplayer : player.id {\n assigned_vehicles_mode: bus\n assigned_vehicles: slot.bus\n buses: 1\n buses[0]: vehicle.bus\n current_job: null\n current_bus_job: null\n current_car_job: null\n selected_bus_offer: null\n}\nplayer_vehicles : slot.bus {\n vehicle: vehicle.bus\n}\nvehicle : vehicle.bus {\n passenger_mass: 0\n odometer: 123\n accessories: 1\n accessories[0]: chassis.bus\n}\nvehicle_accessory : chassis.bus {\n data_path: \"/def/vehicle/bus/volvo.9700_23/chassis/143_6x24.sii\"\n}\nbus_stop : bus_stop.city.a {\n discovered: false\n lines_offer: 1\n lines_offer[0]: offer.a\n}\nbus_stop : bus_stop.city.b {\n discovered: false\n lines_offer: 0\n}\nbus_stop : bus_stop.city.c {\n discovered: true\n lines_offer: 0\n}\nline_offer_data : offer.a {\n type: regular\n source: bus_stop.city.a\n saved_targets: 2\n saved_targets[0]: \"city.b\"\n saved_targets[1]: \"city.c\"\n targets_distances: 2\n targets_distances[0]: 20\n targets_distances[1]: 80\n targets_times: 2\n targets_times[0]: 30\n targets_times[1]: 95\n targets_ferry_times: 2\n targets_ferry_times[0]: 0\n targets_ferry_times[1]: 5\n targets_base_times: 2\n targets_base_times[0]: 25\n targets_base_times[1]: 70\n tight_schedule_rank: 1\n satisfaction_decrease_rank: 2\n low_acceleration_rank: 0\n}\n}\n".lines().map(str::to_owned).collect();
    lines.push(String::new());
    lines
}

fn request() -> CoachJobRequest {
    CoachJobRequest {
        generation: Generation::Accepted,
        offer_id: Some("offer.a".into()),
        coach_id: "vehicle.bus".into(),
        source: "bus_stop.city.a".into(),
        targets: vec!["city.b".into(), "city.c".into()],
        passengers: 40,
        departure_delay: 60,
    }
}

#[test]
fn generates_selected_offer_without_accepting_or_boarding() {
    let mut lines = fixture();
    let offer_end = units(&lines).unwrap()["offer.a"].end;
    lines.insert(offer_end, " bus_name: volvo_9700_23_143d6_500".into());
    let mut req = request();
    req.generation = Generation::Offer;
    let result = generate_job(&lines, &req).unwrap();
    let before = units(&lines).unwrap();
    let index = units(&result).unwrap();
    let player = &index["player.id"];
    assert_eq!(value(&result, player, "current_bus_job"), Some("null"));
    let id = value(&result, player, "selected_bus_offer").unwrap();
    let offer = &index[id];
    assert_eq!(offer.kind, "line_offer_data");
    assert_eq!(
        value(&result, offer, "bus_name"),
        Some("volvo_9700_23_143d6_500")
    );
    assert_eq!(value(&result, offer, "departure_time_of_day"), Some("660"));
    assert_eq!(value(&result, offer, "expiration_time"), Some("133080"));
    let stop = &index["bus_stop.city.a"];
    assert_eq!(value(&result, stop, "lines_offer"), Some("2"));
    assert_eq!(value(&result, stop, "lines_offer[1]"), Some(id));
    assert_eq!(
        route(&result, offer, &index).unwrap().public.targets,
        req.targets
    );
    assert!(!index.values().any(|u| u.kind.starts_with("player_bus_")));
    for (id, unit) in &before {
        if !["player.id", "bus_stop.city.a"].contains(id) {
            let after = &index[id];
            assert_eq!(
                &lines[unit.start..=unit.end],
                &result[after.start..=after.end]
            );
        }
    }
    req.offer_id = None;
    req.targets = vec!["city.c".into()];
    assert!(generate_job(&lines, &req).is_ok());
}

fn replace(lines: &mut [String], old: &str, new: &str) {
    *lines.iter_mut().find(|s| s.as_str() == old).unwrap() = new.into();
}

#[test]
fn selected_offer_preserves_inactive_game_offers_at_the_origin() {
    let mut lines = fixture();
    let index = units(&lines).unwrap();
    let offer_end = index["offer.a"].end;
    lines.insert(offer_end, " bus_name: volvo_9700_23_143d6_500".into());
    let closing = lines.iter().rposition(|s| s.trim() == "}").unwrap();
    let mut additions = Vec::new();
    for kind in ["regular", "tourist"] {
        additions.extend(
            format!("line_offer_data : inactive.{kind} {{\n type: {kind}\n source: null\n saved_targets: 0\n targets_distances: 0\n targets_times: 0\n targets_ferry_times: 0\n targets_base_times: 0\n departure_time_of_day: 0\n bus_name: \"\"\n expiration_time: 0\n tight_schedule_rank: 0\n satisfaction_decrease_rank: 0\n low_acceleration_rank: 0\n}}\n")
                .lines().map(str::to_owned),
        );
    }
    lines.splice(closing..closing, additions);
    let stop_end = units(&lines).unwrap()["bus_stop.city.a"].end;
    lines.splice(
        stop_end..stop_end,
        [
            " lines_offer[1]: inactive.regular",
            " lines_offer[2]: inactive.tourist",
        ]
        .map(str::to_owned),
    );
    replace(&mut lines, " lines_offer: 1", " lines_offer: 3");
    let before = units(&lines).unwrap();
    for custom in [false, true] {
        let mut req = request();
        req.generation = Generation::Offer;
        if custom {
            req.offer_id = None;
        }
        let result = generate_job(&lines, &req).unwrap();
        let after = units(&result).unwrap();
        let stop = &after["bus_stop.city.a"];
        let player = &after["player.id"];
        assert_eq!(value(&result, stop, "lines_offer"), Some("4"));
        assert_eq!(value(&result, player, "current_bus_job"), Some("null"));
        assert_eq!(
            value(&result, stop, "lines_offer[3]"),
            value(&result, player, "selected_bus_offer"),
        );
        for (i, id) in ["offer.a", "inactive.regular", "inactive.tourist"]
            .iter()
            .enumerate()
        {
            assert_eq!(
                value(&result, stop, &format!("lines_offer[{i}]")),
                Some(*id)
            );
            let original = &before[id];
            let updated = &after[id];
            assert_eq!(
                &lines[original.start..=original.end],
                &result[updated.start..=updated.end]
            );
        }
    }
    for invalid in ["missing.offer", "bus_stop.city.b"] {
        let mut broken = lines.clone();
        replace(&mut broken, " source: null", &format!(" source: {invalid}"));
        let mut req = request();
        req.generation = Generation::Offer;
        assert!(generate_job(&broken, &req).is_err());
    }
}

fn navigation_fixture() -> Vec<String> {
    let mut lines: Vec<_> = fixture()
        .into_iter()
        .map(|line| {
            line.replace("city.a", "city.paris")
                .replace("city.b", "city.berlin")
                .replace("city.c", "city.dortmund")
        })
        .collect();
    let economy_end = units(&lines).unwrap()["economy.id"].end;
    lines.splice(
        economy_end..economy_end,
        [
            " stored_gps_behind: 0",
            " stored_gps_ahead: 0",
            " stored_gps_behind_waypoints: 0",
            " stored_gps_ahead_waypoints: 0",
            " stored_nav_start_pos: (2147483647, 2147483647, 2147483647)",
            " stored_nav_end_pos: (2147483647, 2147483647, 2147483647)",
            " stored_online_gps_ahead_waypoints: 0",
        ]
        .map(str::to_owned),
    );
    let slot_end = units(&lines).unwrap()["slot.bus"].end;
    lines.insert(
        slot_end,
        " stored_vehicle_placement: (&3f800000, 2, -3) (1; 0, 0, 0)".into(),
    );
    let offer_end = units(&lines).unwrap()["offer.a"].end;
    lines.insert(offer_end, " bus_name: volvo_9700_23_143d6_500".into());
    lines
}

#[test]
fn navigation_routes_to_the_origin_for_offers_and_all_targets_for_accepted_jobs() {
    let mut lines = navigation_fixture();
    let mut req = request();
    req.source = "bus_stop.city.paris".into();
    req.targets = vec!["city.berlin".into(), "city.dortmund".into()];
    let positions: BTreeMap<String, Vec<NavigationPoint>> =
        serde_json::from_str(include_str!("../../../embeds/coach_stop_positions.json")).unwrap();
    assert_eq!(positions.len(), 224);
    for (generation, cities) in [
        (Generation::Offer, vec!["paris"]),
        (Generation::Accepted, vec!["berlin", "dortmund"]),
    ] {
        req.generation = generation;
        let result = generate_job(&lines, &req).unwrap();
        let index = units(&result).unwrap();
        let economy = &index["economy.id"];
        assert_eq!(
            value(&result, economy, "stored_gps_behind_waypoints"),
            Some("1")
        );
        assert_eq!(
            value(&result, economy, "stored_online_gps_ahead_waypoints"),
            Some("0")
        );
        let behind = &index[value(&result, economy, "stored_gps_behind_waypoints[0]").unwrap()];
        let point = positions
            .values()
            .flatten()
            .min_by_key(|point| {
                point
                    .position
                    .iter()
                    .zip([256i32, 512, -768])
                    .map(|(a, b)| {
                        let delta = *a as i128 - b as i128;
                        delta * delta
                    })
                    .sum::<i128>()
            })
            .unwrap();
        assert_eq!(
            value(&result, behind, "nav_node_position"),
            Some(
                format!(
                    "({}, {}, {})",
                    point.position[0], point.position[1], point.position[2]
                )
                .as_str()
            )
        );
        assert_ne!(
            value(&result, behind, "nav_node_position"),
            Some("(256, 512, -768)")
        );
        assert_eq!(
            value(&result, economy, "stored_gps_ahead_waypoints"),
            Some(cities.len().to_string().as_str())
        );
        for (i, city) in cities.iter().enumerate() {
            let waypoint = &index[value(
                &result,
                economy,
                &format!("stored_gps_ahead_waypoints[{i}]"),
            )
            .unwrap()];
            assert_eq!(waypoint.kind, "gps_waypoint_storage");
            let point = &positions[*city][0];
            let [x, y, z] = point.position;
            assert_eq!(
                value(&result, waypoint, "nav_node_position"),
                Some(format!("({x}, {y}, {z})").as_str())
            );
            assert_eq!(
                value(&result, waypoint, "direction"),
                Some(point.direction.as_str())
            );
        }
    }
    replace(
        &mut lines,
        " stored_gps_ahead_waypoints: 0",
        " stored_gps_ahead_waypoints: 1",
    );
    assert!(generate_job(&lines, &req).is_err());
}

#[test]
fn navigation_removes_detached_waypoints_and_preserves_shared_history_and_online_units() {
    let mut lines = navigation_fixture();
    let economy_end = units(&lines).unwrap()["economy.id"].end;
    lines.splice(
        economy_end..economy_end,
        [
            " stored_gps_behind_waypoints[0]: gps.old_behind",
            " stored_gps_ahead_waypoints[0]: gps.old_ahead",
            " stored_gps_ahead_waypoints[1]: gps.shared",
            " stored_gps_waypoints_history: 1",
            " stored_gps_waypoints_history[0]: gps.shared",
            " stored_online_gps_ahead_waypoints[0]: gps.online",
        ]
        .map(str::to_owned),
    );
    replace(
        &mut lines,
        " stored_gps_behind_waypoints: 0",
        " stored_gps_behind_waypoints: 1",
    );
    replace(
        &mut lines,
        " stored_gps_ahead_waypoints: 0",
        " stored_gps_ahead_waypoints: 2",
    );
    replace(
        &mut lines,
        " stored_online_gps_ahead_waypoints: 0",
        " stored_online_gps_ahead_waypoints: 1",
    );
    let closing = lines.iter().rposition(|line| line.trim() == "}").unwrap();
    let additions: Vec<_> = [
        "gps.old_behind",
        "gps.old_ahead",
        "gps.shared",
        "gps.online",
    ]
    .into_iter()
    .flat_map(|id| {
        format!(
            "gps_waypoint_storage : {id} {{\n nav_node_position: (1, 2, 3)\n direction: any\n}}\n"
        )
        .lines()
        .map(str::to_owned)
        .collect::<Vec<_>>()
    })
    .collect();
    lines.splice(closing..closing, additions);
    for generation in [Generation::Offer, Generation::Accepted] {
        let mut req = request();
        req.generation = generation;
        req.source = "bus_stop.city.paris".into();
        req.targets = vec!["city.berlin".into(), "city.dortmund".into()];
        let result = generate_job(&lines, &req).unwrap();
        let before = units(&lines).unwrap();
        let after = units(&result).unwrap();
        assert!(!after.contains_key("gps.old_behind"));
        assert!(!after.contains_key("gps.old_ahead"));
        for id in ["gps.shared", "gps.online"] {
            let original = &before[id];
            let retained = &after[id];
            assert_eq!(
                &lines[original.start..=original.end],
                &result[retained.start..=retained.end]
            );
        }
        let references: std::collections::HashSet<_> = after
            .values()
            .flat_map(|unit| fields(&result, unit).map(|(_, _, id)| id))
            .collect();
        assert!(
            after
                .values()
                .filter(|unit| unit.kind == "gps_waypoint_storage")
                .all(|unit| references.contains(unit.id)),
            "Detached GPS units create extra save unit trees"
        );
    }
}

#[test]
fn navigation_catalog_matches_game_saved_station_entrances() {
    let positions: BTreeMap<String, Vec<NavigationPoint>> =
        serde_json::from_str(include_str!("../../../embeds/coach_stop_positions.json")).unwrap();
    // Accepted quick job (save 25) and selected contract (save 26), written by the game.
    for (city, expected) in [
        ("wien", [5283074, 15936, 3635270]),
        ("tirana", [9809909, 3740, 13072845]),
    ] {
        assert_eq!(positions[city][0].position, expected);
        assert_eq!(positions[city][0].direction, "forward");
    }
    assert!(positions.values().all(|points| {
        !points.is_empty()
            && points
                .iter()
                .all(|point| ["forward", "backward"].contains(&point.direction.as_str()))
    }));
}

#[test]
fn navigation_reuses_a_nearby_saved_road_node_for_the_start() {
    let mut lines = navigation_fixture();
    let end = units(&lines).unwrap()["economy.id"].end;
    lines.splice(
        end..end,
        [
            " stored_gps_waypoints_history: 1".into(),
            " stored_gps_waypoints_history[0]: gps.nearby".into(),
        ],
    );
    let closing = lines.iter().rposition(|line| line.trim() == "}").unwrap();
    lines.splice(closing..closing,
        "gps_waypoint_storage : gps.nearby {\n nav_node_position: (260, 512, -768)\n direction: forward\n}\n"
            .lines().map(str::to_owned));
    let mut req = request();
    req.source = "bus_stop.city.paris".into();
    req.targets = vec!["city.berlin".into(), "city.dortmund".into()];
    let result = generate_job(&lines, &req).unwrap();
    let index = units(&result).unwrap();
    let behind = &index[value(
        &result,
        &index["economy.id"],
        "stored_gps_behind_waypoints[0]",
    )
    .unwrap()];
    assert_eq!(
        value(&result, behind, "nav_node_position"),
        Some("(260, 512, -768)")
    );
    assert_eq!(value(&result, behind, "direction"), Some("any"));
    assert!(index.contains_key("gps.nearby"));
}

#[test]
fn accepted_job_updates_both_boarded_and_requested_passenger_mass() {
    let mut lines = fixture();
    let end = units(&lines).unwrap()["vehicle.bus"].end;
    lines.insert(end, " requested_passenger_mass: 0".into());
    let result = generate_job(&lines, &request()).unwrap();
    let index = units(&result).unwrap();
    for key in ["passenger_mass", "requested_passenger_mass"] {
        assert_eq!(value(&result, &index["vehicle.bus"], key), Some("3000"));
    }
}

#[test]
fn generation_reports_validation_failures_without_writing_a_save() {
    let lines = fixture();
    let generated = generate_job(&lines, &request()).unwrap();
    assert!(matches!(
        generate_job(&generated, &request()),
        Err(CoachJobError::ActiveJob)
    ));
    let mut req = request();
    req.coach_id = "different.bus".into();
    assert!(matches!(
        generate_job(&lines, &req),
        Err(CoachJobError::ChangedSave)
    ));
    req = request();
    req.passengers = 79;
    assert!(matches!(
        generate_job(&lines, &req),
        Err(CoachJobError::InvalidRequest)
    ));
    req = request();
    req.offer_id = Some("missing.offer".into());
    assert!(matches!(
        generate_job(&lines, &req),
        Err(CoachJobError::ChangedSave)
    ));
    req.offer_id = None;
    req.targets = vec!["city.missing".into()];
    assert!(matches!(
        generate_job(&lines, &req),
        Err(CoachJobError::InvalidRoute)
    ));
}

#[test]
fn generates_linked_stages_passengers_and_preserves_unrelated_units() {
    let lines = fixture();
    let options = job_options(&lines).unwrap();
    assert_eq!(options.status, "ready");
    assert_eq!(options.capacity, 78);
    assert_eq!(options.routes[0].distance, 100);
    let result = generate_job(&lines, &request()).unwrap();
    let before = units(&lines).unwrap();
    let after = units(&result).unwrap();
    for (id, u) in &before {
        let updated = &after[id];
        if !["player", "vehicle"].contains(&u.kind) {
            assert_eq!(
                &lines[u.start..=u.end],
                &result[updated.start..=updated.end]
            );
        }
    }
    let player = &after["player.id"];
    let job = &after[value(&result, player, "current_bus_job").unwrap()];
    assert_eq!(job.kind, "player_bus_job");
    assert_eq!(value(&result, job, "company_bus"), Some("null"));
    assert_eq!(value(&result, job, "display_target_name"), Some("c"));
    let stage0 = &after[value(&result, job, "stages[0]").unwrap()];
    let stage1 = &after[value(&result, job, "stages[1]").unwrap()];
    assert_eq!(
        value(&result, stage0, "planned_departure_time"),
        Some("123060")
    );
    assert_eq!(
        value(&result, stage1, "planned_departure_time"),
        Some("123090")
    );
    assert_eq!(value(&result, stage1, "previous_stage"), Some(stage0.id));
    assert_eq!(value(&result, stage1, "departure_time"), Some("nil"));
    assert_eq!(
        value(&result, stage0, "planned_leaving_passenger_count"),
        Some("0")
    );
    assert_eq!(
        value(&result, stage1, "planned_leaving_passenger_count"),
        Some("40")
    );
    for i in 0..40 {
        let passenger = &after[value(&result, job, &format!("passengers[{i}]")).unwrap()];
        assert_eq!(passenger.kind, "player_bus_passenger");
        assert_eq!(
            value(&result, passenger, "seat_idx"),
            Some(i.to_string().as_str())
        );
    }
    assert_eq!(
        value(&result, &after["vehicle.bus"], "passenger_mass"),
        Some("3000")
    );
    assert_eq!(
        value(&result, &after["vehicle.bus"], "odometer"),
        Some("123")
    );
    assert_eq!(job_options(&result).unwrap().status, "active_job");
    assert!(generate_job(&result, &request()).is_err());
}

#[test]
fn rejects_active_jobs_wrong_vehicle_stale_routes_and_invalid_inputs() {
    for key in ["current_job", "current_bus_job", "current_car_job"] {
        let mut lines = fixture();
        replace(
            &mut lines,
            &format!(" {key}: null"),
            &format!(" {key}: existing.job"),
        );
        assert_eq!(job_options(&lines).unwrap().status, "active_job");
        assert!(generate_job(&lines, &request()).is_err());
    }
    for n in [0, 79, u32::MAX] {
        let mut req = request();
        req.passengers = n;
        assert!(generate_job(&fixture(), &req).is_err());
    }
    let mut req = request();
    req.coach_id = "different.bus".into();
    assert!(generate_job(&fixture(), &req).is_err());
    let mut req = request();
    req.targets.reverse();
    assert!(generate_job(&fixture(), &req).is_err());
    let mut req = request();
    req.source = "bus_stop.city.b".into();
    assert!(generate_job(&fixture(), &req).is_err());
    let mut req = request();
    req.departure_delay = u32::MAX;
    assert!(generate_job(&fixture(), &req).is_err());
    for (a, b) in [
        (
            " assigned_vehicles_mode: bus",
            " assigned_vehicles_mode: truck",
        ),
        (" buses[0]: vehicle.bus", " buses[0]: other.bus"),
        (
            " data_path: \"/def/vehicle/bus/volvo.9700_23/chassis/143_6x24.sii\"",
            " data_path: \"/mod/unknown.sii\"",
        ),
    ] {
        let mut lines = fixture();
        replace(&mut lines, a, b);
        assert_eq!(job_options(&lines).unwrap().status, "no_coach");
        assert!(generate_job(&lines, &request()).is_err());
    }
}

#[test]
fn rejects_broken_route_arrays_missing_stops_and_overflow() {
    for (a, b) in [
        (" targets_times: 2", " targets_times: 1"),
        (" targets_times[1]: 95", " targets_times[1]: -1"),
        (" targets_distances[0]: 20", " targets_distances[0]: 0"),
        (" targets_ferry_times[1]: 5", " targets_ferry_times[1]: 100"),
        (
            " saved_targets[1]: \"city.c\"",
            " saved_targets[1]: \"city.missing\"",
        ),
        (" lines_offer[0]: offer.a", " lines_offer[0]: missing.offer"),
        (" type: regular", " type: tourist"),
    ] {
        let mut lines = fixture();
        replace(&mut lines, a, b);
        assert!(job_options(&lines).unwrap().routes.is_empty());
        assert!(generate_job(&lines, &request()).is_err());
    }
    let mut lines = fixture();
    replace(&mut lines, " game_time: 123000", " game_time: 4294967295");
    assert!(generate_job(&lines, &request()).is_err());
}

#[test]
fn custom_stops_combine_known_legs_without_adding_intermediate_stops() {
    let lines = fixture();
    let mut req = request();
    req.offer_id = None;
    req.targets = vec!["city.c".into()];
    let route = custom_route(&lines, &req, &units(&lines).unwrap()).unwrap();
    assert_eq!(route.distances, vec![100]);
    assert_eq!(route.times, vec![125]);
    assert_eq!(route.ferry_times, vec![5]);
    assert_eq!(route.base_times, vec![95]);
    assert_eq!(route.ranks, [1, 2, 0]);
    let result = generate_job(&lines, &req).unwrap();
    let index = units(&result).unwrap();
    let job = index.values().find(|u| u.kind == "player_bus_job").unwrap();
    assert_eq!(value(&result, job, "stages"), Some("1"));
    let stage = &index[value(&result, job, "stages[0]").unwrap()];
    assert_eq!(
        value(&result, stage, "target_bus_stop"),
        Some("bus_stop.city.c")
    );
    assert_eq!(value(&result, stage, "planned_distance"), Some("100"));
    assert_eq!(
        value(&result, stage, "planned_leaving_passenger_count"),
        Some("40")
    );
    req.targets = vec!["city.b".into(), "city.c".into()];
    let route = custom_route(&lines, &req, &units(&lines).unwrap()).unwrap();
    assert_eq!(route.distances, vec![20, 80]);
    assert!(generate_job(&lines, &req).is_ok());
}

#[test]
fn directed_path_chooses_shorter_route_and_supports_returning_to_the_origin() {
    let graph = Connections::from([
        (
            "a".into(),
            BTreeMap::from([
                (
                    "b".into(),
                    Leg {
                        distance: 20,
                        minutes: 30,
                        ..Leg::default()
                    },
                ),
                (
                    "c".into(),
                    Leg {
                        distance: 150,
                        minutes: 180,
                        ..Leg::default()
                    },
                ),
            ]),
        ),
        (
            "b".into(),
            BTreeMap::from([(
                "c".into(),
                Leg {
                    distance: 80,
                    minutes: 95,
                    ferry_time: 5,
                    base_time: 70,
                    ranks: [0, 3, 1],
                },
            )]),
        ),
    ]);
    let leg = shortest_leg(&graph, "a", "c").unwrap();
    assert_eq!(
        (
            leg.distance,
            leg.minutes,
            leg.ferry_time,
            leg.base_time,
            leg.ranks
        ),
        (100, 125, 5, 70, [0, 3, 1])
    );
    assert!(shortest_leg(&graph, "c", "a").is_none());
    let mut graph = graph;
    graph.insert(
        "c".into(),
        BTreeMap::from([(
            "a".into(),
            Leg {
                distance: 45,
                minutes: 55,
                ..Leg::default()
            },
        )]),
    );
    assert_eq!(shortest_leg(&graph, "c", "b").unwrap().distance, 65);
    assert_eq!(shortest_leg(&graph, "c", "a").unwrap().distance, 45);
}

#[test]
fn custom_stops_reject_missing_unreachable_repeated_and_excess_stops() {
    let lines = fixture();
    for targets in [
        vec![],
        vec!["city.missing".into()],
        vec!["city.a".into()],
        vec!["city.c".into(), "city.b".into()],
        vec!["city.b".into(), "city.b".into()],
        vec!["city.b".into(); 10],
        vec!["city.c\"\nmalformed".into()],
    ] {
        let mut req = request();
        req.offer_id = None;
        req.targets = targets;
        assert!(generate_job(&lines, &req).is_err());
    }
    let mut req = request();
    req.offer_id = None;
    req.source = "bus_stop.city.missing".into();
    assert!(generate_job(&lines, &req).is_err());
    let options = job_options(&lines).unwrap();
    assert_eq!(
        options.stops,
        vec!["bus_stop.city.a", "bus_stop.city.b", "bus_stop.city.c"]
    );
    assert_eq!(options.connections.len(), 2);
    assert!(
        options
            .connections
            .iter()
            .any(|c| c.source == "bus_stop.city.b" && c.target == "bus_stop.city.c")
    );
}
