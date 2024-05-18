import { useProfileContex } from "../hooks/useProfileContex";
import { Select, SelectItem } from "@nextui-org/react";

const ListSaves = () => {
    const { selectedProfile, selectedSave, isSavesLoading, setSave } =
        useProfileContex();

    const onClickSave = (saveHex: string) => {
        selectedProfile?.saves.map((save) => {
            if (save.name === saveHex) {
                setSave(save);
            }
        });
    };

    return (
        <Select
            isDisabled={selectedProfile && !isSavesLoading ? false : true}
            errorMessage={selectedProfile ? undefined : "No profile selected"}
            isLoading={isSavesLoading}
            items={selectedProfile ? selectedProfile.saves : []}
            selectedKeys={selectedSave ? [selectedSave.name] : []}
            onChange={(e) => onClickSave(e.target.value)}
            label="Saves"
            placeholder="Select a save"
            labelPlacement="inside"
            variant="bordered"
            size="md"
        >
            {(save) => (
                <SelectItem key={save.name} textValue={save.name}>
                    {save.name}
                </SelectItem>
            )}
        </Select>
    );
};

export default ListSaves;
