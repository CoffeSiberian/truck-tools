// tauri
import { documentDir } from "@tauri-apps/api/path";
import { exists } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/plugin-shell";
import { convertFileSrc } from "@tauri-apps/api/core";
import { invoke } from "@tauri-apps/api/core";
import { LazyStore } from "@tauri-apps/plugin-store";
import { locale } from "@tauri-apps/plugin-os";

// types
import {
	ProfileWithoutSaves,
	SaveGame,
	ProfileDir,
	ExperienceSkillsTypes,
} from "@/types/SaveGameTypes";
import {
	responseRustTypes,
	responseProfileSaves,
	responseProfileSavesCount,
	responseTrucksInfo,
	responseProfileDir,
	responseSystemTheme,
	themeTypes,
	themeTypesSystem,
	responseGetDeveloperValues,
	licensePlateSaved,
	listLicensePlateSaved,
} from "@/types/fileEditTypes";
import {
	IColorRgbToValidate,
	IColorHsvToValidate,
} from "@/types/fileEditTypes";
import { GamesNames } from "@/types/ContexTypes";
import { Langs } from "@/types/TranslationsTypes";
import { IColor } from "react-color-palette";

const STORE_FILE = ".settings.dat";
const ATS_DIR = "American Truck Simulator";
const ETS2_DIR = "Euro Truck Simulator 2";

