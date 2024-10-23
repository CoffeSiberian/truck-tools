import { useContext } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";
import { Card, CardBody, Chip, Button } from "@nextui-org/react";
import classNames from "classnames";
import ListProfiles from "@/components/ProfileMenu/ListProfiles";
import ListSaves from "@/components/ProfileMenu/ListSaves";
import RenderProfile from "@/components/ProfileMenu/RenderProfile";

// icons
import { IconReload, IconAlertTriangle } from "@tabler/icons-react";

const SelectProfile = () => {
	const { selectedSave, reloadProfiles } = useContext(ProfileContex);

	return (
		<div
			className={classNames(
				"fixed bottom-0 z-10 mb-2 mt-auto flex w-full flex-col items-center gap-1 transition-opacity hover:opacity-100",
				selectedSave ? "opacity-70" : "opacity-100"
			)}
		>
			{!selectedSave && (
				<Chip
					className="opacity-100"
					startContent={<IconAlertTriangle stroke={1.5} />}
					color="warning"
				>
					<b>First select your profile and save</b>
				</Chip>
			)}
			<Card className="flex w-full max-w-4xl">
				<CardBody className="flex flex-row content-between items-center p-1">
					<RenderProfile />
					<div className="flex w-full flex-nowrap items-center gap-2">
						<ListProfiles />
						<ListSaves />
						<Button onPress={() => reloadProfiles()} isIconOnly>
							<IconReload stroke={2} />
						</Button>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

export default SelectProfile;
