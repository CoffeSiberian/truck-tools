import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DarkMode } from "./hooks/useDarkModeContex";
import { ProfileContexInfo } from "./hooks/useProfileContex";
import { NextUIProvider } from "@nextui-org/react";
import "./styles.css";

import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/md-dark-indigo/theme.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<NextUIProvider>
			<PrimeReactProvider>
				<DarkMode>
					<ProfileContexInfo>
						<App />
					</ProfileContexInfo>
				</DarkMode>
			</PrimeReactProvider>
		</NextUIProvider>
	</React.StrictMode>
);
