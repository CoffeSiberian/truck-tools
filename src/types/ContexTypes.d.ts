import { Profile, SaveGame, ProfileWithoutSaves } from "@/types/SaveGameTypes";
import { themeTypesSystem } from "@/types/fileEditTypes";

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

export interface LocaleContextTypes {
	lang: Langs;
	changeLang: (lang: Langs) => void;
}
