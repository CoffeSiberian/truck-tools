import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";

// UI
import { HeroUIProvider } from "@heroui/system";

// Hooks
import { DarkMode } from "@/hooks/useDarkModeContex";
import { Locale } from "@/hooks/useLocaleContext";
import { ProfileContexInfo } from "@/hooks/useProfileContex";

import "@/styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<HeroUIProvider>
			<DarkMode>
				<Locale>
					<ProfileContexInfo>
						<App />
					</ProfileContexInfo>
				</Locale>
			</DarkMode>
		</HeroUIProvider>
	</React.StrictMode>
);
