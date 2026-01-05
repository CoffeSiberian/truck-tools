import { useState, useContext } from "react";

// UI
import { RadioGroup } from "@heroui/radio";
import { useDisclosure } from "@heroui/use-disclosure";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@heroui/modal";
import CustomRadio from "@/components/CustomRadio";
import AlertSave from "@/components/AlertSave";

// Hooks
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";

// Utils
import { setProfileGarageStatus } from "@/utils/fileEdit";

// Icons
import { IconPencil, IconDeviceFloppy } from "@tabler/icons-react";

// Images
// ets2
import smallGarage from "@/static/img/ets2/garages/small.webp";
import mediumGarage from "@/static/img/ets2/garages/medium.webp";
import largeGarage from "@/static/img/ets2/garages/large.webp";

// ats
import smallGarage_ats from "@/static/img/ats/garages/small.webp";
import mediumGarage_ats from "@/static/img/ats/garages/medium.webp";
import largeGarage_ats from "@/static/img/ats/garages/large.webp";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const SetGarageStatus = () => {
	const { selectedSave, game } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { garage_status } = translations.menu_options.profile;

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [GarageStatus, setGarageStatus] = useState<string>("3");
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

		const res = await setProfileGarageStatus(selectedSave.dir, GarageStatus);

		setCompleted({
			error: !res,
			completed: true,
		});
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
				{garage_status.modal.btn_open}
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
								{garage_status.modal.title}
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>{garage_status.modal.description}</p>
								<RadioGroup
									className="items-center"
									value={GarageStatus}
									onValueChange={(value) => setGarageStatus(value)}
									orientation="horizontal"
									label={garage_status.modal.input_garage_status.label}
								>
									<CustomRadio
										selectedGarage={GarageStatus}
										text={
											garage_status.modal.input_garage_status.options
												.sell_garage
										}
										value="1"
									/>
									<CustomRadio
										selectedGarage={GarageStatus}
										image={game === "ets2" ? smallGarage : smallGarage_ats}
										text={
											garage_status.modal.input_garage_status.options
												.small_garage
										}
										value="6"
									/>
									<CustomRadio
										selectedGarage={GarageStatus}
										image={game === "ets2" ? mediumGarage : mediumGarage_ats}
										text={
											garage_status.modal.input_garage_status.options
												.medium_garage
										}
										value="2"
									/>
									<CustomRadio
										selectedGarage={GarageStatus}
										image={game === "ets2" ? largeGarage : largeGarage_ats}
										text={
											garage_status.modal.input_garage_status.options
												.large_garage
										}
										value="3"
									/>
								</RadioGroup>
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
								<Button color="danger" variant="light" onPress={onClose}>
									{garage_status.modal.btn_close}
								</Button>
								<Button
									endContent={<IconDeviceFloppy />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									{garage_status.modal.btn_apply}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default SetGarageStatus;
