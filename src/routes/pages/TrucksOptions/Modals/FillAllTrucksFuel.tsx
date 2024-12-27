import { useState, useContext } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";
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
import { setAllFuelTruck } from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";

// icons
import { IconPencil, IconGasStation } from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const FillAllTrucksFuel = () => {
	const { selectedSave } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { trucks } = translations.trucks;

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
			const res = await setAllFuelTruck(selectedSave.dir);
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
				{trucks.fill_all_trucks_fuel.modal.btn_open}
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
								{trucks.fill_all_trucks_fuel.modal.title}
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>{trucks.fill_all_trucks_fuel.modal.description}</p>
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
									{trucks.fill_all_trucks_fuel.modal.btn_close}
								</Button>
								<Button
									endContent={<IconGasStation />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									{trucks.fill_all_trucks_fuel.modal.btn_apply}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default FillAllTrucksFuel;
