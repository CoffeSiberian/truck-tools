import { useState, useContext } from "react";

// UI
import { useDisclosure } from "@heroui/use-disclosure";
import { Button } from "@heroui/button";
import { Slider } from "@heroui/slider";
import { Divider } from "@heroui/divider";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@heroui/modal";
import AlertSave from "@/components/AlertSave";
import Warning from "@/components/Warning";

// Hooks
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";

// Utils
import { setInfinitFuelTruck, setFuelTruck } from "@/utils/fileEdit";

// Icons
import { IconPencil, IconGasStation, IconRestore } from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const SetInfiniteFuel = () => {
	const { selectedSave } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { trucks } = translations.menu_options;

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [fuelLevel, setFuelLevel] = useState<number>(1);
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
			const res = await setInfinitFuelTruck(
				selectedSave.dir,
				fuelLevel.toFixed(1)
			);
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
				{trucks.custom_fuel.modal.btn_open}
			</Button>
			<Modal
				hideCloseButton
				size="lg"
				backdrop="blur"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				shouldBlockScroll={false}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								{trucks.custom_fuel.modal.title}
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>{trucks.custom_fuel.modal.description}</p>
								<Slider
									size="lg"
									color="success"
									label={trucks.custom_fuel.modal.fuel_level}
									minValue={0}
									maxValue={10}
									step={0.1}
									value={fuelLevel}
									onChange={(v) => setFuelLevel(Array.isArray(v) ? v[0] : v)}
									getValue={(v) => Number(v).toFixed(1)}
									className="max-w-md"
								/>
								<Warning
									text={
										<div className="flex flex-col gap-2">
											<b>{trucks.custom_fuel.modal.warning_message.title}</b>
											<p
												dangerouslySetInnerHTML={{
													__html:
														trucks.custom_fuel.modal.warning_message.message,
												}}
											/>
										</div>
									}
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
								<Button color="danger" variant="light" onPress={onClose}>
									{trucks.custom_fuel.modal.btn_close}
								</Button>
								<Button
									endContent={<IconRestore />}
									isLoading={isLoadingRestore}
									color="warning"
									variant="flat"
									onPress={onClickRestore}
								>
									{trucks.custom_fuel.modal.btn_restore_fuel}
								</Button>
								<Button
									endContent={<IconGasStation />}
									isLoading={isLoadingRefuel}
									color="success"
									onPress={onClickApply}
								>
									{trucks.custom_fuel.modal.btn_apply}
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
