# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Truck Tools is a **Tauri 2 desktop app (Windows / MSI)** that edits save games for **Euro
Truck Simulator 2 (ETS2)** and **American Truck Simulator (ATS)**. Frontend is React 19 +
TypeScript + Vite + HeroUI + Tailwind v4; backend is Rust. Package manager is **pnpm**.

## Commands

Run frontend/Tauri commands from the repo root; run `cargo` commands from `src-tauri/`.

- `pnpm install` — install dependencies
- `pnpm tauri dev` — run the full desktop app (spawns Vite on port 1420 + the Rust backend)
- `pnpm dev` — Vite frontend only (no Rust)
- `pnpm build` — type-check + build the frontend (`tsc && vite build`)
- `pnpm tauri build` — build the production MSI installer
- `pnpm tsc` — type-check only
- `pnpm lint` — ESLint (flat config in `eslint.config.js`)
- `pnpm format` — Prettier (tabs, double quotes, Tailwind class sorting)
- `cargo check` / `cargo build` (in `src-tauri/`) — compile the Rust backend

There is **no test suite** in this repo.

When bumping a dependency to a brand-new version, add it to `minimumReleaseAgeExclude` in
[pnpm-workspace.yaml](pnpm-workspace.yaml) — otherwise pnpm's release-age policy blocks `install`.

## Architecture

### Frontend ⇄ Rust bridge

The frontend never edits files directly. Every operation calls a Rust `#[tauri::command]`
through Tauri IPC. All `invoke()` calls are centralized in
[src/utils/fileEdit.ts](src/utils/fileEdit.ts) as typed wrapper functions; UI code imports
those wrappers rather than calling `invoke` itself. JS params are camelCase and map to the
Rust snake_case args automatically (Tauri convention). Most commands return
`{ res: boolean }` (`responseRustTypes`).

### Rust backend

- [src-tauri/src/lib.rs](src-tauri/src/lib.rs) defines all `#[tauri::command]` functions and
  registers them in `tauri::generate_handler![...]`. A command must be listed there to be
  callable from JS.
- Business logic lives in `src-tauri/src/main_options/` (`trucks.rs`, `trailers.rs`,
  `profiles.rs`, `license_plate.rs`, `accessories.rs`, `vehicles_player.rs`) and
  `src-tauri/src/utils/` (`file_edit.rs`, `decrypt_saves.rs`, `compress_folder.rs`). Response
  and data shapes live in `src-tauri/src/structs/`.
- `src-tauri/src/embeds/` holds engine/transmission reference data
  (`trucks_data_ets2.json`, `trucks_data_ats.json`) embedded at compile time via `include_str!`
  in `trucks.rs` and served to the UI by `get_brand_models_ets2` / `get_brand_models_ats`.

### Save-editing model (important)

SCS `.sii` save files are encrypted. Editing follows this pattern:

1. **Decrypt** — [decrypt_saves.rs](src-tauri/src/utils/decrypt_saves.rs) loads the bundled
   `resources/SII_Decrypt.dll` via `libloading` FFI. `get_memory_format` returns the format:
   `1` = plaintext, `2` = encrypted, `4` = 3nK-encoded; formats 2/4 are decoded to text.
2. **Read as lines** — `read_file_text` splits the decrypted file into a `Vec<String>`
   (handles CRLF and LF).
3. **Locate** — getter functions (e.g. `get_truck_id`, `get_truck_vehicle_index`,
   `get_my_trailer_id`) find the relevant line indices.
4. **Mutate + save** — a setter returns a modified `Vec<String>` and `save_file` writes it
   back. Editing is **line/text manipulation**, not structured parsing.

File targets: vehicle/world edits operate on `game.sii` inside a save folder; profile-level
edits on `profile.sii`; game settings (developer mode, convoy size) on `config.cfg`.

### Frontend structure

- [src/main.tsx](src/main.tsx) wraps the app in `HeroUIProvider` → `DarkMode` → `Locale` →
  `ProfileContexInfo` context providers (in `src/hooks/`).
- Feature UIs are tab/page based under `src/routes/pages/` — `TrucksOptions/`,
  `TrailersOptions/`, `ProfilesOptions/`. Each action is its own modal in a subfolder:
  `Modals/` for Trucks and Trailers, `Modal/` (singular) for Profiles.
- Path alias `@` → `./src` (configured in [vite.config.ts](vite.config.ts) and tsconfig).
- i18n: lazy-imported JSON files in `src/translations/` (BCP-47 names like `en-US.json`),
  selected via the `Locale` context; `mostSimilarLang` in `fileEdit.ts` maps a system locale
  to the closest available language. Translations are managed through Weblate — avoid hand-
  editing locale files unless explicitly asked.
- Persistent settings use the Tauri Store plugin in `.settings.dat` (keys: `theme`,
  `document_dir`, `license_plate`, `lang`, `opasity_profile`).

## Adding a save-edit feature

A new feature typically touches all of these layers:

1. Logic + a getter/setter in the relevant `src-tauri/src/main_options/*.rs`.
2. A `#[tauri::command]` in `lib.rs`, **also added to** `generate_handler![...]`.
3. A response struct in `src-tauri/src/structs/responses.rs` if not returning `DefaultResponse`.
4. A typed wrapper in [src/utils/fileEdit.ts](src/utils/fileEdit.ts).
5. UI (usually a modal) under the appropriate `src/routes/pages/*Options/Modal(s)/`.

## Conventions & gotchas

- ESLint ignores `dist` and `src-tauri`; Rust is not linted by ESLint.
- Some existing command/function names contain typos (e.g. `repait_truck`,
  `descriptFiles`, `opasity`). Match the existing spelling when wiring calls together.
- The app is Windows-first and depends on `SII_Decrypt.dll` being bundled as a Tauri
  resource (declared in [src-tauri/tauri.conf.json](src-tauri/tauri.conf.json)).
