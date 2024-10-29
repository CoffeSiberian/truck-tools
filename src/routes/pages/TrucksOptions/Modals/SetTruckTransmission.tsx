import { useState, useContext, useEffect } from "react";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
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
	IconSteeringWheel,
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

const SetTruckTransmission = () => {
	const { selectedSave, game } = useContext(ProfileContex);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [transmissions, setTransmissions] = useState<
		TransmissionType[] | undefined
	>(undefined);

	const [selectedTransmission, setSelectedTransmission] = useState<
		TransmissionType | undefined
	>(undefined);

	const [selectedBrand, setSelectedBrand] = useState<BrandType | undefined>(
		undefined
	);

	const [selectedModel, setSelectedModel] = useState<
		BrandModelTypes | undefined
	>(undefined);

	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const onClickApply = async () => {
		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}

		if (!selectedTransmission) return;
		if (selectedSave) {
			setIsLoading(true);
			const res = await setTruckTransmission(
				selectedSave.dir,
				selectedTransmission.code
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
		if (!branName) return;

		const brandFind = brandFindData.find(
			(p) => p.name === branName
		) as BrandType;
		setSelectedBrand(brandFind);
		setSelectedModel(undefined);
		setSelectedTransmission(undefined);
	};

	const onClickBrandModel = async (modelKey: string, brand: string) => {
		if (!selectedBrand) return;

		const modelFind = selectedBrand.models.find((p) => p.key === modelKey);
		setSelectedModel(modelFind);
		setSelectedTransmission(undefined);

		if (!modelFind) return;
		const resTransmissions =
			game === "ets2"
				? await get_brand_models_ets2(brand.toLocaleLowerCase())
				: await get_brand_models_ats(brand.toLocaleLowerCase());

		if (resTransmissions.res) {
			const models = resTransmissions.models;

			const modelFind = models.find((p) => p.model === modelKey);

			if (modelFind) {
				setTransmissions(modelFind.transmissions);
			} else setTransmissions(undefined);
		}
	};

	const onClickTransmission = (transmissionId: string) => {
		if (!transmissions) return;

		const transmissionFind = transmissions.find(
			(p) => p.name === transmissionId
		);
		setSelectedTransmission(transmissionFind);
	};

	const errorModelEmpty = selectedBrand
		? selectedModel
			? false
			: true
		: false;

	const errorTransmissionEmpty = selectedModel
		? selectedTransmission
			? false
			: true
		: false;

	useEffect(() => {
		if (!isOpen) {
			// need refactor to use one useState
			setSelectedBrand(undefined);
			setSelectedModel(undefined);
			setTransmissions(undefined);
			setSelectedTransmission(undefined);
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
									selectedKeys={selectedBrand ? [selectedBrand.name] : []}
									onChange={(e) => onClickBrand(e.target.value)}
									label="Brands"
									placeholder="Select truck brand"
									labelPlacement="inside"
									variant="bordered"
									startContent={
										selectedBrand ? (
											<Image
												alt={selectedBrand.icon}
												src={selectedBrand.icon}
												width={30}
											/>
										) : (
											<></>
										)
									}
								>
									{(BrandObj) => (
										<SelectItem key={BrandObj.name} textValue={BrandObj.name}>
											<div className="flex items-center gap-2">
												<Avatar
													alt={BrandObj.icon}
													src={BrandObj.icon}
													size="lg"
													showFallback
													fallback={<IconSteeringWheel />}
												/>
												<div className="flex flex-col">
													<span className="text-small">{BrandObj.name}</span>
												</div>
											</div>
										</SelectItem>
									)}
								</Select>
								<Select
									isDisabled={selectedBrand ? false : true}
									isInvalid={errorModelEmpty}
									items={selectedBrand ? selectedBrand.models : []}
									selectedKeys={selectedModel ? [selectedModel.key] : []}
									onChange={(e) =>
										onClickBrandModel(e.target.value, selectedBrand!.name)
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
									isDisabled={!selectedModel}
									isInvalid={errorTransmissionEmpty}
									items={transmissions ? transmissions : []}
									selectedKeys={
										selectedTransmission ? [selectedTransmission.name] : []
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
