import { useState, useContext, useEffect, FC } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";
import {
	Modal,
	ModalContent,
	ModalHeader,
	Divider,
	ModalBody,
	ModalFooter,
	Button,
	Input,
} from "@nextui-org/react";
import { setNewProfileName } from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";

// icons
import { IconPencil, IconDeviceFloppy } from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
}

interface ModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
}

const RenameProfile: FC<ModalProps> = ({ isOpen, onOpenChange }) => {
	const { selectedProfile, reloadProfiles } = useContext(ProfileContex);

	const [ProfileName, setProfileName] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const onClickApply = async () => {
		if (ProfileName.length === 0 || ProfileName.length > 20) return;
		if (!selectedProfile) return;

		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}

		setIsLoading(true);

		const res = await setNewProfileName(selectedProfile.dir, ProfileName);

		setCompleted({
			error: !res,
			completed: true,
		});
		setIsLoading(false);
		reloadProfiles();
	};

	useEffect(() => {
		if (selectedProfile) {
			setProfileName(selectedProfile.name);
		}
	}, [selectedProfile]);

	return (
		<Modal
			hideCloseButton
			size="md"
			backdrop="blur"
			isOpen={isOpen}
			onOpenChange={() => {
				if (isLoading) return;
				onOpenChange();
			}}
			shouldBlockScroll={false}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Rename profile
						</ModalHeader>
						<Divider />
						<ModalBody className="py-1">
							<p>
								You can rename the profile, but it must be less than 20
								characters.
							</p>
							<Input
								className="mt-1"
								isInvalid={ProfileName.length === 0 || ProfileName.length > 20}
								startContent={<IconPencil />}
								label="Profile name"
								placeholder="Enter profile name"
								value={ProfileName}
								isDisabled={selectedProfile ? false : true}
								onValueChange={(value) => setProfileName(value)}
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
							<Button color="danger" variant="light" onPress={onClose}>
								Close
							</Button>
							<Button
								endContent={<IconDeviceFloppy />}
								isLoading={isLoading}
								color="success"
								onPress={onClickApply}
								isDisabled={selectedProfile ? false : true}
							>
								Rename
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default RenameProfile;
