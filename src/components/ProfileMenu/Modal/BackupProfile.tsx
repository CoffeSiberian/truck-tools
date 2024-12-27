import { useState, useContext, FC } from "react";
import { save, SaveDialogOptions } from "@tauri-apps/plugin-dialog";
import { documentDir } from "@tauri-apps/api/path";
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
import { backupProfile, openExplorer } from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";

// icons
import {
	IconFolderSearch,
	IconFileTypeZip,
	IconFolderShare,
} from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
	showFolder: boolean;
}

interface ModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
}

const BackupProfile: FC<ModalProps> = ({ isOpen, onOpenChange }) => {
	const { selectedProfile } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { btn_backup_profile } =
		translations.components.player_profile.dropdown.profile_options;

	const [destDirZip, setDestDirZip] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
		showFolder: false,
	});

	const onClickApply = async () => {
		if (destDirZip.length === 0) return;
		if (completed.completed) {
			setCompleted({ error: false, completed: false, showFolder: false });
		}

		if (!selectedProfile) return;

		setIsLoading(true);

		const res = await backupProfile(selectedProfile.dir, destDirZip);

		setCompleted({
			error: !res,
			completed: true,
			showFolder: true,
		});
		setIsLoading(false);
	};

	const onClickFolder = async () => {
		if (!selectedProfile) return;

		const options: SaveDialogOptions = {
			title: btn_backup_profile.modal.save_folder_dialog.title,
			filters: [
				{
					name: btn_backup_profile.modal.save_folder_dialog.filters_name.zip,
					extensions: ["zip"],
				},
			],
			defaultPath: await documentDir(),
		};

		const filePath = await save(options);
		if (!filePath || Array.isArray(filePath)) return;

		setDestDirZip(filePath);
	};

	const clickOpenExplorer = async () => {
		if (destDirZip.length === 0) return;
		const dirSplit = destDirZip.split("\\");
		const removeFile = [...dirSplit.slice(0, -1)].join("\\");

		openExplorer(removeFile);
	};

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
							{btn_backup_profile.modal.title}
						</ModalHeader>
						<Divider />
						<ModalBody className="py-1">
							<p>{btn_backup_profile.modal.description}</p>
							<Input
								className="mt-1"
								disabled={true}
								isInvalid={destDirZip.length === 0}
								startContent={<IconFileTypeZip />}
								endContent={
									<div className="flex">
										<Button
											color="primary"
											startContent={<IconFolderSearch />}
											onPress={onClickFolder}
											size="sm"
										/>
									</div>
								}
								label={btn_backup_profile.modal.input_backup_destination.label}
								placeholder={
									btn_backup_profile.modal.input_backup_destination.placeholder
								}
								value={destDirZip}
								onValueChange={(value) => setDestDirZip(value)}
								variant="bordered"
							/>
							<div className="flex justify-end">
								{completed.showFolder ? (
									<Button
										size="sm"
										variant="bordered"
										disabled={destDirZip.length === 0 && completed.error}
										onPress={clickOpenExplorer}
										endContent={<IconFolderShare stroke={2} />}
										color={destDirZip.length === 0 ? "default" : "success"}
									>
										{btn_backup_profile.modal.btn_open_folder}
									</Button>
								) : null}
							</div>
							<AlertSave
								message={
									completed.error
										? "An error occurred in the process"
										: "Saved successfully"
								}
								error={completed.error}
								show={completed.completed}
								setShowFalse={() =>
									setCompleted({
										error: completed.error,
										completed: false,
										showFolder: completed.showFolder,
									})
								}
							/>
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								{btn_backup_profile.modal.btn_close}
							</Button>
							<Button
								endContent={<IconFileTypeZip />}
								isLoading={isLoading}
								color="success"
								onPress={onClickApply}
							>
								{btn_backup_profile.modal.btn_apply}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default BackupProfile;
