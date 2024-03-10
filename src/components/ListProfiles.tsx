import { useState, useEffect, useRef } from "react";
import defaultUser from "../static/icons/defaultUser.svg";
import { Profile } from "../types/SaveGameTypes";
import { readProfileNames } from "../utils/fileEdit";

interface ListProfilesProps {
    setProfile: (profile: { profile: Profile }) => void;
}

const ListProfiles = ({ setProfile }: ListProfilesProps) => {
    const loaded = useRef(false);

    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(
        null
    );
    const [selectedSave, setSelectedSave] = useState<String | null>(null);
    const [ProfilesList, setProfilesList] = useState<Array<Profile>>([]);
    const [SavesList, setSavesList] = useState<Array<String>>([]);

    const loadDirectory = async () => {
        const prof = await readProfileNames();
        setProfilesList(prof);
    };

    const onClickProfile = (profile: Profile) => {
        setProfile({ profile: profile });
        setSelectedProfile(profile);
        setSavesList(profile.saves);
        setSelectedSave(profile.saves[0]);
    };

    useEffect(() => {
        if (!loaded.current) {
            loaded.current = true;
            loadDirectory();
            return;
        }
    }, []);

    const selectedProfilesTemplate = (option: Profile) => {
        if (option) {
            return (
                <div className="flex items-center align-items-center mr-3">
                    <img
                        alt={option.name}
                        src={option.avatar ? `${option.avatar}` : defaultUser}
                        className={`mr-2 flag flag-${option.name.toLowerCase()}`}
                        style={{ width: "25px" }}
                    />
                    <div>{option.name}</div>
                </div>
            );
        }
    };

    const ProfilesOptionTemplate = (option: Profile) => {
        return (
            <div className="flex items-center align-items-center">
                <img
                    alt={option.name}
                    src={option.avatar}
                    className={`mr-2 flag flag-${option.name.toLowerCase()}`}
                    style={{ width: "50px" }}
                />
                <div>{option.name}</div>
            </div>
        );
    };

    const selectedSavesTemplate = (option: string) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option}</div>
                </div>
            );
        }
    };

    const SavesOptionTemplate = (option: string) => {
        return (
            <div className="flex align-items-center">
                <div>{option}</div>
            </div>
        );
    };

    return <div className="flex gap-3 justify-content-center"></div>;
};
export default ListProfiles;
