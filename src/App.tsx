import { useEffect } from "react";
import { useDarkMode } from "./hooks/useDarkModeContex";
import Home from "./routes/pages/Home";
import UpdaterModal from "./components/UpdaterModal";
import SelectProfile from "./components/ProfileMenu/SelectProfile";

const App = () => {
	const { darkMode } = useDarkMode();
	const defaultClassNames = "scrollbar bg-background text-foreground";

	useEffect(() => {
		document.body.className = darkMode
			? `${defaultClassNames} dark`
			: `${defaultClassNames} light`;

		if (darkMode) {
			import("primereact/resources/themes/md-dark-indigo/theme.css");
		} else {
			import("primereact/resources/themes/md-light-indigo/theme.css");
		}
	}, [darkMode]);

	return (
		<div className="flex min-h-screen flex-col">
			<Home />
			<SelectProfile />
			<UpdaterModal />
		</div>
	);
};

export default App;
