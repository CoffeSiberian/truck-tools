import { useContext } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";
import { Card, CardBody, Tabs, Tab } from "@nextui-org/react";
import classNames from "classnames";
import ProfileCardBody from "@/components/ProfileMenu/ProfileCardBody";
import ProfileError from "@/components/ProfileMenu/ProfileError";

// types
import { GamesNames } from "@/types/ContexTypes";

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
		<div className="fixed bottom-0 z-10 mb-2 mt-auto flex w-full justify-center gap-2">
			<div
				className={classNames(
					"transition-opacity hover:opacity-100",
					selectedSave ? "opacity-70" : "opacity-100"
				)}
			>
				<Tabs
					onSelectionChange={(index) => setGame(index as GamesNames)}
					selectedKey={game}
					size="lg"
					aria-label="options"
					variant="solid"
					isVertical
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
					"flex w-full max-w-4xl items-center gap-1 transition-opacity hover:opacity-100",
					selectedSave ? "opacity-70" : "opacity-100"
				)}
			>
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
