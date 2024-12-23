import { useState, useContext } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";
import {
	Modal,
	ModalContent,
	ModalHeader,
	Divider,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Input,
} from "@nextui-org/react";
import { setCargoMassTrailersAndSlave } from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";

// icons
import { IconPencil, IconDeviceFloppy, IconWeight } from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const ModifyWeight = () => {
	const { selectedSave } = useContext(ProfileContex);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [Weight, setWeight] = useState("0");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const onClickApply = async () => {
		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}

		if (Weight === "") return;

		if (selectedSave) {
			setIsLoading(true);
			const res = await setCargoMassTrailersAndSlave(Weight, selectedSave.dir);
			setCompleted({
				error: !res,
				completed: true,
			});
		}
		setIsLoading(false);
	};

	const setWeightOnlyNumbers = (value: string) => {
		const regex = /^[0-9]*$/;
		if (value === "" || regex.test(value)) {
			setWeight(value);
		}
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
				backdrop="blur"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				shouldBlockScroll={false}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Change load weight
							</ModalHeader>
							<Divider />
							<ModalBody className="items-center py-1">
								<p>
									This will modify the weight of your current job to the one you
									define here. Remember that you will need to have an active job
									anchored to your truck
								</p>
								<Input
									className="mt-1"
									startContent={<IconWeight />}
									isInvalid={Weight === ""}
									label="Weight in kg"
									placeholder="Enter weight in kg"
									value={Weight}
									onValueChange={setWeightOnlyNumbers}
									variant="bordered"
								/>
								<AlertSave
									message={
										completed.error
											? "An error occurred in the process"
											: "Saved successfully"
									}
									error={completed.error}
									show={completed.completed}
									setShowFalse={() =>
										setCompleted({ error: completed.error, completed: false })
									}
								/>
							</ModalBody>
							<ModalFooter>
								<Button
									isDisabled={isLoading}
									color="danger"
									variant="light"
									onPress={onClose}
								>
									Close
								</Button>
								<Button
									endContent={<IconDeviceFloppy />}
									isLoading={isLoading}
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
