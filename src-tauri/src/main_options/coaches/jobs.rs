use super::{Unit, accessories, fields, units, value};
use serde::{Deserialize, Serialize};
use std::cmp::Reverse;
use std::collections::{BTreeMap, BinaryHeap, HashMap};
use uuid::Uuid;

#[derive(Clone, Serialize)]
pub struct CoachRoute {
    pub id: String,
    pub source: String,
    pub targets: Vec<String>,
    pub distance: u32,
    pub minutes: u32,
}

#[derive(Serialize)]
pub struct CoachJobOptions {
    pub res: bool,
    pub status: String,
    pub coach_id: Option<String>,
    pub capacity: u32,
    pub routes: Vec<CoachRoute>,
    pub stops: Vec<String>,
    pub connections: Vec<CoachConnection>,
}

#[derive(Serialize)]
pub struct CoachConnection {
    pub source: String,
    pub target: String,
}

#[derive(Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct CoachJobRequest {
    #[serde(default)]
    pub generation: Generation,
    pub offer_id: Option<String>,
    pub coach_id: String,
    pub source: String,
    pub targets: Vec<String>,
    pub passengers: u32,
    pub departure_delay: u32,
}

#[derive(Default, Deserialize, Serialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum Generation {
    Offer,
    #[default]
    Accepted,
}

#[derive(Clone, Copy, Debug, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum CoachJobError {
    ReadError,
    WriteError,
    ActiveJob,
    NoCoach,
    NoRoutes,
    ChangedSave,
    InvalidRoute,
    InvalidRequest,
    UnsupportedSave,
    NavigationError,
}

#[derive(Serialize)]
pub struct CoachJobResponse {
    pub res: bool,
    pub error: Option<CoachJobError>,
}

#[derive(Clone, Deserialize)]
struct NavigationPoint {
    position: [i32; 3],
    direction: String,
}

struct Route {
    public: CoachRoute,
    distances: Vec<u32>,
    times: Vec<u32>,
    ferry_times: Vec<u32>,
    base_times: Vec<u32>,
    ranks: [u32; 3],
}

#[derive(Clone, Default)]
struct Leg {
    distance: u32,
    minutes: u32,
    ferry_time: u32,
    base_time: u32,
    ranks: [u32; 3],
}

type Connections = BTreeMap<String, BTreeMap<String, Leg>>;

fn connections(routes: &[Route]) -> Connections {
    let mut graph = Connections::new();
    for route in routes {
        let mut source = route.public.source.clone();
        for (i, target) in route.public.targets.iter().enumerate() {
            let target = format!("bus_stop.{target}");
            let candidate = Leg {
                distance: route.distances[i],
                minutes: route.times[i],
                ferry_time: route.ferry_times[i],
                base_time: route.base_times[i],
                ranks: route.ranks,
            };
            let existing = graph
                .entry(source)
                .or_default()
                .entry(target.clone())
                .or_insert(candidate.clone());
            if (
                candidate.distance,
                candidate.minutes,
                candidate.ferry_time,
                candidate.base_time,
                candidate.ranks,
            ) < (
                existing.distance,
                existing.minutes,
                existing.ferry_time,
                existing.base_time,
                existing.ranks,
            ) {
                *existing = candidate;
            }
            source = target;
        }
    }
    graph
}

// Only combine known directed legs. Never infer a reverse route or straight-line mileage.
fn shortest_leg(graph: &Connections, source: &str, target: &str) -> Option<Leg> {
    let mut best = HashMap::from([(source.to_owned(), Leg::default())]);
    let mut queue = BinaryHeap::from([Reverse((0u32, 0u32, source.to_owned()))]);
    while let Some(Reverse((distance, minutes, current))) = queue.pop() {
        let current_leg = best.get(&current)?.clone();
        if (distance, minutes) != (current_leg.distance, current_leg.minutes) {
            continue;
        }
        if current == target {
            return Some(current_leg);
        }
        let Some(neighbors) = graph.get(&current) else {
            continue;
        };
        for (next, edge) in neighbors {
            let candidate = Leg {
                distance: current_leg.distance.checked_add(edge.distance)?,
                minutes: current_leg.minutes.checked_add(edge.minutes)?,
                ferry_time: current_leg.ferry_time.checked_add(edge.ferry_time)?,
                base_time: current_leg.base_time.checked_add(edge.base_time)?,
                ranks: std::array::from_fn(|i| current_leg.ranks[i].max(edge.ranks[i])),
            };
            if best.get(next).is_none_or(|old| {
                (candidate.distance, candidate.minutes) < (old.distance, old.minutes)
            }) {
                queue.push(Reverse((
                    candidate.distance,
                    candidate.minutes,
                    next.clone(),
                )));
                best.insert(next.clone(), candidate);
            }
        }
    }
    None
}

