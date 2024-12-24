import { Profile, SaveGame, ProfileWithoutSaves } from "@/types/SaveGameTypes";
import { themeTypesSystem } from "@/types/fileEditTypes";

// translations types
import { About } from "@/types/translations/about";
import { PlayerProfile } from "@/types/translations/player_profile";
import { Trailers } from "@/types/translations/trailers";
import { Trucks } from "@/types/translations/trucks";
import { Profile as ProfileTR } from "@/types/translations/profile";
import { Settings } from "@/types/translations/settings";
import { LicensePlate } from "@/types/translations/components/license_plate";
import { ProfileError } from "@/types/translations/components/profile_error";
import { Updater } from "@/types/translations/components/updater";

export type GamesNames = "ets2" | "ats";

export type Langs = "en-US";

export interface ProfileObjectType {
	selectedProfile?: Profile;
	selectedSave?: SaveGame;
	listProfiles: Array<ProfileWithoutSaves>;
	game: GamesNames;
}

export interface ProfileTypesContext extends ProfileObjectType {
	profilesNotFound: boolean;
	isSavesLoading: boolean;
	isProfilesLoading: boolean;
	setGame: (game: GamesNames) => void;
	setProfile: (profile: ProfileWithoutSaves) => void;
	reloadProfiles: () => void;
	setSave: (save: SaveGame) => void;
}

export interface DarkModeContextTypes {
	darkMode: boolean;
	userTheme: themeTypesSystem;
	opasityStatus: boolean;
	setOpasityStatus: (status: boolean) => void;
	setUserTheme: (theme: themeTypesSystem) => void;
}

export interface TranslationsObject {
	about: About;
	player_profile: PlayerProfile;
	trailers: Trailers;
	trucks: Trucks;
	profile: ProfileTR;
	settings: Settings;
	components: {
		license_plate: LicensePlate;
		profile_error: ProfileError;
		updater: Updater;
	};
}

export interface LocaleContextTypes {
	lang: Langs;
	translations: TranslationsObject;
	changeLang: (lang: Langs) => void;
}
