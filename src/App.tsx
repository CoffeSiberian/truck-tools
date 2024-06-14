import Home from "./routes/pages/Home";
import SelectProfile from "./components/SelectProfile";

const App = () => {
	return (
		<div className="flex min-h-screen flex-col">
			<Home />
			<SelectProfile />
		</div>
	);
};

export default App;
