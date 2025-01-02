import { useState, useContext, JSX } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";
import {
	Button,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownSection,
	DropdownItem,
	useDisclosure,
	cn,
} from "@nextui-org/react";
import { descriptFiles, openExplorer } from "@/utils/fileEdit";

// modals
import BackupProfile from "@/components/ProfileMenu/Modal/BackupProfile";
import CloneProfile from "@/components/ProfileMenu/Modal/CloneProfile";
import CopyConfig from "@/components/ProfileMenu/Modal/CopyConfig";
import RenameProfile from "@/components/ProfileMenu/Modal/RenameProfile";

// icons
import {
	IconFolderShare,
	IconBinary,
	IconMenu,
	IconFileTypeZip,
	IconCopy,
	IconSettingsShare,
	IconUserEdit,
} from "@tabler/icons-react";
import { Spinner } from "@nextui-org/spinner";

interface DecryptResult {
	isLoading: boolean;
	success?: boolean;
}

interface DecryptStyles {
	color:
		| "success"
		| "default"
		| "danger"
		| "primary"
		| "secondary"
		| "warning"
		| undefined;
	startContent: JSX.Element;
	textColor: string;
}

const ProfileOptions = () => {
	const { selectedProfile, selectedSave } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { player_profile } = translations.components;

	const {
		isOpen: isOpenBackup,
		onOpen: onOpenBackup,
		onOpenChange: onOpenChangeBackup,
	} = useDisclosure();

	const {
		isOpen: isOpenClone,
		onOpen: onOpenClone,
		onOpenChange: onOpenChangeClone,
	} = useDisclosure();

	const {
		isOpen: isOpenCopyConfig,
		onOpen: onOpenCopyConfig,
		onOpenChange: onOpenChangeCopyConfig,
	} = useDisclosure();

	const {
		isOpen: isOpenRenameProfile,
		onOpen: onOpenRenameProfile,
		onOpenChange: onOpenChangeRenameProfile,
	} = useDisclosure();

	const [decryptResult, setDecryptResult] = useState<DecryptResult>({
		isLoading: false,
	});

	const iconClasses =
		"text-xl text-default-500 pointer-events-none flex-shrink-0";

	const decryptStyles: DecryptStyles = {
		color:
			decryptResult.success === true
				? "success"
				: decryptResult.success === undefined
					? "default"
					: "danger",
		startContent: (
			<IconBinary
				className={cn(
					iconClasses,
					decryptResult.success === true
						? "text-success"
						: decryptResult.success === undefined
							? ""
							: "text-danger"
				)}
			/>
		),
		textColor:
			decryptResult.success === true
				? "text-success"
				: decryptResult.success === undefined
					? ""
					: "text-danger",
	};

	const decryptSave = async (dir: string) => {
		setDecryptResult({ isLoading: true });

		const decrypt = await descriptFiles(dir);

		setDecryptResult({ isLoading: false, success: decrypt });
	};

	const disabledKeys = (): string[] => {
		const keys: string[] = [];

		if (!selectedSave) {
			keys.push("open");
			keys.push("decrypt");
		}
		if (!selectedProfile) {
			keys.push("backup");
		}

		return keys;
	};

	return (
		<>
			<BackupProfile isOpen={isOpenBackup} onOpenChange={onOpenChangeBackup} />
			<CloneProfile isOpen={isOpenClone} onOpenChange={onOpenChangeClone} />
			<RenameProfile
				isOpen={isOpenRenameProfile}
				onOpenChange={onOpenChangeRenameProfile}
			/>
			<CopyConfig
				isOpen={isOpenCopyConfig}
				onOpenChange={onOpenChangeCopyConfig}
			/>
			<Dropdown backdrop="opaque" closeOnSelect={false}>
				<DropdownTrigger>
					<Button
						isDisabled={selectedProfile ? false : true}
						endContent={<IconMenu />}
						size="sm"
						variant="solid"
						color={selectedProfile ? "primary" : "default"}
					>
						{player_profile.btn_profile}
					</Button>
				</DropdownTrigger>
				<DropdownMenu
					variant="faded"
					aria-label="Dropdown menu with description"
					disabledKeys={disabledKeys()}
				>
					<DropdownSection
						title={player_profile.dropdown.save_game_options.title}
						showDivider
					>
						<DropdownItem
							key="open"
							description={
								player_profile.dropdown.save_game_options.btn_open_folder
									.description
							}
							startContent={<IconFolderShare className={iconClasses} />}
							onPress={
								selectedSave
									? () => openExplorer(selectedSave.dir.replace(/\//g, "\\"))
									: undefined
							}
						>
							{player_profile.dropdown.save_game_options.btn_open_folder.label}
						</DropdownItem>
						<DropdownItem
							key="decrypt"
							description={
								player_profile.dropdown.save_game_options.btn_decrypt_save
									.description
							}
							className={decryptStyles.textColor}
							color={decryptStyles.color}
							startContent={
								decryptResult.isLoading ? (
									<Spinner size="sm" />
								) : (
									decryptStyles.startContent
								)
							}
							onPress={
								selectedSave
									? () => decryptSave(selectedSave.dir + "/game.sii")
									: undefined
							}
						>
							{player_profile.dropdown.save_game_options.btn_decrypt_save.label}
						</DropdownItem>
					</DropdownSection>
					<DropdownSection
						title={player_profile.dropdown.profile_options.title}
					>
						<DropdownItem
							key="backup"
							description={
								player_profile.dropdown.profile_options.btn_backup_profile
									.description
							}
							startContent={<IconFileTypeZip className={iconClasses} />}
							closeOnSelect={true}
							onPress={onOpenBackup}
						>
							{player_profile.dropdown.profile_options.btn_backup_profile.label}
						</DropdownItem>
						<DropdownItem
							key="rename-profile"
							description={
								player_profile.dropdown.profile_options.btn_rename_profile
									.description
							}
							startContent={<IconUserEdit className={iconClasses} />}
							closeOnSelect={true}
							onPress={onOpenRenameProfile}
						>
							{player_profile.dropdown.profile_options.btn_rename_profile.label}
						</DropdownItem>
						<DropdownItem
							key="clone"
							description={
								player_profile.dropdown.profile_options.btn_clone_profile
									.description
							}
							startContent={<IconCopy className={iconClasses} />}
							closeOnSelect={true}
							onPress={onOpenClone}
						>
							{player_profile.dropdown.profile_options.btn_clone_profile.label}
						</DropdownItem>
						<DropdownItem
							key="copy-config"
							description={
								player_profile.dropdown.profile_options.btn_copy_config
									.description
							}
							startContent={<IconSettingsShare className={iconClasses} />}
							closeOnSelect={true}
							onPress={onOpenCopyConfig}
						>
							{player_profile.dropdown.profile_options.btn_copy_config.label}
						</DropdownItem>
					</DropdownSection>
				</DropdownMenu>
			</Dropdown>
		</>
	);
};

export default ProfileOptions;
