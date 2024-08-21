import { Profile, SaveGame, ProfileWithoutSaves } from "./SaveGameTypes";

export interface ProfileTypesContext {
	selectedProfile?: Profile;
	selectedSave?: SaveGame;
	listProfiles: Array<ProfileWithoutSaves>;
	isSavesLoading: boolean;
	setProfile: (profile: ProfileWithoutSaves) => void;
	reloadProfiles: () => void;
	setSave: (save: SaveGame) => void;
}

export interface DarkModeContextTypes {
	darkMode: boolean;
	setDarkMode: (value: boolean) => void;
}

export interface DarkModeContextTypes {
	darkMode: boolean;
	setDarkMode: (value: boolean) => void;
}
