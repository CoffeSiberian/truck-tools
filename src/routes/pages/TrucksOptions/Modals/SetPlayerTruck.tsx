import { useState, useContext, useEffect } from "react";
import { open } from "@tauri-apps/plugin-shell";
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
import Warning from "@/components/Warning";

// icons
import {
	IconPencil,
	IconReplace,
	IconReload,
	IconBrandYoutube,
} from "@tabler/icons-react";

// types
import { SaveTrucks } from "@/types/fileEditTypes";

interface completedProps {
	error: boolean;
	completed: boolean;
}

interface ListTrucksState {
	trucks: SaveTrucks[];
	trucks_found: boolean;
	current_truck_id: string;
}

const SetPlayerTruck = () => {
	const { selectedSave } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { change_truck } = translations.menu_options.trucks;

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [loadingListTrucks, setLoadingListTrucks] = useState<boolean>(false);
	const [listTrucks, setListTrucks] = useState<ListTrucksState>({
		trucks: [],
		trucks_found: true,
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
			trucks_found: true,
			current_truck_id: "",
		});

		setLoadingListTrucks(true);
		const res = await getSaveGameTrucks(selectedSave.dir);
		if (res.res) {
			setListTrucks({
				trucks: res.trucks,
				trucks_found: true,
				current_truck_id: res.current_truck_id,
			});
		} else {
			setListTrucks({
				trucks: [],
				trucks_found: false,
				current_truck_id: "",
			});
		}
		setLoadingListTrucks(false);
	};

	useEffect(() => {
		if (isOpen && selectedSave) {
			setLoadingListTrucks(true);
			getSaveGameTrucks(selectedSave.dir).then((res) => {
				if (res.res) {
					setListTrucks({
						trucks: res.trucks,
						trucks_found: true,
						current_truck_id: res.current_truck_id,
					});
				} else {
					setListTrucks({
						trucks: [],
						trucks_found: false,
						current_truck_id: "",
					});
				}
				setLoadingListTrucks(false);
			});

			return;
		}

		if (!isOpen) {
			setSelectedTruck([]);
			setListTrucks({
				trucks: [],
				trucks_found: true,
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
				{change_truck.modal.btn_open}
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
								{change_truck.modal.title}
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>{change_truck.modal.description}</p>
								<div className="flex items-center gap-1">
									<Select
										className="w-full"
										selectedKeys={selectedTruck}
										onChange={(e) => setSelectedTruck([e.target.value])}
										isLoading={loadingListTrucks}
										isDisabled={listTrucks.trucks.length === 0}
										isInvalid={!listTrucks.trucks_found}
										label={change_truck.modal.select_label}
										errorMessage={change_truck.modal.select_error}
										placeholder={change_truck.modal.select_placeholder}
										size="md"
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
														<span className="text-tiny text-default-500">
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
								<Warning
									text={
										<div className="flex flex-col gap-2">
											<b>{change_truck.modal.warning_message.title}</b>
											<p>{change_truck.modal.warning_message.message}</p>
										</div>
									}
								/>
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={onClose} color="danger">
									{change_truck.modal.btn_close}
								</Button>
								<Button
									endContent={<IconBrandYoutube />}
									color="warning"
									variant="flat"
									onPress={() => open("https://youtu.be/drwZSHw8hw8")}
								>
									{change_truck.modal.btn_how_to_use}
								</Button>
								<Button
									endContent={<IconReplace />}
									color="success"
									isDisabled={selectedTruck.length === 0}
									isLoading={isLoading}
									onPress={setPlayerTruck}
								>
									{change_truck.modal.btn_apply}
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
