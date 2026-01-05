import { useContext, FC, JSX } from "react";

// Hooks
import { DarkModeContex } from "@/hooks/useDarkModeContex";

// Utils
import classNames from "classnames";

interface WarningProps {
	text: JSX.Element;
}

const Warning: FC<WarningProps> = ({ text }) => {
	const { darkMode } = useContext(DarkModeContex);

	return (
		<div
			className={classNames(
				"flex rounded-md border-l-4 pl-3",
				darkMode ? "border-l-yellow-300" : "border-l-yellow-500"
			)}
		>
			{text}
		</div>
	);
};

export default Warning;
