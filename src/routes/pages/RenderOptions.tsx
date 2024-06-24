import { useState } from "react";
import { useDarkMode } from "../../hooks/useDarkModeContex";
import { Tabs, Tab, useDisclosure } from "@nextui-org/react";

// components
import TrailersOptions from "./TrailersOptions/TrailersOptions";
import TrucksOptions from "./TrucksOptions/TrucksOptions";
import ProfilesOptions from "./ProfilesOptions/ProfilesOptions";
import AboutModal from "../../components/AboutModal";

// icons
import {
	IconTruck,
	IconUserCircle,
	IconSettings,
	IconPackages,
	IconPaw,
} from "@tabler/icons-react";

const RenderOptions = () => {
	const [activeIndex, setActiveIndex] = useState<string | null>(null);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const { themeTatailwind } = useDarkMode();

	const styleBox = `flex flex-col ${themeTatailwind.secondary.main} place-self-center max-w-xs w-full rounded-lg border-2 border-transparent ${themeTatailwind.primary.border_color} shadow-2xl gap-1 mt-4 p-4`;

	const nexTime = <div className={styleBox}>Available soon</div>;

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
			jsx: nexTime,
			modal: false,
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
		<div className="mb-28 mt-12 flex flex-col items-center p-3">
			<AboutModal isOpen={isOpen} onOpenChange={onOpenChange} />
			<Tabs
				className="fixed top-2 z-20 w-full justify-center"
				onSelectionChange={(index) => {
					if (index === "About") onOpen();
					else setActiveIndexOptions(index as string);
				}}
				selectedKey={activeIndex}
				size="lg"
				aria-label="options"
				variant="solid"
				color="primary"
			>
				{items.map((item, index) => {
					return renderCart(
						item.label,
						item.icon,
						!item.modal ? index > 2 : !item.modal
					);
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
