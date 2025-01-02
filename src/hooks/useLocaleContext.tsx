import { createContext, useState, useEffect, useRef } from "react";
import { getCurrentLocale, storeOsLocale } from "@/utils/fileEdit";

// types
import { LocaleContextTypes } from "@/types/ContexTypes";
import { ProviderProps } from "@/types/ReactTypes";

// translations types
import {
	TranslationsTypes,
	Langs as LangsTypes,
} from "@/types/TranslationsTypes";

const getLang = async (lang: LangsTypes): Promise<TranslationsTypes> => {
	const res_lags = await import(`@/translations/${lang}.json`);

	return res_lags as TranslationsTypes;
};

// eslint-disable-next-line react-refresh/only-export-components
export const LocaleContext = createContext<LocaleContextTypes>(
	{} as LocaleContextTypes
);

interface LangeState {
	lang: LangsTypes;
	translations: TranslationsTypes;
}

export const Locale = ({ children }: ProviderProps) => {
	const isLoaded = useRef(false);
	const [Lang, setLang] = useState<LangeState>({
		lang: "en-US",
		translations: {} as TranslationsTypes,
	});

	const changeLang = async (lang: LangsTypes) => {
		const translations = await getLang(lang);

		setLang({
			lang: lang,
			translations: translations,
		});

		await storeOsLocale(lang);
	};

	const changeLangWithoutSaving = async (lang: LangsTypes) => {
		const translations = await getLang(lang);

		setLang({
			lang: lang,
			translations: translations,
		});
	};

	useEffect(() => {
		if (!isLoaded.current) {
			isLoaded.current = true;
			getCurrentLocale()
				.then((res) => changeLangWithoutSaving(res))
				.catch(() => changeLangWithoutSaving("en-US"));
		}
	}, []);

	return (
		<LocaleContext.Provider
			value={{ lang: Lang.lang, translations: Lang.translations, changeLang }}
		>
			{isLoaded.current && children}
		</LocaleContext.Provider>
	);
};
