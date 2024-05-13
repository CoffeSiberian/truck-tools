import { createContext, useState, useContext, useEffect, useRef } from "react";

import { readProfileNames, getListSaves } from "../utils/fileEdit";

// types
import { ProfileTypesContext } from "../types/ContexTypes";
import { Profile, SaveGame, ProfileWithoutSaves } from "../types/SaveGameTypes";

const ProfileContex = createContext<ProfileTypesContext>(
    {} as ProfileTypesContext
);

export const useProfileContex = (): ProfileTypesContext => {
    return useContext(ProfileContex);
};

export const ProfileContexInfo = ({ children }: any) => {
    const loaded = useRef(false);
    const [ProfilesList, setProfilesList] = useState<
        Array<ProfileWithoutSaves>
    >([]);
    const [selectedProfileState, setSelectedProfileState] = useState<
        Profile | undefined
    >(undefined);
    const [selectedSave, setSelectedSave] = useState<SaveGame | undefined>(
        undefined
    );

    const loadDirectory = async () => {
        const prof = await readProfileNames();
        setProfilesList(prof);
    };

    const setSelectedProfile = async (
        profile: ProfileWithoutSaves | undefined
    ) => {
        if (selectedSave) setSelectedSave(undefined);
        if (!profile) {
            setSelectedProfileState(undefined);
            return;
        }

        const saveList = await getListSaves(profile.dir);
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
                setProfile: setSelectedProfile,
                setSave: setSelectedSave,
            }}
        >
            {children}
        </ProfileContex.Provider>
    );
};
