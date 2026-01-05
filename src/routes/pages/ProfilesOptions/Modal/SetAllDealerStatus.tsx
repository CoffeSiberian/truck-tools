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
import AlertSave from "@/components/AlertSave";
import CustomRadio from "@/components/CustomRadio";

// Hooks
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";

// Utils
import { setProfileDealerDiscovered } from "@/utils/fileEdit";

// Icons
import { IconPencil, IconDeviceFloppy } from "@tabler/icons-react";

// Images
// ets2
import discovered from "@/static/img/ets2/dealers/discovered.webp";
import undiscovered from "@/static/img/ets2/dealers/undiscovered.webp";

// ats
import discovered_ats from "@/static/img/ats/dealers/discovered.webp";
import undiscovered_ats from "@/static/img/ats/dealers/undiscovered.webp";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const SetAllDealerStatus = () => {
	const { selectedSave, game } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { dealer_visited } = translations.menu_options.profile;

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [GarageStatus, setGarageStatus] = useState<string>("1");
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
		const res = await setProfileDealerDiscovered(
			selectedSave.dir,
			GarageStatus === "1" ? true : false
		);
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
				{dealer_visited.modal.btn_open}
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
								{dealer_visited.modal.title}
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p> {dealer_visited.modal.description}</p>
								<RadioGroup
									className="items-center"
									value={GarageStatus}
									onValueChange={(value) => setGarageStatus(value)}
									orientation="horizontal"
									label={dealer_visited.modal.input_dealer_status.label}
								>
									<CustomRadio
										selectedGarage={GarageStatus}
										image={game === "ets2" ? discovered : discovered_ats}
										text={
											dealer_visited.modal.input_dealer_status.options.visit_all
										}
										value="1"
									/>
									<CustomRadio
										selectedGarage={GarageStatus}
										image={game === "ets2" ? undiscovered : undiscovered_ats}
										text={
											dealer_visited.modal.input_dealer_status.options
												.unvisit_all
										}
										value="0"
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
									{dealer_visited.modal.btn_close}
								</Button>
								<Button
									endContent={<IconDeviceFloppy />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									{dealer_visited.modal.btn_apply}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default SetAllDealerStatus;
