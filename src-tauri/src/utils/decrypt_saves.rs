use aes::Aes256;
use cbc::{
    Decryptor,
    cipher::{BlockDecryptMut, KeyIvInit, block_padding::NoPadding},
};
use flate2::read::ZlibDecoder;
use std::{collections::HashMap, fs, io::Read};

// AES-256-CBC key from SII_Decrypt source (JohnnyGuitar / TheLazyTomcat)
const SII_KEY: [u8; 32] = [
    0x2a, 0x5f, 0xcb, 0x17, 0x91, 0xd2, 0x2f, 0xb6,
    0x02, 0x45, 0xb3, 0xd8, 0x36, 0x9e, 0xd0, 0xb2,
    0xc2, 0x73, 0x71, 0x56, 0x3f, 0xbf, 0x1f, 0x3c,
    0x9e, 0xdf, 0x6b, 0x11, 0x82, 0x5a, 0x5d, 0x0a,
];

// XOR key table for 3nK format: Key[i] = (((i<<2) ^ ~i) << 3) ^ i
const KEY_3NK: [u8; 256] = [
    0xF8, 0xD1, 0xAA, 0x83, 0x5C, 0x75, 0x0E, 0x27, 0xB0, 0x99, 0xE2, 0xCB, 0x14, 0x3D, 0x46, 0x6F,
    0x68, 0x41, 0x3A, 0x13, 0xCC, 0xE5, 0x9E, 0xB7, 0x20, 0x09, 0x72, 0x5B, 0x84, 0xAD, 0xD6, 0xFF,
    0xD8, 0xF1, 0x8A, 0xA3, 0x7C, 0x55, 0x2E, 0x07, 0x90, 0xB9, 0xC2, 0xEB, 0x34, 0x1D, 0x66, 0x4F,
    0x48, 0x61, 0x1A, 0x33, 0xEC, 0xC5, 0xBE, 0x97, 0x00, 0x29, 0x52, 0x7B, 0xA4, 0x8D, 0xF6, 0xDF,
    0xB8, 0x91, 0xEA, 0xC3, 0x1C, 0x35, 0x4E, 0x67, 0xF0, 0xD9, 0xA2, 0x8B, 0x54, 0x7D, 0x06, 0x2F,
    0x28, 0x01, 0x7A, 0x53, 0x8C, 0xA5, 0xDE, 0xF7, 0x60, 0x49, 0x32, 0x1B, 0xC4, 0xED, 0x96, 0xBF,
    0x98, 0xB1, 0xCA, 0xE3, 0x3C, 0x15, 0x6E, 0x47, 0xD0, 0xF9, 0x82, 0xAB, 0x74, 0x5D, 0x26, 0x0F,
    0x08, 0x21, 0x5A, 0x73, 0xAC, 0x85, 0xFE, 0xD7, 0x40, 0x69, 0x12, 0x3B, 0xE4, 0xCD, 0xB6, 0x9F,
    0x78, 0x51, 0x2A, 0x03, 0xDC, 0xF5, 0x8E, 0xA7, 0x30, 0x19, 0x62, 0x4B, 0x94, 0xBD, 0xC6, 0xEF,
    0xE8, 0xC1, 0xBA, 0x93, 0x4C, 0x65, 0x1E, 0x37, 0xA0, 0x89, 0xF2, 0xDB, 0x04, 0x2D, 0x56, 0x7F,
    0x58, 0x71, 0x0A, 0x23, 0xFC, 0xD5, 0xAE, 0x87, 0x10, 0x39, 0x42, 0x6B, 0xB4, 0x9D, 0xE6, 0xCF,
    0xC8, 0xE1, 0x9A, 0xB3, 0x6C, 0x45, 0x3E, 0x17, 0x80, 0xA9, 0xD2, 0xFB, 0x24, 0x0D, 0x76, 0x5F,
    0x38, 0x11, 0x6A, 0x43, 0x9C, 0xB5, 0xCE, 0xE7, 0x70, 0x59, 0x22, 0x0B, 0xD4, 0xFD, 0x86, 0xAF,
    0xA8, 0x81, 0xFA, 0xD3, 0x0C, 0x25, 0x5E, 0x77, 0xE0, 0xC9, 0xB2, 0x9B, 0x44, 0x6D, 0x16, 0x3F,
    0x18, 0x31, 0x4A, 0x63, 0xBC, 0x95, 0xEE, 0xC7, 0x50, 0x79, 0x02, 0x2B, 0xF4, 0xDD, 0xA6, 0x8F,
    0x88, 0xA1, 0xDA, 0xF3, 0x2C, 0x05, 0x7E, 0x57, 0xC0, 0xE9, 0x92, 0xBB, 0x64, 0x4D, 0x36, 0x1F,
];

