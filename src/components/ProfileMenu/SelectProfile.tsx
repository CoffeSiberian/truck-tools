import { JSX, useContext } from "react";

// UI
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";

// Hooks
import { ProfileContex } from "@/hooks/useProfileContex";
import { DarkModeContex } from "@/hooks/useDarkModeContex";
import ProfileCardBody from "@/components/ProfileMenu/ProfileCardBody";
import ProfileError from "@/components/ProfileMenu/ProfileError";

// Utils
import classNames from "classnames";

// Types
import { GamesNames } from "@/types/ContexTypes";

// Images
import ets2 from "@/static/icons/games/ets2.webp";
import ats from "@/static/icons/games/ats.webp";

const SelectProfile = () => {
	const { selectedSave, profilesNotFound, game, setGame } =
		useContext(ProfileContex);
	const { opasityStatus } = useContext(DarkModeContex);

	const setGameAndScroll = (game: GamesNames) => {
		setGame(game);
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

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
		<div className="fixed bottom-0 z-10 mt-auto mb-2 flex w-full justify-center gap-2">
			{profilesNotFound && <ProfileError />}
			<div
				className={classNames(
					"transition-opacity hover:opacity-100",
					selectedSave && opasityStatus ? "opacity-70" : "opacity-100"
				)}
			>
				<Tabs
					onSelectionChange={(index) => setGameAndScroll(index as GamesNames)}
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
					selectedSave && opasityStatus ? "opacity-70" : "opacity-100"
				)}
			>
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
