import { SaveGame, EnginesTypes, TransmissionsTypes } from "./SaveGameTypes";

export interface responseRustTypes {
	res: boolean;
}

export interface responseProfileSaves extends responseRustTypes {
	saves: SaveGame[];
}

export interface responseProfileSavesCount extends responseRustTypes {
	saves: number;
}

export interface responseTrucksEngines extends responseRustTypes {
	engines?: EnginesTypes;
}

export interface responseTrucksTransmissions extends responseRustTypes {
	transmissions?: TransmissionsTypes;
}
