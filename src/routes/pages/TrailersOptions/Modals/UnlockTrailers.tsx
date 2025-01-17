import { useState, useContext } from "react";
import { open } from "@tauri-apps/plugin-shell";
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
import { setUnlockCurrentTrailers } from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";
import Warning from "@/components/Warning";

// icons
import {
	IconPencil,
	IconLockOpen,
	IconBrandYoutube,
} from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const UnlockTrailers = () => {
	const { selectedSave } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { unlock_trailer_country } = translations.menu_options.trailers;

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
			const res = await setUnlockCurrentTrailers(selectedSave.dir);
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
				{unlock_trailer_country.modal.btn_open}
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
								{unlock_trailer_country.modal.title}
							</ModalHeader>
							<Divider />
							<ModalBody className="items-center py-1">
								<p>{unlock_trailer_country.modal.description}</p>
								<Warning
									text={
										<div className="flex flex-col gap-2">
											<b>
												{unlock_trailer_country.modal.warning_message.title}
											</b>
											<p>
												{unlock_trailer_country.modal.warning_message.message}
											</p>
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
									{unlock_trailer_country.modal.btn_close}
								</Button>
								<Button
									endContent={<IconBrandYoutube />}
									color="warning"
									variant="flat"
									onPress={() => open("https://youtu.be/7vXIQUm4RDM")}
								>
									{unlock_trailer_country.modal.btn_how_to_use}
								</Button>
								<Button
									endContent={<IconLockOpen />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									{unlock_trailer_country.modal.btn_apply}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default UnlockTrailers;
