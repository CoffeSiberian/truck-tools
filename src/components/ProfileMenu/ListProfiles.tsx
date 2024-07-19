import { useProfileContex } from "../../hooks/useProfileContex";
import SelectProfileObject from "./SelectProfileObject";

const ListProfiles = () => {
	const { listProfiles, selectedProfile, setProfile } = useProfileContex();

	return (
		<SelectProfileObject
			listProfiles={listProfiles}
			selectedProfile={selectedProfile}
			setProfile={setProfile}
		/>
	);
};

export default ListProfiles;
