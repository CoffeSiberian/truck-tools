import { useContext } from "react";
import { DarkModeContex } from "@/hooks/useDarkModeContex";
import { Button } from "@nextui-org/react";
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
					<h2 className="text-balance text-lg font-semibold tracking-wide text-white">
						Profiles not found
					</h2>
				</div>
				<div className="flex flex-col items-center gap-1">
					<p className="text-red-100">
						Remember to <b> disable Steam Cloud</b> from your profile or verify
						the location of your "Documents" folder
					</p>
					<div className="flex gap-5">
						<Button
							onPress={() => open("https://imgur.com/lVbgbgH")}
							size="sm"
							color="success"
							endContent={<IconHelp />}
						>
							<b>How to disable Steam Cloud</b>
						</Button>
						<Button
							onPress={() => open("https://youtu.be/e2aYdREZX4M")}
							size="sm"
							color="default"
							endContent={<IconBrandYoutube />}
						>
							<b>Tutorial video</b>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileError;
