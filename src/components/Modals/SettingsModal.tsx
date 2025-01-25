import { FC, useState, useContext, useEffect } from "react";
import { open as openLink } from "@tauri-apps/plugin-shell";
import { open, OpenDialogOptions } from "@tauri-apps/plugin-dialog";
import { documentDir } from "@tauri-apps/api/path";
import { locale } from "@tauri-apps/plugin-os";
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
} from "@heroui/react";
import { DarkModeContex } from "@/hooks/useDarkModeContex";
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";
import {
	getStoredDocumentDir,
	storeDocumentDir,
	getGameDeveloperStatus,
	setGameDeveloperStatus,
	setConvoySize,
	getStoredOpasityStatus,
	storeOpasityStatus,
	mostSimilarLang,
} from "@/utils/fileEdit";

// types
import { Langs } from "@/types/TranslationsTypes";
import { themeTypesSystem } from "@/types/fileEditTypes";

// icons
import {
	IconFolderSearch,
	IconFolderPlus,
	IconRefresh,
	IconEdit,
} from "@tabler/icons-react";

interface SettingsModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
}

interface OptionsStateTypes {
	enableConsole: boolean;
	enable128Convoy: boolean;
	opasityProfile: boolean;
	documentDir: string | null;
}

const SettingsModal: FC<SettingsModalProps> = ({ isOpen, onOpenChange }) => {
	const { userTheme, setUserTheme, setOpasityStatus } =
		useContext(DarkModeContex);
	const { reloadProfiles, game } = useContext(ProfileContex);
	const { translations, lang, changeLang } = useContext(LocaleContext);
	const { settings } = translations.menu_options;

	const [optionsState, setOptionsState] = useState<OptionsStateTypes>({
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
			title: settings.document_dialog_title,
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
				enableConsole: false,
				enable128Convoy: false,
				documentDir: res as string,
			}));
			reloadProfiles();
		}
	};

	const resetConfigs = async () => {
		const dirSetDefault = await documentDir();
		const sys_lang = await locale();
		const lang_res = mostSimilarLang(sys_lang);

		onClickTheme("system");
		await storeDocumentDir(dirSetDefault);
		reloadProfiles();

		await setGameDeveloperStatus(false, game);
		await setConvoySize(false, game);
		await storeOpasityStatus(true);
		setOpasityStatus(true);

		setOptionsState({
			enableConsole: false,
			enable128Convoy: false,
			opasityProfile: true,
			documentDir: dirSetDefault,
		});
		changeLang(lang_res);
	};

	useEffect(() => {
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
						<ModalHeader className="flex flex-col gap-1">
							{settings.title}
						</ModalHeader>
						<Divider />
						<ModalBody className="flex pb-1">
							<div className="flex justify-center gap-1">
								<Select
									selectedKeys={[userTheme]}
									onChange={(e) =>
										onClickTheme(e.target.value as "system" | "light" | "dark")
									}
									label={settings.input_change_theme.label}
									placeholder={settings.input_change_theme.placeholder}
									variant="bordered"
								>
									<SelectItem key="system">
										{settings.input_change_theme.options.system}
									</SelectItem>
									<SelectItem key="dark">
										{settings.input_change_theme.options.dark}
									</SelectItem>
									<SelectItem key="light">
										{settings.input_change_theme.options.light}
									</SelectItem>
								</Select>
							</div>
							<div className="flex items-center justify-center gap-2">
								<Select
									label={settings.input_change_language.label}
									placeholder={settings.input_change_language.placeholder}
									variant="bordered"
									selectedKeys={[lang]}
									onChange={(e) => {
										if (!e.target.value) return;
										changeLang(e.target.value as Langs);
									}}
								>
									<SelectItem key="en-US">English</SelectItem>
									<SelectItem key="zh-Hans">简体中文</SelectItem>
									<SelectItem key="fr-FR">Français</SelectItem>
									<SelectItem key="vi-VN">Tiếng Việt</SelectItem>
									<SelectItem key="pt-BR">Português</SelectItem>
									<SelectItem key="es-CL">Español</SelectItem>
									<SelectItem key="ko-KR">한국어</SelectItem>
									<SelectItem key="zh-Hant">繁體中文</SelectItem>
									<SelectItem key="uk-UA">Українська</SelectItem>
								</Select>
								<Button
									color="primary"
									isIconOnly
									onPress={() =>
										openLink(
											"https://github.com/CoffeSiberian/truck-tools/blob/main/src/translations/README.md"
										)
									}
								>
									<IconEdit />
								</Button>
							</div>
							<div className="flex">
								<Switch
									onValueChange={(e) => onClickDeveloperStatus(e)}
									isSelected={optionsState.enableConsole}
								>
									{settings.input_enable_console}
								</Switch>
							</div>
							<div className="flex">
								<Switch
									onValueChange={(e) => onClickConvoySize(e)}
									isSelected={optionsState.enable128Convoy}
								>
									{settings.input_enable_128_slots}
								</Switch>
							</div>
							<div className="flex">
								<Switch
									onValueChange={(e) => onClickOpacityStatus(e)}
									isSelected={optionsState.opasityProfile}
								>
									{settings.input_opacity_profile}
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
									label={settings.input_document_folder.label}
									placeholder={settings.input_document_folder.placeholder}
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
								{settings.btn_reset}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default SettingsModal;
