import { useContext } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";
import { Image, Skeleton } from "@nextui-org/react";
import ProfileOptions from "@/components/ProfileMenu/ProfileOptions";

// icons
import { IconUserCircle } from "@tabler/icons-react";

const RenderProfile = () => {
	const { isSavesLoading, selectedProfile } = useContext(ProfileContex);

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
						{selectedProfile ? (
							selectedProfile.avatar ? (
								<Image
									src={selectedProfile.avatar}
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
						{selectedProfile ? (
							<>
								<p className="text-pretty">{selectedProfile.name}</p>
								<small className="text-default-500">
									{selectedProfile.saves.length} saves
								</small>
							</>
						) : (
							<>
								<p className="text-pretty">No profile selected</p>
								<small className="text-default-500">0 saves</small>
							</>
						)}

						<div className="mt-1 flex flex-row justify-start gap-1">
							<ProfileOptions />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default RenderProfile;
