import { useState, useContext, useEffect, FC } from "react";
import ListProfilesDropdownCopyConfig from "@/components/ProfileMenu/Dropdown/ListProfilesDropdownCopyConfig";
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";
import {
	Modal,
	Image,
	ModalContent,
	ModalHeader,
	Divider,
	ModalBody,
	ModalFooter,
	Button,
} from "@heroui/react";
import { copyProfileConfigs, readProfileNames } from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";

// icons
import { IconCopy, IconUserCircle, IconArrowRight } from "@tabler/icons-react";

// images
import ets2 from "@/static/icons/games/ets2.webp";
import ats from "@/static/icons/games/ats.webp";

// types
import { ProfileWithoutSaves, Profile } from "@/types/SaveGameTypes";

interface completedProps {
	error: boolean;
	completed: boolean;
}

interface ModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
}

const CopyConfig: FC<ModalProps> = ({ isOpen, onOpenChange }) => {
	const { selectedProfile, listProfiles, game } = useContext(ProfileContex);

	const { translations } = useContext(LocaleContext);
	const { btn_copy_config } =
		translations.components.player_profile.dropdown.profile_options;

	const [ProfileInfo, setProfileInfo] = useState<Profile | undefined>(
		undefined
	);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});
	const [listProfilesBothGames, setListProfilesBothGames] = useState<
		ProfileWithoutSaves[]
	>([]);

	const onClickApply = async () => {
		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}
		if (!ProfileInfo) return;

		setIsLoading(true);

		const sourceDir = listProfilesBothGames.find(
			(p) => p.id === ProfileInfo.id
		);
		if (!sourceDir || !selectedProfile) return;

		const res = await copyProfileConfigs(sourceDir.dir, selectedProfile.dir);

		setCompleted({
			error: !res,
			completed: true,
		});

		setIsLoading(false);
	};

	const setProfile = (profile: ProfileWithoutSaves) => {
		setProfileInfo({
			...profile,
			saves: [],
		});
	};

	useEffect(() => {
		if (isOpen) {
			const invertGame = game === "ets2" ? "ats" : "ets2";

			const loadDirectory = async () => {
				const prof = await readProfileNames(invertGame);
				if (!prof) return;

				setListProfilesBothGames([...listProfiles, ...prof]);
			};

			loadDirectory();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	return (
		<Modal
			hideCloseButton
			size="xl"
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
							{btn_copy_config.modal.title}
						</ModalHeader>
						<Divider />
						<ModalBody className="py-1">
							<p
								dangerouslySetInnerHTML={{
									__html: btn_copy_config.modal.description,
								}}
							/>
							<ListProfilesDropdownCopyConfig
								listProfiles={listProfilesBothGames}
								selectedProfile={ProfileInfo}
								setProfile={setProfile}
							/>
							{ProfileInfo && (
								<div className="flex justify-between">
									<div className="flex w-full flex-col items-center text-center text-wrap wrap-break-word">
										<div className="w-20 text-center">
											{ProfileInfo.avatar ? (
												<Image
													src={ProfileInfo.avatar}
													alt="profile avatar"
													radius="full"
													loading="lazy"
												/>
											) : (
												<IconUserCircle size={80} />
											)}
										</div>
										<div className="flex gap-1">
											<p>
												<strong>{ProfileInfo.name}</strong>
											</p>
											<div className="flex items-center">
												{ProfileInfo.game === "ets2" ? (
													<img src={ets2} className="w-6" alt="ets2" />
												) : (
													<img src={ats} className="w-6" alt="ats" />
												)}
											</div>
										</div>
									</div>
									<div className="flex w-full items-center justify-center gap-2">
										<IconArrowRight size={80} />
									</div>
									<div className="flex w-full flex-col items-center text-center text-wrap wrap-break-word">
										<div className="w-20">
											{selectedProfile?.avatar ? (
												<Image
													src={selectedProfile.avatar}
													alt="profile avatar"
													radius="full"
													loading="lazy"
												/>
											) : (
												<IconUserCircle size={80} />
											)}
										</div>
										<div className="mt-auto flex gap-1">
											<p>
												<strong>{selectedProfile?.name}</strong>
											</p>
											<div className="flex items-center">
												{selectedProfile?.game === "ets2" ? (
													<img src={ets2} className="w-6" alt="ets2" />
												) : (
													<img src={ats} className="w-6" alt="ats" />
												)}
											</div>
										</div>
									</div>
								</div>
							)}
							<AlertSave
								message={
									completed.error
										? translations.components.alert_on_save_default.error
										: translations.components.alert_on_save_default.succes
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
								{btn_copy_config.modal.btn_close}
							</Button>
							<Button
								endContent={<IconCopy />}
								isLoading={isLoading}
								color="success"
								onPress={onClickApply}
							>
								{btn_copy_config.modal.btn_apply}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default CopyConfig;
