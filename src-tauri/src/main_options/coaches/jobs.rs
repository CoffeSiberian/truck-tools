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

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct CoachJobRequest {
    pub offer_id: Option<String>,
    pub coach_id: String,
    pub source: String,
    pub targets: Vec<String>,
    pub passengers: u32,
    pub departure_delay: u32,
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

pub fn generate_job(lines: &[String], request: &CoachJobRequest) -> Option<Vec<String>> {
    let index = units(lines)?;
    let player = index.values().find(|u| u.kind == "player")?;
    if busy(lines, player) || request.departure_delay > 10080 {
        return None;
    }
    let (coach, capacity) = current_coach(lines, &index)?;
    if coach.id != request.coach_id || request.passengers == 0 || request.passengers > capacity {
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
    result.splice(closing..closing, additions);
    Some(result)
}

#[cfg(test)]
#[path = "jobs/tests.rs"]
mod tests;
