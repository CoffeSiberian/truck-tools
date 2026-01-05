import { useEffect, useContext } from "react";
import Home from "@/routes/pages/Home";

// UI
import UpdaterModal from "@/components/Modals/UpdaterModal";
import SelectProfile from "@/components/ProfileMenu/SelectProfile";

// Hooks
import { DarkModeContex } from "@/hooks/useDarkModeContex";

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
		document.body.className = darkMode
			? `${defaultClassNames} dark`
			: `${defaultClassNames} light`;
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
