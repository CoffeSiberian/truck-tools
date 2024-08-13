import {
	SaveGame,
	EnginesTypes,
	ProfileDir,
	TransmissionsTypes,
} from "./SaveGameTypes";

export type themeTypes = "light" | "dark";

export interface responseRustTypes {
	res: boolean;
}

export interface responseProfileSaves extends responseRustTypes {
	save_games: SaveGame[];
}

export interface responseProfileSavesCount extends responseRustTypes {
	saves: number;
}

export interface responseTrucksEngines extends responseRustTypes {
	// deprecated
	engines?: EnginesTypes;
}

export interface responseTrucksTransmissions extends responseRustTypes {
	// deprecated
	transmissions?: TransmissionsTypes;
}

export interface responseProfileDir extends responseRustTypes {
	profiles: ProfileDir[];
}

export interface responseSystemTheme extends responseRustTypes {
	theme: themeTypes;
}
