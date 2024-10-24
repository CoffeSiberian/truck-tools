import { createContext, useState, useEffect, useCallback, useRef } from "react";
import { readProfileNames, getListSaves } from "@/utils/fileEdit";

// types
import { ProviderProps } from "@/types/ReactTypes";
import { ProfileTypesContext } from "@/types/ContexTypes";
import { Profile, SaveGame, ProfileWithoutSaves } from "@/types/SaveGameTypes";

export const ProfileContex = createContext<ProfileTypesContext>(
	{} as ProfileTypesContext
);

export const ProfileContexInfo = ({ children }: ProviderProps) => {
	const loaded = useRef(false);

	const [ProfilesList, setProfilesList] = useState<Array<ProfileWithoutSaves>>(
		[]
	);

	const [selectedProfileState, setSelectedProfileState] = useState<
		Profile | undefined
	>(undefined);

	const [selectedSave, setSelectedSave] = useState<SaveGame | undefined>(
		undefined
	);

	const [isSavesLoading, setIsSavesLoading] = useState<boolean>(false);
	const [isProfilesLoading, setIsProfilesLoading] = useState<boolean>(false);
	const [profilesNotFound, setProfilesNotFound] = useState<boolean>(false);

	const loadDirectory = useCallback(async () => {
		setIsProfilesLoading(true);
		const prof = await readProfileNames();
		if (prof.length === 0) {
			setProfilesNotFound(true);
			setIsProfilesLoading(false);
			return;
		}
		if (profilesNotFound) setProfilesNotFound(false);

		setIsProfilesLoading(false);
		setProfilesList(prof);
	}, [profilesNotFound]);

	const reloadProfiles = async () => {
		setSelectedSave(undefined);
		setSelectedProfileState(undefined);
		setProfilesList([]);
		loadDirectory();
	};

	const setSelectedProfile = async (
		profile: ProfileWithoutSaves | undefined
	) => {
		if (selectedSave) setSelectedSave(undefined);
		if (!profile) {
			setSelectedProfileState(undefined);
			return;
		}

		setIsSavesLoading(true);
		const saveList = await getListSaves(profile.dir);
		setIsSavesLoading(false);

		if (!saveList) return;

		setSelectedProfileState({
			name: profile.name,
			hex: profile.hex,
			saves: saveList,
			avatar: profile.avatar,
			dir: profile.dir,
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
				selectedProfile: selectedProfileState,
				selectedSave: selectedSave,
				listProfiles: ProfilesList,
				isSavesLoading: isSavesLoading,
				isProfilesLoading: isProfilesLoading,
				profilesNotFound: profilesNotFound,
				setProfile: setSelectedProfile,
				setSave: setSelectedSave,
				reloadProfiles: reloadProfiles,
			}}
		>
			{children}
		</ProfileContex.Provider>
	);
};
