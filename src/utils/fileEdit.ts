// tauri
import { documentDir } from "@tauri-apps/api/path";
import { exists } from "@tauri-apps/api/fs";
import { join } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/api/shell";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { invoke } from "@tauri-apps/api/tauri";
import { Store } from "tauri-plugin-store-api";

// types
import {
	ProfileWithoutSaves,
	SaveGame,
	ProfileDir,
	ExperienceSkillsTypes,
	TruckBrands,
} from "../types/SaveGameTypes";
import {
	responseRustTypes,
	responseProfileSaves,
	responseProfileSavesCount,
	responseTrucksInfo,
	responseProfileDir,
	responseSystemTheme,
	themeTypes,
	themeTypesSystem,
} from "../types/fileEditTypes";

const STORE_FILE = ".settings.dat";

const getProfileImage = async (path: string): Promise<string | undefined> => {
	const imgPath = await join(path, "avatar.png");
	const verifyExist = await exists(imgPath);

	if (!verifyExist) return undefined;
	return convertFileSrc(imgPath);
};

const getProfileSavesCount = async (profilePath: string): Promise<number> => {
	const rustParams = {
		dirSave: profilePath,
		ignoreAutoSaves: true,
	};

	const invoceRes = (await invoke(
		"get_save_game_count",
		rustParams
	)) as responseProfileSavesCount;

	return invoceRes.saves;
};

