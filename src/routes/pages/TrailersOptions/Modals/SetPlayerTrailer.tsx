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
	getSaveGameTrailers,
	setPlayerTrailer as setPlayerTrailerSave,
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
import { SaveTrailers } from "@/types/fileEditTypes";

interface completedProps {
	error: boolean;
	completed: boolean;
}

interface ListTrailerState {
	trailers: SaveTrailers[];
	trailers_found: boolean;
	current_trailer_id: string | null;
}

const SetPlayerTrailer = () => {
	const { selectedSave } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { change_trailer } = translations.menu_options.trailers;

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [loadingListTrailers, setLoadingListTrailers] =
		useState<boolean>(false);
	const [listTrailers, setListTrailers] = useState<ListTrailerState>({
		trailers: [],
		trailers_found: true,
		current_trailer_id: "",
	});
	const [selectedTrailer, setSelectedTrailer] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const setPlayerTrailer = async () => {
		if (selectedTrailer.length === 0 || !selectedSave) return;

		setIsLoading(true);
		const res = await setPlayerTrailerSave(
			selectedSave.dir,
			listTrailers.current_trailer_id,
			selectedTrailer[0]
		);

		if (res) {
			setCompleted({ error: false, completed: true });
			setSelectedTrailer([]);
		} else {
			setCompleted({ error: true, completed: true });
		}

		setIsLoading(false);
	};

	const reloadListTrailers = async () => {
		if (!selectedSave) return;

		setSelectedTrailer([]);
		setListTrailers({
			trailers: [],
			trailers_found: true,
			current_trailer_id: "",
		});

		setLoadingListTrailers(true);
		const res = await getSaveGameTrailers(selectedSave.dir);
		if (res.res) {
			setListTrailers({
				trailers: res.trailers,
				trailers_found: true,
				current_trailer_id: res.current_trailer_id,
			});
		} else {
			setListTrailers({
				trailers: [],
				trailers_found: false,
				current_trailer_id: "",
			});
		}
		setLoadingListTrailers(false);
	};

	useEffect(() => {
		if (isOpen && selectedSave) {
			setLoadingListTrailers(true);
			getSaveGameTrailers(selectedSave.dir).then((res) => {
				if (res.res) {
					setListTrailers({
						trailers: res.trailers,
						trailers_found: true,
						current_trailer_id: res.current_trailer_id,
					});
				} else {
					setListTrailers({
						trailers: [],
						trailers_found: false,
						current_trailer_id: "",
					});
				}
				setLoadingListTrailers(false);
			});

			return;
		}

		if (!isOpen) {
			setSelectedTrailer([]);
			setListTrailers({
				trailers: [],
				trailers_found: true,
				current_trailer_id: "",
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
				{change_trailer.modal.btn_open}
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
								{change_trailer.modal.title}
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>{change_trailer.modal.description}</p>
								<div className="flex items-center gap-1">
									<Select
										className="w-full"
										selectedKeys={selectedTrailer}
										onChange={(e) => setSelectedTrailer([e.target.value])}
										isLoading={loadingListTrailers}
										isDisabled={listTrailers.trailers.length === 0}
										isInvalid={!listTrailers.trailers_found}
										label={change_trailer.modal.select_label}
										errorMessage={change_trailer.modal.select_error}
										placeholder={change_trailer.modal.select_placeholder}
										size="md"
									>
										{listTrailers.trailers.map((item) => (
											<SelectItem
												key={item.trailer_id}
												textValue={`${item.trailer_number + 1} - ${item.brand_name}`}
											>
												<div className="flex items-center gap-2">
													<div className="flex flex-col">
														<span className="text-small">
															<b>{item.trailer_number + 1}</b> -{" "}
															{item.brand_name}
														</span>
														<span className="text-tiny text-default-500">
															{item.trailer_id}
														</span>
													</div>
												</div>
											</SelectItem>
										))}
									</Select>
									<Button
										isIconOnly
										color="primary"
										onPress={reloadListTrailers}
									>
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
											<b>{change_trailer.modal.warning_message.title}</b>
											<p>{change_trailer.modal.warning_message.message}</p>
										</div>
									}
								/>
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={onClose} color="danger">
									{change_trailer.modal.btn_close}
								</Button>
								<Button
									endContent={<IconBrandYoutube />}
									color="warning"
									variant="flat"
									onPress={() => open("https://youtu.be/y_XB8vSacSA")}
								>
									{change_trailer.modal.btn_how_to_use}
								</Button>
								<Button
									endContent={<IconReplace />}
									color="success"
									isDisabled={selectedTrailer.length === 0}
									isLoading={isLoading}
									onPress={setPlayerTrailer}
								>
									{change_trailer.modal.btn_apply}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default SetPlayerTrailer;
