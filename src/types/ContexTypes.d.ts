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
