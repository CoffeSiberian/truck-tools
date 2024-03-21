export interface Profile {
    name: string;
    hex: string;
    saves: Array<SaveGame>;
    avatar?: string;
}

export interface SaveGame {
    name: string;
    dir: string;
}
