import { useProfileContex } from "../hooks/useProfileContex";
import { ProfileWithoutSaves } from "../types/SaveGameTypes";

import { Select, SelectItem, Avatar } from "@nextui-org/react";

// icons
import { IconUserCircle } from "@tabler/icons-react";

const ListProfiles = () => {
	const { listProfiles, selectedProfile, setProfile } = useProfileContex();

	const onClickProfile = (profileHex: string) => {
		if (!profileHex) return;

		const profileFind = listProfiles.find(
			(p) => p.hex === profileHex
		) as ProfileWithoutSaves;

		setProfile(profileFind);
	};

	return (
		<Select
			isDisabled={!(listProfiles.length > 0)}
			errorMessage={listProfiles.length > 0 ? undefined : "No profiles found"}
			isLoading={listProfiles.length === 0}
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
						<Avatar
							alt={profile.avatar}
							className="flex-shrink-0"
							size="sm"
							src={profile.avatar}
							showFallback
							fallback={<IconUserCircle />}
						/>
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

export default ListProfiles;
