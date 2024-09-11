import { useState, useContext } from "react";
import { ProfileContex } from "../../../../hooks/useProfileContex";
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
import { setChassisMassTrailer } from "../../../../utils/fileEdit";
import AlertSave from "../../../../components/AlertSave";

// icons
import { IconPencil, IconDeviceFloppy, IconWeight } from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
}

interface ModifyTrailerWeightProps {
	chassisMass: string;
	bodyMass: string;
}

const ModifyTrailerWeight = () => {
	const { selectedSave } = useContext(ProfileContex);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [TrailerWeight, setTrailerWeight] = useState<ModifyTrailerWeightProps>({
		chassisMass: "0",
		bodyMass: "0",
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const onClickApply = async () => {
		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}

		if (TrailerWeight.chassisMass === "") return;
		if (TrailerWeight.bodyMass === "") return;

		if (selectedSave) {
			setIsLoading(true);
			const res = await setChassisMassTrailer(
				selectedSave.dir,
				TrailerWeight.chassisMass,
				TrailerWeight.bodyMass
			);
			setCompleted({
				error: !res,
				completed: true,
			});
		}

		setIsLoading(false);
	};

	const setchassisMassOnlyNumbers = (value: string) => {
		const regex = /^[0-9]*$/;
		if (value === "" || regex.test(value)) {
			setTrailerWeight({
				...TrailerWeight,
				chassisMass: value,
			});
		}
	};

	const setbodyMassOnlyNumbers = (value: string) => {
		const regex = /^[0-9]*$/;
		if (value === "" || regex.test(value)) {
			setTrailerWeight({
				...TrailerWeight,
				bodyMass: value,
			});
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
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Change trailer weight
							</ModalHeader>
							<Divider />
							<ModalBody className="items-center py-1">
								<p>
									This modifies the weight of your trailer in 2 parameters.
									Usually the chassis_mass is used but you can also edit the
									body_mass (default body_mass is 0)
								</p>
								<Input
									className="mt-1"
									startContent={<IconWeight />}
									isInvalid={TrailerWeight.chassisMass === ""}
									label="Chassis Mass"
									placeholder="Enter weight in kg"
									value={TrailerWeight.chassisMass}
									onValueChange={(value) => setchassisMassOnlyNumbers(value)}
								/>
								<Input
									startContent={<IconWeight />}
									label="Body Mass"
									isInvalid={TrailerWeight.bodyMass === ""}
									placeholder="Enter weight in kg"
									value={TrailerWeight.bodyMass}
									onValueChange={(value) => setbodyMassOnlyNumbers(value)}
								/>
								<AlertSave
									message={
										completed.error
											? "An error occurred in the process"
											: "Saved successfully"
									}
									error={completed.error}
									show={completed.completed}
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

export default ModifyTrailerWeight;
