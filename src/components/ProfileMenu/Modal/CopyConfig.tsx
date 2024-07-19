import { useState, FC } from "react";
import SelectProfileObject from "../SelectProfileObject";
import { useProfileContex } from "../../../hooks/useProfileContex";
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
import { copyProfileConfigs } from "../../../utils/fileEdit";
import AlertSave from "../../AlertSave";

// icons
import { IconCopy, IconUserCircle, IconArrowRight } from "@tabler/icons-react";

// types
import { ProfileWithoutSaves, Profile } from "../../../types/SaveGameTypes";

interface completedProps {
	error: boolean;
	completed: boolean;
}

interface ModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
}

const CopyConfig: FC<ModalProps> = ({ isOpen, onOpenChange }) => {
	const { selectedProfile, listProfiles } = useProfileContex();

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
							Copy Config
						</ModalHeader>
						<Divider />
						<ModalBody className="py-1">
							<p>
								Select the profile to which you want to copy the settings,
								remember that your settings will be replaced, we recommend that
								you <b>make a backup copy of your profile</b>.
							</p>
							<SelectProfileObject
								listProfiles={listProfiles}
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
								Copy Config
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default CopyConfig;
