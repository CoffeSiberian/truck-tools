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
} from "@nextui-org/react";
import { setInfinitFuelTruck } from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";
import Warning from "@/components/Warning";

// icons
import { IconPencil, IconGasStation } from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const SetInfiniteFuel = () => {
	const { selectedSave } = useContext(ProfileContex);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [isLoading, setIsLoading] = useState<boolean>(false);
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
			const res = await setInfinitFuelTruck(selectedSave.dir);
			setCompleted({
				error: !res,
				completed: true,
			});
		}
		setIsLoading(false);
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
								Infinite fuel on current truck
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>
									Exactly the fuel is not infinite but it is for approximately
									5.000.000 KM (depending on the truck)
								</p>
								<Warning
									text={
										<div className="flex flex-col gap-2">
											<b>Remember</b>
											<p>
												<b>Disable “Realistic fuel consumption”</b> in your
												“Gameplay” section for this function to take effect.
											</p>
										</div>
									}
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
									endContent={<IconGasStation />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									Refuel
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default SetInfiniteFuel;
