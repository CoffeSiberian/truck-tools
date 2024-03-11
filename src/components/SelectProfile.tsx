import { useState } from "react";
import ListProfiles from "./ListProfiles";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";

// types
import { Profile } from "../types/SaveGameTypes";

// icons
import { IconUserCircle } from "@tabler/icons-react";

interface renderProfile {
    profile: Profile;
}

const SelectProfile = () => {
    const [Profile, setProfile] = useState<renderProfile | null>(null);

    const renderProfile = (userProfile: renderProfile) => {
        return (
            <div className="flex flex-row p-3">
                <div className="flex p-3 justify-center items-center">
                    {userProfile.profile.avatar ? (
                        <Image
                            className="rounded-lg w-[96px] h-[96px] overflow-hidden object-cover drop-shadow-2xl"
                            src={userProfile.profile.avatar}
                            alt={userProfile.profile.name}
                        />
                    ) : (
                        <IconUserCircle height={96} width={96} />
                    )}
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
        <div className="flex flex-col items-center">
            <Card className="flex py-4 w-full max-w-md">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                    <h1>Select Profile</h1>
                </CardHeader>
                <CardBody className="flex flex-col items-center">
                    {Profile ? renderProfile(Profile) : <></>}
                    <ListProfiles setProfile={setProfile} />
                </CardBody>
            </Card>
        </div>
    );
};

export default SelectProfile;
