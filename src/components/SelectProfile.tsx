import { useProfileContex } from "../hooks/useProfileContex";
import {
	Card,
	CardBody,
	Chip,
	Image,
	Skeleton,
	Button,
} from "@nextui-org/react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { descriptFiles, openExplorer } from "../utils/fileEdit";
import ListProfiles from "./ListProfiles";
import ListSaves from "./ListSaves";

// icons
import {
	IconFolderShare,
	IconBinary,
	IconReload,
	IconUserCircle,
} from "@tabler/icons-react";

// types
import { Profile } from "../types/SaveGameTypes";

const SelectProfile = () => {
	const { selectedProfile, isSavesLoading, selectedSave, reloadProfiles } =
		useProfileContex();

	const renderProfile = (profileInfo: Profile | undefined) => {
		return (
			<div className="flex w-full max-w-72 flex-col items-center gap-1 pr-2">
				{isSavesLoading ? (
					<div className="flex w-full items-center gap-3">
						<div>
							<Skeleton className="flex h-14 w-14 rounded-full" />
						</div>
						<div className="flex w-full flex-col gap-2">
							<Skeleton className="h-3 w-3/5 rounded-lg" />
							<Skeleton className="h-3 w-4/5 rounded-lg" />
						</div>
					</div>
				) : (
					<div className="flex w-full items-center gap-2">
						<div className="w-[77px]">
							{profileInfo ? (
								profileInfo.avatar ? (
									<Image
										src={profileInfo.avatar}
										alt="profile avatar"
										radius="full"
										loading="lazy"
										style={{
											zoom: 0.62,
											objectFit: "none",
											objectPosition: "0% 0%",
										}}
									/>
								) : (
									<IconUserCircle size={60} />
								)
							) : (
								<IconUserCircle size={60} />
							)}
						</div>
						<div className="flex w-full flex-col gap-0">
							{profileInfo ? (
								<>
									<p className="text-pretty">{profileInfo.name}</p>
									<small className="text-default-500">
										{profileInfo.saves.length} saves
									</small>
								</>
							) : (
								<>
									<p className="text-pretty">No profile selected</p>
									<small className="text-default-500">0 saves</small>
								</>
							)}

							<div className="mt-1 flex flex-row gap-1">
								<Button
									size="sm"
									variant="bordered"
									disabled={!selectedSave}
									onPress={
										selectedSave
											? () =>
													openExplorer(selectedSave.dir.replace(/\//g, "\\"))
											: undefined
									}
									endContent={<IconFolderShare stroke={2} />}
									color={selectedSave ? "warning" : "default"}
								>
									Open
								</Button>
								<Button
									size="sm"
									variant="bordered"
									disabled={!selectedSave}
									onPress={
										selectedSave
											? () => descriptFiles(selectedSave.dir, "game.sii")
											: undefined
									}
									endContent={<IconBinary stroke={2} />}
									color={selectedSave ? "warning" : "default"}
								>
									Decrypt
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	};

	return (
		<div
			className={`fixed bottom-0 z-10 mb-2 mt-auto flex w-full flex-col items-center transition-opacity ${
				selectedSave ? "opacity-70" : "opacity-100"
			} gap-1 hover:opacity-100`}
		>
			{!selectedSave && (
				<Chip
					className="opacity-100"
					startContent={<IconAlertTriangle stroke={1.5} />}
					color="warning"
				>
					<b>First select your profile and save</b>
				</Chip>
			)}
			<Card className="flex w-full max-w-4xl">
				<CardBody className="flex flex-row content-between items-center p-1">
					{renderProfile(selectedProfile)}
					<div className="flex w-full flex-nowrap items-center gap-2">
						<ListProfiles />
						<ListSaves />
						<Button onPress={() => reloadProfiles()} isIconOnly>
							<IconReload stroke={2} />
						</Button>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

export default SelectProfile;
