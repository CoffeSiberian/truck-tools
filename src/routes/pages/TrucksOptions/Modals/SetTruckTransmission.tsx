import { useState, useContext, useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/react";
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
	Image,
} from "@nextui-org/react";
import {
	setTruckTransmission,
	get_brand_models_ets2,
	get_brand_models_ats,
} from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";
import { BRANDS_ETS2, BRANDS_ATS } from "@/utils/Brands";

// icons
import {
	IconPencil,
	IconManualGearbox,
	IconLayersSubtract,
	IconReplace,
} from "@tabler/icons-react";

// types
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
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [isLoading, setIsLoading] = useState<boolean>(false);

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

	useEffect(() => {
		if (!isOpen) {
			setTransmissionState({
				selectedBrand: undefined,
				selectedModel: undefined,
				selectedTransmission: undefined,
				transmissions: undefined,
			});
			setCompleted({ error: false, completed: false });
		}
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
				size="sm"
				backdrop="blur"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Change truck transmission
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>
									Change the transmission of your truck to the one of your
									choice
								</p>
								<Select
									items={game === "ets2" ? BRANDS_ETS2 : BRANDS_ATS}
									selectedKeys={
										transmissionState.selectedBrand
											? [transmissionState.selectedBrand.key]
											: []
									}
									onChange={(e) => onClickBrand(e.target.value)}
									label="Brands"
									placeholder="Select truck brand"
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
									label="Models"
									placeholder="Select truck model"
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
									label="Transmissions"
									placeholder="Select truck transmission"
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
								<div className="flex justify-center">
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
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button
									endContent={<IconReplace />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
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

export default SetTruckTransmission;