fn custom_route(
    lines: &[String],
    request: &CoachJobRequest,
    index: &HashMap<&str, Unit<'_>>,
) -> Option<Route> {
    if request.targets.is_empty()
        || request.targets.len() > 9
        || !request.source.starts_with("bus_stop.city.")
        || index.get(request.source.as_str())?.kind != "bus_stop"
    {
        return None;
    }
    let routes: Vec<_> = index
        .values()
        .filter_map(|u| route(lines, u, index))
        .collect();
    let graph = connections(&routes);
    let mut result = Route {
        public: CoachRoute {
            id: String::new(),
            source: request.source.clone(),
            targets: request.targets.clone(),
            distance: 0,
            minutes: 0,
        },
        distances: Vec::new(),
        times: Vec::new(),
        ferry_times: Vec::new(),
        base_times: Vec::new(),
        ranks: [0; 3],
    };
    let mut previous = request.source.clone();
    for target in &request.targets {
        if !target.starts_with("city.") {
            return None;
        }
        let target = format!("bus_stop.{target}");
        if target == previous || index.get(target.as_str())?.kind != "bus_stop" {
            return None;
        }
        let leg = shortest_leg(&graph, &previous, &target)?;
        result.public.distance = result.public.distance.checked_add(leg.distance)?;
        result.public.minutes = result.public.minutes.checked_add(leg.minutes)?;
        result.distances.push(leg.distance);
        result.times.push(leg.minutes);
        result.ferry_times.push(leg.ferry_time);
        result.base_times.push(leg.base_time);
        result.ranks = std::array::from_fn(|i| result.ranks[i].max(leg.ranks[i]));
        previous = target;
    }
    Some(result)
}

fn array<'a>(lines: &'a [String], unit: &Unit, key: &str) -> Option<Vec<&'a str>> {
    let count = value(lines, unit, key)?.parse::<usize>().ok()?;
    if count > 9 {
        return None;
    }
    let prefix = format!("{key}[");
    if fields(lines, unit)
        .filter(|(_, k, _)| k.starts_with(&prefix))
        .count()
        != count
    {
        return None;
    }
    (0..count)
        .map(|i| value(lines, unit, &format!("{key}[{i}]")))
        .collect()
}

