import { FC } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { ProfileTypesContext } from "../../../types/ContexTypes";

const ListSavesDropdown: FC<ProfileTypesContext> = ({
	selectedProfile,
	selectedSave,
	isSavesLoading,
	setSave,
}) => {
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
			errorMessage={selectedProfile ? undefined : "No profile selected"}
			isLoading={isSavesLoading}
			isInvalid={selectedProfile ? (selectedSave ? false : true) : false}
			items={selectedProfile ? selectedProfile.saves : []}
			selectedKeys={selectedSave ? [selectedSave.id] : []}
			onChange={(e) => onClickSave(e.target.value)}
			label="Saves"
			placeholder="Select a save"
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
