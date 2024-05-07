import { Buffer } from "buffer";

// tauri
import { readDir, exists, copyFile, BaseDirectory } from "@tauri-apps/api/fs";
import { join } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/api/shell";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { invoke } from "@tauri-apps/api/tauri";

// types
import { Profile } from "../types/SaveGameTypes";
import { setCargoMassTrailersAndSlaveResTypes } from "../types/fileEditTypes";

const getProfileImage = async (path: string): Promise<string | undefined> => {
    const imgPath = await join(path, "avatar.png");
    const verifyExist = await exists(imgPath);

    if (!verifyExist) return undefined;
    return convertFileSrc(imgPath);
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

    try {
        const dirProfiles = await readDir(reDirProfiles, {
            dir: BaseDirectory.Document,
            recursive: true,
        });

        const profileNames = dirProfiles.map(async (profile) => {
            try {
                const profilesSaves = await readDir(profile.path + "/save", {
                    dir: BaseDirectory.Document,
                    recursive: true,
                });

                const profileImg = await getProfileImage(profile.path);

                const profileObject = {
                    name: Buffer.from(profile.name!, "hex").toString("utf-8"),
                    hex: profile.name,
                    saves: profilesSaves.reverse().map((save) => {
                        return { name: save.name, dir: save.path };
                    }),
                    avatar: profileImg,
                };
                return profileObject;
            } catch (err) {
                return null;
            }
        });

        const resolvePromisProfiles = await Promise.all(profileNames);

        const filterNull = resolvePromisProfiles.filter(
            (profile) => profile !== null
        ) as Profile[];

        return filterNull;
    } catch (err) {
        return [];
    }
};

export const setChassisMassTrailer = (
    arrFile: string[],
    id: string,
    chassis_mass: string,
    body_mass: string
) => {
    let arrFileCopy = arrFile.slice();

    const indexTrailer = arrFileCopy.indexOf("trailer : " + id + " {");
    let trailerDefID = "";

    for (let i = indexTrailer; i < arrFileCopy.length; i++) {
        let splitTrailerMas = arrFileCopy[i].split(":");

        if (splitTrailerMas[0] === " trailer_definition") {
            trailerDefID = splitTrailerMas[1];
            break;
        }
    }

    const indexTrailerDef = arrFileCopy.indexOf(
        "trailer_def : " + trailerDefID + " {"
    );
    let body_mass_redy = false;
    let chassis_mass_redy = false;
    for (let i = indexTrailerDef; i < arrFileCopy.length; i++) {
        let splitTrailerMas = arrFileCopy[i].split(":");

        if (splitTrailerMas[0] === " chassis_mass") {
            arrFileCopy[i] = " chassis_mass: " + chassis_mass + "}";
            chassis_mass_redy = true;
        } else if (splitTrailerMas[0] === " body_mass") {
            arrFileCopy[i] = " body_mass: " + body_mass + "}";
            body_mass_redy = true;
        }
        if (body_mass_redy && chassis_mass_redy) return true;
    }
    return false;
};

export const setUnlockCurrentTrailers = async (dirSave: string) => {
    const descriptSucces = await descriptFiles(dirSave, "game.sii");
    if (!descriptSucces) return false;

    const rustParams = {
        dirSave: dirSave + "/game.sii",
    };

    const invoceRes = await invoke("set_unlock_current_trailers", rustParams);
    const res = JSON.parse(
        invoceRes as string
    ) as setCargoMassTrailersAndSlaveResTypes;
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
    const res = JSON.parse(
        invoceRes as string
    ) as setCargoMassTrailersAndSlaveResTypes;

    return res.res;
};
