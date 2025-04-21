import { useState, useContext } from "react";
import { open } from "@tauri-apps/plugin-shell";

// context and hooks
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";
import Warning from "@/components/Warning";

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
	const [cords, setCords] = useState<{
		location: string;
		rotation: string;
	} | null>(null);
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
			setCords(null);
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

			setCords({
				location,
				rotation,
			});

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
								Teleport player position
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>Teleport to a location using the game debug camera</p>
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
								<Warning
									text={
										<div className="flex flex-col gap-2">
											<b>Remember</b>
											<p>
												- You need to enable the console and developer mode to
												use this option; you can do this in the settings (with
												the game closed)
											</p>
											<p>
												- To generate new coordinates, you need to use the
												following key combination: <b>Alt + F12</b>
											</p>
										</div>
									}
								/>
								{cords && (
									<div className="flex flex-col text-center">
										<p className="text-sm text-gray-500">{`Location: ${cords.location}`}</p>
										<p className="text-sm text-gray-500">{`Rotation: ${cords.rotation}`}</p>
									</div>
								)}
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
