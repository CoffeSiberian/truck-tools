import { useProfileContex } from "../hooks/useProfileContex";
import ListProfiles from "./ListProfiles";
import ListSaves from "./ListSaves";
import { Card, CardBody, Image } from "@nextui-org/react";

// types
import { Profile } from "../types/SaveGameTypes";

// icons
import { IconUserCircle } from "@tabler/icons-react";

const SelectProfile = () => {
    const { selectedProfile } = useProfileContex();

    const renderProfile = (profileInfo: Profile) => {
        return (
            <div className="flex flex-row p-3">
                <div className="flex p-3 justify-center items-center">
                    {profileInfo.avatar ? (
                        <Image
                            className="rounded-lg w-[96px] h-[96px] overflow-hidden object-cover drop-shadow-2xl"
                            src={profileInfo.avatar}
                            alt={profileInfo.name}
                        />
                    ) : (
                        <IconUserCircle height={96} width={96} />
                    )}
                </div>
                <div className="flex p-3 items-center align-items-center">
                    {profileInfo.name ? profileInfo.name : "Not found"}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center mt-auto mb-2">
            <Card className="flex py-2 w-full max-w-4xl">
                <CardBody className="flex flex-row content-between">
                    {selectedProfile ? renderProfile(selectedProfile) : <></>}
                    <ListProfiles />
                    <ListSaves />
                </CardBody>
            </Card>
        </div>
    );
};

export default SelectProfile;
