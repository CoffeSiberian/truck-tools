import { FC, useEffect } from "react";
import classNames from "classnames";
import { Alert } from "@nextui-org/react";

interface props {
	message: string;
	error: boolean;
	show: boolean;
	setShowFalse: () => void;
}

const AlertSave: FC<props> = ({ message, error, show, setShowFalse }) => {
	useEffect(() => {
		if (show) {
			const timer = setTimeout(() => {
				setShowFalse();
			}, 2300);
			return () => clearTimeout(timer);
		}
	}, [setShowFalse, show]);

	return (
		<div
			className={classNames(
				"fixed right-8 top-10 w-full max-w-80",
				"transition-opacity duration-700",
				show ? "opacity-100" : "opacity-0"
			)}
		>
			<Alert
				color={error ? "danger" : "success"}
				description={message}
				isVisible={true}
				title={error ? "Error" : "Success"}
			/>
		</div>
	);
};

export default AlertSave;
