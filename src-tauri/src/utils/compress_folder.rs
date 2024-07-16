use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;

use walkdir::WalkDir;
use zip::write::{SimpleFileOptions, ZipWriter};
use zip::CompressionMethod;

pub async fn compress_folder_files(
    src_dir: &str,
    dest_dir_zip: &str,
    ignore_folders: Vec<&str>,
) -> bool {
    let zip_file = match File::create(dest_dir_zip) {
        Ok(file) => file,
        Err(_) => return false,
    };
    let mut zip = ZipWriter::new(zip_file);
    let options = SimpleFileOptions::default().compression_method(CompressionMethod::Deflated);
    let folder_name = match Path::new(src_dir).file_name() {
        Some(name) => match name.to_str() {
            Some(name) => name,
            None => return false,
        },
        None => return false,
    };

    let mut files_in_memory: Vec<(String, Vec<u8>)> = Vec::new();
    let mut list_folders: Vec<String> = vec![format!("./{}", folder_name)];

    for entry in WalkDir::new(src_dir).into_iter().filter_map(|e| e.ok()) {
        let path = entry.path();
        if ignore_folders
            .iter()
            .any(|&folder| path.to_string_lossy().contains(folder))
        {
            continue;
        }

        if path.is_file() {
            let name = match path.strip_prefix(Path::new(src_dir)) {
                Ok(name) => name.to_string_lossy().into_owned(),
                Err(_) => continue,
            };

            let mut read_file = match File::open(path) {
                Ok(file) => file,
                Err(_) => continue,
            };

            let mut buffer: Vec<u8> = Vec::new();
            match read_file.read_to_end(&mut buffer) {
                Ok(_) => (),
                Err(_) => continue,
            }

            files_in_memory.push((format!("./{}/{}", folder_name, name), buffer));
        }

        if path.is_dir() {
            let name = match path.strip_prefix(Path::new(src_dir)) {
                Ok(name) => name.to_string_lossy().into_owned(),
                Err(_) => continue,
            };

            if name.is_empty() {
                continue;
            }

            list_folders.push(format!("./{}/{}", folder_name, name));
        }
    }

    for folder in list_folders {
        match zip.add_directory_from_path(folder, options) {
            Ok(_) => (),
            Err(_) => return false,
        }
    }

    for (name, content) in files_in_memory {
        match zip.start_file_from_path(name, options) {
            Ok(_) => (),
            Err(_) => return false,
        }
        match zip.write_all(&content) {
            Ok(_) => (),
            Err(_) => return false,
        }
    }

    match zip.finish() {
        Ok(_) => true,
        Err(_) => false,
    }
}
