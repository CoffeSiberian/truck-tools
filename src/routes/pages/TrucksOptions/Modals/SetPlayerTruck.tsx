import { useState, useContext, useEffect } from "react";
import { Select, SelectItem } from "@heroui/react";
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";
import {
	Modal,
	ModalContent,
	ModalHeader,
	Divider,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
} from "@heroui/react";
import {
	getSaveGameTrucks,
	setPlayerTruck as setPlayerTruckSave,
} from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";

// icons
import { IconPencil, IconReplace, IconReload } from "@tabler/icons-react";

// types
import { SaveTrucks } from "@/types/fileEditTypes";

interface completedProps {
	error: boolean;
	completed: boolean;
}

interface ListTrucksState {
	trucks: SaveTrucks[];
	current_truck_id: string;
}

const SetPlayerTruck = () => {
	const { selectedSave } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [listTrucks, setListTrucks] = useState<ListTrucksState>({
		trucks: [],
		current_truck_id: "",
	});
	const [selectedTruck, setSelectedTruck] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const setPlayerTruck = async () => {
		if (selectedTruck.length === 0 || !selectedSave) return;

		setIsLoading(true);
		const res = await setPlayerTruckSave(
			selectedSave.dir,
			listTrucks.current_truck_id,
			selectedTruck[0]
		);

		if (res) {
			setCompleted({ error: false, completed: true });
			setSelectedTruck([]);
		} else {
			setCompleted({ error: true, completed: true });
		}

		setIsLoading(false);
	};

	const reloadListTrucks = async () => {
		if (!selectedSave) return;

		setSelectedTruck([]);
		setListTrucks({
			trucks: [],
			current_truck_id: "",
		});
		const res = await getSaveGameTrucks(selectedSave.dir);
		if (res) {
			setListTrucks({
				trucks: res.trucks,
				current_truck_id: res.current_truck_id,
			});
		} else {
			setCompleted({ error: true, completed: true });
		}
	};

	useEffect(() => {
		if (isOpen && selectedSave) {
			getSaveGameTrucks(selectedSave.dir).then((res) => {
				if (res) {
					setListTrucks({
						trucks: res.trucks,
						current_truck_id: res.current_truck_id,
					});
				} else {
					setCompleted({ error: true, completed: true });
				}
			});

			return;
		}

		if (!isOpen) {
			setSelectedTruck([]);
			setListTrucks({
				trucks: [],
				current_truck_id: "",
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

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
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Change Truck in road
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>Change your truck without going to the garage</p>
								<div className="flex items-center gap-1">
									<Select
										className="w-full"
										label="Select truck"
										selectedKeys={selectedTruck}
										onChange={(e) => setSelectedTruck([e.target.value])}
										isLoading={listTrucks.trucks.length === 0}
										isDisabled={listTrucks.trucks.length === 0}
										placeholder="Select truck"
									>
										{listTrucks.trucks.map((item) => (
											<SelectItem
												key={item.truck_id}
												textValue={`${item.truck_number + 1} - ${item.brand_name}`}
											>
												<div className="flex items-center gap-2">
													<div className="flex flex-col">
														<span className="text-small">
															<b>{item.truck_number + 1}</b> - {item.brand_name}
														</span>
														<span className="text-tiny text-default-400">
															{item.truck_id}
														</span>
													</div>
												</div>
											</SelectItem>
										))}
									</Select>
									<Button isIconOnly color="primary" onPress={reloadListTrucks}>
										<IconReload />
									</Button>
								</div>
								<AlertSave
									message={
										completed.error
											? translations.components.alert_on_save_default.error
											: translations.components.alert_on_save_default.succes
									}
									error={completed.error}
									show={completed.completed}
									setShowFalse={() =>
										setCompleted({ error: completed.error, completed: false })
									}
								/>
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={onClose} color="danger">
									Close
								</Button>
								<Button
									endContent={<IconReplace />}
									color="success"
									isDisabled={selectedTruck.length === 0}
									isLoading={isLoading}
									onPress={setPlayerTruck}
								>
									Change
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default SetPlayerTruck;
