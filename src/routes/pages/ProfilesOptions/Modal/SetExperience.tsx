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
import { setProfileExperience } from "../../../../utils/fileEdit";
import AlertSave from "../../../../components/AlertSave";

// icons
import { IconPencil, IconArrowBigUpLine } from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const SetExperience = () => {
	const { selectedSave } = useContext(ProfileContex);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [Experience, setExperience] = useState<string>("575700");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const onClickApply = async () => {
		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}

		if (!selectedSave) return;

		setIsLoading(true);

		const res = await setProfileExperience(selectedSave.dir, Experience);

		setCompleted({
			error: !res,
			completed: true,
		});
		setIsLoading(false);
	};

	const setExperienceNumbers = (value: string) => {
		const regex = /^[0-9]*$/;
		if (value === "" || regex.test(value)) {
			setExperience(value);
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
				size="sm"
				backdrop="blur"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Add experience
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>
									Enter the amount of experience you want to add to your profile
								</p>
								<Input
									className="mt-1"
									startContent={<IconArrowBigUpLine />}
									isInvalid={Experience === ""}
									label="Experience"
									placeholder="Enter the amount of experience in numbers"
									value={Experience}
									onValueChange={(value) => setExperienceNumbers(value)}
								/>
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
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button
									endContent={<IconArrowBigUpLine />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									Add
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default SetExperience;
