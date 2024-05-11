import { SaveGame } from "./SaveGameTypes";

export interface responseRustTypes {
    res: boolean;
}

export interface responseProfileSaves extends responseRustTypes {
    saves: SaveGame[];
}
