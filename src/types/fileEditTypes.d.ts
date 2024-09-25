import { SaveGame, ProfileDir, TruckBrands } from "@/types/SaveGameTypes";

export type themeTypes = "light" | "dark";
export type themeTypesSystem = "system" | "light" | "dark";

export interface responseRustTypes {
	res: boolean;
}

export interface responseProfileSaves extends responseRustTypes {
	save_games: SaveGame[];
}

export interface responseProfileSavesCount extends responseRustTypes {
	saves: number;
}

export interface responseTrucksInfo extends responseRustTypes {
	trucks: TruckBrands;
}

export interface responseProfileDir extends responseRustTypes {
	profiles: ProfileDir[];
}

export interface responseSystemTheme extends responseRustTypes {
	theme: themeTypes;
}

export interface responseGetDeveloperValues extends responseRustTypes {
	developer: boolean;
	console: boolean;
	active_max_convoy_mode: boolean;
}

export interface licensePlateSaved {
	text: string;
	text_color: string;
	bg_color: string;
}

export interface listLicensePlateSaved {
	license_plates_ets2: licensePlateSaved[];
}
