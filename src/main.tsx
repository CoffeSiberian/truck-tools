import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DarkMode } from "./hooks/useDarkModeContex";
import { NextUIProvider } from "@nextui-org/react";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <NextUIProvider>
            <DarkMode>
                <App />
            </DarkMode>
        </NextUIProvider>
    </React.StrictMode>
);
