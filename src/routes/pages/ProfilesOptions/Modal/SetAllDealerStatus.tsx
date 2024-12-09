import { useState, useContext } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";
import {
	Modal,
	ModalContent,
	ModalHeader,
	Divider,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	RadioGroup,
} from "@nextui-org/react";
import CustomRadio from "@/components/CustomRadio";
import { setProfileDealerDiscovered } from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";

// icons
import { IconPencil, IconDeviceFloppy } from "@tabler/icons-react";

// images
// ets2
import discovered from "@/static/img/ets2/dealers/discovered.webp";
import undiscovered from "@/static/img/ets2/dealers/undiscovered.webp";

// ats
import discovered_ats from "@/static/img/ats/dealers/discovered.webp";
import undiscovered_ats from "@/static/img/ats/dealers/undiscovered.webp";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const SetAllDealerStatus = () => {
	const { selectedSave, game } = useContext(ProfileContex);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [GarageStatus, setGarageStatus] = useState<string>("1");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const onClickApply = async () => {
		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}

		if (!selectedSave) return;

		setIsLoading(true);
		const res = await setProfileDealerDiscovered(
			selectedSave.dir,
			GarageStatus === "1" ? true : false
		);
		setCompleted({
			error: !res,
			completed: true,
		});
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
				hideCloseButton
				size="md"
				backdrop="blur"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				shouldBlockScroll={false}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Set all dealer status
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>Select the status of all the dealers in your profile</p>
								<RadioGroup
									className="items-center"
									value={GarageStatus}
									onValueChange={(value) => setGarageStatus(value)}
									orientation="horizontal"
									label="Visited cities"
								>
									<CustomRadio
										selectedGarage={GarageStatus}
										image={game === "ets2" ? discovered : discovered_ats}
										text="Discovered all dealers"
										value="1"
									/>
									<CustomRadio
										selectedGarage={GarageStatus}
										image={game === "ets2" ? undiscovered : undiscovered_ats}
										text="Undiscover all dealers"
										value="0"
									/>
								</RadioGroup>
								<AlertSave
									message={
										completed.error
											? "An error occurred in the process"
											: "Saved successfully"
									}
									error={completed.error}
									show={completed.completed}
									setShowFalse={() =>
										setCompleted({ error: completed.error, completed: false })
									}
								/>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
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

export default SetAllDealerStatus;
