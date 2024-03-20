import Home from "./routes/pages/Home";
import SelectProfile from "./components/SelectProfile";

const App = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Home />
            <SelectProfile />
        </div>
    );
};

export default App;
