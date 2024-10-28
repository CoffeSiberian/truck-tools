import { useContext } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";
import { Card, CardBody, Chip, Tabs, Tab } from "@nextui-org/react";
import classNames from "classnames";
import ProfileCardBody from "@/components/ProfileMenu/ProfileCardBody";
import ProfileError from "@/components/ProfileMenu/ProfileError";

// types
import { GamesNames } from "@/types/ContexTypes";

// icons
import { IconAlertTriangle } from "@tabler/icons-react";

// images
import ets2 from "@/static/icons/games/ets2.webp";
import ats from "@/static/icons/games/ats.webp";

const SelectProfile = () => {
	const { selectedSave, profilesNotFound, game, setGame } =
		useContext(ProfileContex);

	const renderCart = (
		key: string,
		name: string,
		icon: JSX.Element
	): JSX.Element => {
		return (
			<Tab
				key={key}
				title={
					<div className="flex items-center space-x-1">
						{icon}
						<span>
							<b>{name}</b>
						</span>
					</div>
				}
			/>
		);
	};

	return (
		<div className="fixed bottom-0 z-10 mb-2 mt-auto flex w-full justify-center">
			<div className="mr-2 flex flex-col justify-end gap-2">
				<Tabs
					onSelectionChange={(index) => setGame(index as GamesNames)}
					selectedKey={game}
					size="lg"
					aria-label="options"
					variant="solid"
					color="warning"
				>
					{renderCart(
						"ets2",
						"ETS 2",
						<img src={ets2} className="w-6" alt="ets2" />
					)}
					{renderCart(
						"ats",
						"ATS",
						<img src={ats} className="w-6" alt="ats" />
					)}
				</Tabs>
			</div>
			<div
				className={classNames(
					"flex w-full max-w-4xl flex-col items-center gap-1 transition-opacity hover:opacity-100",
					selectedSave ? "opacity-70" : "opacity-100"
				)}
			>
				{!selectedSave && !profilesNotFound && (
					<Chip
						className="opacity-100"
						startContent={<IconAlertTriangle stroke={1.5} />}
						color="warning"
					>
						<b>First select your profile and save</b>
					</Chip>
				)}
				{profilesNotFound && <ProfileError />}
				<Card className="flex w-full">
					<CardBody className="px-4 py-2">
						<ProfileCardBody />
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default SelectProfile;