// File format magic values (little-endian u32)
const SIG_PLAIN: u32 = 0x4E696953;      // "SiiN"
const SIG_ENCRYPTED: u32 = 0x43736353;  // "ScsC" — AES-256-CBC + zlib
const SIG_3NK: u32 = 0x014B6E33;        // "3nK\x01" — XOR table

// Base-38 character table for SCS token encoding (1-indexed: index 0 = char '0', etc.)
const CHAR_ENCODINGS: [char; 37] = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z', '_',
];

fn decode_base38(val: u64) -> String {
    if val == 0 {
        return String::new();
    }
    let mut remaining = val & !(1u64 << 63);
    let mut chars = Vec::new();
    while remaining > 0 {
        let last = (remaining % 38) as usize;
        remaining /= 38;
        if last == 0 || last > 37 {
            break;
        }
        chars.push(CHAR_ENCODINGS[last - 1]);
    }
    chars.into_iter().collect()
}

fn format_nameless_id(id: u64) -> String {
    if id == 0 {
        return "_nameless.0".to_string();
    }
    let mut result = String::from("_nameless");
    let mut bit_shift: i32 = 48;
    let mut has_first = false;
    while bit_shift >= 0 {
        let part = ((id >> bit_shift as u32) & 0xffff) as u16;
        bit_shift -= 16;
        if !has_first && part != 0 {
            has_first = true;
            result.push_str(&format!(".{:x}", part));
        } else if has_first {
            result.push_str(&format!(".{:04x}", part));
        }
    }
    result
}

fn format_float(f: f32) -> String {
    if f.trunc() == f && f.abs() <= 1e7 {
        format!("{}", f)
    } else {
        format!("&{:x}", f.to_bits())
    }
}

fn format_string(s: &str) -> String {
    if s.is_empty() {
        return "\"\"".to_string();
    }
    if s.chars().all(|c| c.is_ascii_alphanumeric() || c == '_') {
        return s.to_string();
    }
    let mut out = String::from("\"");
    for b in s.as_bytes() {
        if *b >= 32 && *b <= 127 {
            out.push(*b as char);
        } else {
            out.push_str(&format!("\\x{:02x}", b));
        }
    }
    out.push('"');
    out
}

// ─── BSII parser ─────────────────────────────────────────────────────────────

struct FieldDef {
    type_id: u32,
    name: String,
    enum_values: Option<HashMap<u32, String>>,
}

struct ProtoDef {
    name: String,
    fields: Vec<FieldDef>,
}

struct Parser {
    data: Vec<u8>,
    pos: usize,
}

impl Parser {
    fn read_u8(&mut self) -> Option<u8> {
        if self.pos >= self.data.len() { return None; }
        let v = self.data[self.pos];
        self.pos += 1;
        Some(v)
    }
    fn read_bytes<const N: usize>(&mut self) -> Option<[u8; N]> {
        if self.pos + N > self.data.len() { return None; }
        let mut arr = [0u8; N];
        arr.copy_from_slice(&self.data[self.pos..self.pos + N]);
        self.pos += N;
        Some(arr)
    }
    fn read_u16(&mut self) -> Option<u16> { Some(u16::from_le_bytes(self.read_bytes()?)) }
    fn read_u32(&mut self) -> Option<u32> { Some(u32::from_le_bytes(self.read_bytes()?)) }
    fn read_i32(&mut self) -> Option<i32> { Some(i32::from_le_bytes(self.read_bytes()?)) }
    fn read_u64(&mut self) -> Option<u64> { Some(u64::from_le_bytes(self.read_bytes()?)) }
    fn read_i64(&mut self) -> Option<i64> { Some(i64::from_le_bytes(self.read_bytes()?)) }
    fn read_f32(&mut self) -> Option<f32> { Some(f32::from_bits(u32::from_le_bytes(self.read_bytes()?))) }

    fn read_str(&mut self) -> Option<String> {
        let len = self.read_u32()? as usize;
        if self.pos + len > self.data.len() { return None; }
        let s = String::from_utf8(self.data[self.pos..self.pos + len].to_vec()).ok()?;
        self.pos += len;
        Some(s)
    }

    fn read_encoded_str(&mut self) -> Option<String> {
        Some(decode_base38(self.read_u64()?))
    }

