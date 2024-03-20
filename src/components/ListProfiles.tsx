import { useProfileContex } from "../hooks/useProfileContex";
import { Profile } from "../types/SaveGameTypes";

import { Select, SelectItem, Avatar } from "@nextui-org/react";

// icons
import { IconUserCircle } from "@tabler/icons-react";

const ListProfiles = () => {
    const { listProfiles, selectedProfile, setProfile, setSave } =
        useProfileContex();

    const onClickProfile = (profileHex: string) => {
        if (!profileHex) return;
        if (!listProfiles) return;

        const profileFind = listProfiles.find(
            (p) => p.hex === profileHex
        ) as Profile;

        setProfile(profileFind);
        setSave(profileFind.saves[0]);
    };

    return (
        <div className="flex flex-col w-full items-center">
            <Select
                isDisabled={listProfiles ? true : false}
                errorMessage={listProfiles ? "No profiles found" : undefined}
                items={listProfiles}
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
