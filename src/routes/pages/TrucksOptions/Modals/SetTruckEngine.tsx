import { useState } from "react";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import { useProfileContex } from "../../../../hooks/useProfileContex";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@nextui-org/react";
import { setTruckEngine } from "../../../../utils/fileEdit";
import { getListEngines } from "../../../../utils/fileEdit";
import AlertSave from "../../../../components/AlertSave";

// icons
import { IconPencil, IconSteeringWheel } from "@tabler/icons-react";

// types
import { EnginesTypes } from "../../../../types/SaveGameTypes";

// images
import ScaniaIcon from "../../../../static/icons/brands/scania.svg";
import VolvoIcon from "../../../../static/icons/brands/volvo.svg";

interface completedProps {
    error: boolean;
    completed: boolean;
}

interface BrandType {
    name: string;
    icon: string;
}

const SetTruckEngine = () => {
    const { selectedSave } = useProfileContex();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const BRANDS: BrandType[] = [
        { name: "Scania", icon: ScaniaIcon },
        { name: "Volvo", icon: VolvoIcon },
    ];

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [Engines, setEngines] = useState<EnginesTypes | undefined>(undefined);
    const [selectedBrand, setSelectedBrand] = useState<BrandType | undefined>(
        undefined
    );
    const [completed, setCompleted] = useState<completedProps>({
        error: false,
        completed: false,
    });

    const onClickApply = async () => {
        if (completed.completed) {
            setCompleted({ error: false, completed: false });
        }

        if (selectedSave) {
            setIsLoading(true);
            /*const res = await setTruckEngine(selectedSave.dir);
            setCompleted({
                error: !res,
                completed: true,
            });*/
        }
        setIsLoading(false);
    };

    const onOpenModal = async () => {
        onOpen();
        const res = await getListEngines();
        setEngines(res);
    };

    const onClickBrand = (branName: string) => {
        if (!branName) return;

        const brandFind = BRANDS.find((p) => p.name === branName) as BrandType;
        setSelectedBrand(brandFind);
    };

    return (
        <>
            <Button
                endContent={<IconPencil stroke={2} />}
                onPress={onOpenModal}
                isDisabled={!selectedSave}
                color="primary"
                variant="shadow"
            >
                Open
            </Button>
            <Modal
                hideCloseButton
                size="sm"
                backdrop="blur"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Change truck engine
                            </ModalHeader>
                            <ModalBody className="py-1">
                                <p>
                                    Change the engine of your truck to the one
                                    of your choice
                                </p>
                                <Select
                                    items={BRANDS}
                                    selectedKeys={
                                        selectedBrand
                                            ? [selectedBrand.name]
                                            : []
                                    }
                                    onChange={(e) =>
                                        onClickBrand(e.target.value)
                                    }
                                    label="Brands"
                                    placeholder="Select truck brand"
                                    labelPlacement="inside"
                                    variant="bordered"
                                    size="md"
                                >
                                    {(BrandObj) => (
                                        <SelectItem
                                            key={BrandObj.name}
                                            textValue={BrandObj.name}
                                        >
                                            <div className="flex gap-2 items-center">
                                                <Avatar
                                                    alt={BrandObj.icon}
                                                    src={BrandObj.icon}
                                                    size="lg"
                                                    showFallback
                                                    fallback={
                                                        <IconSteeringWheel />
                                                    }
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-small">
                                                        {BrandObj.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    )}
                                </Select>
                                <div className="flex justify-center">
                                    <AlertSave
                                        message={
                                            completed.error
                                                ? "An error occurred in the process"
                                                : "Saved successfully"
                                        }
                                        error={completed.error}
                                        show={completed.completed}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                                <Button
                                    isLoading={isLoading}
                                    color="success"
                                    onPress={onClickApply}
                                >
                                    Change
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default SetTruckEngine;
