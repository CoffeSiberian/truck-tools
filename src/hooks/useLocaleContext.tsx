import { createContext, useState, useEffect, useRef } from "react";

// types
import { LocaleContextTypes } from "@/types/ContexTypes";
import { Langs as LangsTypes, TranslationsObject } from "@/types/ContexTypes";
import { ProviderProps } from "@/types/ReactTypes";

// translations types
import { About } from "@/types/translations/about";
import { PlayerProfile } from "@/types/translations/player_profile";
import { Settings } from "@/types/translations/settings";
import { Trailers } from "@/types/translations/trailers";
import { Trucks } from "@/types/translations/trucks";
import { LicensePlate } from "@/types/translations/components/license_plate";
import { ProfileError } from "@/types/translations/components/profile_error";

const getLang = async (lang: LangsTypes): Promise<TranslationsObject> => {
	const splitLang = lang.split("-");

	const about: About = await import(
		`@/translations/${splitLang[0]}/${splitLang[1]}/about.json`
	);
	const player_profile: PlayerProfile = await import(
		`@/translations/${splitLang[0]}/${splitLang[1]}/player_profile.json`
	);
	const settings: Settings = await import(
		`@/translations/${splitLang[0]}/${splitLang[1]}/settings.json`
	);
	const trailers: Trailers = await import(
		`@/translations/${splitLang[0]}/${splitLang[1]}/trailers.json`
	);
	const trucks: Trucks = await import(
		`@/translations/${splitLang[0]}/${splitLang[1]}/trucks.json`
	);
	const license_plate: LicensePlate = await import(
		`@/translations/${splitLang[0]}/${splitLang[1]}/components/license_plate.json`
	);
	const profile_error: ProfileError = await import(
		`@/translations/${splitLang[0]}/${splitLang[1]}/components/profile_error.json`
	);

	return {
		about: about,
		player_profile: player_profile,
		settings: settings,
		trailers: trailers,
		trucks: trucks,
		components: {
			license_plate: license_plate,
			profile_error: profile_error,
		},
	};
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
	};

	useEffect(() => {
		if (!isLoaded.current) {
			changeLang(Lang.lang);
			isLoaded.current = true;
		}
	}, [Lang.lang]);

	return (
		<LocaleContext.Provider
			value={{ lang: Lang.lang, translations: Lang.translations, changeLang }}
		>
			{children}
		</LocaleContext.Provider>
	);
};