    fn read_id(&mut self) -> Option<String> {
        let length = self.read_u8()?;
        if length == 0xFF {
            Some(format_nameless_id(self.read_u64()?))
        } else {
            let mut parts = Vec::with_capacity(length as usize);
            for _ in 0..length {
                parts.push(self.read_encoded_str()?);
            }
            if parts.is_empty() { Some("null".to_string()) } else { Some(parts.join(".")) }
        }
    }

    // Returns (is_array, formatted_value_or_count, array_elements)
    fn read_value(&mut self, type_id: u32, enum_values: Option<&HashMap<u32, String>>) -> Option<BsiiValue> {
        match type_id {
            0x01 => Some(BsiiValue::Scalar(format_string(&self.read_str()?))),
            0x02 => {
                let count = self.read_u32()? as usize;
                let mut items = Vec::with_capacity(count);
                for _ in 0..count { items.push(format_string(&self.read_str()?)); }
                Some(BsiiValue::Array(items))
            }
            0x03 => {
                let s = self.read_encoded_str()?;
                Some(BsiiValue::Scalar(if s.is_empty() { "\"\"".to_string() } else { s }))
            }
            0x04 => {
                let count = self.read_u32()? as usize;
                let mut items = Vec::with_capacity(count);
                for _ in 0..count {
                    let s = self.read_encoded_str()?;
                    items.push(if s.is_empty() { "\"\"".to_string() } else { s });
                }
                Some(BsiiValue::Array(items))
            }
            0x05 => Some(BsiiValue::Scalar(format_float(self.read_f32()?))),
            0x06 => {
                let count = self.read_u32()? as usize;
                let mut items = Vec::with_capacity(count);
                for _ in 0..count { items.push(format_float(self.read_f32()?)); }
                Some(BsiiValue::Array(items))
            }
            0x07 => {
                let a = self.read_f32()?; let b = self.read_f32()?;
                Some(BsiiValue::Scalar(format!("({}, {})", format_float(a), format_float(b))))
            }
            0x09 => {
                let a = self.read_f32()?; let b = self.read_f32()?; let c = self.read_f32()?;
                Some(BsiiValue::Scalar(format!("({}, {}, {})", format_float(a), format_float(b), format_float(c))))
            }
            0x11 => {
                let a = self.read_i32()?; let b = self.read_i32()?; let c = self.read_i32()?;
                Some(BsiiValue::Scalar(format!("({}, {}, {})", a, b, c)))
            }
            0x12 => {
                let count = self.read_u32()? as usize;
                let mut items = Vec::with_capacity(count);
                for _ in 0..count {
                    let a = self.read_i32()?; let b = self.read_i32()?; let c = self.read_i32()?;
                    items.push(format!("({}, {}, {})", a, b, c));
                }
                Some(BsiiValue::Array(items))
            }
            0x18 => {
                let count = self.read_u32()? as usize;
                let mut items = Vec::with_capacity(count);
                for _ in 0..count {
                    let f1 = self.read_f32()?; let f2 = self.read_f32()?;
                    let f3 = self.read_f32()?; let f4 = self.read_f32()?;
                    items.push(format!("({}; {}, {}, {})", format_float(f1), format_float(f2), format_float(f3), format_float(f4)));
                }
                Some(BsiiValue::Array(items))
            }
            0x19 => {
                let f1 = self.read_f32()?; let f2 = self.read_f32()?;
                let f3 = self.read_f32()?; let f4 = self.read_f32()?;
                let f5 = self.read_f32()?; let f6 = self.read_f32()?;
                let f7 = self.read_f32()?; let f8 = self.read_f32()?;
                let coef = f4.trunc() as i32;
                let f1_ = f1 + (((coef & 0xfff) - 2048) << 9) as f32;
                let f3_ = f3 + ((((coef >> 12) & 0xfff) - 2048) << 9) as f32;
                Some(BsiiValue::Scalar(format!(
                    "({}, {}, {}) ({}; {}, {}, {})",
                    format_float(f1_), format_float(f2), format_float(f3_),
                    format_float(f5), format_float(f6), format_float(f7), format_float(f8)
                )))
            }
            0x1a => {
                let count = self.read_u32()? as usize;
                let mut items = Vec::with_capacity(count);
                for _ in 0..count {
                    let f1 = self.read_f32()?; let f2 = self.read_f32()?;
                    let f3 = self.read_f32()?; let f4 = self.read_f32()?;
                    let f5 = self.read_f32()?; let f6 = self.read_f32()?;
                    let f7 = self.read_f32()?; let f8 = self.read_f32()?;
                    let coef = f4.trunc() as i32;
                    let f1_ = f1 + (((coef & 0xfff) - 2048) << 9) as f32;
                    let f3_ = f3 + ((((coef >> 12) & 0xfff) - 2048) << 9) as f32;
                    items.push(format!(
                        "({}, {}, {}) ({}; {}, {}, {})",
                        format_float(f1_), format_float(f2), format_float(f3_),
                        format_float(f5), format_float(f6), format_float(f7), format_float(f8)
                    ));
                }
                Some(BsiiValue::Array(items))
            }
            0x25 => Some(BsiiValue::Scalar(format!("{}", self.read_i32()?))),
            0x26 => {
                let count = self.read_u32()? as usize;
                let mut items = Vec::with_capacity(count);
                for _ in 0..count { items.push(format!("{}", self.read_i32()?)); }
                Some(BsiiValue::Array(items))
            }
            0x27 | 0x2f => {
                let v = self.read_u32()?;
                Some(BsiiValue::Scalar(if v == u32::MAX { "nil".to_string() } else { format!("{}", v) }))
            }
            0x28 => {
                let count = self.read_u32()? as usize;
                let mut items = Vec::with_capacity(count);
                for _ in 0..count {
                    let v = self.read_u32()?;
                    items.push(if v == u32::MAX { "nil".to_string() } else { format!("{}", v) });
                }
                Some(BsiiValue::Array(items))
            }
            0x2b => {
                let v = self.read_u16()?;
                Some(BsiiValue::Scalar(if v == u16::MAX { "nil".to_string() } else { format!("{}", v) }))
            }
            0x2c => {
                let count = self.read_u32()? as usize;
                let mut items = Vec::with_capacity(count);
                for _ in 0..count {
                    let v = self.read_u16()?;
                    items.push(if v == u16::MAX { "nil".to_string() } else { format!("{}", v) });
                }
                Some(BsiiValue::Array(items))
            }
            0x31 => Some(BsiiValue::Scalar(format!("{}", self.read_i64()?))),
            0x32 => {
                let count = self.read_u32()? as usize;
                let mut items = Vec::with_capacity(count);
                for _ in 0..count { items.push(format!("{}", self.read_i64()?)); }
                Some(BsiiValue::Array(items))
            }
            0x33 => {
                let v = self.read_u64()?;
                Some(BsiiValue::Scalar(if v == u64::MAX { "nil".to_string() } else { format!("{}", v) }))
            }
            0x34 => {
                let count = self.read_u32()? as usize;
                let mut items = Vec::with_capacity(count);
                for _ in 0..count {
                    let v = self.read_u64()?;
                    items.push(if v == u64::MAX { "nil".to_string() } else { format!("{}", v) });
                }
                Some(BsiiValue::Array(items))
            }
            0x35 => Some(BsiiValue::Scalar(if self.read_u8()? != 0 { "true".to_string() } else { "false".to_string() })),
            0x36 => {
                let count = self.read_u32()? as usize;
                let mut items = Vec::with_capacity(count);
                for _ in 0..count { items.push(if self.read_u8()? != 0 { "true".to_string() } else { "false".to_string() }); }
                Some(BsiiValue::Array(items))
            }
            0x37 => {
                let v = self.read_u32()?;
                let s = enum_values
                    .and_then(|ev| ev.get(&v))
                    .map(|s| format_string(s))
                    .unwrap_or_else(|| format!("{}", v));
                Some(BsiiValue::Scalar(s))
            }
            0x39 | 0x3b | 0x3d => Some(BsiiValue::Scalar(self.read_id()?)),
            0x3a | 0x3c => {
                let count = self.read_u32()? as usize;
                let mut items = Vec::with_capacity(count);
                for _ in 0..count { items.push(self.read_id()?); }
                Some(BsiiValue::Array(items))
            }
            _ => None,  // unknown type — fail gracefully
        }
    }
}

