import Home from "./routes/pages/Home";
import UpdaterModal from "./components/UpdaterModal";
import SelectProfile from "./components/SelectProfile";

const App = () => {
	return (
		<div className="flex min-h-screen flex-col">
			<Home />
			<SelectProfile />
			<UpdaterModal />
		</div>
	);
};

export default App;
