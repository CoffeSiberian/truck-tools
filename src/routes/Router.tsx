import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

const RoutesPage = () => {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
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
