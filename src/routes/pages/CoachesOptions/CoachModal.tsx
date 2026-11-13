import { useContext, useRef, useState } from "react";
import { useDisclosure } from "@heroui/use-disclosure";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { Select, SelectItem } from "@heroui/select";
import { Image } from "@heroui/image";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@heroui/modal";
import { ColorPicker, ColorService, useColor } from "react-color-palette";
import {
	IconDeviceFloppy,
	IconPencil,
	IconRoad,
	IconTool,
	IconEngine,
	IconManualGearbox,
	IconLayersSubtract,
} from "@tabler/icons-react";
import CustomLicensePlate from "@/components/CustomLicensePlate";
import AlertSave from "@/components/AlertSave";
import { LocaleContext } from "@/hooks/useLocaleContext";
import { ProfileContex } from "@/hooks/useProfileContex";
import { getSaveCoaches, updateCoach } from "@/utils/fileEdit";
import { CoachEdit, SaveCoach } from "@/types/fileEditTypes";
import { COACH_BRANDS } from "@/utils/Brands";

export type CoachAction =
	| "change_engine"
	| "change_transmission"
	| "license_plate"
	| "paint_job"
	| "change_km"
	| "repair_coach"
	| "repair_all_coaches";

const CoachModal = ({ action }: { action: CoachAction }) => {
	const { selectedSave, game } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const t = translations.menu_options.coaches;
	const copy = t[action].modal;
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [coach, setCoach] = useState<SaveCoach>();
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [loadError, setLoadError] = useState(false);
	const [completed, setCompleted] = useState({
		error: false,
		completed: false,
	});
	const [km, setKm] = useState("");
	const [plateText, setPlateText] = useState("");
	const [bgColor, setBGColor] = useColor("#bf2222");
	const [txColor, setTxColor] = useColor("#ffffff");
	const [isColorMargin, setIsColorMargin] = useState(false);
	const [paintPath, setPaintPath] = useState("");
	const [partPath, setPartPath] = useState("");
	const [partBrand, setPartBrand] = useState("");
	const [partModel, setPartModel] = useState("");
	const [paintColor, setPaintColor] = useColor("#ffffff");
	const readVersion = useRef(0);
	const modalRef = useRef<HTMLDivElement>(null);
	const selectedPaint = coach?.paint_jobs.find((p) => p.path === paintPath);
	const customColor =
		selectedPaint?.name === "pj_custom_colour" ||
		selectedPaint?.name === "pj_custom_metallic_colour";
	const bulk = action === "repair_all_coaches";
	const repair = action === "repair_coach" || bulk;
	const powertrain =
		action === "change_engine" || action === "change_transmission";
	const parts =
		action === "change_engine" ? coach?.engines : coach?.transmissions;
	const selectedBrand = COACH_BRANDS.find((b) => b.key === partBrand);
	const availableParts = parts?.filter((p) => p.model === partModel) ?? [];
	const selectedPart = availableParts.find((p) => p.path === partPath);
	const partInput =
		action === "change_engine"
			? t.powertrain_inputs.engines
			: t.powertrain_inputs.transmissions;

	const loadValues = (selected?: SaveCoach) => {
		setCoach(selected);
		const currentPath =
			action === "change_engine" ? selected?.engine : selected?.transmission;
		const catalog =
			action === "change_engine" ? selected?.engines : selected?.transmissions;
		const model =
			catalog?.find((p) => p.path === currentPath)?.model ??
			selected?.model ??
			"";
		setPartModel(model);
		setPartBrand(
			COACH_BRANDS.find((b) => b.models.some((m) => m.key === model))?.key ?? ""
		);
		setPartPath(
			(action === "change_engine"
				? selected?.engine
				: selected?.transmission) ?? ""
		);
		setKm(selected?.odometer?.toString() ?? "");
		// Strip the game's plate formatting; the existing plate editor supplies the new formatting.
		setPlateText(
			selected?.license_plate
				.split("|")[0]
				.replace(/<[^>]*>/g, "")
				.trim() ?? ""
		);
		setPaintPath(selected?.paint_job ?? "");
		setPaintColor(
			ColorService.convert("hex", selected?.paint_color ?? "#ffffff")
		);
		setBGColor(ColorService.convert("hex", "#bf2222"));
		setTxColor(ColorService.convert("hex", "#ffffff"));
		setIsColorMargin(false);
		setCompleted({ error: false, completed: false });
	};

	const loadCurrentCoach = async () => {
		if (!selectedSave) return;
		const version = ++readVersion.current;
		setLoading(true);
		setLoadError(false);
		loadValues();
		try {
			const response = await getSaveCoaches(selectedSave.dir);
			if (version !== readVersion.current) return;
			if (!response.res) throw new Error("load");
			loadValues(
				response.coaches.find((c) => c.id === response.current_coach_id)
			);
		} catch {
			if (version === readVersion.current) setLoadError(true);
		} finally {
			if (version === readVersion.current) setLoading(false);
		}
	};

	const apply = async () => {
		if (!selectedSave || loading || saving || (!repair && !coach)) return;
		let edit: CoachEdit;
		switch (action) {
			case "change_engine":
			case "change_transmission":
				edit = {
					action: action === "change_engine" ? "engine" : "transmission",
					path: partPath,
				};
				break;
			case "repair_all_coaches":
				edit = { action: "repair_all" };
				break;
			case "repair_coach":
				edit = { action: "repair" };
				break;
			case "change_km":
				edit = { action: "odometer", km: Number(km) };
				break;
			case "license_plate":
				edit = {
					action: "license_plate",
					text: plateText,
					background: bgColor.hex,
					foreground: txColor.hex,
					margin: isColorMargin,
				};
				break;
			case "paint_job":
				edit = {
					action: "paint_job",
					path: paintPath,
					color: customColor ? paintColor.hex : null,
				};
				break;
		}
		setSaving(true);
		setCompleted({ error: false, completed: false });
		try {
			const res = await updateCoach(selectedSave.dir, edit);
			setCompleted({ error: !res, completed: true });
		} catch {
			setCompleted({ error: true, completed: true });
		} finally {
			setSaving(false);
		}
	};

	const invalid =
		loading ||
		(!repair && (loadError || !coach)) ||
		(action === "change_km" &&
			(km === "" ||
				!Number.isSafeInteger(Number(km)) ||
				Number(km) > 2147483647)) ||
		(action === "license_plate" &&
			(plateText.trim() === "" || /["\\<>|\r\n]/.test(plateText))) ||
		(action === "paint_job" && !selectedPaint) ||
		(powertrain && !selectedPart);

	return (
		<>
			<Button
				endContent={<IconPencil stroke={2} />}
				color="primary"
				variant="shadow"
				isDisabled={!selectedSave || game !== "ets2"}
				onPress={() => {
					onOpen();
					setCompleted({ error: false, completed: false });
					if (!repair) void loadCurrentCoach();
				}}
			>
				{copy.btn_open}
			</Button>
			<Modal
				ref={modalRef}
				hideCloseButton
				backdrop="blur"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				isDismissable={!saving}
				isKeyboardDismissDisabled={saving}
				shouldBlockScroll={false}
				size={action === "license_plate" ? "lg" : repair ? "sm" : "md"}
				scrollBehavior="inside"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								{copy.title}
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>{copy.description}</p>
								{loading && <Spinner size="sm" />}
								{coach && !loading && powertrain && (
									<>
										<Select
											popoverProps={{
												portalContainer: modalRef.current ?? undefined,
											}}
											variant="bordered"
											label={t.powertrain_inputs.brands.label}
											placeholder={t.powertrain_inputs.brands.placeholder}
											isDisabled={saving}
											selectedKeys={selectedBrand ? [partBrand] : []}
											startContent={
												selectedBrand ? (
													<Image
														alt={selectedBrand.name}
														src={selectedBrand.icon}
														width={30}
													/>
												) : undefined
											}
											onChange={(e) => {
												setPartBrand(e.target.value);
												setPartModel("");
												setPartPath("");
											}}
										>
											{COACH_BRANDS.map((brand) => (
												<SelectItem key={brand.key} textValue={brand.name}>
													<div className="flex items-center gap-2">
														<Image
															alt={brand.name}
															src={brand.icon}
															className="w-12 rounded-lg object-contain"
														/>
														<span className="text-small">{brand.name}</span>
													</div>
												</SelectItem>
											))}
										</Select>
										<Select
											popoverProps={{
												portalContainer: modalRef.current ?? undefined,
											}}
											variant="bordered"
											label={t.powertrain_inputs.models.label}
											placeholder={t.powertrain_inputs.models.placeholder}
											isDisabled={saving || !selectedBrand}
											isInvalid={!!selectedBrand && !partModel}
											selectedKeys={partModel ? [partModel] : []}
											startContent={<IconLayersSubtract stroke={2} />}
											onChange={(e) => {
												setPartModel(e.target.value);
												setPartPath("");
											}}
										>
											{(selectedBrand?.models ?? []).map((model) => (
												<SelectItem key={model.key}>{model.name}</SelectItem>
											))}
										</Select>
										<Select
											popoverProps={{
												portalContainer: modalRef.current ?? undefined,
											}}
											variant="bordered"
											label={partInput.label}
											placeholder={partInput.placeholder}
											isDisabled={saving || !partModel}
											isInvalid={!!partModel && !selectedPart}
											startContent={
												action === "change_engine" ? (
													<IconEngine stroke={2} />
												) : (
													<IconManualGearbox stroke={2} />
												)
											}
											selectedKeys={selectedPart ? [partPath] : []}
											onSelectionChange={(keys) =>
												setPartPath(Array.from(keys)[0]?.toString() ?? "")
											}
										>
											{availableParts.map((p) => (
												<SelectItem key={p.path}>
													{t.part_names[p.name] ?? p.name}
												</SelectItem>
											))}
										</Select>
									</>
								)}
								{!loading && !repair && (loadError || !coach) && (
									<p className="text-small text-default-500">
										{loadError ? t.load_error : t.empty}
									</p>
								)}
								{coach && !loading && action === "change_km" && (
									<Input
										variant="bordered"
										startContent={<IconRoad />}
										label={t.change_km.modal.input_km.label}
										placeholder={t.change_km.modal.input_km.placeholder}
										value={km}
										isDisabled={saving}
										isInvalid={km === "" || Number(km) > 2147483647}
										onValueChange={(v) => {
											if (/^\d*$/.test(v)) setKm(v);
										}}
									/>
								)}
								{coach && !loading && action === "license_plate" && (
									<CustomLicensePlate
										portalContainer={modalRef.current ?? undefined}
										txColor={txColor}
										bgColor={bgColor}
										plateText={plateText}
										isColorMargin={isColorMargin}
										setColorMargin={setIsColorMargin}
										setBGColor={setBGColor}
										setTxColor={setTxColor}
										setPlateText={setPlateText}
										setIsColorMargin={setIsColorMargin}
										modalOpen={isOpen}
									/>
								)}
								{coach && !loading && action === "paint_job" && (
									<>
										<Select
											popoverProps={{
												portalContainer: modalRef.current ?? undefined,
											}}
											variant="bordered"
											label={t.paint_label}
											isDisabled={saving}
											selectedKeys={selectedPaint ? [paintPath] : []}
											onSelectionChange={(keys) =>
												setPaintPath(Array.from(keys)[0]?.toString() ?? "")
											}
										>
											{coach.paint_jobs.map((p) => (
												<SelectItem key={p.path}>
													{t.paint_names[p.name] ?? p.name}
												</SelectItem>
											))}
										</Select>
										{customColor && (
											<div className="flex flex-col gap-2">
												<p className="text-small">{t.color_label}</p>
												<ColorPicker
													color={paintColor}
													onChange={setPaintColor}
													hideAlpha
													disabled={saving}
												/>
											</div>
										)}
									</>
								)}
								<AlertSave
									message={
										completed.error
											? translations.components.alert_on_save_default.error
											: translations.components.alert_on_save_default.succes
									}
									error={completed.error}
									show={completed.completed}
									setShowFalse={() =>
										setCompleted({ ...completed, completed: false })
									}
								/>
							</ModalBody>
							<ModalFooter>
								<Button
									isDisabled={saving}
									color="danger"
									variant="light"
									onPress={onClose}
								>
									{copy.btn_close}
								</Button>
								<Button
									endContent={repair ? <IconTool /> : <IconDeviceFloppy />}
									isLoading={saving}
									isDisabled={invalid}
									color="success"
									onPress={apply}
								>
									{copy.btn_apply}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default CoachModal;
