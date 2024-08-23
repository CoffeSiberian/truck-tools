import { createContext, useState, useContext, useEffect, useRef } from "react";
import {
	getSystemTheme,
	getStoredTheme,
	storeSystemTheme,
} from "../utils/fileEdit";

// types
import { themeTypesSystem } from "../types/fileEditTypes";
import { DarkModeContextTypes } from "../types/ContexTypes";

const DarkModeContex = createContext<DarkModeContextTypes>(
	{} as DarkModeContextTypes
);

export const useDarkMode = (): DarkModeContextTypes => {
	return useContext(DarkModeContex);
};

export const DarkMode = ({ children }: any) => {
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

			if (systemTheme === "dark") {
				setDarkModeState(true);
			} else setDarkModeState(false);

			setTheme("system");
			await storeSystemTheme(theme);
		} else {
			if (theme === "dark") {
				setDarkModeState(true);
			} else setDarkModeState(false);

			setTheme(theme);
			await storeSystemTheme(theme);
		}
	};

	const setUserThemeWithoutSaving = async (theme: themeTypesSystem) => {
		if (theme === "system") {
			const systemTheme = await getSystemTheme();

			if (systemTheme === "dark") {
				setDarkModeState(true);
			} else setDarkModeState(false);

			setTheme("system");
		} else {
			if (theme === "dark") {
				setDarkModeState(true);
			} else setDarkModeState(false);

			setTheme(theme);
		}
	};

	useEffect(() => {
		if (!isLoaded.current) {
			getCurrentTheme().then((resThemeSet) => {
				console.log(resThemeSet);
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