fn route(lines: &[String], offer: &Unit, index: &HashMap<&str, Unit<'_>>) -> Option<Route> {
    // Reuse game-calculated regular routes, including their individual leg metrics.
    if offer.kind != "line_offer_data" || value(lines, offer, "type")? != "regular" {
        return None;
    }
    let source = value(lines, offer, "source")?;
    if !source.starts_with("bus_stop.city.") || index.get(source)?.kind != "bus_stop" {
        return None;
    }
    let stop = index.get(source)?;
    if !fields(lines, stop).any(|(_, k, v)| k.starts_with("lines_offer[") && v == offer.id) {
        return None;
    }
    let targets = array(lines, offer, "saved_targets")?
        .into_iter()
        .map(|s| {
            let s = s.strip_prefix('"')?.strip_suffix('"')?;
            if !s.starts_with("city.")
                || index.get(format!("bus_stop.{s}").as_str())?.kind != "bus_stop"
            {
                return None;
            }
            Some(s.to_owned())
        })
        .collect::<Option<Vec<_>>>()?;
    if targets.is_empty() {
        return None;
    }
    let mut previous = source.strip_prefix("bus_stop.")?;
    for target in &targets {
        if target == previous {
            return None;
        }
        previous = target;
    }
    let numbers = |key| -> Option<Vec<u32>> {
        let values = array(lines, offer, key)?
            .into_iter()
            .map(|s| s.parse::<u32>().ok().filter(|n| *n <= 1_000_000))
            .collect::<Option<Vec<_>>>()?;
        (values.len() == targets.len()).then_some(values)
    };
    let distances = numbers("targets_distances")?;
    let times = numbers("targets_times")?;
    let ferry_times = numbers("targets_ferry_times")?;
    let base_times = numbers("targets_base_times")?;
    if distances.iter().any(|n| *n == 0)
        || times.iter().any(|n| *n == 0)
        || base_times.iter().zip(&times).any(|(b, t)| b > t)
        || ferry_times.iter().zip(&times).any(|(f, t)| f > t)
    {
        return None;
    }
    let rank = |key| {
        value(lines, offer, key)?
            .parse::<u32>()
            .ok()
            .filter(|n| *n <= 5)
    };
    Some(Route {
        public: CoachRoute {
            id: offer.id.to_owned(),
            source: source.to_owned(),
            targets,
            distance: distances.iter().sum(),
            minutes: times.iter().sum(),
        },
        distances,
        times,
        ferry_times,
        base_times,
        ranks: [
            rank("tight_schedule_rank")?,
            rank("satisfaction_decrease_rank")?,
            rank("low_acceleration_rank")?,
        ],
    })
}

fn current_coach<'a>(
    lines: &[String],
    index: &'a HashMap<&str, Unit<'a>>,
) -> Option<(&'a Unit<'a>, u32)> {
    let player = index.values().find(|u| u.kind == "player")?;
    if value(lines, player, "assigned_vehicles_mode")? != "bus" {
        return None;
    }
    let slot = index.get(value(lines, player, "assigned_vehicles")?)?;
    if slot.kind != "player_vehicles" {
        return None;
    }
    let coach = index.get(value(lines, slot, "vehicle")?)?;
    // Generate owned-coach jobs; company/quick jobs have additional vehicle ownership state.
    if coach.kind != "vehicle"
        || !fields(lines, player).any(|(_, k, v)| k.starts_with("buses[") && v == coach.id)
    {
        return None;
    }
    let chassis = accessories(lines, coach, index)
        .into_iter()
        .filter_map(|a| value(lines, a, "data_path"))
        .map(|p| p.trim_matches('"'))
        .find(|p| p.contains("/chassis/"))?;
    // Stock chassis passenger_capacity values from the official Coach DLC definitions.
    let capacity = match chassis {
        "/def/vehicle/bus/man.lions_24/chassis/121_4x2.sii" => 48,
        "/def/vehicle/bus/man.lions_24/chassis/139_6x24.sii" => 56,
        "/def/vehicle/bus/scania.touring_23/chassis/129_4x2.sii" => 53,
        "/def/vehicle/bus/scania.touring_23/chassis/137_6x24.sii" => 57,
        "/def/vehicle/bus/volvo.9700_23/chassis/143_6x24.sii" => 78,
        _ => return None,
    };
    Some((coach, capacity))
}

fn busy(lines: &[String], player: &Unit) -> bool {
    ["current_job", "current_bus_job", "current_car_job"]
        .iter()
        .any(|key| value(lines, player, key) != Some("null"))
}

pub fn job_options(lines: &[String]) -> Option<CoachJobOptions> {
    let index = units(lines)?;
    let player = index.values().find(|u| u.kind == "player")?;
    let current = current_coach(lines, &index);
    let routes: Vec<_> = index
        .values()
        .filter_map(|u| route(lines, u, &index))
        .collect();
    let connections = connections(&routes)
        .into_iter()
        .flat_map(|(source, neighbors)| {
            neighbors.into_keys().map(move |target| CoachConnection {
                source: source.clone(),
                target,
            })
        })
        .collect();
    let mut stops: Vec<_> = index
        .values()
        .filter(|u| u.kind == "bus_stop" && u.id.starts_with("bus_stop.city."))
        .map(|u| u.id.to_owned())
        .collect();
    stops.sort();
    let status = if busy(lines, player) {
        "active_job"
    } else if current.is_none() {
        "no_coach"
    } else if routes.is_empty() {
        "no_routes"
    } else {
        "ready"
    };
    let mut options = CoachJobOptions {
        res: true,
        status: status.into(),
        coach_id: current.map(|(u, _)| u.id.to_owned()),
        capacity: current.map_or(0, |(_, n)| n),
        routes: routes.into_iter().map(|r| r.public).collect(),
        stops,
        connections,
    };
    options.routes.sort_by(|a, b| {
        (&a.source, &a.targets, a.distance, &a.id).cmp(&(&b.source, &b.targets, b.distance, &b.id))
    });
    Some(options)
}

