import { Profile, SaveGame, ProfileWithoutSaves } from "./SaveGameTypes";

export interface DarkModeTypes {
    primary: {
        main: string;
        color: string;
        border_color: string;
        text: string;
    };
    secondary: {
        main: string;
        main_contrast: string;
        color: string;
        border_color: string;
    };
}

export interface ProfileTypesContext {
    selectedProfile?: Profile;
    selectedSave?: SaveGame;
    listProfiles: Array<ProfileWithoutSaves>;
    isSavesLoading: boolean;
    setProfile: (profile: ProfileWithoutSaves) => void;
    setSave: (save: SaveGame) => void;
}

export interface DarkModeContextTypes {
    darkMode: boolean;
    themeTatailwind: DarkModeTypes;
    setDarkMode: (value: boolean) => void;
}

export interface DarkModeContextTypes {
    darkMode: boolean;
    themeTatailwind: DarkModeTypes;
    setDarkMode: (value: boolean) => void;
}
