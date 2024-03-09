import { useState, useEffect, useRef } from "react";
import defaultUser from "../static/img/defaultUser.svg";
import {
    Dropdown,
    DropdownChangeEvent,
    DropdownProps,
} from "primereact/dropdown";
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
        const prof = await readProfileNames("readProfileNames");
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

    const selectedProfilesTemplate = (
        option: Profile,
        props: DropdownProps
    ) => {
        if (option) {
            return (
                <div className="flex items-center align-items-center mr-3">
                    <img
                        alt={option.name}
                        src={
                            option.avatar
                                ? `data:image/png;base64, ${option.avatar}`
                                : defaultUser
                        }
                        className={`mr-2 flag flag-${option.name.toLowerCase()}`}
                        style={{ width: "25px" }}
                    />
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const ProfilesOptionTemplate = (option: Profile) => {
        return (
            <div className="flex items-center align-items-center">
                <img
                    alt={option.name}
                    src={
                        option.avatar
                            ? `data:image/png;base64, ${option.avatar}`
                            : defaultUser
                    }
                    className={`mr-2 flag flag-${option.name.toLowerCase()}`}
                    style={{ width: "50px" }}
                />
                <div>{option.name}</div>
            </div>
        );
    };

    const selectedSavesTemplate = (option: string, props: DropdownProps) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const SavesOptionTemplate = (option: string) => {
        return (
            <div className="flex align-items-center">
                <div>{option}</div>
            </div>
        );
    };

    return (
        <div className="flex gap-3 justify-content-center">
            <Dropdown
                value={selectedProfile}
                onChange={(e: DropdownChangeEvent) => onClickProfile(e.value)}
                options={ProfilesList}
                optionLabel="name"
                placeholder="Select Profile"
                filter
                valueTemplate={selectedProfilesTemplate}
                itemTemplate={ProfilesOptionTemplate}
                className="max-w-xs w-full"
            />
            {selectedProfile ? (
                <Dropdown
                    value={selectedSave}
                    onChange={(e: DropdownChangeEvent) =>
                        setSelectedSave(e.value)
                    }
                    options={SavesList}
                    optionLabel="name"
                    placeholder="Select Save"
                    filter
                    valueTemplate={selectedSavesTemplate}
                    itemTemplate={SavesOptionTemplate}
                    className="max-w-xs w-full"
                />
            ) : (
                <></>
            )}
        </div>
    );
};
export default ListProfiles;
