import { useContext } from "react";
import { DarkModeContex } from "@/hooks/useDarkModeContex";
import { LocaleContext } from "@/hooks/useLocaleContext";
import { Button } from "@heroui/react";
import { open } from "@tauri-apps/plugin-shell";
import classNames from "classnames";

// icons
import {
	IconAlertTriangle,
	IconHelp,
	IconBrandYoutube,
} from "@tabler/icons-react";

const ProfileError = () => {
	const { darkMode } = useContext(DarkModeContex);
	const { translations } = useContext(LocaleContext);
	const { profile_error } = translations.components;

	return (
		<div
			className={classNames(
				"fixed bottom-[105px] max-w-3xl rounded-3xl shadow-lg",
				darkMode ? "bg-[#c81260]" : "bg-[#f51260]"
			)}
		>
			<div className="flex flex-row items-center p-4">
				<div className="mr-2 flex items-center">
					<IconAlertTriangle
						className="mr-3 h-8 w-8 flex-shrink-0 text-white"
						size={32}
						stroke={2}
					/>
					<h2 className="text-lg font-semibold tracking-wide text-balance text-white">
						{profile_error.title}
					</h2>
				</div>
				<div className="flex flex-col items-center gap-1">
					<p
						className="text-red-100"
						dangerouslySetInnerHTML={{
							__html: profile_error.description,
						}}
					/>
					<div className="flex gap-5">
						<Button
							onPress={() => open("https://imgur.com/lVbgbgH")}
							size="sm"
							color="success"
							endContent={<IconHelp />}
						>
							<b>{profile_error.btn_how_to_disable}</b>
						</Button>
						<Button
							onPress={() => open("https://youtu.be/e2aYdREZX4M")}
							size="sm"
							color="default"
							endContent={<IconBrandYoutube />}
						>
							<b>{profile_error.btn_how_to}</b>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileError;
