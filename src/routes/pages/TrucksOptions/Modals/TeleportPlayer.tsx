import { useState, useContext } from "react";
import { open } from "@tauri-apps/plugin-shell";

// context and hooks
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";

// utils
import { setPlayerPosition, getSavePlayerCamera } from "@/utils/fileEdit";

// components
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
import AlertSave from "@/components/AlertSave";

// icons
import { IconBrandYoutube, IconMapPin, IconPencil } from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const TeleportPlayer = () => {
	const { selectedSave, dirDocsGame } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	// const { trucks } = translations.menu_options;

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

		if (selectedSave && dirDocsGame) {
			setIsLoading(true);
			const cords = await getSavePlayerCamera(dirDocsGame);

			if (!cords) {
				setIsLoading(false);
				setCompleted({
					error: true,
					completed: true,
				});
				return;
			}
			const { location, rotation } = cords;

			const res = await setPlayerPosition(selectedSave.dir, location, rotation);
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
				Open
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
								Teleport player position
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>Teleport to a location using the game's debug camera</p>
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
									Close
								</Button>
								<Button
									endContent={<IconBrandYoutube />}
									color="warning"
									variant="flat"
									onPress={() => open("https://youtu.be/bD68jEzw-wg")}
								>
									How to use
								</Button>
								<Button
									endContent={<IconMapPin />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									Teleport
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default TeleportPlayer;
