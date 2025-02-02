import { useEffect, useContext } from "react";
import { DarkModeContex } from "@/hooks/useDarkModeContex";
import Home from "@/routes/pages/Home";
import UpdaterModal from "@/components/Modals/UpdaterModal";
import SelectProfile from "@/components/ProfileMenu/SelectProfile";

/*
import Snowfall from "react-snowfall";

const isHolidaysMonths = (): boolean => {
	const month = new Date().getMonth();
	return month === 11 || month === 0;
};

{isHolidaysMonth.current && (
	<Snowfall
		snowflakeCount={80}
		color={!darkMode ? "#99d5e6" : undefined}
	/>
)}
*/

const defaultClassNames = "scrollbar bg-background text-foreground";

const App = () => {
	const { darkMode } = useContext(DarkModeContex);

	useEffect(() => {
		const darkStyleSheets = [
			"/md-light-indigo/theme.css",
			"/md-dark-indigo/theme.css",
		];

		document.body.className = darkMode
			? `${defaultClassNames} dark`
			: `${defaultClassNames} light`;

		const themeCss = darkMode ? darkStyleSheets[1] : darkStyleSheets[0];

		const link = document.createElement("link");
		link.rel = "stylesheet";

		link.href = themeCss;

		document.head.appendChild(link);
		return () => {
			document.head.removeChild(link);
		};
	}, [darkMode]);

	return (
		<div className="relative flex flex-col">
			<Home />
			<SelectProfile />
			<UpdaterModal />
		</div>
	);
};

export default App;
