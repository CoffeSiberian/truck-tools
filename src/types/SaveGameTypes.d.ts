import {
	ScaniaModelsEngines,
	ScaniaModelsTransmissions,
	VolvoModelsEngines,
	VolvoModelsTransmissions,
} from "./TrucksTypes";

export interface Profile {
	name: string;
	hex: string;
	saves: Array<SaveGame>;
	avatar?: string;
	dir: string;
}

export interface ProfileDir {
	name: string;
	hex: string;
	dir: string;
}

export interface ProfileWithoutSaves {
	name: string;
	hex: string;
	savesCount: number;
	avatar?: string;
	dir: string;
}

export interface SaveGame {
	id: string;
	name: string;
	dir: string;
}

export interface EngineTypes {
	name_id: string;
	name: string;
	cv: string;
	nm: string;
	code: string;
}

export interface TransmissionTypes {
	name_id: string;
	name: string;
	speeds: string;
	retarder: boolean;
	ratio: string;
	code: string;
}

export interface EnginesTypes {
	scania: ScaniaModelsEngines;
	volvo: VolvoModelsEngines;
}

export interface TransmissionsTypes {
	scania: ScaniaModelsTransmissions;
	volvo: VolvoModelsTransmissions;
}

export interface ExperienceSkillsTypes {
	adrBin: string;
	longDist: string;
	heavy: string;
	fragile: string;
	urgent: string;
	mechanical: string;
}