pub fn generate_job(
    lines: &[String],
    request: &CoachJobRequest,
) -> Result<Vec<String>, CoachJobError> {
    let options = job_options(lines).ok_or(CoachJobError::UnsupportedSave)?;
    match options.status.as_str() {
        "active_job" => return Err(CoachJobError::ActiveJob),
        "no_coach" => return Err(CoachJobError::NoCoach),
        "no_routes" => return Err(CoachJobError::NoRoutes),
        _ => {}
    }
    if options.coach_id.as_deref() != Some(request.coach_id.as_str()) {
        return Err(CoachJobError::ChangedSave);
    }
    if request.departure_delay > 10080
        || (request.generation == Generation::Accepted
            && (request.passengers == 0 || request.passengers > options.capacity))
    {
        return Err(CoachJobError::InvalidRequest);
    }
    let index = units(lines).ok_or(CoachJobError::UnsupportedSave)?;
    let selected = if let Some(id) = &request.offer_id {
        let offer = index.get(id.as_str()).ok_or(CoachJobError::ChangedSave)?;
        route(lines, offer, &index)
    } else {
        custom_route(lines, request, &index)
    }
    .ok_or(CoachJobError::InvalidRoute)?;
    if selected.public.source != request.source || selected.public.targets != request.targets {
        return Err(CoachJobError::ChangedSave);
    }
    let (updated, destinations) =
        generate_job_data(lines, request).ok_or(CoachJobError::UnsupportedSave)?;
    with_navigation(updated, request, &destinations).ok_or(CoachJobError::NavigationError)
}

