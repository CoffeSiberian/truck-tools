import { useContext } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";

/* 
import ListSavesDropdown from "./Dropdown/ListSavesDropdown";

It will be temporarily disabled while the bug 
https://github.com/nextui-org/nextui/issues/3510 is being fixed.
*/

import ListSavePrimeRe from "@/components/ProfileMenu/Dropdown/ListSavePrimeRe";

const ListSaves = () => {
	const Contex = useContext(ProfileContex);

	return <ListSavePrimeRe {...Contex} />;
};

export default ListSaves;
