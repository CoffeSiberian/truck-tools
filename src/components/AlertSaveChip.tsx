import { FC } from "react";

// UI
import { Chip } from "@heroui/chip";

// icons
import { IconDeviceFloppy, IconAlertTriangle } from "@tabler/icons-react";

interface props {
	message: string;
	error: boolean;
	show: boolean;
}

const AlertSaveChip: FC<props> = ({ message, error, show }) => {
	return (
		<Chip
			className={show ? "" : "hidden"}
			startContent={
				error ? (
					<IconAlertTriangle stroke={1.5} />
				) : (
					<IconDeviceFloppy stroke={1.5} />
				)
			}
			variant="faded"
			color={error ? "warning" : "success"}
		>
			{message}
		</Chip>
	);
};

export default AlertSaveChip;
