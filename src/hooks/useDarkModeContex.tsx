import { createContext, useState, useEffect, useRef } from "react";
import {
	getSystemTheme,
	getStoredTheme,
	storeSystemTheme,
} from "../utils/fileEdit";

// types
import { ProviderProps } from "../types/ReactTypes";
import { themeTypesSystem } from "../types/fileEditTypes";
import { DarkModeContextTypes } from "../types/ContexTypes";

export const DarkModeContex = createContext<DarkModeContextTypes>(
	{} as DarkModeContextTypes
);

export const DarkMode = ({ children }: ProviderProps) => {
	const [theme, setTheme] = useState<themeTypesSystem>("system");
	const [darkMode, setDarkModeState] = useState<boolean>(true);
	const isLoaded = useRef(false);

	const getCurrentTheme = async (): Promise<themeTypesSystem> => {
		const theme = await getStoredTheme();

		if (!theme) {
			await storeSystemTheme("system");
			return "system";
		}

		return theme;
	};

	const setUserTheme = async (theme: themeTypesSystem) => {
		if (theme === "system") {
			const systemTheme = await getSystemTheme();

			setDarkModeState(systemTheme === "dark");
			setTheme("system");
			await storeSystemTheme(theme);
		} else {
			setDarkModeState(theme === "dark");
			setTheme(theme);
			await storeSystemTheme(theme);
		}
	};

	const setUserThemeWithoutSaving = async (theme: themeTypesSystem) => {
		if (theme === "system") {
			const systemTheme = await getSystemTheme();

			setDarkModeState(systemTheme === "dark");
			setTheme("system");
		} else {
			setDarkModeState(theme === "dark");
			setTheme(theme);
		}
	};

	useEffect(() => {
		if (!isLoaded.current) {
			getCurrentTheme().then((resThemeSet) => {
				setUserThemeWithoutSaving(resThemeSet);
			});

			isLoaded.current = true;
		}
	}, []);

	return (
		<DarkModeContex.Provider
			value={{ darkMode, userTheme: theme, setUserTheme }}
		>
			{children}
		</DarkModeContex.Provider>
	);
};
