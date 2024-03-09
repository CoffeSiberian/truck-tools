import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

const RoutesPage = () => {
    return (
        <Router>
            <Routes>
                <Route
                    path="/index.html"
                    element={
                        <>
                            <Home />
                        </>
                    }
                />
            </Routes>
        </Router>
    );
};

export default RoutesPage;
