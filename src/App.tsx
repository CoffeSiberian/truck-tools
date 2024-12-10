import { useEffect, useContext, useRef } from "react";
import { DarkModeContex } from "@/hooks/useDarkModeContex";
import Home from "@/routes/pages/Home";
import Snowfall from "react-snowfall";
import UpdaterModal from "@/components/Modals/UpdaterModal";
import SelectProfile from "@/components/ProfileMenu/SelectProfile";

const App = () => {
	const { darkMode } = useContext(DarkModeContex);
	const isHolidaysMonth = useRef(false);

	const defaultClassNames = "scrollbar bg-background text-foreground";

	const isHolidaysMonths = (): boolean => {
		const month = new Date().getMonth();
		return month === 11 || month === 0;
	};

	useEffect(() => {
		const darkStyleSheets = [
			"/md-light-indigo/theme.css",
			"/md-dark-indigo/theme.css",
		];

		isHolidaysMonth.current = isHolidaysMonths();

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
			{isHolidaysMonth && (
				<Snowfall color={!darkMode ? "#99d5e6" : undefined} />
			)}
			<UpdaterModal />
		</div>
	);
};

export default App;
