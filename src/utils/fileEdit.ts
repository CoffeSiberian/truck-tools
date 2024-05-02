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

// workers
import findMyTrailerIdWorker from "./workers/findMyTrailerId?worker";

// types
import { findMyTrailerIdWorkerResTypes } from "../types/fileEditTypes";

const getProfileImage = async (path: string): Promise<string | undefined> => {
    const imgPath = await join(path, "avatar.png");
    const verifyExist = await exists(imgPath);

    if (!verifyExist) return undefined;
    return convertFileSrc(imgPath);
};

const arrFile = async (dir: string, fileName: string): Promise<string[]> => {
    // 1000 ms prom generate by readTextFile (tauri api)
    const file = await readTextFile(`${dir}/${fileName}`);
    const splitFile = file.split("\r\n");
    return splitFile;
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

const findMyTrailerId = async (arrFile: string[]): Promise<null | string> => {
    return new Promise((resolve) => {
        const worker = new findMyTrailerIdWorker();
        worker.postMessage(arrFile);
        worker.onmessage = (event: findMyTrailerIdWorkerResTypes) => {
            resolve(event.data);
            worker.terminate();
        };
        worker.onerror = () => {
            resolve(null);
            worker.terminate();
        };
    });
};

const findTrailerIndex = async (
    arrFile: string[],
    trailerId: string
): Promise<null | number> => {
    for (let i = 0; i < arrFile.length; i++) {
        const splitTrailerMas = arrFile[i].split(":");

        if (splitTrailerMas[1] === trailerId + " {") {
            return i;
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
            saveGameDeep[i] = " cargo_mass: " + cargoMass;
            return saveGameDeep;
        }
    }
    return null;
};

const getSlaveTrailersId = async (
    index: number,
    saveGame: string[]
): Promise<null | string> => {
    const saveGameDeep = JSON.parse(JSON.stringify(saveGame));
    let maxRound = 70;

    for (let i = index; i < saveGameDeep.length; i++) {
        if (maxRound === 0) return null;
        maxRound--;

        const split = saveGameDeep[i].split(":");
        if (split[0] === " slave_trailer") {
            if (split[1] === " null") return null;
            return split[1];
        }
    }
    return null;
};

const setAnySlaveTrailersWeight = async (
    firstSlaveId: string,
    saveGame: string[],
    cargoMass: string
): Promise<string[]> => {
    let stopWhile = false;
    let nextSlaveId = firstSlaveId;
    let nextSlaveIndex = 0;
    let cargoMassArr = JSON.parse(JSON.stringify(saveGame));

    while (!stopWhile) {
        const slaveIndex = await findTrailerIndex(saveGame, nextSlaveId);
        if (slaveIndex === null) {
            stopWhile = true;
            continue;
        }
        nextSlaveIndex = slaveIndex;

        const cargoMassCurrent = await setCargoMassTrailer(
            nextSlaveIndex,
            cargoMassArr,
            cargoMass
        );
        if (cargoMassCurrent === null) {
            stopWhile = true;
            continue;
        }
        cargoMassArr = cargoMassCurrent;

        const slaveTrailerId = await getSlaveTrailersId(
            nextSlaveIndex,
            cargoMassArr
        );
        if (slaveTrailerId === null) {
            stopWhile = true;
            continue;
        }
        nextSlaveId = slaveTrailerId;
    }
    return cargoMassArr;
};

const readSaveGame = async (
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

export const setCargoMassTrailersAndSlave = async (
    cargo_mass: string,
    dirSave: string
) => {
    const saveGame = await readSaveGame(dirSave, "game.sii");
    if (saveGame === null) return false;
    console.time("setCargoMassTrailersAndSlave Execution Time");
    const trailerId = await findMyTrailerId(saveGame);
    if (trailerId === null) return false;
    console.timeEnd("setCargoMassTrailersAndSlave Execution Time");

    const trailerIndex = await findTrailerIndex(saveGame, trailerId);
    if (trailerIndex === null) return false;

    const saveGameEdit = await setCargoMassTrailer(
        trailerIndex,
        saveGame,
        cargo_mass
    );
    if (saveGameEdit === null) return false;

    const slaveTrailerId = await getSlaveTrailersId(trailerIndex, saveGameEdit);
    if (slaveTrailerId === null) return false;

    const saveGameEditSlave = await setAnySlaveTrailersWeight(
        slaveTrailerId,
        saveGameEdit,
        cargo_mass
    );
    if (saveGameEditSlave === null) return false;
};
