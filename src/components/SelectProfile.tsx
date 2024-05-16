import { useProfileContex } from "../hooks/useProfileContex";
import { Avatar, Card, CardBody, Skeleton } from "@nextui-org/react";
import ListProfiles from "./ListProfiles";
import ListSaves from "./ListSaves";

// types
import { Profile } from "../types/SaveGameTypes";

const SelectProfile = () => {
    const { selectedProfile, isSavesLoading } = useProfileContex();

    const renderProfile = (profileInfo: Profile | undefined) => {
        return (
            <div className="flex flex-col max-w-64 w-full gap-1 items-center pr-2">
                {isSavesLoading ? (
                    <div className="flex w-full items-center gap-3">
                        <div>
                            <Skeleton className="flex rounded-full w-14 h-14" />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <Skeleton className="h-3 w-3/5 rounded-lg" />
                            <Skeleton className="h-3 w-4/5 rounded-lg" />
                        </div>
                    </div>
                ) : (
                    <div className="flex w-full items-center gap-2">
                        {profileInfo ? (
                            <>
                                <Avatar
                                    src={profileInfo.avatar}
                                    size="lg"
                                    name={profileInfo.name}
                                    alt="profile avatar"
                                />
                                <div className="flex flex-col gap-0">
                                    <h5 className="text-large">
                                        {profileInfo.name}
                                    </h5>
                                    <small className="text-default-500">
                                        {profileInfo.saves.length} saves
                                    </small>
                                </div>
                            </>
                        ) : (
                            <>
                                <Avatar
                                    size="lg"
                                    name="No profile selected"
                                    alt="profile avatar"
                                />
                                <h5 className="text-large">
                                    No profile selected
                                </h5>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed w-full bottom-0 z-10 flex flex-col items-center mt-auto mb-2 transition-opacity opacity-70 hover:opacity-100">
            <Card className="flex w-full max-w-4xl">
                <CardBody className="flex flex-row items-center content-between">
                    {renderProfile(selectedProfile)}
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
