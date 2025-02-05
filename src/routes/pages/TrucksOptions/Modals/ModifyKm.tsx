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
	Input,
} from "@heroui/react";
import { setTruckKm } from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";

// icons
import { IconPencil, IconDeviceFloppy, IconRoad } from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const ModifyKm = () => {
	const { selectedSave } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { modify_job_weight } = translations.menu_options.trailers;

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [Km, setKm] = useState("0");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const onClickApply = async () => {
		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}

		if (Km === "") return;

		if (selectedSave) {
			setIsLoading(true);
			const res = await setTruckKm(selectedSave.dir, Km);
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
			setKm(value);
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
				{modify_job_weight.modal.btn_open}
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
								Change Km driven
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>Change the mileage on your truck</p>
								<Input
									className="mt-1"
									startContent={<IconRoad />}
									isInvalid={Km === ""}
									label="Distance in Km"
									placeholder="Distance in Km"
									value={Km}
									onValueChange={setWeightOnlyNumbers}
									variant="bordered"
								/>
								<AlertSave
									message={
										completed.error
											? translations.components.alert_on_save_default.error
											: translations.components.alert_on_save_default.succes
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

export default ModifyKm;
