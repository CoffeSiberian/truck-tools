import { useContext, useRef, useState } from "react";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { RadioGroup } from "@heroui/radio";
import { Spinner } from "@heroui/spinner";
import { useDisclosure } from "@heroui/use-disclosure";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/modal";
import {
	IconArrowDown,
	IconArrowUp,
	IconDeviceFloppy,
	IconPencil,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import AlertSave from "@/components/AlertSave";
import CustomRadio from "@/components/CustomRadio";
import { LocaleContext } from "@/hooks/useLocaleContext";
import { ProfileContex } from "@/hooks/useProfileContex";
import { CoachJobOptions } from "@/types/fileEditTypes";
import { generateCoachJob, getCoachJobOptions } from "@/utils/fileEdit";

const CoachJobModal = () => {
	const { selectedSave, game } = useContext(ProfileContex);
	const { translations, lang } = useContext(LocaleContext);
	const t = translations.menu_options.coaches;
	const copy = t.job_generator.modal;
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const modalRef = useRef<HTMLDivElement>(null);
	const version = useRef(0);
	const [options, setOptions] = useState<CoachJobOptions>();
	const [loading, setLoading] = useState(false);
	const [loadError, setLoadError] = useState(false);
	const [saving, setSaving] = useState(false);
	const [generated, setGenerated] = useState(false);
	const [completed, setCompleted] = useState({
		error: false,
		completed: false,
	});
	const [source, setSource] = useState("");
	const [mode, setMode] = useState("custom");
	const [stops, setStops] = useState([""]);
	const [routeId, setRouteId] = useState("");
	const [passengers, setPassengers] = useState("30");
	const [delay, setDelay] = useState("0");
	const stopName = (id: string) => {
		const token = id.replace(/^bus_stop\./, "").replace(/^city\./, "");
		return (
			t.city_names[token] ??
			token
				.split("_")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ")
		);
	};
	const sources = [
		...new Set(
			mode === "custom"
				? (options?.stops ?? [])
				: (options?.routes.map((r) => r.source) ?? [])
		),
	].sort((a, b) => stopName(a).localeCompare(stopName(b), lang));
	const allStops = [...(options?.stops ?? [])].sort((a, b) =>
		stopName(a).localeCompare(stopName(b), lang)
	);
	const graph = new Map<string, string[]>();
	for (const edge of options?.connections ?? []) {
		const targets = graph.get(edge.source) ?? [];
		targets.push(edge.target);
		graph.set(edge.source, targets);
	}
	const reachable = (from: string) => {
		const visited = new Set<string>();
		const queue = [from];
		while (queue.length) {
			const current = queue.pop()!;
			if (visited.has(current)) continue;
			visited.add(current);
			queue.push(...(graph.get(current) ?? []));
		}
		return visited;
	};
	const unreachable =
		mode === "custom" &&
		!!source &&
		(!graph.has(source) ||
			stops.some((stop, i) => {
				const previous = i === 0 ? source : stops[i - 1];
				return !!stop && (stop === previous || !reachable(previous).has(stop));
			}));
	const moveStop = (index: number, offset: number) =>
		setStops((previous) => {
			const next = [...previous];
			[next[index], next[index + offset]] = [next[index + offset], next[index]];
			return next;
		});
	const routes = options?.routes.filter((r) => r.source === source) ?? [];
	const route = routes.find((r) => r.id === routeId);
	const status = options?.status;
	const ready = status === "ready";
	const invalid =
		!ready ||
		(mode === "existing"
			? !route
			: !source || unreachable || stops.some((stop) => !stop)) ||
		loading ||
		!options?.coach_id ||
		!/^\d+$/.test(passengers) ||
		Number(passengers) < 1 ||
		Number(passengers) > (options?.capacity ?? 0) ||
		!/^\d+$/.test(delay) ||
		Number(delay) > 10080 ||
		generated;

	const load = async () => {
		if (!selectedSave) return;
		const current = ++version.current;
		setLoading(true);
		setLoadError(false);
		setOptions(undefined);
		setGenerated(false);
		setSource("");
		setMode("custom");
		setStops([""]);
		setRouteId("");
		setPassengers("30");
		setDelay("0");
		setCompleted({ error: false, completed: false });
		try {
			const response = await getCoachJobOptions(selectedSave.dir);
			if (current !== version.current) return;
			if (!response?.res) throw new Error("load");
			setOptions(response);
		} catch {
			if (current === version.current) setLoadError(true);
		} finally {
			if (current === version.current) setLoading(false);
		}
	};

	const apply = async () => {
		if (!selectedSave || !options?.coach_id || invalid || saving) return;
		setSaving(true);
		setCompleted({ error: false, completed: false });
		try {
			const res = await generateCoachJob(selectedSave.dir, {
				offer_id: mode === "existing" ? route!.id : null,
				coach_id: options.coach_id,
				source,
				targets:
					mode === "existing"
						? route!.targets
						: stops.map((stop) => stop.replace(/^bus_stop\./, "")),
				passengers: Number(passengers),
				departure_delay: Number(delay),
			});
			setCompleted({ error: !res, completed: true });
			setGenerated(res);
		} catch {
			setCompleted({ error: true, completed: true });
		} finally {
			setSaving(false);
		}
	};

	return (
		<>
			<Button
				endContent={<IconPencil stroke={2} />}
				color="primary"
				variant="shadow"
				isDisabled={!selectedSave || game !== "ets2"}
				onPress={() => {
					onOpen();
					void load();
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
				size="lg"
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
								{ready && options && !loading && (
									<>
										<RadioGroup
											value={mode}
											label={t.job_inputs.mode.label}
											orientation="horizontal"
											isDisabled={saving}
											onValueChange={(value) => {
												setMode(value);
												setSource("");
												setRouteId("");
												setStops([""]);
											}}
										>
											<CustomRadio
												value="custom"
												selectedGarage={mode}
												text={t.job_controls.custom}
											/>
											<CustomRadio
												value="existing"
												selectedGarage={mode}
												text={t.job_controls.existing}
											/>
										</RadioGroup>
										<Select
											variant="bordered"
											label={t.job_inputs.source.label}
											placeholder={t.job_inputs.source.placeholder}
											popoverProps={{
												portalContainer: modalRef.current ?? undefined,
											}}
											isDisabled={saving}
											selectedKeys={source ? [source] : []}
											onSelectionChange={(keys) => {
												setSource(Array.from(keys)[0]?.toString() ?? "");
												setRouteId("");
											}}
										>
											{sources.map((id) => (
												<SelectItem key={id}>{stopName(id)}</SelectItem>
											))}
										</Select>
										{mode === "existing" && (
											<Select
												variant="bordered"
												label={t.job_inputs.route.label}
												placeholder={t.job_inputs.route.placeholder}
												popoverProps={{
													portalContainer: modalRef.current ?? undefined,
												}}
												isDisabled={saving || !source}
												selectedKeys={route ? [route.id] : []}
												onSelectionChange={(keys) =>
													setRouteId(Array.from(keys)[0]?.toString() ?? "")
												}
											>
												{routes.map((r) => (
													<SelectItem
														key={r.id}
														textValue={r.targets.map(stopName).join(" → ")}
													>
														{r.targets.map(stopName).join(" → ")} ({r.distance}{" "}
														km)
													</SelectItem>
												))}
											</Select>
										)}
										{mode === "custom" && (
											<>
												<p className="text-small text-default-500">
													{t.job_controls.stop_limit}
												</p>
												{stops.map((stop, index) => {
													const previous =
														index === 0 ? source : stops[index - 1];
													const connected = reachable(previous);
													const available = allStops.filter(
														(id) =>
															id === stop ||
															(id !== previous && connected.has(id))
													);
													const numbered = (text: string) =>
														text.replace("{number}", String(index + 1));
													return (
														<div
															key={index}
															className="flex items-center gap-1"
														>
															<Select
																className="flex-1"
																variant="bordered"
																label={numbered(t.job_inputs.stop.label)}
																placeholder={t.job_inputs.stop.placeholder}
																popoverProps={{
																	portalContainer:
																		modalRef.current ?? undefined,
																}}
																isDisabled={saving || !previous}
																selectedKeys={stop ? [stop] : []}
																onSelectionChange={(keys) =>
																	setStops((current) =>
																		current.map((id, i) =>
																			i === index
																				? (Array.from(keys)[0]?.toString() ??
																					"")
																				: id
																		)
																	)
																}
															>
																{available.map((id) => (
																	<SelectItem key={id}>
																		{stopName(id)}
																	</SelectItem>
																))}
															</Select>
															<Button
																isIconOnly
																size="sm"
																variant="light"
																aria-label={numbered(t.job_controls.move_up)}
																isDisabled={saving || index === 0}
																onPress={() => moveStop(index, -1)}
															>
																<IconArrowUp size={18} />
															</Button>
															<Button
																isIconOnly
																size="sm"
																variant="light"
																aria-label={numbered(t.job_controls.move_down)}
																isDisabled={
																	saving || index === stops.length - 1
																}
																onPress={() => moveStop(index, 1)}
															>
																<IconArrowDown size={18} />
															</Button>
															<Button
																isIconOnly
																size="sm"
																color="danger"
																variant="light"
																aria-label={numbered(
																	t.job_controls.remove_stop
																)}
																isDisabled={saving || stops.length === 1}
																onPress={() =>
																	setStops((current) =>
																		current.filter((_, i) => i !== index)
																	)
																}
															>
																<IconTrash size={18} />
															</Button>
														</div>
													);
												})}
												<Button
													className="shrink-0"
													variant="bordered"
													startContent={<IconPlus size={18} />}
													isDisabled={saving || stops.length >= 9}
													onPress={() =>
														setStops((current) => [...current, ""])
													}
												>
													{t.job_controls.add_stop}
												</Button>
												{unreachable && (
													<p className="text-danger">
														{t.job_controls.unreachable}
													</p>
												)}
											</>
										)}
										<Input
											type="number"
											variant="bordered"
											label={t.job_inputs.passengers.label}
											placeholder={t.job_inputs.passengers.placeholder}
											min={1}
											max={options.capacity}
											value={passengers}
											onValueChange={setPassengers}
											isDisabled={saving}
											description={`1–${options.capacity}`}
										/>
										<Input
											type="number"
											variant="bordered"
											label={t.job_inputs.departure_delay.label}
											placeholder={t.job_inputs.departure_delay.placeholder}
											min={0}
											max={10080}
											value={delay}
											onValueChange={setDelay}
											isDisabled={saving}
										/>
									</>
								)}
								{!loading && (loadError || (status && status !== "ready")) && (
									<p className="text-danger">
										{loadError
											? t.load_error
											: status && status !== "ready"
												? t.job_status[status]
												: ""}
									</p>
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
										setCompleted((prev) => ({ ...prev, completed: false }))
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
									endContent={<IconDeviceFloppy />}
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

export default CoachJobModal;
