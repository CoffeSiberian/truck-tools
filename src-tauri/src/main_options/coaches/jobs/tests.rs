use super::*;

fn fixture() -> Vec<String> {
    let mut lines: Vec<String> = "SiiNunit\n{\neconomy : economy.id {\n game_time: 123000\n}\nplayer : player.id {\n assigned_vehicles_mode: bus\n assigned_vehicles: slot.bus\n buses: 1\n buses[0]: vehicle.bus\n current_job: null\n current_bus_job: null\n current_car_job: null\n selected_bus_offer: null\n}\nplayer_vehicles : slot.bus {\n vehicle: vehicle.bus\n}\nvehicle : vehicle.bus {\n passenger_mass: 0\n odometer: 123\n accessories: 1\n accessories[0]: chassis.bus\n}\nvehicle_accessory : chassis.bus {\n data_path: \"/def/vehicle/bus/volvo.9700_23/chassis/143_6x24.sii\"\n}\nbus_stop : bus_stop.city.a {\n discovered: false\n lines_offer: 1\n lines_offer[0]: offer.a\n}\nbus_stop : bus_stop.city.b {\n discovered: false\n lines_offer: 0\n}\nbus_stop : bus_stop.city.c {\n discovered: true\n lines_offer: 0\n}\nline_offer_data : offer.a {\n type: regular\n source: bus_stop.city.a\n saved_targets: 2\n saved_targets[0]: \"city.b\"\n saved_targets[1]: \"city.c\"\n targets_distances: 2\n targets_distances[0]: 20\n targets_distances[1]: 80\n targets_times: 2\n targets_times[0]: 30\n targets_times[1]: 95\n targets_ferry_times: 2\n targets_ferry_times[0]: 0\n targets_ferry_times[1]: 5\n targets_base_times: 2\n targets_base_times[0]: 25\n targets_base_times[1]: 70\n tight_schedule_rank: 1\n satisfaction_decrease_rank: 2\n low_acceleration_rank: 0\n}\n}\n".lines().map(str::to_owned).collect();
    lines.push(String::new());
    lines
}

fn request() -> CoachJobRequest {
    CoachJobRequest {
        offer_id: Some("offer.a".into()),
        coach_id: "vehicle.bus".into(),
        source: "bus_stop.city.a".into(),
        targets: vec!["city.b".into(), "city.c".into()],
        passengers: 40,
        departure_delay: 60,
    }
}

fn replace(lines: &mut [String], old: &str, new: &str) {
    *lines.iter_mut().find(|s| s.as_str() == old).unwrap() = new.into();
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
    assert!(generate_job(&result, &request()).is_none());
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
        assert!(generate_job(&lines, &request()).is_none());
    }
    for n in [0, 79, u32::MAX] {
        let mut req = request();
        req.passengers = n;
        assert!(generate_job(&fixture(), &req).is_none());
    }
    let mut req = request();
    req.coach_id = "different.bus".into();
    assert!(generate_job(&fixture(), &req).is_none());
    let mut req = request();
    req.targets.reverse();
    assert!(generate_job(&fixture(), &req).is_none());
    let mut req = request();
    req.source = "bus_stop.city.b".into();
    assert!(generate_job(&fixture(), &req).is_none());
    let mut req = request();
    req.departure_delay = u32::MAX;
    assert!(generate_job(&fixture(), &req).is_none());
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
        assert!(generate_job(&lines, &request()).is_none());
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
        assert!(generate_job(&lines, &request()).is_none());
    }
    let mut lines = fixture();
    replace(&mut lines, " game_time: 123000", " game_time: 4294967295");
    assert!(generate_job(&lines, &request()).is_none());
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
    assert!(generate_job(&lines, &req).is_some());
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
        assert!(generate_job(&lines, &req).is_none());
    }
    let mut req = request();
    req.offer_id = None;
    req.source = "bus_stop.city.missing".into();
    assert!(generate_job(&lines, &req).is_none());
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
