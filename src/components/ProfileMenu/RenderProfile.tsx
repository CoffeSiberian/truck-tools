import { useContext } from "react";

// UI
import { Skeleton } from "@heroui/skeleton";
import { Image } from "@heroui/image";
import ProfileOptions from "@/components/ProfileMenu/ProfileOptions";

// Hooks
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";

// Icons
import { IconUserCircle } from "@tabler/icons-react";

const RenderProfile = () => {
	const { isSavesLoading, selectedProfile } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { player_profile } = translations.components;

	return (
		<div className="flex h-18.75 flex-col justify-center">
			{isSavesLoading ? (
				<div className="flex w-full items-center gap-2 align-middle">
					<div className="w-19.25">
						<Skeleton className="flex h-12.5 w-12.5 rounded-full" />
					</div>
					<div className="flex w-full flex-col gap-2">
						<Skeleton className="h-3.75 w-3/5 rounded-lg" />
						<Skeleton className="h-2.5 w-1/3 rounded-lg" />
					</div>
				</div>
			) : (
				<div className="flex w-full items-center gap-2">
					<div className="w-25">
						{selectedProfile ? (
							selectedProfile.avatar ? (
								<Image
									src={selectedProfile.avatar}
									alt="profile avatar"
									radius="lg"
									loading="lazy"
								/>
							) : (
								<IconUserCircle size={55} />
							)
						) : (
							<IconUserCircle size={55} />
						)}
					</div>
					<div className="flex w-full flex-col gap-0">
						{selectedProfile ? (
							<>
								<p className="text-pretty">{selectedProfile.name}</p>
								<small className="text-default-500">
									{selectedProfile.saves.length} {player_profile.total_saves}
								</small>
							</>
						) : (
							<>
								<p className="text-pretty">
									{player_profile.no_selected_profile}
								</p>
								<small className="text-default-500">
									0 {player_profile.total_saves}
								</small>
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
