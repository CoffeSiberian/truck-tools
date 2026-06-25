pub fn get_assigned_vehicle_block(arr_val: &[String]) -> Option<(usize, usize)> {
    let player_start = arr_val
        .iter()
        .position(|line| line.starts_with("player : _nameless") && line.ends_with('{'))?;

    let assigned_id = arr_val.iter().skip(player_start).find_map(|line| {
        if line.contains("assigned_vehicles:") {
            line.split(':').nth(1).map(|s| s.trim().to_string())
        } else {
            None
        }
    })?;

    let header = format!("player_vehicles : {} {{", assigned_id);
    let block_start = arr_val.iter().position(|line| line.contains(&header))?;

    let block_end = arr_val
        .iter()
        .enumerate()
        .skip(block_start + 1)
        .find(|(_, line)| line.trim() == "}")?
        .0;

    Some((block_start, block_end))
}

pub fn find_in_player_vehicles_block(arr_val: &[String], key: &str) -> Option<(String, usize)> {
    let (block_start, block_end) = get_assigned_vehicle_block(arr_val)?;

    arr_val[block_start..=block_end]
        .iter()
        .enumerate()
        .find_map(|(offset, line)| {
            (line.contains(key) && !line.contains("null")).then(|| {
                let id = line.split(':').nth(1)?.trim().to_string();
                Some((id, block_start + offset))
            })?
        })
}
