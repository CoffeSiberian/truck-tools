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
import { setInfinitFuelTruck, setFuelTruck } from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";
import Warning from "@/components/Warning";

// icons
import { IconPencil, IconGasStation, IconRestore } from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const SetInfiniteFuel = () => {
	const { selectedSave } = useContext(ProfileContex);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [isLoadingRefuel, setIsLoadingRefuel] = useState<boolean>(false);
	const [isLoadingRestore, setIsLoadingRestore] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const onClickApply = async () => {
		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}

		if (selectedSave) {
			setIsLoadingRefuel(true);
			const res = await setInfinitFuelTruck(selectedSave.dir);
			setCompleted({
				error: !res,
				completed: true,
			});
		}
		setIsLoadingRefuel(false);
	};

	const onClickRestore = async () => {
		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}

		if (selectedSave) {
			setIsLoadingRestore(true);
			const res = await setFuelTruck(selectedSave.dir, 0.5);
			setCompleted({
				error: !res,
				completed: true,
			});
		}
		setIsLoadingRestore(false);
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
				size="md"
				backdrop="blur"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				shouldBlockScroll={false}
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
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button
									endContent={<IconRestore />}
									isLoading={isLoadingRestore}
									color="warning"
									variant="flat"
									onPress={onClickRestore}
								>
									Restore fuel
								</Button>
								<Button
									endContent={<IconGasStation />}
									isLoading={isLoadingRefuel}
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
