import { useState } from "react";
import { TabMenu } from "primereact/tabmenu";
import { MenuItem } from "primereact/menuitem";
import { Typography } from "@mui/material";
import { useDarkMode } from "renderer/hooks/DarkModeContex";

import TrailersOptions from "renderer/components/TrailersOptions";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import InventoryIcon from "@mui/icons-material/Inventory";
import SettingsIcon from "@mui/icons-material/Settings";

const RenderOptions = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const { themeTatailwind } = useDarkMode();

    const styleBox = `flex flex-col ${themeTatailwind.secondary.main} place-self-center max-w-xs w-full rounded-lg border-2 border-transparent ${themeTatailwind.primary.border_color} shadow-2xl gap-1 mt-4 p-4`;

    const nexTime = (
        <div className={styleBox}>
            <Typography
                className="flex justify-center"
                color={themeTatailwind.primary.color}
                variant="h6"
            >
                Available soon
            </Typography>
        </div>
    );

    const items: MenuItem[] = [
        { label: "Trailers", icon: <InventoryIcon className="mr-3" /> },
        { label: "Truck", icon: <LocalShippingIcon className="mr-3" /> },
        { label: "Profile", icon: <AssignmentIndIcon className="mr-3" /> },
        { label: "Settings", icon: <SettingsIcon className="mr-3" /> },
    ];

    return (
        <div className="flex flex-col p-3 card">
            <TabMenu
                model={items}
                className={`w-full gap-3`}
                activeIndex={activeIndex}
                onTabChange={(e) => setActiveIndex(e.index)}
            />
            {activeIndex === 0 && <TrailersOptions />}
            {activeIndex === 1 && nexTime}
            {activeIndex === 2 && nexTime}
            {activeIndex === 3 && nexTime}
        </div>
    );
};

export default RenderOptions;
