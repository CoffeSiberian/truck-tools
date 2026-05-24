use std::fs;

pub async fn decrypt_file(path: &str) -> Option<String> {
    let data = fs::read(path).ok()?;
    let decoded = decrypt_truck::decrypt_bin_file(&data).ok()?;
    String::from_utf8(decoded).ok()
}

pub async fn decrypt_file_to_save(path: &str) -> bool {
    match decrypt_file(path).await {
        Some(content) => fs::write(path, content).is_ok(),
        None => false,
    }
}
