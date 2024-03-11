import { createContext, useState, useContext, useEffect, useRef } from "react";

import { readProfileNames } from "../utils/fileEdit";

// types
import { ProfileTypesContext } from "../types/ContexTypes";
import { Profile } from "../types/SaveGameTypes";

const ProfileContex = createContext<ProfileTypesContext>(
    {} as ProfileTypesContext
);

export const useProfileContex = (): ProfileTypesContext => {
    return useContext(ProfileContex);
};

export const ProfileContexInfo = ({ children }: any) => {
    const loaded = useRef(false);
    const [ProfilesList, setProfilesList] = useState<Array<Profile>>([]);
    const [selectedProfile, setSelectedProfile] = useState<Profile | undefined>(
        undefined
    );
    const [selectedSave, setSelectedSave] = useState<string | undefined>(
        undefined
    );

    const loadDirectory = async () => {
        const prof = await readProfileNames();
        setProfilesList(prof);
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
                selectedProfile: selectedProfile,
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
