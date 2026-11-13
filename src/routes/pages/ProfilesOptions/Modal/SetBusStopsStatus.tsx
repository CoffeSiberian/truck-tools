import { useState, useContext } from "react";

// UI
import { useDisclosure } from "@heroui/use-disclosure";
import { RadioGroup } from "@heroui/radio";
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
import { setBusStopsStatus } from "@/utils/fileEdit";

// Icons
import { IconPencil, IconDeviceFloppy } from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const SetBusStopsStatus = () => {
	const { selectedSave } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { bus_stops } = translations.menu_options.profile;

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [StopStatus, setStopStatus] = useState<string>("1");
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
		const res = await setBusStopsStatus(
			selectedSave.dir,
			StopStatus === "1" ? true : false
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
				{bus_stops.modal.btn_open}
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
								{bus_stops.modal.title}
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p> {bus_stops.modal.description}</p>
								<RadioGroup
									className="items-center"
									value={StopStatus}
									onValueChange={(value) => setStopStatus(value)}
									orientation="horizontal"
									label={bus_stops.modal.input_city_status.label}
								>
									<CustomRadio
										selectedGarage={StopStatus}
										text={bus_stops.modal.input_city_status.options.visit_all}
										value="1"
									/>
									<CustomRadio
										selectedGarage={StopStatus}
										text={bus_stops.modal.input_city_status.options.unvisit_all}
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
									{bus_stops.modal.btn_close}
								</Button>
								<Button
									endContent={<IconDeviceFloppy />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									{bus_stops.modal.btn_apply}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default SetBusStopsStatus;
