import { JSX, useState } from "react";
import { open } from "@tauri-apps/plugin-shell";
import { Tabs, Tab, useDisclosure, Image, Button } from "@nextui-org/react";
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

const RenderOptions = () => {
	const [activeIndex, setActiveIndex] = useState<string | null>(null);

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

	const items = [
		{
			label: "Trailers",
			jsx: <TrailersOptions />,
			modal: false,
			icon: <IconPackages />,
		},
		{
			label: "Truck",
			jsx: <TrucksOptions />,
			modal: false,
			icon: <IconTruck />,
		},
		{
			label: "Profile",
			jsx: <ProfilesOptions />,
			modal: false,
			icon: <IconUserCircle />,
		},
		{
			label: "Settings",
			jsx: <></>,
			modal: true,
			icon: <IconSettings />,
		},
		{ label: "About", jsx: <></>, modal: true, icon: <IconPaw /> },
	];

	const setActiveIndexOptions = (index: string) => {
		setActiveIndex(index);
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const renderCart = (
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
				key={name}
				isDisabled={disable}
			/>
		);
	};

	return (
		<div className="mb-28 mt-12 flex flex-col items-center p-5">
			<AboutModal isOpen={isOpenAbout} onOpenChange={onOpenChangeAbout} />

			<SettingsModal
				isOpen={isOpenSettings}
				onOpenChange={onOpenChangeSettings}
			/>

			<Image
				className={classNames(
					"fixed left-44 top-2 z-20 cursor-pointer",
					"transition duration-100 ease-in hover:scale-110",
					"drop-shadow-lg"
				)}
				alt="KoFi Card link"
				width={120}
				src={kofi}
				onClick={() => open("https://ko-fi.com/siberiancoffe")}
			/>
			<div
				className={classNames(
					"fixed right-32 top-4 z-20 cursor-pointer",
					"drop-shadow-lg"
				)}
			>
				<Button
					onPress={() => open("https://github.com/CoffeSiberian/truck-tools")}
					variant="bordered"
					startContent={<IconBrandGithub />}
					size="sm"
				>
					Star on GitHub ❤️
				</Button>
			</div>
			<Tabs
				className="fixed top-2 z-20 justify-center"
				onSelectionChange={(index) => {
					if (index === "About") onOpenAbout();
					else if (index === "Settings") onOpenSettings();
					else setActiveIndexOptions(index as string);
				}}
				selectedKey={activeIndex}
				size="lg"
				aria-label="options"
				variant="solid"
				color="primary"
			>
				{items.map((item) => {
					return renderCart(item.label, item.icon, false);
				})}
			</Tabs>
			{items.map((item, index) => {
				return (
					<div key={"cardOptionNumber" + index}>
						{activeIndex === item.label && item.jsx}
					</div>
				);
			})}
		</div>
	);
};

export default RenderOptions;
