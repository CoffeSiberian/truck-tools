import { Typography } from "@mui/material";
import { Divider } from "primereact/divider";
import { useDarkMode } from "../hooks/DarkModeContex";
import { Button } from "primereact/button";
import ScaleIcon from "@mui/icons-material/Scale";

const TrailersOptions = () => {
    const { themeTatailwind } = useDarkMode();

    const styleBox = `flex flex-col ${themeTatailwind.secondary.main} place-self-center max-w-xs w-full rounded-lg border-2 border-transparent ${themeTatailwind.primary.border_color} shadow-2xl gap-1 mt-4 p-4`;

    const render1 = (
        <div className={styleBox}>
            <Typography
                className="flex justify-center"
                color={themeTatailwind.primary.color}
            >
                <ScaleIcon />
            </Typography>
            <Typography
                className="flex justify-center"
                color={themeTatailwind.primary.color}
                variant="h6"
            >
                Change cargo trailer weight
            </Typography>
            <Divider />
            <div className="flex justify-center">
                <Button label=" Open" severity="secondary" outlined />
            </div>
        </div>
    );

    const render2 = (
        <div className={styleBox}>
            <Typography
                className="flex justify-center"
                color={themeTatailwind.primary.color}
            >
                <ScaleIcon />
            </Typography>
            <Typography
                className="flex justify-center"
                color={themeTatailwind.primary.color}
                variant="h6"
            >
                Change trailer weight
            </Typography>
            <Divider />
            <div className="flex justify-center">
                <Button label=" Open" severity="secondary" outlined />
            </div>
        </div>
    );

    const render3 = (
        <div className={styleBox}>
            <Typography
                className="flex justify-center"
                color={themeTatailwind.primary.color}
            >
                <ScaleIcon />
            </Typography>
            <Typography
                className="flex justify-center"
                color={themeTatailwind.primary.color}
                variant="h6"
            >
                Unlock country lock
            </Typography>
            <Divider />
            <div className="flex justify-center">
                <Button label=" Open" severity="secondary" outlined />
            </div>
        </div>
    );

    return (
        <>
            <div className="grid grid-cols-3">
                {render1}
                {render2}
                {render3}
            </div>
        </>
    );
};

export default TrailersOptions;
