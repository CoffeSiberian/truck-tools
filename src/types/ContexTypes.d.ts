import { Profile, SaveGame, ProfileWithoutSaves } from "@/types/SaveGameTypes";
import { themeTypesSystem } from "@/types/fileEditTypes";

export type GamesNames = "ets2" | "ats";

export interface ProfileTypesContext {
	selectedProfile?: Profile;
	selectedSave?: SaveGame;
	listProfiles: Array<ProfileWithoutSaves>;
	isSavesLoading: boolean;
	isProfilesLoading: boolean;
	profilesNotFound: boolean;
	game: GamesNames;
	setGame: (game: GamesNames) => void;
	setProfile: (profile: ProfileWithoutSaves) => void;
	reloadProfiles: () => void;
	setSave: (save: SaveGame) => void;
}

export interface DarkModeContextTypes {
	darkMode: boolean;
	userTheme: themeTypesSystem;
	setUserTheme: (theme: themeTypesSystem) => void;
}
