import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";

// hooks
import { HeroUIProvider } from "@heroui/react";
import { PrimeReactProvider } from "primereact/api";
import { DarkMode } from "@/hooks/useDarkModeContex";
import { Locale } from "@/hooks/useLocaleContext";
import { ProfileContexInfo } from "@/hooks/useProfileContex";

import "@/styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<HeroUIProvider>
			<PrimeReactProvider>
				<DarkMode>
					<Locale>
						<ProfileContexInfo>
							<App />
						</ProfileContexInfo>
					</Locale>
				</DarkMode>
			</PrimeReactProvider>
		</HeroUIProvider>
	</React.StrictMode>
);
