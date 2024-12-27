import { useState, useEffect, useContext, FC } from "react";
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
	Input,
} from "@nextui-org/react";
import { copyProfile } from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";

// icons
import { IconUserEdit, IconCopy } from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
}

interface ModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
}

const CloneProfile: FC<ModalProps> = ({ isOpen, onOpenChange }) => {
	const { selectedProfile, reloadProfiles } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { btn_clone_profile } =
		translations.components.player_profile.dropdown.profile_options;

	const [ProfileName, setProfileName] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const onClickApply = async () => {
		if (ProfileName.length === 0 || ProfileName.length > 20) return;
		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}

		if (!selectedProfile) return;

		setIsLoading(true);

		const res = await copyProfile(selectedProfile.dir, ProfileName);

		setCompleted({
			error: !res,
			completed: true,
		});
		setIsLoading(false);
		reloadProfiles();
	};

	useEffect(() => {
		if (isOpen) {
			if (selectedProfile) {
				setProfileName(selectedProfile.name + " - Clone");
			}
		}
	}, [isOpen, selectedProfile]);

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
							{btn_clone_profile.modal.title}
						</ModalHeader>
						<Divider />
						<ModalBody className="py-1">
							<p>{btn_clone_profile.modal.description}</p>
							<Input
								className="mt-1"
								startContent={<IconUserEdit />}
								isInvalid={ProfileName.length === 0 || ProfileName.length > 20}
								label={btn_clone_profile.modal.input_new_name.label}
								placeholder={btn_clone_profile.modal.input_new_name.placeholder}
								value={ProfileName}
								onValueChange={(value) => setProfileName(value)}
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
							<Button color="danger" variant="light" onPress={onClose}>
								{btn_clone_profile.modal.btn_close}
							</Button>
							<Button
								endContent={<IconCopy />}
								isLoading={isLoading}
								color="success"
								onPress={onClickApply}
							>
								{btn_clone_profile.modal.btn_apply}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default CloneProfile;
