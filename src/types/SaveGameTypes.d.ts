import {
	ScaniaModelsEngines,
	ScaniaModelsTransmissions,
	VolvoModelsEngines,
	VolvoModelsTransmissions,
} from "./TrucksTypes";

/////////////////////////////////////////////////////////
// PROFILE TYPES

export interface Profile {
	name: string;
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

export interface TruckValues {
	engines: EngineTypes[];
	transmissions: TransmissionTypes[];
}

export interface BrandScania {
	scania_r: TruckValues;
	scania_s: TruckValues;
	scania_streamline: TruckValues;
	scania_r_2009: TruckValues;
}

export interface BrandVolvo {
	volvo_fh: TruckValues;
	volvo_fh_classic: TruckValues;
}

export interface TruckBrands {
	scania: BrandScania;
	volvo: BrandVolvo;
}

/////////////////////////////////////////////////////////
