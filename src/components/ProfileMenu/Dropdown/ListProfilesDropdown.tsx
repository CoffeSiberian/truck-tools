import { FC } from "react";
import { Select, SelectItem, Image } from "@nextui-org/react";

// icons
import { IconUserCircle } from "@tabler/icons-react";

// types
import { ProfileWithoutSaves } from "../../../types/SaveGameTypes";
import { ProfileTypesContext } from "../../../types/ContexTypes";

const ListProfilesDropdown: FC<ProfileTypesContext> = ({
	listProfiles,
	selectedProfile,
	setProfile,
}) => {
	const onClickProfile = (profileHex: string) => {
		if (!profileHex) return;

		const profileFind = listProfiles.find(
			(p) => p.hex === profileHex
		) as ProfileWithoutSaves;

		setProfile(profileFind);
	};

	return (
		<Select
			isDisabled={listProfiles.length === 0}
			errorMessage={listProfiles.length > 0 ? undefined : "No profiles found"}
			isLoading={listProfiles.length === 0}
			isInvalid={selectedProfile ? false : true}
			items={listProfiles}
			selectedKeys={selectedProfile ? [selectedProfile.hex] : []}
			onChange={(e) => onClickProfile(e.target.value)}
			label="Profiles"
			placeholder="Select a profile"
			labelPlacement="inside"
			variant="bordered"
			size="md"
		>
			{(profile) => (
				<SelectItem key={profile.hex} textValue={profile.name}>
					<div className="flex items-center gap-2">
						<div className="w-[30px]">
							{profile.avatar ? (
								<Image
									src={profile.avatar}
									alt="profile avatar select"
									radius="full"
									loading="lazy"
									style={{
										zoom: 0.31,
										objectFit: "none",
										objectPosition: "0% 0%",
									}}
								/>
							) : (
								<IconUserCircle size={30} />
							)}
						</div>
						<div className="flex flex-col">
							<span className="text-small">{profile.name}</span>
							<span className="text-tiny text-default-400">
								{profile.savesCount} saves
							</span>
						</div>
					</div>
				</SelectItem>
			)}
		</Select>
	);
};

export default ListProfilesDropdown;
