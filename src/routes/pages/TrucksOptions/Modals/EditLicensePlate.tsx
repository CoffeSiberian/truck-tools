import { useState } from "react";
import { useColor } from "react-color-palette";
import { useProfileContex } from "../../../../hooks/useProfileContex";
import {
	Modal,
	ModalContent,
	ModalHeader,
	Divider,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
} from "@nextui-org/react";
import { setLicensePlateTruck } from "../../../../utils/fileEdit";
import CustomLicensePlate from "../../../../components/CustomLicensePlate";
import AlertSave from "../../../../components/AlertSave";

// icons
import { IconPencil, IconDeviceFloppy } from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const EditLicensePlate = () => {
	const { selectedSave } = useProfileContex();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [bgColor, setBGColor] = useColor("#bf2222");
	const [txColor, setTxColor] = useColor("#ffffff");
	const [plateText, setPlateText] = useState<string>(" T-TOOLS");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isColorMargin, setIsColorMargin] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const onClickApply = async () => {
		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}

		if (selectedSave) {
			setIsLoading(true);
			const res = await setLicensePlateTruck(
				selectedSave.dir,
				plateText,
				bgColor.hex,
				txColor.hex,
				isColorMargin
			);
			setCompleted({
				error: !res,
				completed: true,
			});
		}
		setIsLoading(false);
	};

	return (
		<>
			<Button
				endContent={<IconPencil stroke={2} />}
				onPress={onOpen}
				isDisabled={!selectedSave}
				color="primary"
				variant="shadow"
			>
				Open
			</Button>
			<Modal
				size="lg"
				hideCloseButton
				backdrop="blur"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Change truck license plate
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>
									Enter the new truck license plate. Remember to remove your
									license plate from Word of Trucks
								</p>
								<div className="flex flex-col items-center gap-2">
									<CustomLicensePlate
										txColor={txColor}
										bgColor={bgColor}
										plateText={plateText}
										isColorMargin={isColorMargin}
										setBGColor={setBGColor}
										setTxColor={setTxColor}
										setPlateText={setPlateText}
										setIsColorMargin={setIsColorMargin}
									/>
									<AlertSave
										message={
											completed.error
												? "An error occurred in the process"
												: "Saved successfully"
										}
										error={completed.error}
										show={completed.completed}
									/>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button
									isDisabled={isLoading}
									color="danger"
									variant="light"
									onPress={onClose}
								>
									Close
								</Button>
								<Button
									endContent={<IconDeviceFloppy />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									Apply
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default EditLicensePlate;
