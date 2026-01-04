import { createContext, useState, useEffect } from "react";
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
	loaded: boolean;
	lang: LangsTypes;
	translations: TranslationsTypes;
}

export const Locale = ({ children }: ProviderProps) => {
	const [Lang, setLang] = useState<LangeState>({
		loaded: false,
		lang: "en-US",
		translations: {} as TranslationsTypes,
	});

	const changeLang = async (lang: LangsTypes) => {
		const translations = await getLang(lang);

		setLang({
			loaded: true,
			lang: lang,
			translations: translations,
		});

		await storeOsLocale(lang);
	};

	const changeLangWithoutSaving = async (lang: LangsTypes) => {
		const translations = await getLang(lang);

		setLang({
			loaded: true,
			lang: lang,
			translations: translations,
		});
	};

	useEffect(() => {
		if (!Lang.loaded) {
			getCurrentLocale()
				.then((res) => changeLangWithoutSaving(res))
				.catch(() => changeLangWithoutSaving("en-US"));
		}
	}, [Lang.loaded]);

	return (
		<LocaleContext.Provider
			value={{ lang: Lang.lang, translations: Lang.translations, changeLang }}
		>
			{Lang.loaded && children}
		</LocaleContext.Provider>
	);
};
