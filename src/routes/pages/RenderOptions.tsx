import { JSX, useState, useContext } from "react";
import { LocaleContext } from "@/hooks/useLocaleContext";
import { DarkModeContex } from "@/hooks/useDarkModeContex";
import { open } from "@tauri-apps/plugin-shell";
import { Tabs, Tab, useDisclosure, Image, Button } from "@heroui/react";
import classNames from "classnames";

// components
import TrailersOptions from "@/routes/pages/TrailersOptions/TrailersOptions";
import TrucksOptions from "@/routes/pages/TrucksOptions/TrucksOptions";
import ProfilesOptions from "@/routes/pages/ProfilesOptions/ProfilesOptions";
import AboutModal from "@/components/Modals/AboutModal";
import SettingsModal from "@/components/Modals/SettingsModal";

// icons
import {
	IconTruck,
	IconUserCircle,
	IconSettings,
	IconPackages,
	IconPaw,
	IconBrandGithub,
} from "@tabler/icons-react";

// image
import kofi from "@/static/icons/kofi/kofi.webp";

type ItemId = "trailer" | "truck" | "profile" | "settings" | "about";

interface ItemsTypes {
	id: ItemId;
	label: string;
	jsx: JSX.Element;
	modal: boolean;
	icon: JSX.Element;
}

const RenderOptions = () => {
	const { translations } = useContext(LocaleContext);
	const { darkMode } = useContext(DarkModeContex);
	const [activeIndex, setActiveIndex] = useState<ItemId>("trailer");
	const { trailers, trucks, profile, settings, about } =
		translations.menu_options;

	const {
		isOpen: isOpenAbout,
		onOpen: onOpenAbout,
		onOpenChange: onOpenChangeAbout,
	} = useDisclosure();

	const {
		isOpen: isOpenSettings,
		onOpen: onOpenSettings,
		onOpenChange: onOpenChangeSettings,
	} = useDisclosure();

	const items: ItemsTypes[] = [
		{
			id: "trailer",
			label: trailers.tab_title,
			jsx: <TrailersOptions />,
			modal: false,
			icon: <IconPackages />,
		},
		{
			id: "truck",
			label: trucks.tab_title,
			jsx: <TrucksOptions />,
			modal: false,
			icon: <IconTruck />,
		},
		{
			id: "profile",
			label: profile.tab_title,
			jsx: <ProfilesOptions />,
			modal: false,
			icon: <IconUserCircle />,
		},
		{
			id: "settings",
			label: settings.tab_title,
			jsx: <></>,
			modal: true,
			icon: <IconSettings />,
		},
		{
			id: "about",
			label: about.tab_title,
			jsx: <></>,
			modal: true,
			icon: <IconPaw />,
		},
	];

	const setActiveIndexOptions = (index: ItemId) => {
		setActiveIndex(index);
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const renderCart = (
		id: string,
		name: string,
		icon: JSX.Element,
		disable: boolean
	): JSX.Element => {
		return (
			<Tab
				title={
					<div className="flex items-center space-x-2">
						{icon}
						<span>
							<b>{name}</b>
						</span>
					</div>
				}
				key={id}
				isDisabled={disable}
			/>
		);
	};

	return (
		<>
			<AboutModal isOpen={isOpenAbout} onOpenChange={onOpenChangeAbout} />
			<SettingsModal
				isOpen={isOpenSettings}
				onOpenChange={onOpenChangeSettings}
			/>
			<div className="mt-12 mb-28 flex flex-col items-center p-5">
				<div className="fixed top-2 z-20 flex items-center justify-center gap-5">
					<Image
						className={classNames(
							"cursor-pointer transition duration-100 ease-in hover:scale-110",
							"drop-shadow-lg"
						)}
						alt="KoFi Card link"
						width={120}
						src={kofi}
						onClick={() => open("https://ko-fi.com/siberiancoffe")}
					/>
					<Tabs
						onSelectionChange={(index) => {
							if (index === "about") onOpenAbout();
							else if (index === "settings") onOpenSettings();
							else setActiveIndexOptions(index as ItemId);
						}}
						selectedKey={activeIndex}
						size="lg"
						aria-label="options"
						variant="solid"
						color="primary"
					>
						{items.map((item) => {
							return renderCart(item.id, item.label, item.icon, false);
						})}
					</Tabs>
					<div className={classNames("z-20 cursor-pointer", "drop-shadow-lg")}>
						<Button
							className={classNames(
								darkMode ? "text-emerald-400" : "text-emerald-600",
								"font-extrabold"
							)}
							variant="faded"
							size="sm"
							startContent={<IconBrandGithub />}
							onPress={() =>
								open("https://github.com/CoffeSiberian/truck-tools")
							}
						>
							Star on GitHub ❤️
						</Button>
					</div>
				</div>
				{items.map((item, index) => {
					return (
						<div key={"cardOptionNumber" + index}>
							{activeIndex === item.id && item.jsx}
						</div>
					);
				})}
			</div>
		</>
	);
};

export default RenderOptions;
