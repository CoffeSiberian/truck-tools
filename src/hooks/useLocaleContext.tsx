import { createContext, useState } from "react";

// types
import { LocaleContextTypes } from "@/types/ContexTypes";
import { Langs as LangsTypes } from "@/types/ContexTypes";
import { ProviderProps } from "@/types/ReactTypes";

// eslint-disable-next-line react-refresh/only-export-components
export const LocaleContext = createContext<LocaleContextTypes>(
	{} as LocaleContextTypes
);

export const Locale = ({ children }: ProviderProps) => {
	const [Lang, setLang] = useState<LangsTypes>("en");

	const changeLang = (lang: LangsTypes) => {
		setLang(lang);
	};

	return (
		<LocaleContext.Provider value={{ lang: Lang, changeLang }}>
			{children}
		</LocaleContext.Provider>
	);
};
