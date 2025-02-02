import { FC, JSX, useContext } from "react";
import { LocaleContext } from "@/hooks/useLocaleContext";
import { classNames } from "primereact/utils";
import { Image } from "@heroui/react";
import { Dropdown } from "primereact/dropdown";

// icons
import { IconUserCircle } from "@tabler/icons-react";

// types
import { ProfileWithoutSaves } from "@/types/SaveGameTypes";
import { ProfileTypesContext } from "@/types/ContexTypes";

const ListProfilePrimeRe: FC<ProfileTypesContext> = ({
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

	const profileListTemplate = (option: ProfileWithoutSaves): JSX.Element => {
		return (
			<div className="flex items-center gap-2">
				<div className="w-[40px]">
					{option.avatar ? (
						<Image
							src={option.avatar}
							alt="profile avatar select"
							radius="full"
							loading="lazy"
						/>
					) : (
						<IconUserCircle size={40} />
					)}
				</div>
				<div className="flex flex-col">
					<span className="text-small">{option.name}</span>
					<span className="text-tiny text-default-500">
						{option.savesCount} {player_profile.total_saves}
					</span>
				</div>
			</div>
		);
	};

	const selectedProfileTemplate = (): JSX.Element => {
		if (!selectedProfile)
			return <>{player_profile.input_select_profile.label}</>;

		return <>{selectedProfile.name}</>;
	};

	return (
		<Dropdown
			value={selectedProfile}
			onChange={(e) => onClickProfile(e.value.id)}
			options={listProfiles}
			loading={isProfilesLoading}
			disabled={listProfiles.length === 0}
			itemTemplate={profileListTemplate}
			valueTemplate={selectedProfileTemplate}
			optionLabel={player_profile.input_select_profile.label}
			placeholder={player_profile.input_select_profile.placeholder}
			className={classNames(
				"md:w-14rem w-full rounded-xl",
				selectedProfile ? "" : "border-2 border-red-500"
			)}
		/>
	);
};

export default ListProfilePrimeRe;
