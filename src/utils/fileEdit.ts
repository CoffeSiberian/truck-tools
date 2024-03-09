import { Buffer } from "buffer";
import { Profile } from "../types/SaveGameTypes";

import {
    readTextFile,
    readDir,
    copyFile,
    BaseDirectory,
} from "@tauri-apps/api/fs";
import { join } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/api/shell";
import { convertFileSrc } from "@tauri-apps/api/tauri";

const getProfileImage = async (path: string): Promise<string | undefined> => {
    try {
        const imgPath = await join(path, "avatar.png");
        return convertFileSrc(imgPath);
    } catch (err) {
        return undefined;
    }
};

export const arrFile = async (dir: string, fileName: string) => {
    const file = await readTextFile(dir + fileName);
    return file.split("\r\n");
};

export const descriptFiles = async (savePath: string) => {
    try {
        const gameSiiJoin = await join(savePath, "game.sii");
        await copyFile(gameSiiJoin, `${savePath}/game.sii.bak`);

        const command = Command.sidecar("bin/SII_Decrypt", `${gameSiiJoin}`);
        const res = await command.execute();

        if (res.code === null) return false;
        if (res.code === -1) return false;
        return true;
    } catch (err) {
        return false;
    }
};

export const readProfileNames = async (): Promise<Array<Profile>> => {
    try {
        const dirProfiles = await readDir("Euro Truck Simulator 2/profiles", {
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
                    saves: profilesSaves.map((save) => save.name),
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

export const findTrailerId = (arrFile: Array<string>) => {
    for (let i = 0; i < arrFile.length; i++) {
        let splitTrailerMas = arrFile[i].split(":");

        if (splitTrailerMas[0] === " my_trailer") {
            return splitTrailerMas[1];
        }
    }
    return null;
};

export const anyToDown = (arrFile: Array<string>, cargo_mass: string) => {
    let arrFileCopy = arrFile.slice();

    for (let i = 0; i < arrFileCopy.length; i++) {
        let splitCargoMas = arrFileCopy[i].split(":");

        if (splitCargoMas[0] === " cargo_mass") {
            arrFileCopy[i] = ` cargo_mass: ${cargo_mass}}`;
        }
    }
};

export const setCargoMassTrailer = (
    arrFile: Array<string>,
    id: string,
    cargo_mass: string
) => {
    let arrFileCopy = arrFile.slice();

    const indexTrailer = arrFileCopy.indexOf(`trailer :${id} {`);

    for (let i = indexTrailer; i < arrFileCopy.length; i++) {
        let splitTrailerMas = arrFileCopy[i].split(":");

        if (splitTrailerMas[0] === " cargo_mass") {
            arrFileCopy[i] = ` cargo_mass: ${cargo_mass}}`;
            return true;
        }
    }
    return false;
};

export const setChassisMassTrailer = (
    arrFile: Array<string>,
    id: string,
    chassis_mass: string,
    body_mass: string
) => {
    let arrFileCopy = arrFile.slice();

    const indexTrailer = arrFileCopy.indexOf(`trailer :${id} {`);
    let trailerDefID = "";

    for (let i = indexTrailer; i < arrFileCopy.length; i++) {
        let splitTrailerMas = arrFileCopy[i].split(":");

        if (splitTrailerMas[0] === " trailer_definition") {
            trailerDefID = splitTrailerMas[1];
            break;
        }
    }

    const indexTrailerDef = arrFileCopy.indexOf(
        `trailer_def :${trailerDefID} {`
    );
    let body_mass_redy = false;
    let chassis_mass_redy = false;
    for (let i = indexTrailerDef; i < arrFileCopy.length; i++) {
        let splitTrailerMas = arrFileCopy[i].split(":");

        if (splitTrailerMas[0] === " chassis_mass") {
            arrFileCopy[i] = ` chassis_mass: ${chassis_mass}}`;
            chassis_mass_redy = true;
        } else if (splitTrailerMas[0] === " body_mass") {
            arrFileCopy[i] = ` body_mass: ${body_mass}}`;
            body_mass_redy = true;
        }
        if (body_mass_redy && chassis_mass_redy) return true;
    }
    return false;
};
