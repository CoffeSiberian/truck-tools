import { useContext } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";

import ListProfilesDropdown from "@/components/ProfileMenu/Dropdown/ListProfilesDropdown";

/*
This component will remain for a while until the stability 
and functionality of the HeroUI dropdown are properly verified.

import ListProfilePrimeRe from "@/components/ProfileMenu/Dropdown/ListProfilePrimeRe";
*/

const ListProfiles = () => {
	const Contex = useContext(ProfileContex);

	return <ListProfilesDropdown {...Contex} />;
};

export default ListProfiles;
