import { FC, useState, useEffect } from "react";
import { open, OpenDialogOptions } from "@tauri-apps/api/dialog";
import { documentDir } from "@tauri-apps/api/path";
import {
	Modal,
	ModalContent,
	ModalHeader,
	Divider,
	ModalBody,
	ModalFooter,
	Button,
	Select,
	SelectItem,
	Switch,
	Input,
} from "@nextui-org/react";
import { useDarkMode } from "../../hooks/useDarkModeContex";
import { useProfileContex } from "../../hooks/useProfileContex";
import {
	getStoredDocumentDir,
	storeDocumentDir,
	getGameDeveloperStatus,
	setGameDeveloperStatus,
	setConvoySize,
} from "../../utils/fileEdit";

// types
import { themeTypesSystem } from "../../types/fileEditTypes";

// icons
import {
	IconFolderSearch,
	IconFolderPlus,
	IconRefresh,
} from "@tabler/icons-react";

interface SettingsModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
}

interface OptionsStateTypes {
	enableConsole: boolean;
	enable128Convoy: boolean;
	documentDir: string | null;
}

const SettingsModal: FC<SettingsModalProps> = ({ isOpen, onOpenChange }) => {
	const { userTheme, setUserTheme } = useDarkMode();
	const { reloadProfiles } = useProfileContex();

	const [optionsState, setOptionsState] = useState<OptionsStateTypes>({
		enableConsole: false,
		enable128Convoy: false,
		documentDir: null,
	});

	const onClickTheme = (theme: themeTypesSystem) => {
		setUserTheme(theme);
	};

	const onClickDeveloperStatus = async (status: boolean) => {
		const res = await setGameDeveloperStatus(status);

		if (res) {
			setOptionsState((prev) => ({
				...prev,
				enableConsole: status,
			}));
		}
	};

	const onClickConvoySize = async (status: boolean) => {
		const res = await setConvoySize(status);

		if (res) {
			setOptionsState((prev) => ({
				...prev,
				enable128Convoy: status,
			}));
		}
	};

	const openSelectDir = async () => {
		const options: OpenDialogOptions = {
			title: "Select the folder where your progre is stored",
			directory: true,
			multiple: false,
			defaultPath: await documentDir(),
		};

		const res = await open(options);

		if (res) {
			storeDocumentDir(res as string);
			setOptionsState((prev) => ({
				...prev,
				documentDir: res as string,
			}));
			reloadProfiles();
		}
	};

	const resetConfigs = async () => {
		const dirSetDefault = await documentDir();

		onClickTheme("system");
		await storeDocumentDir(dirSetDefault);
		reloadProfiles();

		setOptionsState((prev) => ({
			...prev,
			documentDir: dirSetDefault,
		}));
	};

	useEffect(() => {
		const getOptions = async () => {
			const getDocumentDirStore = await getStoredDocumentDir();
			const getGameDeveloperStatusStore = await getGameDeveloperStatus();

			if (!getDocumentDirStore) {
				storeDocumentDir(await documentDir());
			}

			setOptionsState({
				enableConsole:
					getGameDeveloperStatusStore.console &&
					getGameDeveloperStatusStore.developer,
				enable128Convoy: getGameDeveloperStatusStore.active_max_convoy_mode,
				documentDir: getDocumentDirStore,
			});
		};

		if (isOpen) {
			getOptions();
		}
	}, [isOpen]);

	return (
		<Modal
			size="sm"
			backdrop="blur"
			isOpen={isOpen}
			onOpenChange={onOpenChange}
		>
			<ModalContent>
				{(_onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">Settings</ModalHeader>
						<Divider />
						<ModalBody className="flex pb-1">
							<div className="flex justify-center gap-1">
								<Select
									selectedKeys={[userTheme]}
									onChange={(e) => onClickTheme(e.target.value as any)}
									label="Change theme"
									variant="bordered"
									placeholder="Select a theme"
								>
									<SelectItem key="system">System</SelectItem>
									<SelectItem key="dark">Dark</SelectItem>
									<SelectItem key="light">Light</SelectItem>
								</Select>
							</div>
							<div className="flex justify-center gap-1">
								<Select
									label="Change language"
									variant="bordered"
									placeholder="Select a language"
									isDisabled
								>
									<SelectItem key="english">English</SelectItem>
								</Select>
							</div>
							<div className="flex">
								<Switch
									onValueChange={(e) => onClickDeveloperStatus(e)}
									isSelected={optionsState.enableConsole}
								>
									Enable console and developer mode
								</Switch>
							</div>
							<div className="flex">
								<Switch
									onValueChange={(e) => onClickConvoySize(e)}
									isSelected={optionsState.enable128Convoy}
								>
									Enable 128 convoy mode slots
								</Switch>
							</div>
							<div className="flex">
								<Input
									disabled={true}
									value={optionsState.documentDir || ""}
									startContent={<IconFolderPlus />}
									endContent={
										<div className="flex">
											<Button
												color="primary"
												startContent={<IconFolderSearch />}
												onPress={openSelectDir}
												size="sm"
											/>
										</div>
									}
									size="sm"
									label="Document folder"
									placeholder="Enter the document folder"
								/>
							</div>
						</ModalBody>
						<ModalFooter className="justify-center">
							<Button
								onPress={resetConfigs}
								color="danger"
								endContent={<IconRefresh />}
								size="sm"
								variant="bordered"
							>
								Reset Settings
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default SettingsModal;
