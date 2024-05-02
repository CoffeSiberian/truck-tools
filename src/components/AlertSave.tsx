import { FC } from "react";
import { Chip } from "@nextui-org/react";

// icons
import { IconDeviceFloppy, IconAlertTriangle } from "@tabler/icons-react";

interface props {
    message: string;
    error: boolean;
    show: boolean;
}

const AlertSave: FC<props> = ({ message, error, show }) => {
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
            color={error ? "danger" : "success"}
        >
            {message}
        </Chip>
    );
};

export default AlertSave;
