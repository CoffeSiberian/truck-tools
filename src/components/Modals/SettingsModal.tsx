import { FC, useState, useContext, useEffect } from "react";
import { open, OpenDialogOptions } from "@tauri-apps/plugin-dialog";
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
import { DarkModeContex } from "@/hooks/useDarkModeContex";
import { ProfileContex } from "@/hooks/useProfileContex";
import {
	getStoredDocumentDir,
	storeDocumentDir,
	getGameDeveloperStatus,
	setGameDeveloperStatus,
	setConvoySize,
	getStoredOpasityStatus,
	storeOpasityStatus,
} from "@/utils/fileEdit";

// types
import { themeTypesSystem } from "@/types/fileEditTypes";

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
	language: string;
	enableConsole: boolean;
	enable128Convoy: boolean;
	opasityProfile: boolean;
	documentDir: string | null;
}

const SettingsModal: FC<SettingsModalProps> = ({ isOpen, onOpenChange }) => {
	const { userTheme, setUserTheme, setOpasityStatus } =
		useContext(DarkModeContex);
	const { reloadProfiles, game } = useContext(ProfileContex);

	const [optionsState, setOptionsState] = useState<OptionsStateTypes>({
		language: "english",
		enableConsole: false,
		enable128Convoy: false,
		opasityProfile: false,
		documentDir: null,
	});

	const onClickTheme = (theme: themeTypesSystem) => {
		setUserTheme(theme);
	};

	const onClickDeveloperStatus = async (status: boolean) => {
		const res = await setGameDeveloperStatus(status, game);

		if (res) {
			setOptionsState((prev) => ({
				...prev,
				enableConsole: status,
			}));
		}
	};

	const onClickConvoySize = async (status: boolean) => {
		const res = await setConvoySize(status, game);

		if (res) {
			setOptionsState((prev) => ({
				...prev,
				enable128Convoy: status,
			}));
		}
	};

	const onClickOpacityStatus = async (status: boolean) => {
		await storeOpasityStatus(status);

		setOpasityStatus(status);
		setOptionsState((prev) => ({
			...prev,
			opasityProfile: status,
		}));
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
			await storeDocumentDir(res as string);
			await setGameDeveloperStatus(false, game);
			await setConvoySize(false, game);

			setOptionsState((prev) => ({
				...prev,
				language: "english",
				enableConsole: false,
				enable128Convoy: false,
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

		await setGameDeveloperStatus(false, game);
		await setConvoySize(false, game);
		await storeOpasityStatus(true);
		setOpasityStatus(true);

		setOptionsState({
			language: "english",
			enableConsole: false,
			enable128Convoy: false,
			opasityProfile: true,
			documentDir: dirSetDefault,
		});
	};

	useEffect(() => {
		// cambiar el target dinamicamente segun el tipo de juego (actualmente solo con ETS2)
		const getOptions = async () => {
			const getDocumentDirStore = await getStoredDocumentDir();
			const getGameDeveloperStatusStore = await getGameDeveloperStatus(game);
			const getOpasityStatusStore = await getStoredOpasityStatus();

			let documentDirString = getDocumentDirStore;
			if (!documentDirString) {
				documentDirString = await documentDir();
				storeDocumentDir(documentDirString);
			}

			setOptionsState({
				language: "english",
				enableConsole:
					getGameDeveloperStatusStore.console &&
					getGameDeveloperStatusStore.developer,
				enable128Convoy: getGameDeveloperStatusStore.active_max_convoy_mode,
				opasityProfile: getOpasityStatusStore,
				documentDir: documentDirString,
			});
		};

		if (isOpen) {
			getOptions();
		}
	}, [game, isOpen]);

	return (
		<Modal
			size="sm"
			backdrop="blur"
			isOpen={isOpen}
			onOpenChange={onOpenChange}
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col gap-1">Settings</ModalHeader>
						<Divider />
						<ModalBody className="flex pb-1">
							<div className="flex justify-center gap-1">
								<Select
									selectedKeys={[userTheme]}
									onChange={(e) =>
										onClickTheme(e.target.value as "system" | "light" | "dark")
									}
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
									selectedKeys={[optionsState.language]}
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
								<Switch
									onValueChange={(e) => onClickOpacityStatus(e)}
									isSelected={optionsState.opasityProfile}
								>
									Opacity on select profile
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
									variant="bordered"
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