enum BsiiValue {
    Scalar(String),
    Array(Vec<String>),
}

fn bsii_to_siin(data: Vec<u8>) -> Option<String> {
    if data.len() < 8 || &data[0..4] != b"BSII" {
        return None;
    }
    let version = u32::from_le_bytes(data[4..8].try_into().ok()?);
    if version == 1 {
        return None;
    }

    let mut p = Parser { data, pos: 8 };
    let mut prototypes: HashMap<u32, ProtoDef> = HashMap::new();
    let mut output = String::with_capacity(1 << 20);

    output.push_str("SiiNunit\n{\n");

    loop {
        let block_id = p.read_u32()?;
        if block_id == 0 {
            let validity = p.read_u8()?;
            if validity == 0 {
                break;
            }
            // Parse prototype (struct definition) block
            let struct_id = p.read_u32()?;
            let struct_name = p.read_str()?;
            let mut fields = Vec::new();
            loop {
                let type_id = p.read_u32()?;
                if type_id == 0 { break; }
                let field_name = p.read_str()?;
                let enum_values = if type_id == 0x37 {
                    let count = p.read_u32()? as usize;
                    let mut ev = HashMap::new();
                    for _ in 0..count {
                        let k = p.read_u32()?;
                        let v = p.read_str()?;
                        ev.insert(k, v);
                    }
                    Some(ev)
                } else {
                    None
                };
                fields.push(FieldDef { type_id, name: field_name, enum_values });
            }
            prototypes.insert(struct_id, ProtoDef { name: struct_name, fields });
        } else {
            // Parse data block
            let proto = prototypes.get(&block_id)?;
            let proto_name = proto.name.clone();
            // Collect field info before mutably borrowing parser
            let field_defs: Vec<(u32, String, Option<HashMap<u32, String>>)> = proto.fields.iter()
                .map(|f| (f.type_id, f.name.clone(), f.enum_values.clone()))
                .collect();

            let obj_id = p.read_id()?;
            output.push_str(&proto_name);
            output.push_str(" : ");
            output.push_str(&obj_id);
            output.push_str(" {\n");

            for (type_id, field_name, enum_vals) in &field_defs {
                let value = p.read_value(*type_id, enum_vals.as_ref())?;
                match value {
                    BsiiValue::Scalar(s) => {
                        output.push(' ');
                        output.push_str(field_name);
                        output.push_str(": ");
                        output.push_str(&s);
                        output.push('\n');
                    }
                    BsiiValue::Array(items) => {
                        output.push(' ');
                        output.push_str(field_name);
                        output.push_str(": ");
                        output.push_str(&items.len().to_string());
                        output.push('\n');
                        for (i, item) in items.iter().enumerate() {
                            output.push(' ');
                            output.push_str(field_name);
                            output.push_str(&format!("[{}]: ", i));
                            output.push_str(item);
                            output.push('\n');
                        }
                    }
                }
            }
            output.push_str("}\n\n");
        }
    }

    output.push_str("}\n");
    Some(output)
}

