import { useState } from "react";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import { useProfileContex } from "../../../../hooks/useProfileContex";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Image,
} from "@nextui-org/react";
import { setTruckEngine, getListEngines } from "../../../../utils/fileEdit";
import AlertSave from "../../../../components/AlertSave";

// icons
import {
	IconPencil,
	IconSteeringWheel,
	IconEngine,
	IconLayersSubtract,
} from "@tabler/icons-react";

// types
import { EngineTypes } from "../../../../types/SaveGameTypes";

// images
import ScaniaIcon from "../../../../static/icons/brands/scania.svg";
import VolvoIcon from "../../../../static/icons/brands/volvo.svg";

interface completedProps {
	error: boolean;
	completed: boolean;
}

interface BrandModelTypes {
	key: string;
	name: string;
}

interface BrandType {
	name: string;
	models: BrandModelTypes[];
	icon: string;
}

const SetTruckEngine = () => {
	const { selectedSave } = useProfileContex();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const BRANDS: BrandType[] = [
		{
			name: "Scania",
			models: [
				{ key: "scania_r", name: "Scania R" },
				{ key: "scania_s", name: "Scania S" },
				{ key: "scania_r_2009", name: "Scania R 2009" },
				{ key: "scania_streamline", name: "Scania Streamline" },
			],
			icon: ScaniaIcon,
		},
		{
			name: "Volvo",
			models: [
				{ key: "volvo_fh_classic", name: "Volvo FH Classic" },
				{ key: "volvo_fh", name: "Volvo FH" },
			],
			icon: VolvoIcon,
		},
	];

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [Engines, setEngines] = useState<EngineTypes[] | undefined>(undefined);

	const [SelectedEngine, setSelectedEngine] = useState<EngineTypes | undefined>(
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

		const brandFind = BRANDS.find((p) => p.name === branName) as BrandType;
		setSelectedBrand(brandFind);
		setSelectedModel(undefined);
		setSelectedEngine(undefined);
	};

	const onClickBrandModel = async (modelKey: string) => {
		if (!selectedBrand) return;

		const modelFind = selectedBrand.models.find((p) => p.key === modelKey);
		setSelectedModel(modelFind);
		setSelectedEngine(undefined);

		if (!modelFind) return;
		const resEngines = await getListEngines();

		if (resEngines) {
			switch (modelFind.key) {
				case "scania_r":
					setEngines(resEngines.scania.scania_r);
					break;
				case "scania_s":
					setEngines(resEngines.scania.scania_s);
					break;
				case "scania_r_2009":
					setEngines(resEngines.scania.scania_r_2009);
					break;
				case "scania_streamline":
					setEngines(resEngines.scania.scania_streamline);
					break;
				case "volvo_fh_classic":
					setEngines(resEngines.volvo.volvo_fh_classic);
					break;
				case "volvo_fh":
					setEngines(resEngines.volvo.volvo_fh);
					break;
			}
		}
	};

	const onClickEngine = (engineId: string) => {
		if (!Engines) return;

		const engineFind = Engines.find((p) => p.name_id === engineId);
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
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Change truck engine
							</ModalHeader>
							<ModalBody className="py-1">
								<p>Change the engine of your truck to the one of your choice</p>
								<Select
									items={BRANDS}
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
									onChange={(e) => onClickBrandModel(e.target.value)}
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
									isDisabled={!Engines}
									isInvalid={errorEngineEmpty}
									items={Engines ? Engines : []}
									selectedKeys={SelectedEngine ? [SelectedEngine.name_id] : []}
									onChange={(e) => onClickEngine(e.target.value)}
									label="Engines"
									placeholder="Select truck engine"
									labelPlacement="inside"
									variant="bordered"
									startContent={<IconEngine stroke={2} />}
								>
									{(engineObj) => (
										<SelectItem
											key={engineObj.name_id}
											textValue={engineObj.name}
										>
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
