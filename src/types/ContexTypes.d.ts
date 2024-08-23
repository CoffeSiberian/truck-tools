import { Profile, SaveGame, ProfileWithoutSaves } from "./SaveGameTypes";
import { themeTypesSystem } from "./fileEditTypes";

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
	userTheme: themeTypesSystem;
	setUserTheme: (theme: themeTypesSystem) => void;
}
