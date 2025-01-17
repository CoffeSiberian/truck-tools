import { FC, useContext } from "react";
import { LocaleContext } from "@/hooks/useLocaleContext";
import { Select, SelectItem } from "@heroui/react";
import { ProfileTypesContext } from "@/types/ContexTypes";

const ListSavesDropdown: FC<ProfileTypesContext> = ({
	selectedProfile,
	selectedSave,
	isSavesLoading,
	setSave,
}) => {
	const { translations } = useContext(LocaleContext);
	const { player_profile } = translations.components;

	const onClickSave = (saveHex: string) => {
		selectedProfile?.saves.map((save) => {
			if (save.id === saveHex) {
				setSave(save);
			}
		});
	};

	return (
		<Select
			isDisabled={selectedProfile && !isSavesLoading ? false : true}
			errorMessage={
				selectedProfile ? undefined : player_profile.no_selected_profile
			}
			isLoading={isSavesLoading}
			isInvalid={selectedProfile ? (selectedSave ? false : true) : false}
			items={selectedProfile ? selectedProfile.saves : []}
			selectedKeys={selectedSave ? [selectedSave.id] : []}
			onChange={(e) => onClickSave(e.target.value)}
			label={player_profile.input_select_save.label}
			placeholder={player_profile.input_select_save.placeholder}
			labelPlacement="inside"
			variant="bordered"
			size="md"
		>
			{(save) => (
				<SelectItem key={save.id} textValue={save.name}>
					{save.name}
				</SelectItem>
			)}
		</Select>
	);
};

export default ListSavesDropdown;
