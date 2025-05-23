import { createContext, useState, useEffect, useCallback, useRef } from "react";
import { join } from "@tauri-apps/api/path";
import {
	readProfileNames,
	getListSaves,
	getDocsDir,
	ATS_DIR,
	ETS2_DIR,
} from "@/utils/fileEdit";

// types
import { ProviderProps } from "@/types/ReactTypes";
import {
	ProfileTypesContext,
	ProfileObjectType,
	GamesNames,
} from "@/types/ContexTypes";
import { ProfileWithoutSaves } from "@/types/SaveGameTypes";

// eslint-disable-next-line react-refresh/only-export-components
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
			setProfile({
				game: profile.game,
				selectedProfile: undefined,
				selectedSave: undefined,
				listProfiles: [],
			});
			return;
		}
		if (profilesNotFound) setProfilesNotFound(false);

		setIsProfilesLoading(false);

		const docsDir = await getDocsDir();
		const dirDocsGame = await join(
			docsDir,
			profile.game === "ets2" ? ETS2_DIR : ATS_DIR
		);

		setProfile({
			game: profile.game,
			selectedProfile: undefined,
			selectedSave: undefined,
			listProfiles: prof,
			dirDocsGame: dirDocsGame,
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

		const docsDir = await getDocsDir();
		const dirDocsGame = await join(
			docsDir,
			game === "ets2" ? ETS2_DIR : ATS_DIR
		);

		setProfile({
			game: game,
			selectedProfile: undefined,
			selectedSave: undefined,
			listProfiles: prof,
			dirDocsGame: dirDocsGame,
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
			id: profile_info.id,
			name: profile_info.name,
			game: profile_info.game,
			hex: profile_info.hex,
			saves: saveList,
			avatar: profile_info.avatar,
			dir: profile_info.dir,
		};

		setProfile({
			...profile,
			selectedProfile: profile_to_save,
			selectedSave: undefined,
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
				dirDocsGame: profile.dirDocsGame,
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
