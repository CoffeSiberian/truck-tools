import { useProfileContex } from "../../hooks/useProfileContex";

/* 
import ListSavesDropdown from "./Dropdown/ListSavesDropdown";

It will be temporarily disabled while the bug 
https://github.com/nextui-org/nextui/issues/3510 is being fixed.
*/

import ListSavePrimeRe from "./Dropdown/ListSavePrimeRe";

const ListSaves = () => {
	const Contex = useProfileContex();

	return <ListSavePrimeRe {...Contex} />;
};

export default ListSaves;
