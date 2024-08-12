import exp from "constants";
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

export interface ManModelsEngines {
	man_tgx: EngineTypes[];
	man_tgx_euro6: EngineTypes[];
}

export interface DafModelsEngines {
	daf_xf: EngineTypes[];
	daf_xf_euro6: EngineTypes[];
}

export interface MercedesModelsEngines {
	merc_actros: EngineTypes[];
	merc_new_actros: EngineTypes[];
}

export interface RenaultModelsEngines {
	renault_t: EngineTypes[];
	renault_magnum: EngineTypes[];
	renault_premium: EngineTypes[];
}

export interface IvecoModelsEngines {
	iveco_stralis: EngineTypes[];
	iveco_hiway: EngineTypes[];
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
