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
import { setProfileExperience } from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";

// icons
import { IconPencil, IconArrowBigUpLine } from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const SetExperience = () => {
	const { selectedSave } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { add_experience } = translations.menu_options.profile;

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [Experience, setExperience] = useState<string>("575700");
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

		const res = await setProfileExperience(selectedSave.dir, Experience);

		setCompleted({
			error: !res,
			completed: true,
		});
		setIsLoading(false);
	};

	const setExperienceNumbers = (value: string) => {
		const regex = /^[0-9]*$/;
		if (value === "" || regex.test(value)) {
			setExperience(value);
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
				{add_experience.modal.btn_open}
			</Button>
			<Modal
				hideCloseButton
				size="sm"
				backdrop="blur"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				shouldBlockScroll={false}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								{add_experience.modal.title}
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>{add_experience.modal.description}</p>
								<Input
									className="mt-1"
									startContent={<IconArrowBigUpLine />}
									isInvalid={Experience === ""}
									label={add_experience.modal.input_experience.label}
									placeholder={
										add_experience.modal.input_experience.placeholder
									}
									value={Experience}
									onValueChange={(value) => setExperienceNumbers(value)}
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
								<Button color="danger" variant="light" onPress={onClose}>
									{add_experience.modal.btn_close}
								</Button>
								<Button
									endContent={<IconArrowBigUpLine />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									{add_experience.modal.btn_apply}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default SetExperience;
