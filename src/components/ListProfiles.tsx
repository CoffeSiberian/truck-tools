import { useState, useEffect, useRef } from "react";
import { Profile } from "../types/SaveGameTypes";
import { readProfileNames } from "../utils/fileEdit";

import { Select, SelectItem, Avatar } from "@nextui-org/react";

// icons
import { IconUserCircle } from "@tabler/icons-react";

interface ListProfilesProps {
    setProfile: (profile: { profile: Profile }) => void;
}

const ListProfiles = ({ setProfile }: ListProfilesProps) => {
    const loaded = useRef(false);

    const [selectedProfile, setSelectedProfile] = useState<Profile | undefined>(
        undefined
    );
    const [selectedSave, setSelectedSave] = useState<String | null>(null);
    const [ProfilesList, setProfilesList] = useState<Array<Profile>>([]);
    const [SavesList, setSavesList] = useState<Array<String>>([]);

    const loadDirectory = async () => {
        const prof = await readProfileNames();
        setProfilesList(prof);
    };

    const onClickProfile = (profileHex: string) => {
        if (!profileHex) return;
        const profileFind = ProfilesList.find(
            (p) => p.hex === profileHex
        ) as Profile;

        setProfile({ profile: profileFind });
        setSelectedProfile(profileFind);
        setSavesList(profileFind.saves);
        setSelectedSave(profileFind.saves[0]);
    };

    useEffect(() => {
        if (!loaded.current) {
            loaded.current = true;
            loadDirectory();
            return;
        }
    }, []);

    return (
        <div className="flex flex-col w-full items-center">
            <Select
                items={ProfilesList}
                selectedKeys={
                    selectedProfile ? [selectedProfile.hex] : undefined
                }
                onChange={(e) => onClickProfile(e.target.value)}
                label="Profiles"
                placeholder="Select a profile"
                labelPlacement="inside"
                className="max-w-xs"
                variant="flat"
                size="md"
            >
                {(profile) => (
                    <SelectItem key={profile.hex} textValue={profile.name}>
                        <div className="flex gap-2 items-center">
                            <Avatar
                                alt={profile.avatar}
                                className="flex-shrink-0"
                                size="sm"
                                src={profile.avatar}
                                showFallback
                                fallback={<IconUserCircle />}
                            />
                            <div className="flex flex-col">
                                <span className="text-small">
                                    {profile.name}
                                </span>
                                <span className="text-tiny text-default-400">
                                    {profile.saves.length} saves
                                </span>
                            </div>
                        </div>
                    </SelectItem>
                )}
            </Select>
        </div>
    );
};

export default ListProfiles;
