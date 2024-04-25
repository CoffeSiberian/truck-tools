import { useState } from "react";
import { useDarkMode } from "../../hooks/useDarkModeContex";
import { Tabs, Tab } from "@nextui-org/react";

// components
import TrailersOptions from "./TrailersOptions/TrailersOptions";
import TrucksOptions from "./TrucksOptions/TrucksOptions";

// icons
import {
    IconTruck,
    IconUserCircle,
    IconSettings,
    IconPackages,
} from "@tabler/icons-react";

const RenderOptions = () => {
    const [activeIndex, setActiveIndex] = useState<string | null>(null);
    const { themeTatailwind } = useDarkMode();

    const styleBox = `flex flex-col ${themeTatailwind.secondary.main} place-self-center max-w-xs w-full rounded-lg border-2 border-transparent ${themeTatailwind.primary.border_color} shadow-2xl gap-1 mt-4 p-4`;

    const nexTime = <div className={styleBox}>Available soon</div>;

    const items = [
        { label: "Trailers", jsx: <TrailersOptions />, icon: <IconPackages /> },
        { label: "Truck", jsx: <TrucksOptions />, icon: <IconTruck /> },
        { label: "Profile", jsx: nexTime, icon: <IconUserCircle /> },
        { label: "Settings", jsx: nexTime, icon: <IconSettings /> },
    ];

    const renderCart = (
        name: string,
        icon: JSX.Element | null
    ): JSX.Element => {
        return (
            <Tab
                title={
                    <div className="flex items-center space-x-2">
                        {icon}
                        <span>{name}</span>
                    </div>
                }
                key={name}
            />
        );
    };

    return (
        <div className="flex flex-col items-center p-3">
            <Tabs
                onSelectionChange={(index) => {
                    setActiveIndex(index as string);
                }}
                selectedKey={activeIndex}
                size="lg"
                aria-label="options"
                variant="bordered"
            >
                {items.map((item) => {
                    return renderCart(item.label, item.icon);
                })}
            </Tabs>
            {items.map((item, index) => {
                return (
                    <div key={index}>
                        {activeIndex === item.label && item.jsx}
                    </div>
                );
            })}
        </div>
    );
};

export default RenderOptions;
