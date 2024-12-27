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
} from "@nextui-org/react";
import { setChassisMassTrailer } from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";

// icons
import { IconPencil, IconDeviceFloppy, IconWeight } from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
}

interface ModifyTrailerWeightProps {
	chassisMass: string;
	bodyMass: string;
}

const ModifyTrailerWeight = () => {
	const { selectedSave } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { modify_trailer_weight } = translations.trailers.trailers;

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [TrailerWeight, setTrailerWeight] = useState<ModifyTrailerWeightProps>({
		chassisMass: "0",
		bodyMass: "0",
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const onClickApply = async () => {
		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}

		if (TrailerWeight.chassisMass === "") return;
		if (TrailerWeight.bodyMass === "") return;

		if (selectedSave) {
			setIsLoading(true);
			const res = await setChassisMassTrailer(
				selectedSave.dir,
				TrailerWeight.chassisMass,
				TrailerWeight.bodyMass
			);
			setCompleted({
				error: !res,
				completed: true,
			});
		}

		setIsLoading(false);
	};

	const setchassisMassOnlyNumbers = (value: string) => {
		const regex = /^[0-9]*$/;
		if (value === "" || regex.test(value)) {
			setTrailerWeight({
				...TrailerWeight,
				chassisMass: value,
			});
		}
	};

	const setbodyMassOnlyNumbers = (value: string) => {
		const regex = /^[0-9]*$/;
		if (value === "" || regex.test(value)) {
			setTrailerWeight({
				...TrailerWeight,
				bodyMass: value,
			});
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
				{modify_trailer_weight.modal.btn_open}
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
								{modify_trailer_weight.modal.title}
							</ModalHeader>
							<Divider />
							<ModalBody className="items-center py-1">
								<p>{modify_trailer_weight.modal.description}</p>
								<Input
									className="mt-1"
									startContent={<IconWeight />}
									isInvalid={TrailerWeight.chassisMass === ""}
									label={modify_trailer_weight.modal.input_chassis_mass.label}
									placeholder={
										modify_trailer_weight.modal.input_chassis_mass.placeholder
									}
									value={TrailerWeight.chassisMass}
									onValueChange={(value) => setchassisMassOnlyNumbers(value)}
									variant="bordered"
								/>
								<Input
									startContent={<IconWeight />}
									isInvalid={TrailerWeight.bodyMass === ""}
									label={modify_trailer_weight.modal.input_body_mass.label}
									placeholder={
										modify_trailer_weight.modal.input_body_mass.placeholder
									}
									value={TrailerWeight.bodyMass}
									onValueChange={(value) => setbodyMassOnlyNumbers(value)}
									variant="bordered"
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
								<Button
									isDisabled={isLoading}
									color="danger"
									variant="light"
									onPress={onClose}
								>
									{modify_trailer_weight.modal.btn_close}
								</Button>
								<Button
									endContent={<IconDeviceFloppy />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									{modify_trailer_weight.modal.btn_apply}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default ModifyTrailerWeight;
