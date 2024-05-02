import { createContext, useState, useContext, useEffect, useRef } from "react";

import { readProfileNames } from "../utils/fileEdit";

// types
import { ProfileTypesContext } from "../types/ContexTypes";
import { Profile, SaveGame } from "../types/SaveGameTypes";

const ProfileContex = createContext<ProfileTypesContext>(
    {} as ProfileTypesContext
);

export const useProfileContex = (): ProfileTypesContext => {
    return useContext(ProfileContex);
};

export const ProfileContexInfo = ({ children }: any) => {
    const loaded = useRef(false);
    const [ProfilesList, setProfilesList] = useState<Array<Profile>>([]);
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

    const setSelectedProfile = (profile: Profile | undefined) => {
        setSelectedSave(undefined);
        setSelectedProfileState(profile);
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
