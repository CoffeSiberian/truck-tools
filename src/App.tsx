import { useEffect, useContext } from "react";
import { DarkModeContex } from "./hooks/useDarkModeContex";
import Home from "./routes/pages/Home";
import UpdaterModal from "./components/UpdaterModal";
import SelectProfile from "./components/ProfileMenu/SelectProfile";

const App = () => {
	const { darkMode } = useContext(DarkModeContex);

	const defaultClassNames = "scrollbar bg-background text-foreground";
	const darkStyleSheets = [
		"/md-light-indigo/theme.css",
		"/md-dark-indigo/theme.css",
	];

	useEffect(() => {
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
		<div className="flex min-h-screen flex-col">
			<Home />
			<SelectProfile />
			<UpdaterModal />
		</div>
	);
};

export default App;
