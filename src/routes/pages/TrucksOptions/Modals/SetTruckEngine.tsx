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
	Image,
} from "@heroui/react";
import {
	setTruckEngine,
	get_brand_models_ets2,
	get_brand_models_ats,
	setRemoveTruckBadge,
} from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";
import Warning from "@/components/Warning";

// icons
import {
	IconPencil,
	IconEngine,
	IconLayersSubtract,
	IconReplace,
	IconBadgeOff,
} from "@tabler/icons-react";

// types
import { EngineType } from "@/types/SaveGameTypes";
import { BrandModelTypes, BrandType } from "@/types/ConstTypes";
import { BRANDS_ETS2, BRANDS_ATS } from "@/utils/Brands";

interface completedProps {
	error: boolean;
	completed: boolean;
}

interface TruckEngineState {
	selectedBrand?: BrandType;
	selectedModel?: BrandModelTypes;
	selectedEngine?: EngineType;
	engines?: EngineType[];
}

const SetTruckEngine = () => {
	const { selectedSave, game } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { change_truck_engine } = translations.menu_options.trucks;

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isLoadingRemoveBadge, setIsLoadingRemoveBadge] =
		useState<boolean>(false);

	const [stateEngine, setStateEngine] = useState<TruckEngineState>({
		selectedBrand: undefined,
		selectedModel: undefined,
		selectedEngine: undefined,
		engines: undefined,
	});

	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const onClickApply = async () => {
		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}
		if (!stateEngine.selectedEngine) return;

		if (selectedSave) {
			setIsLoading(true);
			const res = await setTruckEngine(
				selectedSave.dir,
				stateEngine.selectedEngine.code
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

		setStateEngine({
			selectedBrand: brandFind,
			selectedModel: undefined,
			selectedEngine: undefined,
			engines: undefined,
		});
	};

	const onClickBrandModel = async (modelKey: string, brand: string) => {
		if (!stateEngine.selectedBrand) return;

		const modelFind = stateEngine.selectedBrand.models.find(
			(p) => p.key === modelKey
		);
		if (!modelFind) return;

		const resEngines =
			game === "ets2"
				? await get_brand_models_ets2(brand)
				: await get_brand_models_ats(brand);

		if (resEngines.res) {
			const models = resEngines.models;
			const modelFindApi = models.find((p) => p.model === modelKey);

			if (modelFindApi) {
				setStateEngine({
					...stateEngine,
					selectedModel: modelFind,
					engines: modelFindApi.engines,
					selectedBrand: stateEngine.selectedBrand,
					selectedEngine: undefined,
				});
			} else {
				setStateEngine({
					...stateEngine,
					selectedModel: modelFind,
					engines: undefined,
				});
			}
		}
	};

	const onClickEngine = (engineName: string) => {
		if (!stateEngine.engines) return;
		const engineFind = stateEngine.engines.find((p) => p.name === engineName);

		setStateEngine({
			...stateEngine,
			selectedEngine: engineFind,
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

	const errorModelEmpty = stateEngine.selectedBrand
		? stateEngine.selectedModel
			? false
			: true
		: false;

	const errorEngineEmpty = stateEngine.selectedModel
		? stateEngine.selectedEngine
			? false
			: true
		: false;

	useEffect(() => {
		if (!isOpen) {
			setStateEngine({
				selectedBrand: undefined,
				selectedModel: undefined,
				selectedEngine: undefined,
				engines: undefined,
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
				{change_truck_engine.modal.btn_open}
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
								{change_truck_engine.modal.title}
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>{change_truck_engine.modal.description}</p>
								<Select
									items={game === "ets2" ? BRANDS_ETS2 : BRANDS_ATS}
									selectedKeys={
										stateEngine.selectedBrand
											? [stateEngine.selectedBrand.key]
											: []
									}
									onChange={(e) => onClickBrand(e.target.value)}
									label={change_truck_engine.modal.input_brands.label}
									placeholder={
										change_truck_engine.modal.input_brands.placeholder
									}
									labelPlacement="inside"
									variant="bordered"
									startContent={
										stateEngine.selectedBrand ? (
											<Image
												alt={stateEngine.selectedBrand.icon}
												src={stateEngine.selectedBrand.icon}
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
									isDisabled={stateEngine.selectedBrand ? false : true}
									isInvalid={errorModelEmpty}
									items={
										stateEngine.selectedBrand
											? stateEngine.selectedBrand.models
											: []
									}
									selectedKeys={
										stateEngine.selectedModel
											? [stateEngine.selectedModel.key]
											: []
									}
									onChange={(e) =>
										onClickBrandModel(
											e.target.value,
											stateEngine.selectedBrand!.key
										)
									}
									label={change_truck_engine.modal.input_models.label}
									placeholder={
										change_truck_engine.modal.input_models.placeholder
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
									isDisabled={!stateEngine.selectedModel}
									isInvalid={errorEngineEmpty}
									items={stateEngine.engines ? stateEngine.engines : []}
									selectedKeys={
										stateEngine.selectedEngine
											? [stateEngine.selectedEngine.name]
											: []
									}
									onChange={(e) => onClickEngine(e.target.value)}
									label={change_truck_engine.modal.input_engines.label}
									placeholder={
										change_truck_engine.modal.input_engines.placeholder
									}
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
											<b>{change_truck_engine.modal.warning_message.title}</b>
											<p
												dangerouslySetInnerHTML={{
													__html:
														change_truck_engine.modal.warning_message.message,
												}}
											/>
										</div>
									}
								/>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									{change_truck_engine.modal.btn_close}
								</Button>
								<Button
									endContent={<IconBadgeOff />}
									isLoading={isLoadingRemoveBadge}
									color="warning"
									variant="bordered"
									onPress={onClickRemoveBadge}
								>
									{change_truck_engine.modal.btn_remove_badge}
								</Button>
								<Button
									endContent={<IconReplace />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									{change_truck_engine.modal.btn_apply}
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
