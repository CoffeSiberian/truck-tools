import { createContext, useState, useEffect, useRef } from "react";
import { locale } from "@tauri-apps/plugin-os";
import {
	getStoredOsLocale,
	mostSimilarLang,
	storeOsLocale,
} from "@/utils/fileEdit";

// types
import { LocaleContextTypes } from "@/types/ContexTypes";
import { Langs as LangsTypes, TranslationsObject } from "@/types/ContexTypes";
import { ProviderProps } from "@/types/ReactTypes";

// translations types
import { About } from "@/types/translations/about";
import { PlayerProfile } from "@/types/translations/player_profile";
import { Trailers } from "@/types/translations/trailers";
import { Trucks } from "@/types/translations/trucks";
import { Profile } from "@/types/translations/profile";
import { Settings } from "@/types/translations/settings";
import { LicensePlate } from "@/types/translations/components/license_plate";
import { ProfileError } from "@/types/translations/components/profile_error";
import { Updater } from "@/types/translations/components/updater";

const getLang = async (lang: LangsTypes): Promise<TranslationsObject> => {
	const splitLang = lang.split("-");

	const about: About = await import(
		`@/translations/${splitLang[0]}/${splitLang[1]}/about.json`
	);
	const player_profile: PlayerProfile = await import(
		`@/translations/${splitLang[0]}/${splitLang[1]}/player_profile.json`
	);
	const trailers: Trailers = await import(
		`@/translations/${splitLang[0]}/${splitLang[1]}/trailers.json`
	);
	const trucks: Trucks = await import(
		`@/translations/${splitLang[0]}/${splitLang[1]}/trucks.json`
	);
	const profile: Profile = await import(
		`@/translations/${splitLang[0]}/${splitLang[1]}/profile.json`
	);
	const settings: Settings = await import(
		`@/translations/${splitLang[0]}/${splitLang[1]}/settings.json`
	);
	const license_plate: LicensePlate = await import(
		`@/translations/${splitLang[0]}/${splitLang[1]}/components/license_plate.json`
	);
	const profile_error: ProfileError = await import(
		`@/translations/${splitLang[0]}/${splitLang[1]}/components/profile_error.json`
	);
	const updater: Updater = await import(
		`@/translations/${splitLang[0]}/${splitLang[1]}/components/updater.json`
	);

	return {
		about: about,
		player_profile: player_profile,
		trailers: trailers,
		trucks: trucks,
		profile: profile,
		settings: settings,
		components: {
			license_plate: license_plate,
			profile_error: profile_error,
			updater: updater,
		},
	};
};

const getCurrentLocale = async (): Promise<LangsTypes> => {
	const locale_store = await getStoredOsLocale();

	if (!locale_store) {
		const lang_locale = await locale();

		if (lang_locale) {
			const lang_similar = mostSimilarLang(lang_locale);
			await storeOsLocale(lang_similar);
			return lang_similar;
		}

		return "en-US";
	}

	return locale_store;
};

// eslint-disable-next-line react-refresh/only-export-components
export const LocaleContext = createContext<LocaleContextTypes>(
	{} as LocaleContextTypes
);

interface LangeState {
	lang: LangsTypes;
	translations: TranslationsObject;
}

export const Locale = ({ children }: ProviderProps) => {
	const isLoaded = useRef(false);
	const [Lang, setLang] = useState<LangeState>({
		lang: "en-US",
		translations: {} as TranslationsObject,
	});

	const changeLang = async (lang: LangsTypes) => {
		const translations = await getLang(lang);

		setLang({
			lang: lang,
			translations: translations,
		});

		await storeOsLocale(lang);
	};

	useEffect(() => {
		if (!isLoaded.current) {
			isLoaded.current = true;
			getCurrentLocale()
				.then((res) => changeLang(res))
				.catch(() => changeLang("en-US"));
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