// ─── ScsC header layout: 4 sig + 32 HMAC + 16 IV + 4 DataSize = 56 bytes ────

fn decrypt_scsc(data: &[u8]) -> Option<String> {
    if data.len() < 56 {
        return None;
    }
    let iv: [u8; 16] = data[36..52].try_into().ok()?;
    let data_size = u32::from_le_bytes(data[52..56].try_into().ok()?) as usize;
    let ciphertext = &data[56..];

    if ciphertext.is_empty() || ciphertext.len() % 16 != 0 {
        return None;
    }

    let mut buf = ciphertext.to_vec();
    Decryptor::<Aes256>::new_from_slices(&SII_KEY, &iv)
        .ok()?
        .decrypt_padded_mut::<NoPadding>(&mut buf)
        .ok()?;

    let mut decoded = vec![0u8; data_size];
    ZlibDecoder::new(&buf[..]).read_exact(&mut decoded).ok()?;

    // After AES+zlib, the result may be BSII binary or plain SiiN text
    if decoded.starts_with(b"BSII") {
        bsii_to_siin(decoded)
    } else {
        String::from_utf8(decoded).ok()
    }
}

// 3nK header: 4 sig + 1 unknown + 1 seed = 6 bytes; body XORed with key table
fn decode_3nk(data: &[u8]) -> Option<String> {
    if data.len() < 6 {
        return None;
    }
    let seed = data[5] as usize;
    let decoded: Vec<u8> = data[6..]
        .iter()
        .enumerate()
        .map(|(i, &b)| b ^ KEY_3NK[(seed + i) & 0xFF])
        .collect();
    String::from_utf8(decoded).ok()
}

fn decrypt_memory(data: &[u8]) -> Option<String> {
    if data.len() < 4 {
        return None;
    }
    match u32::from_le_bytes(data[0..4].try_into().ok()?) {
        SIG_PLAIN => String::from_utf8(data.to_vec()).ok(),
        SIG_ENCRYPTED => decrypt_scsc(data),
        SIG_3NK => decode_3nk(data),
        _ => None,
    }
}

pub async fn decrypt_file(path: &str) -> Option<String> {
    let data = fs::read(path).ok()?;
    decrypt_memory(&data)
}

pub async fn decrypt_file_to_save(path: &str) -> bool {
    match decrypt_file(path).await {
        Some(content) => fs::write(path, content).is_ok(),
        None => false,
    }
}
