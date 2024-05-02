import { useProfileContex } from "../hooks/useProfileContex";
import { Select, SelectItem } from "@nextui-org/react";

const ListSaves = () => {
    const { selectedProfile, selectedSave, setSave } = useProfileContex();

    const onClickSave = (saveHex: string) => {
        selectedProfile?.saves.map((save) => {
            if (save.name === saveHex) {
                setSave(save);
            }
        });
    };

    return (
        <div className="flex flex-col w-full items-center">
            <Select
                isDisabled={selectedProfile ? false : true}
                errorMessage={
                    selectedProfile ? undefined : "No profile selected"
                }
                items={selectedProfile ? selectedProfile.saves : []}
                selectedKeys={selectedSave ? [selectedSave.name] : []}
                onChange={(e) => onClickSave(e.target.value)}
                label="Saves"
                placeholder="Select a save"
                labelPlacement="inside"
                className="max-w-xs"
                variant="flat"
                size="md"
            >
                {(save) => (
                    <SelectItem key={save.name} textValue={save.name}>
                        {save.name}
                    </SelectItem>
                )}
            </Select>
        </div>
    );
};

export default ListSaves;
