import { SaveGame } from "./SaveGameTypes";

export interface responseRustTypes {
    res: boolean;
}

export interface responseProfileSaves extends responseRustTypes {
    saves: SaveGame[];
}

export interface responseProfileSavesCount extends responseRustTypes {
    saves: number;
}
