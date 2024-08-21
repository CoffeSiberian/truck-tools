import { createContext, useState, useContext, useEffect } from "react";
import {
	getSystemTheme,
	getStoredTheme,
	storeSystemTheme,
} from "../utils/fileEdit";
import { themeTypesSystem } from "../types/fileEditTypes";
import { DarkModeContextTypes } from "../types/ContexTypes";

const DarkModeContex = createContext<DarkModeContextTypes>(
	{} as DarkModeContextTypes
);

export const useDarkMode = (): DarkModeContextTypes => {
	return useContext(DarkModeContex);
};

export const DarkMode = ({ children }: any) => {
	const [darkMode, setDarkModeState] = useState<boolean>(true);

	const setDarkMode = (darkModeBool: boolean) => {
		localStorage.setItem("darkMode", darkModeBool.toString());
		setDarkModeState(darkModeBool);
	};

	const getThemeSet = async (): Promise<themeTypesSystem> => {
		const theme = await getStoredTheme();

		if (!theme) {
			await storeSystemTheme("system");
			return "system";
		}
		return theme;
	};

	useEffect(() => {
		getThemeSet().then((resThemeSet) => {
			if (resThemeSet === "system") {
				getSystemTheme().then((resSystemTheme) => {
					if (resSystemTheme === "dark") {
						setDarkMode(true);
					} else {
						setDarkMode(false);
					}
				});
			} else {
				setDarkMode(resThemeSet === "dark");
			}
		});
	}, []);

	return (
		<DarkModeContex.Provider value={{ darkMode, setDarkMode }}>
			{children}
		</DarkModeContex.Provider>
	);
};
