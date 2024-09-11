import { useContext } from "react";
import { ProfileContex } from "../../hooks/useProfileContex";

/* 
import SelectProfileObject from "./SelectProfileObject";

It will be temporarily disabled while the bug 
https://github.com/nextui-org/nextui/issues/3510 is being fixed.
*/

import ListProfilePrimeRe from "./Dropdown/ListProfilePrimeRe";

const ListProfiles = () => {
	const Contex = useContext(ProfileContex);

	return <ListProfilePrimeRe {...Contex} />;
};

export default ListProfiles;
