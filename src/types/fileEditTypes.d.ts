import {
	SaveGame,
	EnginesTypes,
	ProfileDir,
	TransmissionsTypes,
	TruckBrands,
} from "./SaveGameTypes";

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
