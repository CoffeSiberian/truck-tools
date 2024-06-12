import { SaveGame, EngineTypes, TransmissionTypes } from "./SaveGameTypes";

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
    engines: {
        scania: EngineTypes[];
        volvo: EngineTypes[];
    };
}

export interface responseTrucksTransmissions extends responseRustTypes {
    transmissions: {
        scania: TransmissionTypes[];
        volvo: TransmissionTypes[];
    };
}
