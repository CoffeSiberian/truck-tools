import { createContext, useState, useContext, useEffect } from "react";
import { getSystemTheme } from "../utils/fileEdit";
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

	useEffect(() => {
		getSystemTheme().then((res) => {
			if (res === "dark") {
				import("primereact/resources/themes/md-dark-indigo/theme.css");
				setDarkModeState(true);
			} else {
				import("primereact/resources/themes/md-light-indigo/theme.css");
				setDarkModeState(false);
			}
		});
	}, []);

	return (
		<DarkModeContex.Provider value={{ darkMode, setDarkMode }}>
			{children}
		</DarkModeContex.Provider>
	);
};
