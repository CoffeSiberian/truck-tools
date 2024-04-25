import { useState } from "react";
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

// icons
import { IconPencil } from "@tabler/icons-react";

const ModifyWeight = () => {
    const [Weight, setWeight] = useState("");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
                                <Button color="success" onPress={onClose}>
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
