import { useState, useContext, FC } from "react";
import ListProfilesDropdown from "@/components/ProfileMenu/Dropdown/ListProfilesDropdown";
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
} from "@nextui-org/react";
import { copyProfileConfigs } from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";

// icons
import { IconCopy, IconUserCircle, IconArrowRight } from "@tabler/icons-react";

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
	const Contex = useContext(ProfileContex);
	const { selectedProfile, listProfiles } = Contex;

	const { translations } = useContext(LocaleContext);
	const { btn_copy_config } =
		translations.player_profile.dropdown.profile_options;

	const [ProfileInfo, setProfileInfo] = useState<Profile | undefined>(
		undefined
	);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const onClickApply = async () => {
		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}
		if (!ProfileInfo) return;

		setIsLoading(true);

		const sourceDir = listProfiles.find((p) => p.hex === ProfileInfo.hex);
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

	return (
		<Modal
			hideCloseButton
			size="lg"
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
							<ListProfilesDropdown
								{...Contex}
								selectedProfile={ProfileInfo}
								setProfile={setProfile}
							/>
							{ProfileInfo && (
								<div className="flex justify-between">
									<div className="flex w-full flex-col items-center text-wrap break-words text-center">
										<div className="w-[77px] text-center">
											{ProfileInfo.avatar ? (
												<Image
													src={ProfileInfo.avatar}
													alt="profile avatar"
													radius="full"
													loading="lazy"
													style={{
														zoom: 0.81,
														objectFit: "none",
														objectPosition: "0% 0%",
													}}
												/>
											) : (
												<IconUserCircle size={77} />
											)}
										</div>
										<p>
											<strong>{ProfileInfo.name}</strong>
										</p>
									</div>
									<div className="flex w-full items-center justify-center gap-2">
										<IconArrowRight size={80} />
									</div>
									<div className="flex w-full flex-col items-center text-wrap break-words text-center">
										<div className="w-[77px]">
											{selectedProfile?.avatar ? (
												<Image
													src={selectedProfile.avatar}
													alt="profile avatar"
													radius="full"
													loading="lazy"
													style={{
														zoom: 0.81,
														objectFit: "none",
														objectPosition: "0% 0%",
													}}
												/>
											) : (
												<IconUserCircle size={78} />
											)}
										</div>
										<p>
											<strong>{selectedProfile?.name}</strong>
										</p>
									</div>
								</div>
							)}
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
