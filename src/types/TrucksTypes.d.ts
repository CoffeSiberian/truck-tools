import { EngineTypes, TransmissionTypes } from "./SaveGameTypes";

export interface ScaniaModelsEngines {
	scania_r: EngineTypes[];
	scania_s: EngineTypes[];
	scania_r_2009: EngineTypes[];
	scania_streamline: EngineTypes[];
}

export interface VolvoModelsEngines {
	volvo_fh_classic: EngineTypes[];
	volvo_fh: EngineTypes[];
}

export interface ScaniaModelsTransmissions {
	scania_r: TransmissionTypes[];
	scania_s: TransmissionTypes[];
	scania_r_2009: TransmissionTypes[];
	scania_streamline: TransmissionTypes[];
}

export interface VolvoModelsTransmissions {
	volvo_fh_classic: TransmissionTypes[];
	volvo_fh: TransmissionTypes[];
}
