import { FC } from "react";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { ProfileTypesContext } from "../../../types/ContexTypes";

//types
import { SaveGame } from "../../../types/SaveGameTypes";

const ListSavePrimeRe: FC<ProfileTypesContext> = ({
	selectedProfile,
	selectedSave,
	isSavesLoading,
	setSave,
}) => {
	const onClickSave = (saveId: string) => {
		selectedProfile?.saves.map((save) => {
			if (save.id === saveId) {
				setSave(save);
			}
		});
	};

	const saveListTemplate = (option: SaveGame): JSX.Element => {
		return (
			<div className="flex items-center gap-2">
				<span className="text-small">{option.name}</span>
			</div>
		);
	};

	const selectedSaveTemplate = (): JSX.Element => {
		if (!selectedSave) return <>Select save</>;

		return <>{selectedSave.name}</>;
	};

	const isInvalidad = selectedProfile ? (selectedSave ? false : true) : false;
	return (
		<>
			<Dropdown
				value={selectedSave && selectedSave.id}
				onChange={(e) => onClickSave(e.value.id)}
				options={selectedProfile?.saves}
				loading={isSavesLoading}
				disabled={selectedProfile && !isSavesLoading ? false : true}
				itemTemplate={saveListTemplate}
				valueTemplate={selectedSaveTemplate}
				optionLabel="Saves"
				placeholder="Select a save"
				className={classNames(
					"md:w-14rem w-full rounded-xl",
					!isInvalidad ? "" : "border-2 border-red-500"
				)}
			/>
		</>
	);
};

export default ListSavePrimeRe;
