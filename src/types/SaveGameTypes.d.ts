import { GamesNames } from "@/types/ContexTypes";

/////////////////////////////////////////////////////////
// PROFILE TYPES

export interface Profile {
	id: string;
	name: string;
	game: GamesNames;
	hex: string;
	saves: Array<SaveGame>;
	avatar?: string;
	dir: string;
}

export interface SaveGame {
	id: string;
	name: string;
	dir: string;
}

export interface ProfileDir {
	id: string;
	name: string;
	hex: string;
	dir: string;
}

export interface ProfileWithoutSaves {
	id: string;
	name: string;
	game: GamesNames;
	hex: string;
	savesCount: number;
	avatar?: string;
	dir: string;
}

export interface ExperienceSkillsTypes {
	adrBin: string;
	longDist: string;
	heavy: string;
	fragile: string;
	urgent: string;
	mechanical: string;
}

/////////////////////////////////////////////////////////
// TRUCKS TYPES

export interface TruckBrands {
	mercedes: Model[];
	daf: Model[];
	man: Model[];
	renault: Model[];
	scania: Model[];
	volvo: Model[];
	iveco: Model[];
}

export interface Model {
	brand: string;
	model: string;
	engines: EngineType[];
	transmissions: TransmissionType[];
}

export interface EngineType {
	name: string;
	cv: string;
	nm: string;
	code: string;
}

export interface TransmissionType {
	name: string;
	speeds: string;
	retarder: boolean;
	ratio: string;
	code: string;
}

/////////////////////////////////////////////////////////
