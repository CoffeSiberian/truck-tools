import { useState, useContext } from "react";

// UI
import { useDisclosure } from "@heroui/use-disclosure";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Select, SelectItem } from "@heroui/select";
import { Divider } from "@heroui/divider";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@heroui/modal";
import AlertSave from "@/components/AlertSave";
import Warning from "@/components/Warning";

// Hooks
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";

// Utils
import {
	setTruckTransmission,
	get_brand_models_ets2,
	get_brand_models_ats,
	setRemoveTruckBadge,
} from "@/utils/fileEdit";
import { BRANDS_ETS2, BRANDS_ATS } from "@/utils/Brands";

// Icons
import {
	IconPencil,
	IconManualGearbox,
	IconLayersSubtract,
	IconReplace,
	IconBadgeOff,
} from "@tabler/icons-react";

// Types
import { TransmissionType } from "@/types/SaveGameTypes";
import { BrandModelTypes, BrandType } from "@/types/ConstTypes";

interface completedProps {
	error: boolean;
	completed: boolean;
}

interface TruckTransmissionState {
	selectedBrand?: BrandType;
	selectedModel?: BrandModelTypes;
	selectedTransmission?: TransmissionType;
	transmissions?: TransmissionType[];
}

const SetTruckTransmission = () => {
	const { selectedSave, game } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { change_truck_transmission } = translations.menu_options.trucks;

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isLoadingRemoveBadge, setIsLoadingRemoveBadge] =
		useState<boolean>(false);

	const [transmissionState, setTransmissionState] =
		useState<TruckTransmissionState>({
			selectedBrand: undefined,
			selectedModel: undefined,
			selectedTransmission: undefined,
			transmissions: undefined,
		});

	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const onClickApply = async () => {
		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}

		if (!transmissionState.selectedTransmission) return;
		if (selectedSave) {
			setIsLoading(true);
			const res = await setTruckTransmission(
				selectedSave.dir,
				transmissionState.selectedTransmission.code
			);
			setCompleted({
				error: !res,
				completed: true,
			});
		}
		setIsLoading(false);
	};

	const onClickBrand = async (branName: string) => {
		const brandFindData = game === "ets2" ? BRANDS_ETS2 : BRANDS_ATS;

		const brandFind = brandFindData.find(
			(p) => p.key === branName
		) as BrandType;

		setTransmissionState({
			selectedBrand: brandFind,
			selectedModel: undefined,
			selectedTransmission: undefined,
			transmissions: undefined,
		});
	};

	const onClickBrandModel = async (modelKey: string, brand: string) => {
		if (!transmissionState.selectedBrand) return;

		const modelFind = transmissionState.selectedBrand.models.find(
			(p) => p.key === modelKey
		);
		if (!modelFind) return;

		const resTransmissions =
			game === "ets2"
				? await get_brand_models_ets2(brand)
				: await get_brand_models_ats(brand);

		if (resTransmissions.res) {
			const models = resTransmissions.models;
			const modelFindApi = models.find((p) => p.model === modelKey);

			if (modelFindApi) {
				setTransmissionState({
					...transmissionState,
					selectedModel: modelFind,
					transmissions: modelFindApi.transmissions,
					selectedTransmission: undefined,
				});
			} else {
				setTransmissionState({
					...transmissionState,
					selectedModel: modelFind,
					transmissions: undefined,
				});
			}
		}
	};

	const onClickTransmission = (transmissionId: string) => {
		if (!transmissionState.transmissions) return;
		const transmissionFind = transmissionState.transmissions.find(
			(p) => p.name === transmissionId
		);

		setTransmissionState({
			...transmissionState,
			selectedTransmission: transmissionFind,
		});
	};

	const onClickRemoveBadge = async () => {
		if (selectedSave) {
			setIsLoadingRemoveBadge(true);
			const res = await setRemoveTruckBadge(selectedSave.dir);
			setCompleted({
				error: !res,
				completed: true,
			});
		}
		setIsLoadingRemoveBadge(false);
	};

	const errorModelEmpty = transmissionState.selectedBrand
		? transmissionState.selectedModel
			? false
			: true
		: false;

	const errorTransmissionEmpty = transmissionState.selectedModel
		? transmissionState.selectedTransmission
			? false
			: true
		: false;

	const resetState = () => {
		setTransmissionState({
			selectedBrand: undefined,
			selectedModel: undefined,
			selectedTransmission: undefined,
			transmissions: undefined,
		});
		setCompleted({ error: false, completed: false });
	};

	const handleClose = () => {
		resetState();
	};

	const openModalChange = (open: boolean) => {
		onOpenChange();
		if (!open) handleClose();
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
				{change_truck_transmission.modal.btn_open}
			</Button>
			<Modal
				hideCloseButton
				size="md"
				backdrop="blur"
				isOpen={isOpen}
				onOpenChange={openModalChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								{change_truck_transmission.modal.title}
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>{change_truck_transmission.modal.description}</p>
								<Select
									items={game === "ets2" ? BRANDS_ETS2 : BRANDS_ATS}
									selectedKeys={
										transmissionState.selectedBrand
											? [transmissionState.selectedBrand.key]
											: []
									}
									onChange={(e) => onClickBrand(e.target.value)}
									label={change_truck_transmission.modal.input_brands.label}
									placeholder={
										change_truck_transmission.modal.input_brands.placeholder
									}
									labelPlacement="inside"
									variant="bordered"
									startContent={
										transmissionState.selectedBrand ? (
											<Image
												alt={transmissionState.selectedBrand.icon}
												src={transmissionState.selectedBrand.icon}
												width={30}
											/>
										) : (
											<></>
										)
									}
								>
									{(BrandObj) => (
										<SelectItem key={BrandObj.key} textValue={BrandObj.name}>
											<div className="flex items-center gap-2">
												<Image
													alt={BrandObj.icon}
													src={BrandObj.icon}
													className="w-12 rounded-lg object-contain"
												/>
												<div className="flex flex-col">
													<span className="text-small">{BrandObj.name}</span>
												</div>
											</div>
										</SelectItem>
									)}
								</Select>
								<Select
									isDisabled={transmissionState.selectedBrand ? false : true}
									isInvalid={errorModelEmpty}
									items={
										transmissionState.selectedBrand
											? transmissionState.selectedBrand.models
											: []
									}
									selectedKeys={
										transmissionState.selectedModel
											? [transmissionState.selectedModel.key]
											: []
									}
									onChange={(e) =>
										onClickBrandModel(
											e.target.value,
											transmissionState.selectedBrand!.key
										)
									}
									label={change_truck_transmission.modal.input_models.label}
									placeholder={
										change_truck_transmission.modal.input_models.placeholder
									}
									labelPlacement="inside"
									variant="bordered"
									startContent={<IconLayersSubtract stroke={2} />}
								>
									{(modelObj) => (
										<SelectItem key={modelObj.key} textValue={modelObj.name}>
											<div className="flex items-center gap-2">
												<div className="flex flex-col">
													<span className="text-small">{modelObj.name}</span>
												</div>
											</div>
										</SelectItem>
									)}
								</Select>
								<Select
									isDisabled={!transmissionState.selectedModel}
									isInvalid={errorTransmissionEmpty}
									items={
										transmissionState.transmissions
											? transmissionState.transmissions
											: []
									}
									selectedKeys={
										transmissionState.selectedTransmission
											? [transmissionState.selectedTransmission.name]
											: []
									}
									onChange={(e) => onClickTransmission(e.target.value)}
									label={
										change_truck_transmission.modal.input_transmissions.label
									}
									placeholder={
										change_truck_transmission.modal.input_transmissions
											.placeholder
									}
									labelPlacement="inside"
									variant="bordered"
									startContent={<IconManualGearbox stroke={2} />}
								>
									{(transmissionObj) => (
										<SelectItem
											key={transmissionObj.name}
											textValue={transmissionObj.name}
										>
											<div className="flex items-center gap-2">
												<div className="flex w-full flex-col">
													<span className="text-small font-medium">
														{transmissionObj.name}
													</span>
													<span className="text-tiny text-default-600">
														Speeds: {transmissionObj.speeds}
													</span>
													<span className="text-tiny text-default-600">
														Retarder:{" "}
														{transmissionObj.retarder
															? "\u2714\ufe0f"
															: "\u274c"}
													</span>
													<span className="text-tiny text-default-600">
														Ratio: {transmissionObj.ratio}
													</span>
												</div>
											</div>
										</SelectItem>
									)}
								</Select>
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
											<b>
												{change_truck_transmission.modal.warning_message.title}
											</b>
											<p
												dangerouslySetInnerHTML={{
													__html:
														change_truck_transmission.modal.warning_message
															.message,
												}}
											/>
										</div>
									}
								/>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									{change_truck_transmission.modal.btn_close}
								</Button>
								<Button
									endContent={<IconBadgeOff />}
									isLoading={isLoadingRemoveBadge}
									color="warning"
									variant="bordered"
									onPress={onClickRemoveBadge}
								>
									{change_truck_transmission.modal.btn_remove_badge}
								</Button>
								<Button
									endContent={<IconReplace />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									{change_truck_transmission.modal.btn_apply}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default SetTruckTransmission;
