import { FC, useContext } from "react";
import { LocaleContext } from "@/hooks/useLocaleContext";
import { Select, SelectItem, Image } from "@heroui/react";

// icons
import { IconUserCircle } from "@tabler/icons-react";

// images
import ets2 from "@/static/icons/games/ets2.webp";
import ats from "@/static/icons/games/ats.webp";

// types
import { Profile, ProfileWithoutSaves } from "@/types/SaveGameTypes";

interface ProfileListProps {
	listProfiles: Array<ProfileWithoutSaves>;
	selectedProfile?: Profile;
	setProfile: (profile: ProfileWithoutSaves) => void;
}

const ListProfilesDropdownCopyConfig: FC<ProfileListProps> = ({
	listProfiles,
	selectedProfile,
	setProfile,
}) => {
	const { translations } = useContext(LocaleContext);
	const { player_profile } = translations.components;

	const onClickProfile = (id: string) => {
		if (!id) return;

		const profileFind = listProfiles.find(
			(p) => p.id === id
		) as ProfileWithoutSaves;

		setProfile(profileFind);
	};

	return (
		<Select
			isDisabled={listProfiles.length === 0}
			errorMessage={
				listProfiles.length > 0 ? undefined : player_profile.no_selected_profile
			}
			isLoading={listProfiles.length === 0}
			isInvalid={selectedProfile ? false : true}
			items={listProfiles}
			selectedKeys={selectedProfile ? [selectedProfile.id] : []}
			onChange={(e) => onClickProfile(e.target.value)}
			label={player_profile.input_select_profile.label}
			placeholder={player_profile.input_select_profile.placeholder}
			labelPlacement="inside"
			variant="bordered"
			size="md"
		>
			{(profile) => (
				<SelectItem key={profile.id} textValue={profile.name}>
					<div className="flex items-center gap-2">
						<div className="w-7.5">
							{profile.avatar ? (
								<Image
									src={profile.avatar}
									alt="profile avatar select"
									radius="full"
									loading="lazy"
								/>
							) : (
								<IconUserCircle size={30} />
							)}
						</div>
						<div className="flex">
							<span className="text-small">{profile.name}</span>
						</div>
						{profile.game === "ets2" ? (
							<img src={ets2} className="w-6" alt="ets2" />
						) : (
							<img src={ats} className="w-6" alt="ats" />
						)}
					</div>
				</SelectItem>
			)}
		</Select>
	);
};

export default ListProfilesDropdownCopyConfig;
