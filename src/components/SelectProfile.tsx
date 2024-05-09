import { useProfileContex } from "../hooks/useProfileContex";
import ListProfiles from "./ListProfiles";
import ListSaves from "./ListSaves";
import { Card, CardBody, User } from "@nextui-org/react";

// types
import { Profile } from "../types/SaveGameTypes";

const SelectProfile = () => {
    const { selectedProfile } = useProfileContex();

    const renderProfile = (profileInfo: Profile) => {
        return (
            <div className="flex flex-col max-w-64 w-full gap-1 items-center pr-2">
                <User
                    avatarProps={{
                        src: profileInfo.avatar,
                    }}
                    name={profileInfo.name}
                    description={profileInfo.saves.length + " saves"}
                />
            </div>
        );
    };

    const renderProfileEmpty = () => {
        return (
            <div className="flex flex-col max-w-64 w-full gap-1 items-center pr-2">
                <User name="No profile selected" />
            </div>
        );
    };

    return (
        <div className="fixed w-full bottom-0 z-10 flex flex-col items-center mt-auto mb-2 transition-opacity opacity-70 hover:opacity-100">
            <Card className="flex w-full max-w-4xl">
                <CardBody className="flex flex-row items-center content-between">
                    {selectedProfile
                        ? renderProfile(selectedProfile)
                        : renderProfileEmpty()}
                    <div className="flex w-full p-1 gap-2">
                        <ListProfiles />
                        <ListSaves />
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default SelectProfile;
