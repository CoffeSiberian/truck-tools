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
    name: string;
    dir: string;
}
