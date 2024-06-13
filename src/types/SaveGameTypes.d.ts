export interface Profile {
    name: string;
    hex: string;
    saves: Array<SaveGame>;
    avatar?: string;
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
    retarde: boolean;
    ratio: string;
    code: string;
}

export interface EnginesTypes {
    scania: EngineTypes[];
    volvo: EngineTypes[];
}

export interface TransmissionsTypes {
    scania: TransmissionTypes[];
    volvo: TransmissionTypes[];
}
