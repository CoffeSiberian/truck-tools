import { useContext } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";
import { Button } from "@heroui/react";
import ListProfiles from "@/components/ProfileMenu/ListProfiles";
import ListSaves from "@/components/ProfileMenu/ListSaves";
import RenderProfile from "@/components/ProfileMenu/RenderProfile";

// icons
import { IconReload } from "@tabler/icons-react";

const ProfileCardBody = () => {
	const { reloadProfiles } = useContext(ProfileContex);

	return (
		<div className="flex flex-row items-center">
			<div className="w-full max-w-72">
				<RenderProfile />
			</div>
			<div className="flex w-full items-center gap-2">
				<ListProfiles />
				<ListSaves />
				<Button onPress={() => reloadProfiles()} isIconOnly>
					<IconReload stroke={2} />
				</Button>
			</div>
		</div>
	);
};

export default ProfileCardBody;
