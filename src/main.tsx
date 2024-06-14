import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DarkMode } from "./hooks/useDarkModeContex";
import { ProfileContexInfo } from "./hooks/useProfileContex";
import { NextUIProvider } from "@nextui-org/react";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<NextUIProvider>
			<DarkMode>
				<ProfileContexInfo>
					<App />
				</ProfileContexInfo>
			</DarkMode>
		</NextUIProvider>
	</React.StrictMode>
);
