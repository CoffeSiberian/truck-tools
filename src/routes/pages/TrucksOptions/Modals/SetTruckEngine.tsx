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
    Image,
} from "@nextui-org/react";
import { setTruckEngine, getListEngines } from "../../../../utils/fileEdit";
import AlertSave from "../../../../components/AlertSave";

// icons
import { IconPencil, IconSteeringWheel, IconEngine } from "@tabler/icons-react";

// types
import { EngineTypes } from "../../../../types/SaveGameTypes";

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

    const [Engines, setEngines] = useState<EngineTypes[] | undefined>(
        undefined
    );

    const [SelectedEngine, setSelectedEngine] = useState<
        EngineTypes | undefined
    >(undefined);

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

    const onClickBrand = async (branName: string) => {
        if (!branName) return;

        const brandFind = BRANDS.find((p) => p.name === branName) as BrandType;
        setSelectedBrand(brandFind);
        const resEngines = await getListEngines();
        console.log(resEngines);

        if (resEngines) {
            switch (brandFind.name) {
                case "Volvo":
                    setEngines(resEngines.volvo);
                    console.log(resEngines.volvo);
                    break;
                case "Scania":
                    setEngines(resEngines.scania);
                    break;
            }
        }
    };

    const onClickEngine = (engineId: string) => {
        if (!Engines) return;

        const engineFind = Engines.find((p) => p.name_id === engineId);
        setSelectedEngine(engineFind);
    };

    return (
        <>
            <Button
                endContent={<IconPencil stroke={2} />}
                onPress={onOpen}
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
                                    startContent={
                                        selectedBrand ? (
                                            <Image
                                                alt={selectedBrand.icon}
                                                src={selectedBrand.icon}
                                                width={30}
                                            />
                                        ) : (
                                            <></>
                                        )
                                    }
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
                                <Select
                                    isDisabled={!Engines}
                                    items={Engines ? Engines : []}
                                    selectedKeys={
                                        SelectedEngine
                                            ? [SelectedEngine.name_id]
                                            : []
                                    }
                                    onChange={(e) =>
                                        onClickEngine(e.target.value)
                                    }
                                    label="Engines"
                                    placeholder="Select truck engine"
                                    labelPlacement="inside"
                                    variant="bordered"
                                    startContent={<IconEngine stroke={2} />}
                                >
                                    {(engineObj) => (
                                        <SelectItem
                                            key={engineObj.name_id}
                                            textValue={engineObj.name}
                                        >
                                            <div className="flex gap-2 items-center">
                                                <div className="flex flex-col">
                                                    <span className="text-small">
                                                        {engineObj.name}
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
