import { useState } from "react";
import defaultUser from "../static/icons/defaultUser.svg";
import { useDarkMode } from "../hooks/useDarkModeContex";
import ListProfiles from "./ListProfiles";
import { Profile } from "../types/SaveGameTypes";

interface renderProfile {
    profile: Profile;
}

const SelectProfile = () => {
    const { themeTatailwind } = useDarkMode();

    const [Profile, setProfile] = useState<renderProfile | null>(null);

    const renderProfile = (userProfile: renderProfile) => {
        return (
            <div className="flex flex-row p-3">
                <div className="flex p-3 justify-center items-center">
                    <img
                        className="rounded-lg w-[96px] h-[96px] overflow-hidden object-cover drop-shadow-2xl"
                        src={
                            userProfile.profile.avatar
                                ? `${userProfile.profile.avatar}`
                                : defaultUser
                        }
                        alt={
                            userProfile.profile.name
                                ? userProfile.profile.name
                                : "Not found"
                        }
                    />
                </div>
                <div className="flex p-3 items-center align-items-center">
                    {userProfile.profile.name
                        ? userProfile.profile.name
                        : "Not found"}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col-reverse w-full items-center">
            <div
                className={`flex flex-col ${themeTatailwind.secondary.main} max-w-lg w-full items-center rounded-lg border-2 border-transparent ${themeTatailwind.primary.border_color} shadow-2xl gap-3 m-4 p-4`}
            >
                Select Profile
                {Profile ? renderProfile(Profile) : <></>}
                <ListProfiles setProfile={setProfile} />
            </div>
        </div>
    );
};

export default SelectProfile;
