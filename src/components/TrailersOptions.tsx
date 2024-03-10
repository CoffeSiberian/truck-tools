import { useDarkMode } from "../hooks/useDarkModeContex";

const TrailersOptions = () => {
    const { themeTatailwind } = useDarkMode();

    const styleBox = `flex flex-col ${themeTatailwind.secondary.main} place-self-center max-w-xs w-full rounded-lg border-2 border-transparent ${themeTatailwind.primary.border_color} shadow-2xl gap-1 mt-4 p-4`;

    const render1 = <div className={styleBox}>Change cargo trailer weight</div>;

    const render2 = <div className={styleBox}>Change trailer weight</div>;

    const render3 = <div className={styleBox}>Unlock country lock</div>;

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
