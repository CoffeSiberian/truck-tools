import { Buffer } from "buffer";

// tauri
import { readDir, exists, copyFile, BaseDirectory } from "@tauri-apps/api/fs";
import { join } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/api/shell";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { invoke } from "@tauri-apps/api/tauri";

// types
import { ProfileWithoutSaves, SaveGame } from "../types/SaveGameTypes";
import {
    responseRustTypes,
    responseProfileSaves,
    responseProfileSavesCount,
} from "../types/fileEditTypes";

const getProfileImage = async (path: string): Promise<string | undefined> => {
    const imgPath = await join(path, "avatar.png");
    const verifyExist = await exists(imgPath);

    if (!verifyExist) return undefined;
    return convertFileSrc(imgPath);
};

export const descriptFiles = async (
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

export const openExplorer = async (path: string) => {
    const command = new Command("explorer", path);
    await command.execute();
};

const getProfileSavesCount = async (profilePath: string): Promise<number> => {
    const rustParams = {
        dirSave: profilePath,
    };

    const invoceRes = await invoke("get_save_game_count", rustParams);
    const res = JSON.parse(invoceRes as string) as responseProfileSavesCount;

    return res.saves;
};

export const getListSaves = async (
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

export const readProfileNames = async (): Promise<ProfileWithoutSaves[]> => {
    const reDirProfiles = "Euro Truck Simulator 2/profiles";

    const dirProfiles = await readDir(reDirProfiles, {
        dir: BaseDirectory.Document,
        recursive: true,
    });

    let profileNames: ProfileWithoutSaves[] = [];
    for (let i = 0; i < dirProfiles.length; i++) {
        const profileImg = await getProfileImage(dirProfiles[i].path);
        const saves = await getProfileSavesCount(dirProfiles[i].path);
        if (saves === 0) continue;

        const profileObject: ProfileWithoutSaves = {
            name: Buffer.from(dirProfiles[i].name!, "hex").toString("utf-8"),
            hex: dirProfiles[i].name!,
            savesCount: saves,
            avatar: profileImg,
            dir: dirProfiles[i].path,
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

export const setRepairTruck = async (dirSave: string) => {
    const descriptSucces = await descriptFiles(dirSave, "game.sii");
    if (!descriptSucces) return false;

    const rustParams = {
        dirSave: dirSave + "/game.sii",
        wear: "0",
    };

    const invoceRes = await invoke("repait_truck", rustParams);
    const res = JSON.parse(invoceRes as string) as responseRustTypes;
    return res.res;
};

export const setRepairAllTruck = async (dirSave: string) => {
    const descriptSucces = await descriptFiles(dirSave, "game.sii");
    if (!descriptSucces) return false;

    const rustParams = {
        dirSave: dirSave + "/game.sii",
        wear: "0",
    };

    const invoceRes = await invoke("repait_all_trucks", rustParams);
    const res = JSON.parse(invoceRes as string) as responseRustTypes;
    return res.res;
};

export const setFuelTruck = async (dirSave: string) => {
    const descriptSucces = await descriptFiles(dirSave, "game.sii");
    if (!descriptSucces) return false;

    const rustParams = {
        dirSave: dirSave + "/game.sii",
        fuel: "1",
    };

    const invoceRes = await invoke("fill_fuel_truck", rustParams);
    const res = JSON.parse(invoceRes as string) as responseRustTypes;
    return res.res;
};

export const setAllFuelTruck = async (dirSave: string) => {
    const descriptSucces = await descriptFiles(dirSave, "game.sii");
    if (!descriptSucces) return false;

    const rustParams = {
        dirSave: dirSave + "/game.sii",
        fuel: "1",
    };

    const invoceRes = await invoke("fill_any_trucks_fuel", rustParams);
    const res = JSON.parse(invoceRes as string) as responseRustTypes;
    return res.res;
};

export const setInfinitFuelTruck = async (dirSave: string) => {
    const descriptSucces = await descriptFiles(dirSave, "game.sii");
    if (!descriptSucces) return false;

    const rustParams = {
        dirSave: dirSave + "/game.sii",
    };

    const invoceRes = await invoke("set_infinite_fuel", rustParams);
    const res = JSON.parse(invoceRes as string) as responseRustTypes;
    return res.res;
};

export const setLicensePlateTrailer = async (
    dirSave: string,
    licensePlate: string,
    bgPlateColor: string,
    textPlateColor: string
) => {
    const descriptSucces = await descriptFiles(dirSave, "game.sii");
    if (!descriptSucces) return false;

    const rustParams = {
        dirSave: dirSave + "/game.sii",
        licensePlate: licensePlate,
        bgPlateColor: bgPlateColor,
        textPlateColor: textPlateColor,
    };

    const invoceRes = await invoke("set_license_plate_trailer", rustParams);
    const res = JSON.parse(invoceRes as string) as responseRustTypes;
    return res.res;
};

export const setLicensePlateTruck = async (
    dirSave: string,
    licensePlate: string,
    bgPlateColor: string,
    textPlateColor: string
) => {
    const descriptSucces = await descriptFiles(dirSave, "game.sii");
    if (!descriptSucces) return false;

    const rustParams = {
        dirSave: dirSave + "/game.sii",
        licensePlate: licensePlate,
        bgPlateColor: bgPlateColor,
        textPlateColor: textPlateColor,
    };

    const invoceRes = await invoke("set_license_plate_truck", rustParams);
    const res = JSON.parse(invoceRes as string) as responseRustTypes;
    return res.res;
};

export const getListEngines = async () => {
    const invoceRes = await invoke("get_list_engines");
    const res = JSON.parse(invoceRes as string) as responseRustTypes;
    return res.res;
};

export const getListTransmissions = async () => {
    const invoceRes = await invoke("get_list_transmissions");
    const res = JSON.parse(invoceRes as string) as responseRustTypes;
    return res.res;
};
