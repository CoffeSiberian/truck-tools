import { useContext } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";
import { Card, CardBody, Chip } from "@nextui-org/react";
import classNames from "classnames";
import ProfileCardBody from "@/components/ProfileMenu/ProfileCardBody";

// icons
import { IconAlertTriangle } from "@tabler/icons-react";

const SelectProfile = () => {
	const { selectedSave } = useContext(ProfileContex);

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
					<ProfileCardBody />
				</CardBody>
			</Card>
		</div>
	);
};

export default SelectProfile;
