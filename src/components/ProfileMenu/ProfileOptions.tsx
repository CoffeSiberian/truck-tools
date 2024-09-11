import { useState, useContext } from "react";
import { ProfileContex } from "../../hooks/useProfileContex";
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
import { descriptFiles, openExplorer } from "../../utils/fileEdit";

// modals
import BackupProfile from "./Modal/BackupProfile";
import CloneProfile from "./Modal/CloneProfile";
import CopyConfig from "./Modal/CopyConfig";

// icons
import {
	IconFolderShare,
	IconBinary,
	IconMenu,
	IconFileTypeZip,
	IconCopy,
	IconSettingsShare,
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
						Profile Options
					</Button>
				</DropdownTrigger>
				<DropdownMenu
					variant="faded"
					aria-label="Dropdown menu with description"
					disabledKeys={disabledKeys()}
				>
					<DropdownSection title="Save Game Options" showDivider>
						<DropdownItem
							key="open"
							description="Open selected save game folder"
							startContent={<IconFolderShare className={iconClasses} />}
							onPress={
								selectedSave
									? () => openExplorer(selectedSave.dir.replace(/\//g, "\\"))
									: undefined
							}
						>
							Open Save Folder
						</DropdownItem>
						<DropdownItem
							key="decrypt"
							description="Decrypt selected save game"
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
							Decrypt Save
						</DropdownItem>
					</DropdownSection>
					<DropdownSection title="Profile Options">
						<DropdownItem
							key="backup"
							description="Create a backup copy of your profile"
							startContent={<IconFileTypeZip className={iconClasses} />}
							closeOnSelect={true}
							onPress={onOpenBackup}
						>
							Backup Profile
						</DropdownItem>
						<DropdownItem
							key="clone"
							description="Clone your profile to a new one"
							startContent={<IconCopy className={iconClasses} />}
							closeOnSelect={true}
							onPress={onOpenClone}
						>
							Clone Profile
						</DropdownItem>
						<DropdownItem
							key="copy-config"
							description="Copy settings from other profiles"
							startContent={<IconSettingsShare className={iconClasses} />}
							closeOnSelect={true}
							onPress={onOpenCopyConfig}
						>
							Copy Config
						</DropdownItem>
					</DropdownSection>
				</DropdownMenu>
			</Dropdown>
		</>
	);
};

export default ProfileOptions;
