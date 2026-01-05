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
import { setProfileVisitedCities } from "@/utils/fileEdit";

// Icons
import { IconPencil, IconDeviceFloppy } from "@tabler/icons-react";

// Images
// ets2
import unvisited from "@/static/img/ets2/cities/unvisited.webp";
import visited from "@/static/img/ets2/cities/visited.webp";

// ats
import unvisited_ats from "@/static/img/ats/cities/unvisited.webp";
import visited_ats from "@/static/img/ats/cities/visited.webp";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const SetAllCitiesStatus = () => {
	const { selectedSave, game } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { visited_cities } = translations.menu_options.profile;

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
		const res = await setProfileVisitedCities(
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
				{visited_cities.modal.btn_open}
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
								{visited_cities.modal.title}
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p> {visited_cities.modal.description}</p>
								<RadioGroup
									className="items-center"
									value={GarageStatus}
									onValueChange={(value) => setGarageStatus(value)}
									orientation="horizontal"
									label={visited_cities.modal.input_city_status.label}
								>
									<CustomRadio
										selectedGarage={GarageStatus}
										image={game === "ets2" ? visited : visited_ats}
										text={
											visited_cities.modal.input_city_status.options.visit_all
										}
										value="1"
									/>
									<CustomRadio
										selectedGarage={GarageStatus}
										image={game === "ets2" ? unvisited : unvisited_ats}
										text={
											visited_cities.modal.input_city_status.options.unvisit_all
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
									{visited_cities.modal.btn_close}
								</Button>
								<Button
									endContent={<IconDeviceFloppy />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									{visited_cities.modal.btn_apply}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default SetAllCitiesStatus;