fn generate_job_data(
    lines: &[String],
    request: &CoachJobRequest,
) -> Option<(Vec<String>, Vec<String>)> {
    let index = units(lines)?;
    let player = index.values().find(|u| u.kind == "player")?;
    if busy(lines, player) || request.departure_delay > 10080 {
        return None;
    }
    let (coach, capacity) = current_coach(lines, &index)?;
    if coach.id != request.coach_id
        || (request.generation == Generation::Accepted
            && (request.passengers == 0 || request.passengers > capacity))
    {
        return None;
    }
    let route = if let Some(offer_id) = &request.offer_id {
        route(lines, index.get(offer_id.as_str())?, &index)?
    } else {
        custom_route(lines, request, &index)?
    };
    if route.public.source != request.source || route.public.targets != request.targets {
        return None;
    }
    let economy = index.values().find(|u| u.kind == "economy")?;
    let now = value(lines, economy, "game_time")?.parse::<u32>().ok()?;
    let departure = now.checked_add(request.departure_delay)?;
    if departure.checked_add(route.public.minutes)? > i32::MAX as u32 {
        return None;
    }
    if request.generation == Generation::Offer {
        let result = generate_offer(lines, request, &route, &index, player, now, departure)?;
        return Some((result, vec![route.public.source.clone()]));
    }
    let count = request.passengers;
    // SII anonymous unit IDs have at most 12 hexadecimal digits after _nameless.
    let mut reserved = std::collections::HashSet::new();
    let mut new_id = || loop {
        let bits = Uuid::new_v4().as_u128() as u64 & 0xffff_ffff_ffff;
        let id = format!(
            "_nameless.{:x}.{:04x}.{:04x}",
            bits >> 32,
            (bits >> 16) & 0xffff,
            bits & 0xffff
        );
        if !index.contains_key(id.as_str()) && reserved.insert(id.clone()) {
            break id;
        }
    };
    let job = new_id();
    let stages: Vec<_> = route.public.targets.iter().map(|_| new_id()).collect();
    let passengers: Vec<_> = (0..count).map(|_| new_id()).collect();
    let target = route.public.targets.last()?.strip_prefix("city.")?;
    let mut additions = vec![
        format!("player_bus_job : {job} {{"),
        " job_type: regular".into(),
        " company_bus: null".into(),
        format!(" stages: {}", stages.len()),
    ];
    for (i, id) in stages.iter().enumerate() {
        additions.push(format!(" stages[{i}]: {id}"));
    }
    additions.extend([" stage_idx: 0".into(), format!(" passengers: {count}")]);
    for (i, id) in passengers.iter().enumerate() {
        additions.push(format!(" passengers[{i}]: {id}"));
    }
    additions.extend([
        " left_passengers: 0".into(),
        " no_penalty_reward_distance: 0".into(),
        " no_penalty_reward_stage: true".into(),
        format!(" tight_schedule_rank: {}", route.ranks[0]),
        format!(" satisfaction_decrease_rank: {}", route.ranks[1]),
        format!(" low_acceleration_rank: {}", route.ranks[2]),
        " display_target_type: city".into(),
        format!(" display_target_name: {target}"),
        "}".into(),
        String::new(),
    ]);
    let mut planned_departure = departure;
    for (i, id) in stages.iter().enumerate() {
        let previous = if i == 0 { "null" } else { &stages[i - 1] };
        let source = if i == 0 {
            route.public.source.clone()
        } else {
            format!("bus_stop.{}", route.public.targets[i - 1])
        };
        let entering = if i == 0 { count } else { 0 };
        let leaving = if i + 1 == stages.len() { count } else { 0 };
        additions.extend(format!("player_bus_job_stage : {id} {{\n previous_stage: {previous}\n source_bus_stop: {source}\n target_bus_stop: bus_stop.{}\n planned_distance: {}\n planned_departure_time: {planned_departure}\n planned_arrival_time: nil\n planned_stage_time: {}\n planned_ferry_time: {}\n planned_entering_passenger_count: {entering}\n planned_leaving_passenger_count: {leaving}\n departure_time: {}\n entering_passenger_count: {}\n starting_satisfaction: {}\n travelled_distance: 0\n arrival_time: nil\n leaving_passenger_count: nil\n satisfaction: -1\n base_time: {}\n}}\n",
            route.public.targets[i], route.distances[i], route.times[i], route.ferry_times[i],
            if i == 0 { departure.to_string() } else { "nil".into() },
            if i == 0 { count.to_string() } else { "nil".into() },
            if i == 0 { "0.65" } else { "-1" }, route.base_times[i])
            .lines().map(str::to_owned));
        planned_departure = planned_departure.checked_add(route.times[i])?;
    }
    for (seat, id) in passengers.iter().enumerate() {
        additions.extend(format!("player_bus_passenger : {id} {{\n source_bus_stop: {}\n target_bus_stop: null\n seat_idx: {seat}\n pos_satis_sensitivity: 1\n neg_satis_sensitivity: 1\n satisfaction: 0.65\n passenger_data_idx: 0\n}}\n", route.public.source).lines().map(str::to_owned));
    }
    let current_line = fields(lines, player)
        .find(|(_, k, _)| *k == "current_bus_job")?
        .0;
    let selected_line = fields(lines, player)
        .find(|(_, k, _)| *k == "selected_bus_offer")?
        .0;
    let mass_line = fields(lines, coach)
        .find(|(_, k, _)| *k == "passenger_mass")?
        .0;
    let closing = lines.iter().rposition(|s| !s.trim().is_empty())?;
    if lines[closing].trim() != "}" || index.values().any(|u| u.end >= closing) {
        return None;
    }
    let mut result = lines.to_vec();
    result[current_line] = format!(" current_bus_job: {job}");
    result[selected_line] = " selected_bus_offer: null".into();
    result[mass_line] = format!(" passenger_mass: {}", count * 75);
    // The game keeps the boarded and requested masses in sync for an active coach job.
    if let Some((requested_mass_line, _, _)) =
        fields(lines, coach).find(|(_, key, _)| *key == "requested_passenger_mass")
    {
        result[requested_mass_line] = format!(" requested_passenger_mass: {}", count * 75);
    }
    result.splice(closing..closing, additions);
    let destinations = route
        .public
        .targets
        .iter()
        .map(|target| format!("bus_stop.{target}"))
        .collect::<Vec<_>>();
    Some((result, destinations))
}

