import { Buffer } from "buffer";

// tauri
import { readDir, exists, copyFile, BaseDirectory } from "@tauri-apps/api/fs";
import { join } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/api/shell";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { invoke } from "@tauri-apps/api/tauri";

// types
import { Profile, SaveGame } from "../types/SaveGameTypes";
import {
    responseRustTypes,
    responseProfileSaves,
} from "../types/fileEditTypes";

const getProfileImage = async (path: string): Promise<string | undefined> => {
    const imgPath = await join(path, "avatar.png");
    const verifyExist = await exists(imgPath);

    if (!verifyExist) return undefined;
    return convertFileSrc(imgPath);
};

const getListSaveNames = async (
    profilePath: string
): Promise<SaveGame[] | null> => {
    const rustParams = {
        dirSave: profilePath,
    };

    const invoceRes = await invoke("get_save_game_name", rustParams);
    const res = JSON.parse(invoceRes as string) as responseProfileSaves;
    if (!res.saves) return null;

    return res.saves;
};

const descriptFiles = async (
    dir: string,
    fileName: string
): Promise<boolean> => {
    try {
        const gameSiiJoin = await join(dir, fileName);
        await copyFile(gameSiiJoin, `${dir}/${fileName}.bak`);

        const command = Command.sidecar("bin/SII_Decrypt", `${gameSiiJoin}`);
        const res = await command.execute();

        if (res.code === null) return false;
        if (res.code === -1) return false;
        return true;
    } catch (err) {
        return false;
    }
};

export const readProfileNames = async (): Promise<Profile[]> => {
    const reDirProfiles = "Euro Truck Simulator 2/profiles";

    const dirProfiles = await readDir(reDirProfiles, {
        dir: BaseDirectory.Document,
        recursive: true,
    });

    let profileNames: Profile[] = [];
    for (let i = 0; i < dirProfiles.length; i++) {
        const profileImg = await getProfileImage(dirProfiles[i].path);
        const saves = await getListSaveNames(dirProfiles[i].path);
        if (!saves) continue;

        const profileObject: Profile = {
            name: Buffer.from(dirProfiles[i].name!, "hex").toString("utf-8"),
            hex: dirProfiles[i].name!,
            saves: saves,
            avatar: profileImg,
        };

        profileNames.push(profileObject);
    }

    return profileNames;
};

export const setChassisMassTrailer = async (
    dirSave: string,
    chassisMass: string,
    bodyMass: string
) => {
    const descriptSucces = await descriptFiles(dirSave, "game.sii");
    if (!descriptSucces) return false;

    const rustParams = {
        dirSave: dirSave + "/game.sii",
        bodyMass,
        chassisMass,
    };

    const invoceRes = await invoke("set_cargo_mass_def_trailers", rustParams);
    const res = JSON.parse(invoceRes as string) as responseRustTypes;
    return res.res;
};

export const setUnlockCurrentTrailers = async (dirSave: string) => {
    const descriptSucces = await descriptFiles(dirSave, "game.sii");
    if (!descriptSucces) return false;

    const rustParams = {
        dirSave: dirSave + "/game.sii",
    };

    const invoceRes = await invoke("set_unlock_current_trailers", rustParams);
    const res = JSON.parse(invoceRes as string) as responseRustTypes;
    return res.res;
};

export const setCargoMassTrailersAndSlave = async (
    cargoMass: string,
    dirSave: string
) => {
    const descriptSucces = await descriptFiles(dirSave, "game.sii");
    if (!descriptSucces) return false;

    const rustParams = {
        cargoMass,
        dirSave: dirSave + "/game.sii",
    };

    const invoceRes = await invoke(
        "set_cargo_mass_trailers_and_slave",
        rustParams
    );
    const res = JSON.parse(invoceRes as string) as responseRustTypes;

    return res.res;
};
