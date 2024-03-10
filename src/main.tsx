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
                <main className="dark text-foreground bg-background min-h-screen">
                    <App />
                </main>
            </DarkMode>
        </NextUIProvider>
    </React.StrictMode>
);
