import { useEffect } from "react";
import { useDarkMode } from "./hooks/useDarkModeContex";
import Home from "./routes/pages/Home";
import UpdaterModal from "./components/UpdaterModal";
import SelectProfile from "./components/ProfileMenu/SelectProfile";

const App = () => {
	const { darkMode } = useDarkMode();
	const defaultClassNames = "scrollbar bg-background text-foreground";

	useEffect(() => {
		console.log(darkMode);
		document.body.className = darkMode
			? `${defaultClassNames} dark`
			: `${defaultClassNames} light`;
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