fn with_navigation(
    mut lines: Vec<String>,
    request: &CoachJobRequest,
    destinations: &[String],
) -> Option<Vec<String>> {
    let positions: BTreeMap<String, Vec<NavigationPoint>> =
        serde_json::from_str(include_str!("../../embeds/coach_stop_positions.json")).ok()?;
    let Some(targets) = destinations
        .iter()
        .map(|id| {
            positions
                .get(id.strip_prefix("bus_stop.city.")?)?
                .first()
                .cloned()
        })
        .collect::<Option<Vec<_>>>()
    else {
        // Mod cities are not in the stock map catalog; keep their existing navigation intact.
        return Some(lines);
    };
    let index = units(&lines)?;
    let economy = index.values().find(|u| u.kind == "economy")?;
    let player = index.values().find(|u| u.kind == "player")?;
    let slot = index.get(value(&lines, player, "assigned_vehicles")?)?;
    if value(&lines, slot, "vehicle")? != request.coach_id {
        return None;
    }
    let placement = value(&lines, slot, "stored_vehicle_placement")?;
    let position = placement.strip_prefix('(')?.split_once(')')?.0;
    let current: Vec<i32> = position
        .split(',')
        .map(|part| {
            let part = part.trim();
            let number = if let Some(hex) = part.strip_prefix('&') {
                f32::from_bits(u32::from_str_radix(hex, 16).ok()?) as f64
            } else {
                part.parse::<f64>().ok()?
            };
            let scaled = number * 256.0;
            (scaled.is_finite() && scaled > i32::MIN as f64 && scaled < i32::MAX as f64)
                .then_some(scaled.round() as i32)
        })
        .collect::<Option<_>>()?;
    let current: [i32; 3] = current.try_into().ok()?;
    let distance = |point: &NavigationPoint| -> u128 {
        point
            .position
            .iter()
            .zip(current)
            .map(|(a, b)| {
                let delta = *a as i128 - b as i128;
                (delta * delta) as u128
            })
            .sum()
    };
    // GPS storage identifies exact road nodes, not arbitrary world positions. Reuse the
    // nearest saved ordinary waypoint/history node or stock station entrance for the start.
    let saved_points = fields(&lines, economy)
        .filter(|(_, key, _)| {
            [
                "stored_gps_behind_waypoints[",
                "stored_gps_ahead_waypoints[",
                "stored_gps_waypoints_history[",
            ]
            .iter()
            .any(|prefix| key.starts_with(prefix))
        })
        .filter_map(|(_, _, id)| {
            let unit = index.get(id)?;
            if unit.kind != "gps_waypoint_storage" {
                return None;
            }
            let raw = value(&lines, unit, "nav_node_position")?
                .strip_prefix('(')?
                .strip_suffix(')')?;
            let position: Vec<i32> = raw
                .split(',')
                .map(|n| n.trim().parse().ok())
                .collect::<Option<_>>()?;
            let direction = value(&lines, unit, "direction")?;
            ["any", "forward", "backward"]
                .contains(&direction)
                .then_some(NavigationPoint {
                    position: position.try_into().ok()?,
                    direction: "any".into(),
                })
        });
    // Prefer a nearby node already resolved by the game. A station entrance alone may
    // otherwise become both ends of a zero-length route when driving near the origin.
    let nearby_saved = saved_points
        .min_by_key(&distance)
        .filter(|point| distance(point) <= (1000u128 * 256).pow(2));
    let start =
        nearby_saved.or_else(|| positions.values().flatten().cloned().min_by_key(&distance))?;
    let mut additions = Vec::new();
    let mut used = std::collections::HashSet::new();
    let mut waypoint = |point: NavigationPoint| {
        let id = loop {
            let bits = Uuid::new_v4().as_u128() as u64 & 0xffff_ffff_ffff;
            let id = format!(
                "_nameless.{:x}.{:04x}.{:04x}",
                bits >> 32,
                (bits >> 16) & 0xffff,
                bits & 0xffff
            );
            if !index.contains_key(id.as_str()) && used.insert(id.clone()) {
                break id;
            }
        };
        additions.extend([
            format!("gps_waypoint_storage : {id} {{"),
            format!(
                " nav_node_position: ({}, {}, {})",
                point.position[0], point.position[1], point.position[2]
            ),
            format!(" direction: {}", point.direction),
            "}".into(),
            String::new(),
        ]);
        id
    };
    let behind = waypoint(NavigationPoint {
        direction: "any".into(),
        ..start
    });
    let ahead: Vec<_> = targets.into_iter().map(&mut waypoint).collect();
    let mut replacements = BTreeMap::new();
    let mut removed = std::collections::HashSet::new();
    let mut previous_waypoints = std::collections::HashSet::new();
    for (key, ids) in [
        ("stored_gps_behind_waypoints", vec![behind]),
        ("stored_gps_ahead_waypoints", ahead),
    ] {
        let field = fields(&lines, economy).find(|(_, k, _)| *k == key)?.0;
        let count = value(&lines, economy, key)?.parse::<usize>().ok()?;
        if count > 4096 {
            return None;
        }
        let prefix = format!("{key}[");
        let old: Vec<_> = fields(&lines, economy)
            .filter(|(_, k, _)| k.starts_with(&prefix))
            .collect();
        if old.len() != count {
            return None;
        }
        for i in 0..count {
            let id = value(&lines, economy, &format!("{key}[{i}]"))?;
            if index.get(id)?.kind != "gps_waypoint_storage" {
                return None;
            }
            previous_waypoints.insert(id);
        }
        for (line, _, _) in old {
            removed.insert(line);
        }
        let mut replacement = vec![format!(" {key}: {}", ids.len())];
        replacement.extend(
            ids.iter()
                .enumerate()
                .map(|(i, id)| format!(" {key}[{i}]: {id}")),
        );
        replacements.insert(field, replacement);
    }
    // Detached waypoint units become extra unit trees and prevent the game from loading.
    // History, avoidance and online navigation can share them, so retain any still referenced.
    let retained: std::collections::HashSet<_> = index
        .values()
        .flat_map(|unit| fields(&lines, unit))
        .filter(|(line, _, _)| !removed.contains(line))
        .map(|(_, _, id)| id)
        .collect();
    for id in previous_waypoints {
        if !retained.contains(id) {
            let unit = index.get(id)?;
            removed.extend(unit.start..=unit.end);
        }
    }
    for (key, setting) in [
        ("stored_gps_behind", "0"),
        ("stored_gps_ahead", "0"),
        (
            "stored_nav_start_pos",
            "(2147483647, 2147483647, 2147483647)",
        ),
        ("stored_nav_end_pos", "(2147483647, 2147483647, 2147483647)"),
    ] {
        let field = fields(&lines, economy).find(|(_, k, _)| *k == key)?.0;
        replacements.insert(field, vec![format!(" {key}: {setting}")]);
    }
    let closing = lines.iter().rposition(|s| !s.trim().is_empty())?;
    if lines[closing].trim() != "}" {
        return None;
    }
    let mut result = Vec::with_capacity(lines.len() + additions.len());
    for (i, line) in lines.drain(..).enumerate() {
        if i == closing {
            result.append(&mut additions);
        }
        if removed.contains(&i) {
            continue;
        }
        if let Some(replacement) = replacements.remove(&i) {
            result.extend(replacement);
        } else {
            result.push(line);
        }
    }
    Some(result)
}