export const descriptFiles = async (path: string): Promise<boolean> => {
	const rustParams = {
		dirSave: path,
	};

	const invoceRes = (await invoke(
		"decrypt_to_save",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const openExplorer = async (path: string) => {
	const command = new Command("explorer", path);
	await command.execute();
};

export const getListSaves = async (
	profilePath: string
): Promise<SaveGame[] | null> => {
	const rustParams = {
		dirSave: profilePath,
		ignoreAutoSaves: true,
	};

	const invoceRes = (await invoke(
		"get_save_game_name",
		rustParams
	)) as responseProfileSaves;

	if (invoceRes.save_games.length === 0) return null;
	return invoceRes.save_games;
};

export const getListDirProfiles = async (
	profilePath: string
): Promise<ProfileDir[] | null> => {
	const rustParams = {
		dirProfile: profilePath,
	};

	const invoceRes = (await invoke(
		"get_list_dir_profile",
		rustParams
	)) as responseProfileDir;

	if (invoceRes.profiles.length === 0) return null;
	return invoceRes.profiles;
};

export const readProfileNames = async (): Promise<ProfileWithoutSaves[]> => {
	const reDirProfiles = "Euro Truck Simulator 2/profiles";
	const docsDir = await documentDir();

	const dirProfiles = await getListDirProfiles(docsDir + reDirProfiles);
	if (!dirProfiles) return [];

	let profileNames: ProfileWithoutSaves[] = [];
	for (let i = 0; i < dirProfiles.length; i++) {
		const profileImg = await getProfileImage(dirProfiles[i].dir);
		const saves = await getProfileSavesCount(dirProfiles[i].dir);
		if (saves === 0) continue;

		const profileObject: ProfileWithoutSaves = {
			name: dirProfiles[i].name,
			hex: dirProfiles[i].hex,
			savesCount: saves,
			avatar: profileImg,
			dir: dirProfiles[i].dir,
		};

		profileNames.push(profileObject);
	}

	return profileNames;
};

export const setChassisMassTrailer = async (
	dirSave: string,
	chassisMass: string,
	bodyMass: string
): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
		bodyMass,
		chassisMass,
	};

	const invoceRes = (await invoke(
		"set_cargo_mass_def_trailers",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setUnlockCurrentTrailers = async (
	dirSave: string
): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
	};

	const invoceRes = (await invoke(
		"set_unlock_current_trailers",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setCargoMassTrailersAndSlave = async (
	cargoMass: string,
	dirSave: string
): Promise<boolean> => {
	const rustParams = {
		cargoMass,
		dirSave: dirSave + "/game.sii",
	};

	const invoceRes = (await invoke(
		"set_cargo_mass_trailers_and_slave",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setRepairTruck = async (dirSave: string): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
		wear: "0",
	};

	const invoceRes = (await invoke(
		"repait_truck",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setRepairAllTruck = async (dirSave: string): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
		wear: "0",
	};

	const invoceRes = (await invoke(
		"repait_all_trucks",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setFuelTruck = async (dirSave: string): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
		fuel: "1",
	};

	const invoceRes = (await invoke(
		"fill_fuel_truck",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setAllFuelTruck = async (dirSave: string): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
		fuel: "1",
	};

	const invoceRes = (await invoke(
		"fill_any_trucks_fuel",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setInfinitFuelTruck = async (
	dirSave: string
): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
	};

	const invoceRes = (await invoke(
		"set_infinite_fuel",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setLicensePlateTrailer = async (
	dirSave: string,
	licensePlate: string,
	bgPlateColor: string,
	textPlateColor: string,
	colorMargin: boolean
): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
		licensePlate: licensePlate,
		bgPlateColor: bgPlateColor,
		textPlateColor: textPlateColor,
		colorMargin,
	};

	const invoceRes = (await invoke(
		"set_license_plate_trailer",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setLicensePlateTruck = async (
	dirSave: string,
	licensePlate: string,
	bgPlateColor: string,
	textPlateColor: string,
	colorMargin: boolean
): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
		licensePlate: licensePlate,
		bgPlateColor: bgPlateColor,
		textPlateColor: textPlateColor,
		colorMargin,
	};

	const invoceRes = (await invoke(
		"set_license_plate_truck",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setTruckEngine = async (
	dirSave: string,
	engineCode: string
): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
		engineCode,
	};

	const invoceRes = (await invoke(
		"set_truck_engine_def",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setTruckTransmission = async (
	dirSave: string,
	transmissionsCode: string
): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
		transmissionsCode,
	};

	const invoceRes = (await invoke(
		"set_truck_transmissions_def",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setProfileMoney = async (
	dirSave: string,
	money: string
): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
		money,
	};

	const invoceRes = (await invoke(
		"set_profile_money",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setProfileExperience = async (
	dirSave: string,
	experience: string
): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
		experience,
	};

	const invoceRes = (await invoke(
		"set_profile_experience",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setProfileGarageStatus = async (
	dirSave: string,
	status: string
): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
		status,
	};

	const invoceRes = (await invoke(
		"set_any_garage_status",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setProfileVisitedCities = async (
	dirSave: string,
	citiesVisited: boolean
): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
		citiesVisited,
	};

	const invoceRes = (await invoke(
		"set_cities_visited",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setProfileDealerDiscovered = async (
	dirSave: string,
	discovered: boolean
): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
		discovered,
	};

	const invoceRes = (await invoke(
		"set_dealerships_discovered",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setProfileSkill = async (
	dirSave: string,
	experience: ExperienceSkillsTypes
): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
		...experience,
	};

	const invoceRes = (await invoke(
		"set_profile_experience_skills",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const backupProfile = async (
	dirProfile: string,
	destDirZip: string
): Promise<boolean> => {
	const rustParams = {
		dirProfile,
		destDirZip,
	};

	const invoceRes = (await invoke(
		"backup_profile",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const copyProfile = async (
	dirProfile: string,
	newProfileName: string
): Promise<boolean> => {
	const rustParams = {
		dirProfile,
		newProfileName,
	};

	const invoceRes = (await invoke(
		"copy_profile",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const copyProfileConfigs = async (
	dirProfile: string,
	destDirProfile: string
): Promise<boolean> => {
	const rustParams = {
		dirProfile,
		destDirProfile,
	};

	const invoceRes = (await invoke(
		"copy_controls_config",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const getTrucksInfoList = async (): Promise<TruckBrands> => {
	const invoceRes = (await invoke(
		"get_list_trucks_info"
	)) as responseTrucksInfo;

	return invoceRes.trucks;
};

export const getSystemTheme = async (): Promise<themeTypes> => {
	const invoceRes = (await invoke("get_os_theme")) as responseSystemTheme;

	return invoceRes.theme;
};

// App Variables store

export const storeSystemTheme = async (theme: themeTypesSystem) => {
	const STORE = new Store(STORE_FILE);
	await STORE.set("theme", theme);
	await STORE.save();
};

export const getStoredTheme = async (): Promise<themeTypesSystem | null> => {
	const STORE = new Store(STORE_FILE);
	const theme = await STORE.get("theme");

	if (!theme) return null;
	if (theme === "light" || theme === "dark" || theme === "system") return theme;

	return null;
};

export const storeDocumentDir = async (dir: string) => {
	const STORE = new Store(STORE_FILE);
	await STORE.set("document_dir", dir);
	await STORE.save();
};

export const getStoredDocumentDir = async (): Promise<string | null> => {
	const STORE = new Store(STORE_FILE);
	const dir = await STORE.get("document_dir");

	if (!dir) return null;
	if (typeof dir === "string") return dir;

	return null;
};
