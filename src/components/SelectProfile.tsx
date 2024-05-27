import { useProfileContex } from "../hooks/useProfileContex";
import {
    Avatar,
    Card,
    CardBody,
    Chip,
    Skeleton,
    Button,
} from "@nextui-org/react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { descriptFiles, openExplorer } from "../utils/fileEdit";
import ListProfiles from "./ListProfiles";
import ListSaves from "./ListSaves";

// icons
import { IconFolderShare, IconBinary, IconReload } from "@tabler/icons-react";

// types
import { Profile } from "../types/SaveGameTypes";

const SelectProfile = () => {
    const { selectedProfile, isSavesLoading, selectedSave, reloadProfiles } =
        useProfileContex();

    const renderProfile = (profileInfo: Profile | undefined) => {
        return (
            <div className="flex flex-col max-w-72 w-full gap-1 items-center pr-2">
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
                                <div>
                                    <Avatar
                                        src={profileInfo.avatar}
                                        size="lg"
                                        name={profileInfo.name}
                                        alt="profile avatar"
                                    />
                                </div>
                                <div className="flex flex-col w-full gap-0">
                                    <p className="text-pretty">
                                        {profileInfo.name}
                                    </p>
                                    <small className="text-default-500">
                                        {profileInfo.saves.length} saves
                                    </small>
                                    <div className="flex flex-row mt-1 gap-1">
                                        <Button
                                            size="sm"
                                            variant="bordered"
                                            disabled={!selectedSave}
                                            onPress={
                                                selectedSave
                                                    ? () =>
                                                          openExplorer(
                                                              selectedSave.dir
                                                                  .replace(
                                                                      "/",
                                                                      "\\"
                                                                  )
                                                                  .replace(
                                                                      "/",
                                                                      "\\"
                                                                  )
                                                          )
                                                    : undefined
                                            }
                                            endContent={
                                                <IconFolderShare stroke={2} />
                                            }
                                            color={
                                                selectedSave
                                                    ? "warning"
                                                    : "default"
                                            }
                                        >
                                            Open
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="bordered"
                                            disabled={!selectedSave}
                                            onPress={
                                                selectedSave
                                                    ? () =>
                                                          descriptFiles(
                                                              selectedSave.dir,
                                                              "game.sii"
                                                          )
                                                    : undefined
                                            }
                                            endContent={
                                                <IconBinary stroke={2} />
                                            }
                                            color={
                                                selectedSave
                                                    ? "warning"
                                                    : "default"
                                            }
                                        >
                                            Decrypt
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <Avatar
                                        size="lg"
                                        name="No profile selected"
                                        alt="profile avatar"
                                    />
                                </div>
                                <div className="flex flex-col gap-0">
                                    <p className="text-pretty">
                                        No profile selected
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            className={`fixed w-full bottom-0 z-10 flex flex-col items-center mt-auto mb-2 transition-opacity ${
                selectedSave ? "opacity-70" : "opacity-100"
            } hover:opacity-100 gap-1`}
        >
            {!selectedSave && (
                <Chip
                    className="opacity-100"
                    startContent={<IconAlertTriangle stroke={1.5} />}
                    color="warning"
                >
                    <b>First select your profile and save</b>
                </Chip>
            )}
            <Card className="flex w-full max-w-4xl">
                <CardBody className="flex flex-row items-center p-1 content-between">
                    {renderProfile(selectedProfile)}
                    <div className="flex w-full items-center p-1 gap-2">
                        <ListProfiles />
                        <ListSaves />
                        <Button onPress={() => reloadProfiles()} isIconOnly>
                            <IconReload stroke={2} />
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default SelectProfile;
