import { useState } from "react";
import { save, SaveDialogOptions } from "@tauri-apps/api/dialog";
import { documentDir } from "@tauri-apps/api/path";
import { useProfileContex } from "../../../../hooks/useProfileContex";
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
import { backupProfile } from "../../../../utils/fileEdit";
import AlertSave from "../../../../components/AlertSave";

// icons
import {
	IconPencil,
	IconFolderSearch,
	IconFileTypeZip,
} from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const BackupProfile = () => {
	const { selectedProfile } = useProfileContex();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [destDirZip, setDestDirZip] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const onClickApply = async () => {
		if (destDirZip.length === 0) return;
		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}

		if (!selectedProfile) return;

		setIsLoading(true);

		const res = await backupProfile(selectedProfile.dir, destDirZip);

		setCompleted({
			error: !res,
			completed: true,
		});
		setIsLoading(false);
	};

	const onClickFolder = async () => {
		if (!selectedProfile) return;

		const options: SaveDialogOptions = {
			title: "Choose the destination folder",
			filters: [
				{
					name: "zip files",
					extensions: ["zip"],
				},
			],
			defaultPath: await documentDir(),
		};

		const filePath = await save(options);
		if (!filePath || Array.isArray(filePath)) return;

		setDestDirZip(filePath);
	};

	return (
		<>
			<Button
				endContent={<IconPencil stroke={2} />}
				onPress={onOpen}
				isDisabled={!selectedProfile}
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
				onOpenChange={() => {
					if (isLoading) return;
					onOpenChange();
				}}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Backup Profile
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>Create a backup copy, remember to enter the destination</p>
								<Input
									className="mt-1"
									disabled={true}
									isInvalid={destDirZip.length === 0}
									startContent={<IconFileTypeZip />}
									endContent={
										<Button
											color="primary"
											startContent={<IconFolderSearch />}
											onPress={onClickFolder}
										/>
									}
									label="Choose the destination folder"
									placeholder="Enter the destination folder"
									value={destDirZip}
									onValueChange={(value) => setDestDirZip(value)}
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
									endContent={<IconFileTypeZip />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									Backup
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default BackupProfile;
