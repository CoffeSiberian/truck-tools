import { useContext } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";

import ListSavesDropdown from "@/components/ProfileMenu/Dropdown/ListSavesDropdown";

/*
This component will remain for a while until the stability 
and functionality of the HeroUI dropdown are properly verified.

import ListSavePrimeRe from "@/components/ProfileMenu/Dropdown/ListSavePrimeRe";
*/

const ListSaves = () => {
	const Contex = useContext(ProfileContex);

	return <ListSavesDropdown {...Contex} />;
};

export default ListSaves;
