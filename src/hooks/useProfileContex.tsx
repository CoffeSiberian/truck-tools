import { createContext, useState, useEffect, useRef } from "react";
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

	const loadDirectory = async () => {
		const prof = await readProfileNames();
		setProfilesList(prof);
	};

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
	}, []);

	return (
		<ProfileContex.Provider
			value={{
				selectedProfile: selectedProfileState,
				selectedSave: selectedSave,
				listProfiles: ProfilesList,
				isSavesLoading: isSavesLoading,
				setProfile: setSelectedProfile,
				setSave: setSelectedSave,
				reloadProfiles: reloadProfiles,
			}}
		>
			{children}
		</ProfileContex.Provider>
	);
};
