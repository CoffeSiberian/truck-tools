import { useState, useContext } from "react";
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
import { setTruckEngine, get_brand_models_ets2 } from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";

// icons
import {
	IconPencil,
	IconSteeringWheel,
	IconEngine,
	IconLayersSubtract,
	IconReplace,
} from "@tabler/icons-react";

// types
import { EngineType } from "@/types/SaveGameTypes";
import { BrandModelTypes, BrandType } from "@/types/ConstTypes";
import { BRANDS_ETS2 } from "@/utils/Brands";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const SetTruckEngine = () => {
	const { selectedSave } = useContext(ProfileContex);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [Engines, setEngines] = useState<EngineType[] | undefined>(undefined);

	const [SelectedEngine, setSelectedEngine] = useState<EngineType | undefined>(
		undefined
	);

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

		if (!SelectedEngine) return;
		if (selectedSave) {
			setIsLoading(true);
			const res = await setTruckEngine(selectedSave.dir, SelectedEngine.code);
			setCompleted({
				error: !res,
				completed: true,
			});
		}
		setIsLoading(false);
	};

	const onClickBrand = async (branName: string) => {
		if (!branName) return;

		const brandFind = BRANDS_ETS2.find((p) => p.name === branName) as BrandType;
		setSelectedBrand(brandFind);
		setSelectedModel(undefined);
		setSelectedEngine(undefined);
	};

	const onClickBrandModel = async (modelKey: string, brand: string) => {
		if (!selectedBrand) return;

		const modelFind = selectedBrand.models.find((p) => p.key === modelKey);
		setSelectedModel(modelFind);
		setSelectedEngine(undefined);

		if (!modelFind) return;
		const resEngines = await get_brand_models_ets2(brand.toLocaleLowerCase());

		if (resEngines.res) {
			const models = resEngines.models;

			const modelFind = models.find((p) => p.model === modelKey);

			if (modelFind) {
				setEngines(modelFind.engines);
			} else setEngines(undefined);
		}
	};

	const onClickEngine = (engineName: string) => {
		if (!Engines) return;

		const engineFind = Engines.find((p) => p.name === engineName);
		setSelectedEngine(engineFind);
	};

	const errorModelEmpty = selectedBrand
		? selectedModel
			? false
			: true
		: false;

	const errorEngineEmpty = selectedModel
		? SelectedEngine
			? false
			: true
		: false;

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
				shouldBlockScroll={false}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Change truck engine
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>Change the engine of your truck to the one of your choice</p>
								<Select
									items={BRANDS_ETS2}
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
									isInvalid={errorEngineEmpty}
									items={Engines ? Engines : []}
									selectedKeys={SelectedEngine ? [SelectedEngine.name] : []}
									onChange={(e) => onClickEngine(e.target.value)}
									label="Engines"
									placeholder="Select truck engine"
									labelPlacement="inside"
									variant="bordered"
									startContent={<IconEngine stroke={2} />}
								>
									{(engineObj) => (
										<SelectItem key={engineObj.name} textValue={engineObj.name}>
											<div className="flex items-center gap-2">
												<div className="flex flex-col">
													<span className="text-small font-medium">
														{engineObj.name}
													</span>
													<span className="text-tiny text-default-600">
														CV: {engineObj.cv}
													</span>
													<span className="text-tiny text-default-600">
														NM: {engineObj.nm}
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

export default SetTruckEngine;
