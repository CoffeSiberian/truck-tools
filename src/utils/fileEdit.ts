import { Buffer } from "buffer";
import { Profile } from "../types/SaveGameTypes";

import {
    readTextFile,
    readDir,
    exists,
    copyFile,
    BaseDirectory,
} from "@tauri-apps/api/fs";
import { join } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/api/shell";
import { convertFileSrc } from "@tauri-apps/api/tauri";

const getProfileImage = async (path: string): Promise<string | undefined> => {
    const imgPath = await join(path, "avatar.png");
    const verifyExist = await exists(imgPath);

    if (!verifyExist) return undefined;
    return convertFileSrc(imgPath);
};

const arrFile = async (dir: string, fileName: string): Promise<string[]> => {
    const file = await readTextFile(`${dir}/${fileName}`);
    return file.split("\r\n");
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

const findTrailerId = (arrFile: string[]) => {
    for (let i = 0; i < arrFile.length; i++) {
        const splitTrailerMas = arrFile[i].split(":");

        if (splitTrailerMas[0] === " my_trailer") {
            return splitTrailerMas[1];
        }
    }
    return null;
};

const setCargoMassTrailer = async (
    index: number,
    saveGame: string[],
    cargoMass: string
): Promise<null | string[]> => {
    const saveGameDeep = JSON.parse(JSON.stringify(saveGame));

    for (let i = index; i < saveGameDeep.length; i++) {
        const splitCargoMas = saveGameDeep[i].split(":");

        if (splitCargoMas[0] === " cargo_mass") {
            saveGameDeep[i] = ` cargo_mass: ${cargoMass}`;
            return saveGameDeep;
        }
    }
    return null;
};

export const readSaveGame = async (
    dir: string,
    fileName: string
): Promise<string[] | null> => {
    const descriptSave = await descriptFiles(dir, fileName);
    if (!descriptSave) return null;
    const arrFileSave = await arrFile(dir, fileName);

    return arrFileSave;
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
                    saves: profilesSaves.map((save) => {
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

export const anyToDown = (arrFile: string[], cargo_mass: string) => {
    let arrFileCopy = arrFile.slice();

    for (let i = 0; i < arrFileCopy.length; i++) {
        let splitCargoMas = arrFileCopy[i].split(":");

        if (splitCargoMas[0] === " cargo_mass") {
            arrFileCopy[i] = ` cargo_mass: ${cargo_mass}}`;
        }
    }
};

export const setChassisMassTrailer = (
    arrFile: string[],
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

export const setCargoMassTrailersAndSlave = async (
    cargo_mass: string,
    dirSave: string
) => {
    const saveGame = await readSaveGame(dirSave, "game.sii");
    if (saveGame === null) return false;

    let saveGameEdit = [];
    const trailerId = findTrailerId(saveGame);
    if (trailerId === null) return false;

    for (let i = 0; i < saveGame.length; i++) {
        const splitCargoMas = saveGame[i].split(":");

        if (splitCargoMas[1] === `${trailerId} {`) {
            const cargoMassTrailer = await setCargoMassTrailer(
                i,
                saveGame,
                cargo_mass
            );

            if (cargoMassTrailer === null) return false;
            saveGameEdit = cargoMassTrailer;
        }
    }
};
