import { useState, useContext } from "react";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import { ProfileContex } from "../../../../hooks/useProfileContex";
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
	getTrucksInfoList,
} from "../../../../utils/fileEdit";
import AlertSave from "../../../../components/AlertSave";

// icons
import {
	IconPencil,
	IconSteeringWheel,
	IconManualGearbox,
	IconLayersSubtract,
	IconReplace,
} from "@tabler/icons-react";

// types
import { TransmissionTypes } from "../../../../types/SaveGameTypes";

// images
import ScaniaIcon from "../../../../static/icons/brands/scania.svg";
import VolvoIcon from "../../../../static/icons/brands/volvo.svg";
import ManIcon from "../../../../static/icons/brands/man.svg";
import DafIcon from "../../../../static/icons/brands/daf.svg";
import MercedesIcon from "../../../../static/icons/brands/mercedes.svg";
import RenaultIcon from "../../../../static/icons/brands/renault.svg";
import IvecoIcon from "../../../../static/icons/brands/iveco.svg";

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

const SetTruckTransmission = () => {
	const { selectedSave } = useContext(ProfileContex);
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
		{
			name: "MAN",
			models: [
				{ key: "man_tgx", name: "MAN TGX" },
				{ key: "man_tgx_eu6", name: "MAN TGX Euro 6" },
			],
			icon: ManIcon,
		},
		{
			name: "DAF",
			models: [
				{ key: "daf_xf", name: "DAF XF" },
				{ key: "daf_xf_euro6", name: "DAF XF EURO6" },
				{ key: "daf_2021", name: "DAF 2021" },
			],
			icon: DafIcon,
		},
		{
			name: "Mercedes-Benz",
			models: [
				{ key: "mercedes_actros", name: "Mercedes-Benz Actros" },
				{ key: "mercedes_new_actros", name: "Mercedes-Benz New Actros" },
			],
			icon: MercedesIcon,
		},
		{
			name: "Renault",
			models: [
				{ key: "renault_t", name: "Renault T" },
				{ key: "renault_magnum", name: "Renault Magnum" },
				{ key: "renault_premium", name: "Renault Premium" },
			],
			icon: RenaultIcon,
		},
		{
			name: "Iveco",
			models: [
				{ key: "iveco_stralis", name: "Iveco Stralis" },
				{ key: "iveco_hiway", name: "Iveco Hi-Way" },
			],
			icon: IvecoIcon,
		},
	];

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [transmissions, setTransmissions] = useState<
		TransmissionTypes[] | undefined
	>(undefined);

	const [selectedTransmission, setSelectedTransmission] = useState<
		TransmissionTypes | undefined
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
		if (!branName) return;

		const brandFind = BRANDS.find((p) => p.name === branName) as BrandType;
		setSelectedBrand(brandFind);
		setSelectedModel(undefined);
		setSelectedTransmission(undefined);
	};

	const onClickBrandModel = async (modelKey: string) => {
		if (!selectedBrand) return;

		const modelFind = selectedBrand.models.find((p) => p.key === modelKey);
		setSelectedModel(modelFind);
		setSelectedTransmission(undefined);

		if (!modelFind) return;
		const resTransmissions = await getTrucksInfoList();

		if (resTransmissions) {
			switch (modelFind.key) {
				case "scania_r":
					setTransmissions(resTransmissions.scania.scania_r.transmissions);
					break;
				case "scania_s":
					setTransmissions(resTransmissions.scania.scania_s.transmissions);
					break;
				case "scania_r_2009":
					setTransmissions(resTransmissions.scania.scania_r_2009.transmissions);
					break;
				case "scania_streamline":
					setTransmissions(
						resTransmissions.scania.scania_streamline.transmissions
					);
					break;
				case "volvo_fh_classic":
					setTransmissions(
						resTransmissions.volvo.volvo_fh_classic.transmissions
					);
					break;
				case "volvo_fh":
					setTransmissions(resTransmissions.volvo.volvo_fh.transmissions);
					break;
				case "man_tgx":
					setTransmissions(resTransmissions.man.man_tgx.transmissions);
					break;
				case "man_tgx_eu6":
					setTransmissions(resTransmissions.man.man_tgx_eu6.transmissions);
					break;
				case "daf_xf":
					setTransmissions(resTransmissions.daf.daf_xf.transmissions);
					break;
				case "daf_xf_euro6":
					setTransmissions(resTransmissions.daf.daf_xf_euro6.transmissions);
					break;
				case "daf_2021":
					setTransmissions(resTransmissions.daf.daf_2021.transmissions);
					break;
				case "mercedes_actros":
					setTransmissions(
						resTransmissions.mercedes.mercedes_actros.transmissions
					);
					break;
				case "mercedes_new_actros":
					setTransmissions(
						resTransmissions.mercedes.mercedes_new_actros.transmissions
					);
					break;
				case "renault_t":
					setTransmissions(resTransmissions.renault.renault_t.transmissions);
					break;
				case "renault_magnum":
					setTransmissions(
						resTransmissions.renault.renault_magnum.transmissions
					);
					break;
				case "renault_premium":
					setTransmissions(
						resTransmissions.renault.renault_premium.transmissions
					);
					break;
				case "iveco_stralis":
					setTransmissions(resTransmissions.iveco.iveco_stralis.transmissions);
					break;
				case "iveco_hiway":
					setTransmissions(resTransmissions.iveco.iveco_hiway.transmissions);
					break;
			}
		}
	};

	const onClickTransmission = (transmissionId: string) => {
		if (!transmissions) return;

		const transmissionFind = transmissions.find(
			(p) => p.name_id === transmissionId
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
									isDisabled={!selectedModel}
									isInvalid={errorTransmissionEmpty}
									items={transmissions ? transmissions : []}
									selectedKeys={
										selectedTransmission ? [selectedTransmission.name_id] : []
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
											key={transmissionObj.name_id}
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
