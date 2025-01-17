import { useState, useContext } from "react";
import { useColor } from "react-color-palette";
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
} from "@heroui/react";
import { setLicensePlateTruck } from "@/utils/fileEdit";
import CustomLicensePlate from "@/components/CustomLicensePlate";
import AlertSave from "@/components/AlertSave";

// icons
import { IconPencil, IconDeviceFloppy } from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const EditLicensePlate = () => {
	const { selectedSave } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { trucks } = translations.menu_options;

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [bgColor, setBGColor] = useColor("#bf2222");
	const [txColor, setTxColor] = useColor("#ffffff");
	const [plateText, setPlateText] = useState<string>(" T-TOOLS");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isColorMargin, setIsColorMargin] = useState<boolean>(false);
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
			const res = await setLicensePlateTruck(
				selectedSave.dir,
				plateText,
				bgColor.hex,
				txColor.hex,
				isColorMargin
			);
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
				{trucks.license_plate.modal.btn_open}
			</Button>
			<Modal
				size="lg"
				hideCloseButton
				backdrop="blur"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								{trucks.license_plate.modal.title}
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>{trucks.license_plate.modal.description}</p>
								<div className="flex flex-col items-center gap-2">
									<CustomLicensePlate
										txColor={txColor}
										bgColor={bgColor}
										plateText={plateText}
										isColorMargin={isColorMargin}
										setColorMargin={setIsColorMargin}
										setBGColor={setBGColor}
										setTxColor={setTxColor}
										setPlateText={setPlateText}
										setIsColorMargin={setIsColorMargin}
										modalOpen={isOpen}
									/>
								</div>
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
									{trucks.license_plate.modal.btn_close}
								</Button>
								<Button
									endContent={<IconDeviceFloppy />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									{trucks.license_plate.modal.btn_apply}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default EditLicensePlate;
