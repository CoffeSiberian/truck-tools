import { useState, useContext } from "react";
import { open } from "@tauri-apps/plugin-shell";
import { ProfileContex } from "@/hooks/useProfileContex";
import {
	Modal,
	ModalContent,
	ModalHeader,
	Divider,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
} from "@nextui-org/react";
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
				Open
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
								Unlock Current Trailer
							</ModalHeader>
							<Divider />
							<ModalBody className="items-center py-1">
								<p>
									Unlock your trailer in all countries if it is blocked by the
									game
								</p>
								<Warning
									text={
										<div className="flex flex-col gap-2">
											<b>Remember</b>
											<p>
												You must have the trailer hitched to the truck for the
												changes to take effect.
											</p>
										</div>
									}
								/>
								<AlertSave
									message={
										completed.error
											? "An error occurred in the process"
											: "Saved successfully"
									}
									error={completed.error}
									show={completed.completed}
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
									onPress={() => open("https://youtu.be/7vXIQUm4RDM")}
								>
									How to use
								</Button>
								<Button
									endContent={<IconLockOpen />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									Unlock
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
