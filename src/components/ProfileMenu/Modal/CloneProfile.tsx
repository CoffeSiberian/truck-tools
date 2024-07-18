import { useState, useEffect, FC } from "react";
import { useProfileContex } from "../../../hooks/useProfileContex";
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
import { copyProfile } from "../../../utils/fileEdit";
import AlertSave from "../../AlertSave";

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
	const { selectedProfile } = useProfileContex();

	const [ProfileName, setProfileName] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const onClickApply = async () => {
		if (ProfileName.length === 0) return;
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
	};

	useEffect(() => {
		if (isOpen) {
			if (selectedProfile) {
				setProfileName(selectedProfile.name + " - Copy");
			}
		}
	}, [isOpen]);

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
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Clone Profile
						</ModalHeader>
						<Divider />
						<ModalBody className="py-1">
							<p>
								Enter the name of the profile you want to clone. This will
								create a new profile with the same settings as the selected
								profile.
							</p>
							<Input
								className="mt-1"
								startContent={<IconUserEdit />}
								isInvalid={ProfileName === ""}
								label="New Profile Name"
								placeholder="Enter the name of the profile"
								value={ProfileName}
								onValueChange={(value) => setProfileName(value)}
							/>
							<div className="flex justify-center">
								<AlertSave
									message={
										completed.error
											? "An error occurred in the process"
											: "Saved successfully"
									}
									error={completed.error}
									show={completed.completed}
								/>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								Close
							</Button>
							<Button
								endContent={<IconCopy />}
								isLoading={isLoading}
								color="success"
								onPress={onClickApply}
							>
								Clone
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default CloneProfile;
