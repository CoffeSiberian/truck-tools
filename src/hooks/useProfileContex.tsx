import { createContext, useState, useEffect, useCallback, useRef } from "react";
import { readProfileNames, getListSaves } from "@/utils/fileEdit";

// types
import { ProviderProps } from "@/types/ReactTypes";
import {
	ProfileTypesContext,
	ProfileObjectType,
	GamesNames,
} from "@/types/ContexTypes";
import { ProfileWithoutSaves } from "@/types/SaveGameTypes";

export const ProfileContex = createContext<ProfileTypesContext>(
	{} as ProfileTypesContext
);

export const ProfileContexInfo = ({ children }: ProviderProps) => {
	const loaded = useRef(false);

	const [profile, setProfile] = useState<ProfileObjectType>({
		selectedProfile: undefined,
		selectedSave: undefined,
		listProfiles: [],
		game: "ets2",
	});

	const [isSavesLoading, setIsSavesLoading] = useState<boolean>(false);
	const [isProfilesLoading, setIsProfilesLoading] = useState<boolean>(false);
	const [profilesNotFound, setProfilesNotFound] = useState<boolean>(false);

	const loadDirectory = useCallback(async () => {
		// only used on first load or complete reload
		setIsProfilesLoading(true);
		const prof = await readProfileNames(profile.game);
		if (prof.length === 0) {
			setProfilesNotFound(true);
			setIsProfilesLoading(false);
			return;
		}
		if (profilesNotFound) setProfilesNotFound(false);

		setIsProfilesLoading(false);
		setProfile({
			game: profile.game,
			selectedProfile: undefined,
			selectedSave: undefined,
			listProfiles: prof,
		});
	}, [profile, profilesNotFound]);

	const loadDirectoryGame = async (game: GamesNames) => {
		setIsProfilesLoading(true);
		const prof = await readProfileNames(game);
		if (prof.length === 0) {
			setProfilesNotFound(true);
			setIsProfilesLoading(false);
			setProfile({
				game: game,
				selectedProfile: undefined,
				selectedSave: undefined,
				listProfiles: [],
			});
			return;
		}
		if (profilesNotFound) setProfilesNotFound(false);

		setIsProfilesLoading(false);
		setProfile({
			game: game,
			selectedProfile: undefined,
			selectedSave: undefined,
			listProfiles: prof,
		});
	};

	const setSelectedProfile = async (
		profile_info: ProfileWithoutSaves | undefined
	) => {
		if (!profile_info) {
			setProfile({
				...profile,
				selectedProfile: undefined,
				selectedSave: undefined,
			});
			return;
		}

		setIsSavesLoading(true);
		const saveList = await getListSaves(profile_info.dir);
		setIsSavesLoading(false);

		if (!saveList) return;

		const profile_to_save = {
			name: profile_info.name,
			hex: profile_info.hex,
			saves: saveList,
			avatar: profile_info.avatar,
			dir: profile_info.dir,
		};

		setProfile({
			...profile,
			selectedProfile: profile_to_save,
		});
	};

	useEffect(() => {
		if (!loaded.current) {
			loaded.current = true;
			loadDirectory();
		}
	}, [loadDirectory]);

	return (
		<ProfileContex.Provider
			value={{
				selectedProfile: profile.selectedProfile,
				selectedSave: profile.selectedSave,
				listProfiles: profile.listProfiles,
				isSavesLoading: isSavesLoading,
				isProfilesLoading: isProfilesLoading,
				profilesNotFound: profilesNotFound,
				game: profile.game,
				setGame: (game) => loadDirectoryGame(game),
				setProfile: setSelectedProfile,
				setSave: (save) => setProfile({ ...profile, selectedSave: save }),
				reloadProfiles: loadDirectory,
			}}
		>
			{children}
		</ProfileContex.Provider>
	);
};