const getProfileImage = async (path: string): Promise<string | undefined> => {
	const imgPath = await join(path, "online_avatar.png");
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
	const command = await Command.create("explorer", path);
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

export const readProfileNames = async (
	game: GamesNames
): Promise<ProfileWithoutSaves[]> => {
	const readDirProfiles = (game === "ets2" ? ETS2_DIR : ATS_DIR) + "/profiles";

	const storeDocsDir = await getStoredDocumentDir();
	const docsDirSystem = await documentDir();
	const docsDir = storeDocsDir || docsDirSystem;

	const dirProfiles = await getListDirProfiles(
		(await join(docsDir, readDirProfiles)).toString()
	);
	if (!dirProfiles) return [];

	const profileNames: ProfileWithoutSaves[] = [];
	for (let i = 0; i < dirProfiles.length; i++) {
		const profileImg = await getProfileImage(dirProfiles[i].dir);
		const saves = await getProfileSavesCount(dirProfiles[i].dir);
		if (saves === 0) continue;

		const profileObject: ProfileWithoutSaves = {
			id: dirProfiles[i].id,
			name: dirProfiles[i].name,
			game,
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

export const setFuelTruck = async (
	dirSave: string,
	fuelLevel: number
): Promise<boolean> => {
	if (fuelLevel < 0 || fuelLevel > 1) return false;

	const rustParams = {
		dirSave: dirSave + "/game.sii",
		fuel: fuelLevel.toString(),
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

export const get_brand_models_ets2 = async (
	brand: string
): Promise<responseTrucksInfo> => {
	const rustParams = {
		brand,
	};

	const invoceRes = (await invoke(
		"get_brand_models_ets2",
		rustParams
	)) as responseTrucksInfo;

	return invoceRes;
};

export const get_brand_models_ats = async (
	brand: string
): Promise<responseTrucksInfo> => {
	const rustParams = {
		brand,
	};

	const invoceRes = (await invoke(
		"get_brand_models_ats",
		rustParams
	)) as responseTrucksInfo;

	return invoceRes;
};

export const getSystemTheme = async (): Promise<themeTypes> => {
	const invoceRes = (await invoke("get_os_theme")) as responseSystemTheme;

	return invoceRes.theme;
};

export const getGameDeveloperStatus = async (
	game: GamesNames
): Promise<responseGetDeveloperValues> => {
	const storeDocsDir = await getStoredDocumentDir();
	const docsDirSystem = await documentDir();
	const docsDir = storeDocsDir || docsDirSystem;

	const rustParams = {
		dirDocsGameFolder: (
			await join(docsDir, game === "ets2" ? ETS2_DIR : ATS_DIR)
		).toString(),
	};

	const invoceRes = (await invoke(
		"get_developer_game_status",
		rustParams
	)) as responseGetDeveloperValues;

	return invoceRes;
};

export const setGameDeveloperStatus = async (
	statusDeveloper: boolean,
	game: GamesNames
): Promise<boolean> => {
	const storeDocsDir = await getStoredDocumentDir();
	const docsDirSystem = await documentDir();
	const docsDir = storeDocsDir || docsDirSystem;

	const rustParams = {
		dirDocsGameFolder: (
			await join(docsDir, game === "ets2" ? ETS2_DIR : ATS_DIR)
		).toString(),
		statusDeveloper,
	};

	const invoceRes = (await invoke(
		"set_developer_game_status",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setConvoySize = async (
	convoyStatus: boolean,
	game: GamesNames
): Promise<boolean> => {
	const storeDocsDir = await getStoredDocumentDir();
	const docsDirSystem = await documentDir();
	const docsDir = storeDocsDir || docsDirSystem;

	const rustParams = {
		dirDocsGameFolder: (
			await join(docsDir, game === "ets2" ? ETS2_DIR : ATS_DIR)
		).toString(),
		convoyStatus,
	};

	const invoceRes = (await invoke(
		"set_convoy_size",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setNewProfileName = async (
	dirProfile: string,
	newProfileName: string
): Promise<boolean> => {
	const rustParams = {
		dirProfile,
		newProfileName,
	};

	const invoceRes = (await invoke(
		"set_new_profile_name",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setRepairTrailer = async (dirSave: string): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
		wear: "0",
	};

	const invoceRes = (await invoke(
		"repair_trailer",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setRepairAllTrailer = async (
	dirSave: string
): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
		wear: "0",
	};

	const invoceRes = (await invoke(
		"repair_all_trailers",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setRemoveTruckBadge = async (
	dirSave: string
): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
	};

	const invoceRes = (await invoke(
		"set_remove_truck_badge",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

export const setTruckKm = async (
	dirSave: string,
	km: string
): Promise<boolean> => {
	const rustParams = {
		dirSave: dirSave + "/game.sii",
		km,
	};

	const invoceRes = (await invoke(
		"set_truck_km",
		rustParams
	)) as responseRustTypes;

	return invoceRes.res;
};

// App Variables store

// theme store

export const storeSystemTheme = async (theme: themeTypesSystem) => {
	const STORE = new LazyStore(STORE_FILE);
	await STORE.set("theme", theme);
	await STORE.save();
};

export const getStoredTheme = async (): Promise<themeTypesSystem | null> => {
	const STORE = new LazyStore(STORE_FILE);
	const theme = await STORE.get("theme");

	if (!theme) return null;
	if (theme === "light" || theme === "dark" || theme === "system") return theme;

	return null;
};

// document dir store

export const storeDocumentDir = async (dir: string) => {
	const STORE = new LazyStore(STORE_FILE);
	await STORE.set("document_dir", dir);
	await STORE.save();
};

export const getStoredDocumentDir = async (): Promise<string | null> => {
	const STORE = new LazyStore(STORE_FILE);
	const dir = await STORE.get("document_dir");

	if (!dir) return null;
	if (typeof dir === "string") return dir;

	return null;
};

// license plate store

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isColorRgb = (rgb: any): rgb is IColorRgbToValidate => {
	return (
		typeof rgb.r === "number" &&
		typeof rgb.g === "number" &&
		typeof rgb.b === "number" &&
		typeof rgb.a === "number"
	);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isColorHsv = (hsv: any): hsv is IColorHsvToValidate => {
	return (
		typeof hsv.h === "number" &&
		typeof hsv.s === "number" &&
		typeof hsv.v === "number" &&
		typeof hsv.a === "number"
	);
};

const isColorObject = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	color: any
): color is IColor => {
	return (
		typeof color.hex === "string" &&
		typeof color.rgb === "object" &&
		isColorRgb(color.rgb) &&
		typeof color.hsv === "object" &&
		isColorHsv(color.hsv)
	);
};

const isLicensePlateObject = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	licensePlate: any
): licensePlate is licensePlateSaved => {
	return (
		typeof licensePlate.id === "string" &&
		typeof licensePlate.text === "string" &&
		typeof licensePlate.color_margin === "boolean" &&
		typeof licensePlate.text_color === "object" &&
		typeof licensePlate.bg_color === "object" &&
		isColorObject(licensePlate.text_color)
	);
};

const isListLicensePlateObject = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	licensePlate: any
): licensePlate is listLicensePlateSaved => {
	return (
		typeof licensePlate === "object" &&
		Array.isArray(licensePlate.license_plates_ets2) &&
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		licensePlate.license_plates_ets2.every((plate: any) =>
			isLicensePlateObject(plate)
		)
	);
};

export const storeLicensePlate = async (
	licensePlate: listLicensePlateSaved
) => {
	const STORE = new LazyStore(STORE_FILE);
	await STORE.set("license_plate", licensePlate);
	await STORE.save();
};

export const getStoredLicensePlate =
	async (): Promise<listLicensePlateSaved | null> => {
		const STORE = new LazyStore(STORE_FILE);
		const licensePlate = await STORE.get("license_plate");

		if (!licensePlate) return null;
		if (isListLicensePlateObject(licensePlate)) return licensePlate;

		return null;
	};

// opasity profile status

export const storeOpasityStatus = async (status: boolean) => {
	const STORE = new LazyStore(STORE_FILE);
	await STORE.set("opasity_profile", status);
	await STORE.save();
};

export const getStoredOpasityStatus = async (): Promise<boolean> => {
	const STORE = new LazyStore(STORE_FILE);
	const status = await STORE.get("opasity_profile");

	if (typeof status === "boolean") return status;
	return true;
};

// os locale value

/**
 * ## Compliance with BCP-47 is strictly required
 * @param lang Language string `language`-`region`
 * @returns The exact language or the closest available language
 */
export const mostSimilarLang = (lang: string | null): Langs => {
	if (!lang) return "en-US";

	switch (lang) {
		case "en-US":
		case "en-CL":
		case "zh-Hans":
		case "fr-FR":
			return lang as Langs;
	}

	const splitLang = lang.split("-");
	switch (splitLang[0]) {
		case "en":
			return "en-US";
		case "es":
			return "es-CL";
		case "zh":
			return "zh-Hans";
		case "fr":
			return "fr-FR";
		default:
			return "en-US";
	}
};

export const storeOsLocale = async (lang: Langs) => {
	const STORE = new LazyStore(STORE_FILE);
	await STORE.set("lang", lang);
	await STORE.save();
};

export const getStoredOsLocale = async (): Promise<Langs | null> => {
	const STORE = new LazyStore(STORE_FILE);
	const lang = await STORE.get("lang");

	if (!lang) return null;

	if (typeof lang === "string") {
		return mostSimilarLang(lang);
	}

	return null;
};

export const getCurrentLocale = async (): Promise<Langs> => {
	const locale_store = await getStoredOsLocale();

	if (!locale_store) {
		const lang_locale = await locale();

		if (lang_locale) {
			const lang_similar = mostSimilarLang(lang_locale);
			await storeOsLocale(lang_similar);
			return lang_similar;
		}

		return "en-US";
	}

	return locale_store;
};
