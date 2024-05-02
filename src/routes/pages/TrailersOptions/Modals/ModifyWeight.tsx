import { useState } from "react";
import { useProfileContex } from "../../../../hooks/useProfileContex";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
} from "@nextui-org/react";
import { setCargoMassTrailersAndSlave } from "../../../../utils/fileEdit";

// icons
import { IconPencil } from "@tabler/icons-react";

const ModifyWeight = () => {
    const [Weight, setWeight] = useState("");
    const [isLoad, setIsLoad] = useState(false);
    const { selectedSave } = useProfileContex();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const onClickApply = async () => {
        if (selectedSave) {
            setIsLoad(true);
            await setCargoMassTrailersAndSlave(Weight, selectedSave.dir);
        }

        setIsLoad(false);
    };

    return (
        <>
            <Button
                endContent={<IconPencil stroke={2} />}
                onPress={onOpen}
                color="primary"
                variant="shadow"
            >
                Open
            </Button>
            <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Change load weight
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Weight"
                                    placeholder="Enter weight in kg"
                                    value={Weight}
                                    onValueChange={setWeight}
                                />
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
                                    isLoading={isLoad}
                                    color="success"
                                    onPress={onClickApply}
                                >
                                    Apply
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default ModifyWeight;
