import { FC } from "react";
import { classNames } from "primereact/utils";
import { Image } from "@nextui-org/react";
import { Dropdown } from "primereact/dropdown";

// icons
import { IconUserCircle } from "@tabler/icons-react";

// types
import { ProfileWithoutSaves } from "@/types/SaveGameTypes";
import { ProfileTypesContext } from "@/types/ContexTypes";

const ListProfilePrimeRe: FC<ProfileTypesContext> = ({
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

	const profileListTemplate = (option: ProfileWithoutSaves): JSX.Element => {
		return (
			<div className="flex items-center gap-2">
				<div className="w-[30px]">
					{option.avatar ? (
						<Image
							src={option.avatar}
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
					<span className="text-small">{option.name}</span>
					<span className="text-tiny text-default-500">
						{option.savesCount} saves
					</span>
				</div>
			</div>
		);
	};

	const selectedProfileTemplate = (): JSX.Element => {
		if (!selectedProfile) return <>Select profile</>;

		return <>{selectedProfile.name}</>;
	};

	return (
		<Dropdown
			value={selectedProfile}
			onChange={(e) => onClickProfile(e.value.hex)}
			options={listProfiles}
			loading={listProfiles.length === 0}
			disabled={listProfiles.length === 0}
			itemTemplate={profileListTemplate}
			valueTemplate={selectedProfileTemplate}
			optionLabel="name"
			placeholder="Select a profile"
			className={classNames(
				"md:w-14rem w-full rounded-xl",
				selectedProfile ? "" : "border-2 border-red-500"
			)}
		/>
	);
};

export default ListProfilePrimeRe;
