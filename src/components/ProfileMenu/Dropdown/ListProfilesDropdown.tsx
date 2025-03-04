import { FC, useContext } from "react";
import { LocaleContext } from "@/hooks/useLocaleContext";
import { Select, SelectItem, Image } from "@heroui/react";

// icons
import { IconUserCircle } from "@tabler/icons-react";

// types
import { ProfileWithoutSaves } from "@/types/SaveGameTypes";
import { ProfileTypesContext } from "@/types/ContexTypes";

const ListProfilesDropdown: FC<ProfileTypesContext> = ({
	isProfilesLoading,
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
			isLoading={isProfilesLoading}
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
						<div className="w-[30px]">
							{profile.avatar ? (
								<Image
									src={profile.avatar}
									alt="profile avatar select"
									radius="lg"
									loading="lazy"
								/>
							) : (
								<IconUserCircle size={30} />
							)}
						</div>
						<div className="flex flex-col">
							<span className="text-small">{profile.name}</span>
							<span className="text-tiny text-default-500">
								{profile.savesCount} {player_profile.total_saves}
							</span>
						</div>
					</div>
				</SelectItem>
			)}
		</Select>
	);
};

export default ListProfilesDropdown;