// Match a selected contract: the game creates the job and boards passengers at the origin.
fn generate_offer(
    lines: &[String],
    request: &CoachJobRequest,
    route: &Route,
    index: &HashMap<&str, Unit<'_>>,
    player: &Unit,
    now: u32,
    departure: u32,
) -> Option<Vec<String>> {
    let stop = index.get(request.source.as_str())?;
    let count_line = fields(lines, stop).find(|(_, k, _)| *k == "lines_offer")?.0;
    let count = value(lines, stop, "lines_offer")?.parse::<usize>().ok()?;
    if count > 4096
        || fields(lines, stop)
            .filter(|(_, k, _)| k.starts_with("lines_offer["))
            .count()
            != count
    {
        return None;
    }
    for i in 0..count {
        let offer = index.get(value(lines, stop, &format!("lines_offer[{i}]"))?)?;
        let source = value(lines, offer, "source")?;
        // The game retains inactive regular/tourist offers with a null source in this list.
        if offer.kind != "line_offer_data" || (source != stop.id && source != "null") {
            return None;
        }
    }
    // Reuse a real offer's stock vehicle definition; it is only used by game-supplied coaches.
    let template = if let Some(id) = &request.offer_id {
        index.get(id.as_str())?
    } else {
        index
            .values()
            .filter(|u| {
                value(lines, u, "source") == Some(stop.id) && route_for_template(lines, u, index)
            })
            .min_by_key(|u| u.id)?
    };
    let bus_name = value(lines, template, "bus_name")?;
    if bus_name.is_empty()
        || !bus_name
            .bytes()
            .all(|b| b.is_ascii_alphanumeric() || b == b'_')
    {
        return None;
    }
    let expiration = now.checked_add(10080)?.max(departure.checked_add(1440)?);
    if expiration > i32::MAX as u32 {
        return None;
    }
    let id = loop {
        let bits = Uuid::new_v4().as_u128() as u64 & 0xffff_ffff_ffff;
        let id = format!(
            "_nameless.{:x}.{:04x}.{:04x}",
            bits >> 32,
            (bits >> 16) & 0xffff,
            bits & 0xffff
        );
        if !index.contains_key(id.as_str()) {
            break id;
        }
    };
    let mut additions = vec![
        format!("line_offer_data : {id} {{"),
        " type: regular".into(),
        format!(" source: {}", stop.id),
        format!(" saved_targets: {}", route.public.targets.len()),
    ];
    for (i, target) in route.public.targets.iter().enumerate() {
        additions.push(format!(" saved_targets[{i}]: \"{target}\""));
    }
    for (key, values) in [
        ("targets_distances", &route.distances),
        ("targets_times", &route.times),
        ("targets_ferry_times", &route.ferry_times),
        ("targets_base_times", &route.base_times),
    ] {
        additions.push(format!(" {key}: {}", values.len()));
        for (i, value) in values.iter().enumerate() {
            additions.push(format!(" {key}[{i}]: {value}"));
        }
    }
    additions.extend([
        format!(" departure_time_of_day: {}", departure % 1440),
        format!(" bus_name: {bus_name}"),
        format!(" expiration_time: {expiration}"),
        format!(" tight_schedule_rank: {}", route.ranks[0]),
        format!(" satisfaction_decrease_rank: {}", route.ranks[1]),
        format!(" low_acceleration_rank: {}", route.ranks[2]),
        "}".into(),
        String::new(),
    ]);
    let selected_line = fields(lines, player)
        .find(|(_, k, _)| *k == "selected_bus_offer")?
        .0;
    let closing = lines.iter().rposition(|s| !s.trim().is_empty())?;
    if lines[closing].trim() != "}" || index.values().any(|u| u.end >= closing) {
        return None;
    }
    let mut result = lines.to_vec();
    result[selected_line] = format!(" selected_bus_offer: {id}");
    result[count_line] = format!(" lines_offer: {}", count + 1);
    result.splice(closing..closing, additions);
    result.insert(stop.end, format!(" lines_offer[{count}]: {id}"));
    Some(result)
}

fn route_for_template(lines: &[String], unit: &Unit, index: &HashMap<&str, Unit<'_>>) -> bool {
    route(lines, unit, index).is_some() && value(lines, unit, "bus_name").is_some()
}

#[cfg(test)]
#[path = "jobs/tests.rs"]
mod tests;
