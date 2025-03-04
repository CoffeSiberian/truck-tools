import { SaveGame, ProfileDir, Model } from "@/types/SaveGameTypes";
import { IColor } from "react-color-palette";

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
	models: Model[];
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
	id: string;
	text: string;
	color_margin: boolean;
	text_color: IColor;
	bg_color: IColor;
}

export interface listLicensePlateSaved {
	license_plates_ets2: licensePlateSaved[];
}

export interface IColorRgbToValidate {
	readonly r: number;
	readonly g: number;
	readonly b: number;
	readonly a: number;
}

export interface IColorHsvToValidate {
	readonly h: number;
	readonly s: number;
	readonly v: number;
	readonly a: number;
}

export interface SaveTrucks {
	brand_name: string;
	truck_id: string;
	truck_number: number;
}

export interface ResponseSaveGameTrucks extends responseRustTypes {
	current_truck_id: string;
	trucks: SaveTrucks[];
}
