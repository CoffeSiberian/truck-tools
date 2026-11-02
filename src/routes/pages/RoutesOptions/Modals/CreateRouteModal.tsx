import { useState, useContext, useMemo, type ReactNode } from "react";

// UI
import { useDisclosure } from "@heroui/use-disclosure";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { Slider } from "@heroui/slider";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
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
	getSaveGameRouteData,
	setCustomRoute as setCustomRouteSave,
} from "@/utils/fileEdit";
import { formatCityName, getCityCountryOrState } from "@/utils/citiesData";
import { formatCompanyName } from "@/utils/companiesData";
import classNames from "classnames";

// Icons
import {
	IconRoute,
	IconPencil,
	IconRefresh,
	IconMapPin,
	IconPackage,
	IconShare,
	IconCheck,
	IconFlag,
	IconNavigation,
	IconBolt,
	IconTruckDelivery,
	IconChevronDown,
	IconCircleCheck,
} from "@tabler/icons-react";

// Types
import {
	ResponseSaveGameRouteData,
	CustomRoutePayload,
	TrailerDefinitionOption,
	RouteStartMode,
} from "@/types/fileEditTypes";

interface StepProps {
	number: number;
	icon: ReactNode;
	title: string;
	children: ReactNode;
}

interface StartOptionProps {
	icon: ReactNode;
	title: string;
	description: string;
	selected: boolean;
	unavailableReason?: string;
	onSelect: () => void;
}

// Median ratio between offers' road distance and map distance, in both games.
const ROAD_KM_PER_MAP_KM = 25;
const FALLBACK_DISTANCE_KM = 450;

const Step = ({ number, icon, title, children }: StepProps) => (
	<section className="flex gap-3">
		<div className="bg-primary/15 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold">
			{number}
		</div>
		<div className="flex min-w-0 flex-1 flex-col gap-3">
			<h3 className="flex h-7 items-center gap-2 font-semibold">
				{icon}
				{title}
			</h3>
			{children}
		</div>
	</section>
);

const StartOption = ({
	icon,
	title,
	description,
	selected,
	unavailableReason,
	onSelect,
}: StartOptionProps) => (
	<button
		type="button"
		onClick={onSelect}
		disabled={Boolean(unavailableReason)}
		aria-pressed={selected}
		className={classNames(
			"flex flex-col gap-1 rounded-xl border p-3 text-left transition-colors",
			unavailableReason && "cursor-not-allowed opacity-50",
			selected
				? "border-primary bg-primary/10"
				: "border-default-200 hover:bg-default-100"
		)}
	>
		<span className="flex items-center gap-2 text-sm font-semibold">
			{icon}
			{title}
		</span>
		<span className="text-default-500 text-xs">
			{unavailableReason || description}
		</span>
	</button>
);

const CreateRouteModal = () => {
	const { selectedSave, game } = useContext(ProfileContex);
	const { translations, lang } = useContext(LocaleContext);
	const { create_route } = translations.menu_options.routes;
	const text = create_route.modal;

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [loadingData, setLoadingData] = useState<boolean>(false);
	const [routeData, setRouteData] = useState<ResponseSaveGameRouteData | null>(
		null
	);
	const [onlyDiscovered, setOnlyDiscovered] = useState<boolean>(true);
	const [showUnusual, setShowUnusual] = useState<boolean>(true);
	const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

	// Form selections. Everything is optional: effective* values below fall back
	// to the first valid option, so changing one step never leaves an invalid route.
	const [originCity, setOriginCity] = useState<string>("");
	const [originCompany, setOriginCompany] = useState<string>("");
	const [selectedCargo, setSelectedCargo] = useState<string>("");
	const [destCity, setDestCity] = useState<string>("");
	const [destCompany, setDestCompany] = useState<string>("");
	const [selectedTrailerDef, setSelectedTrailerDef] = useState<string>("");
	const [selectedTrailerVar, setSelectedTrailerVar] = useState<string>("");
	const [selectedStartMode, setSelectedStartMode] =
		useState<RouteStartMode>("offer");
	const [urgency, setUrgency] = useState<number>(0);
	const [unitsCount, setUnitsCount] = useState<number>(60);

	const [isApplying, setIsApplying] = useState<boolean>(false);
	const [failed, setFailed] = useState<boolean>(false);
	const [appliedMode, setAppliedMode] = useState<RouteStartMode | null>(null);
	const [copiedConvoy, setCopiedConvoy] = useState<boolean>(false);

	const loadSaveRouteInfo = async () => {
		if (!selectedSave) return;
		setLoadingData(true);
		setAppliedMode(null);
		const data = await getSaveGameRouteData(selectedSave.dir, game);
		setRouteData(data);
		setLoadingData(false);

		if (data?.visited_cities.length === 0) setOnlyDiscovered(false);
	};

	const handleOpen = () => {
		onOpen();
		loadSaveRouteInfo();
	};

	// Labels come from the selected game's data; mods fall back to their tokens.
	const cityName = (city: string) =>
		routeData?.cities[city]?.name || formatCityName(city);
	const cityRegion = (city: string) => {
		const known = getCityCountryOrState(city, game, lang);
		if (known && known !== "USA") return known;
		return (routeData?.cities[city]?.region || "")
			.replace(/_/g, " ")
			.replace(/\b\w/g, (letter) => letter.toUpperCase());
	};
	const companyName = (company: string) =>
		routeData?.companies[company]?.name || formatCompanyName(company, game);
	const cargoName = (cargo: string) =>
		routeData?.cargo_names[cargo] ||
		cargo.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

	const cityList = useMemo(() => {
		if (!routeData) return [];
		return onlyDiscovered && routeData.visited_cities.length > 0
			? routeData.visited_cities
			: routeData.all_cities;
	}, [routeData, onlyDiscovered]);

	const sortCities = (cities: string[]) =>
		[...cities].sort((a, b) => cityName(a).localeCompare(cityName(b)));

	// STEP 1: origin. Only companies with an offer slot can receive a route.
	const originCityList = sortCities(
		cityList.filter((city) =>
			routeData?.origin_companies_by_city.some((c) => c.city === city)
		)
	);
	const effectiveOriginCity = originCityList.includes(originCity)
		? originCity
		: originCityList[0] || "";
	const originCompanies =
		routeData?.origin_companies_by_city.find(
			(c) => c.city === effectiveOriginCity
		)?.companies ?? [];
	const effectiveOriginCompany = originCompanies.includes(originCompany)
		? originCompany
		: originCompanies[0] || "";

	// STEP 4 options are needed early: taking a job limits the cargo to the own trailer.
	const ownTrailer = routeData?.own_trailer ?? null;
	const originPosition =
		routeData?.positions[`${effectiveOriginCompany}.${effectiveOriginCity}`];

	const noPlaceReason = originPosition ? undefined : text.unavailable_no_place;
	const takeNowReason =
		noPlaceReason ||
		(routeData?.current_job ? text.unavailable_active_job : undefined) ||
		(ownTrailer ? undefined : text.unavailable_no_trailer);
	const startMode: RouteStartMode =
		(selectedStartMode === "teleport" && noPlaceReason) ||
		(selectedStartMode === "take_now" && takeNowReason)
			? "offer"
			: selectedStartMode;

	// STEP 2: cargo the origin company ships, among those this save can resolve.
	const availableCargos = useMemo(() => {
		if (!routeData) return [];
		return startMode === "take_now" && routeData.own_trailer
			? Object.keys(routeData.own_trailer.cargo_units)
			: routeData.cargos;
	}, [routeData, startMode]);

	const shippedCargos = routeData?.companies[effectiveOriginCompany]?.cargo_out;
	const cargoList = useMemo(() => {
		const usual = availableCargos.filter((c) => shippedCargos?.includes(c));
		const cargos = showUnusual || usual.length === 0 ? availableCargos : usual;
		return [...cargos].sort((a, b) =>
			(routeData?.cargo_names[a] || a).localeCompare(
				routeData?.cargo_names[b] || b
			)
		);
	}, [availableCargos, shippedCargos, showUnusual, routeData]);

	const effectiveCargo = cargoList.includes(selectedCargo)
		? selectedCargo
		: cargoList[0] || "";

	// STEP 3: destinations that receive that cargo.
	const receivesCargo = (company: string) => {
		const received = routeData?.companies[company]?.cargo_in;
		return showUnusual || !received || received.includes(effectiveCargo);
	};
	const isOrigin = (city: string, company: string) =>
		city === effectiveOriginCity && company === effectiveOriginCompany;

	const destinationsOf = (city: string) =>
		(
			routeData?.companies_by_city.find((c) => c.city === city)?.companies ?? []
		).filter((company) => receivesCargo(company) && !isOrigin(city, company));

	const destCityList = sortCities(
		cityList.filter((city) => destinationsOf(city).length > 0)
	);
	const effectiveDestCity = destCityList.includes(destCity)
		? destCity
		: destCityList.find((city) => city !== effectiveOriginCity) ||
			destCityList[0] ||
			"";
	const destCompanies = destinationsOf(effectiveDestCity);
	const effectiveDestCompany = destCompanies.includes(destCompany)
		? destCompany
		: destCompanies[0] || "";

	const destPosition =
		routeData?.positions[`${effectiveDestCompany}.${effectiveDestCity}`];
	const distanceKm =
		originPosition && destPosition
			? Math.max(
					Math.round(
						(Math.hypot(
							originPosition[0] - destPosition[0],
							originPosition[1] - destPosition[1]
						) /
							1000) *
							ROAD_KM_PER_MAP_KM
					),
					1
				)
			: FALLBACK_DISTANCE_KM;

	// Trailer: chosen for the player, editable in the advanced options.
	const cargoTrailers: TrailerDefinitionOption[] =
		routeData?.cargo_trailers?.[effectiveCargo] ?? [];
	const trailerDefinitionsList = cargoTrailers.filter(
		(t, index) =>
			cargoTrailers.findIndex((o) => o.definition === t.definition) === index
	);
	const effectiveTrailerDef = cargoTrailers.some(
		(t) => t.definition === selectedTrailerDef
	)
		? selectedTrailerDef
		: cargoTrailers[0]?.definition || "";
	const trailerVariants = cargoTrailers.filter(
		(t) => t.definition === effectiveTrailerDef
	);
	const effectiveTrailerVar = trailerVariants.some(
		(t) => t.variant === selectedTrailerVar
	)
		? selectedTrailerVar
		: trailerVariants[0]?.variant || "";

	const usesOwnTrailer = startMode === "take_now";
	const maxUnits =
		(usesOwnTrailer
			? ownTrailer?.cargo_units[effectiveCargo]
			: trailerVariants.find((t) => t.variant === effectiveTrailerVar)
					?.max_units) || 1;
	const effectiveUnits = Math.min(unitsCount, maxUnits);

	const canApply =
		Boolean(effectiveOriginCity && effectiveOriginCompany) &&
		Boolean(effectiveDestCity && effectiveDestCompany) &&
		Boolean(effectiveCargo) &&
		(usesOwnTrailer || Boolean(effectiveTrailerDef && effectiveTrailerVar)) &&
		!(startMode === "take_now" && !destPosition);

	const buildPayload = (): CustomRoutePayload => ({
		source_city: effectiveOriginCity,
		source_company: effectiveOriginCompany,
		target_city: effectiveDestCity,
		target_company: effectiveDestCompany,
		cargo: effectiveCargo,
		units_count: effectiveUnits,
		urgency: urgency,
		distance_km: distanceKm,
		apply_mode: "offer",
		trailer_mode: "freight",
		trailer_definition: effectiveTrailerDef,
		trailer_variant: effectiveTrailerVar,
		game: game,
	});

	const applyCustomRoute = async () => {
		if (!selectedSave || !canApply) return;

		setIsApplying(true);
		setFailed(false);
		const res = await setCustomRouteSave(
			selectedSave.dir,
			{ ...buildPayload(), start_mode: startMode },
			game
		);
		setIsApplying(false);

		if (res) {
			setAppliedMode(startMode);
		} else {
			setFailed(true);
		}
	};

	const exportConvoyCode = () => {
		navigator.clipboard.writeText(btoa(JSON.stringify(buildPayload())));
		setCopiedConvoy(true);
		setTimeout(() => setCopiedConvoy(false), 2500);
	};

	const fillRoutePlace = (message: string) =>
		message
			.replace("{company}", companyName(effectiveOriginCompany))
			.replace("{city}", cityName(effectiveOriginCity));

	const applyLabel = {
		offer: text.btn_offer,
		teleport: text.btn_teleport,
		take_now: text.btn_take,
	}[startMode];

	const nextStepMessage = appliedMode
		? fillRoutePlace(
				{
					offer: text.next_offer,
					teleport: text.next_teleport,
					take_now: text.next_take,
				}[appliedMode]
			)
		: "";

	const cityItems = (cities: string[]) =>
		cities.map((city) => (
			<AutocompleteItem
				key={city}
				textValue={`${cityName(city)} ${cityRegion(city)}`}
			>
				<div className="flex items-center justify-between gap-2">
					<span className="text-sm font-semibold">{cityName(city)}</span>
					<span className="text-default-400 text-xs">{cityRegion(city)}</span>
				</div>
			</AutocompleteItem>
		));

	return (
		<>
			<Button
				endContent={<IconPencil stroke={2} />}
				onPress={handleOpen}
				isDisabled={!selectedSave}
				color="primary"
				variant="shadow"
			>
				{text.btn_open}
			</Button>

			<Modal
				size="3xl"
				backdrop="blur"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				scrollBehavior="inside"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="border-default-200 flex flex-col gap-1 border-b">
								<div className="flex items-center justify-between gap-2">
									<span className="flex items-center gap-2 text-xl font-bold">
										<IconRoute className="text-primary" size={26} />
										{text.title}
									</span>
									<Button
										isIconOnly
										size="sm"
										variant="light"
										aria-label={text.btn_reload}
										onPress={loadSaveRouteInfo}
										isLoading={loadingData}
										className="mr-6"
									>
										<IconRefresh size={18} />
									</Button>
								</div>
								<p className="text-default-500 text-sm font-normal">
									{text.description}
								</p>
							</ModalHeader>

							<ModalBody className="gap-6 py-5">
								<AlertSave
									message={text.error_message}
									error={true}
									show={failed}
									setShowFalse={() => setFailed(false)}
								/>

								{loadingData ? (
									<div className="flex flex-col items-center justify-center gap-3 py-12">
										<Spinner size="lg" color="primary" />
										<p className="text-default-400 text-sm">
											{text.loading_data}
										</p>
									</div>
								) : appliedMode ? (
									<div className="flex flex-col items-center gap-3 py-8 text-center">
										<IconCircleCheck className="text-success" size={56} />
										<h3 className="text-xl font-bold">{text.success_title}</h3>
										<p className="text-default-600 max-w-md text-sm">
											{nextStepMessage}
										</p>
										<div className="mt-2 flex flex-wrap justify-center gap-2">
											{appliedMode !== "take_now" && (
												<Button
													color="primary"
													startContent={
														copiedConvoy ? (
															<IconCheck size={18} />
														) : (
															<IconShare size={18} />
														)
													}
													onPress={exportConvoyCode}
												>
													{text.btn_convoy}
												</Button>
											)}
											<Button
												variant="flat"
												color="primary"
												onPress={loadSaveRouteInfo}
											>
												{text.btn_new_route}
											</Button>
										</div>
									</div>
								) : (
									<>
										<Step
											number={1}
											icon={<IconMapPin size={18} />}
											title={text.step_origin}
										>
											<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
												<Autocomplete
													aria-label={text.origin_city_label}
													label={text.origin_city_label}
													selectedKey={effectiveOriginCity || null}
													onSelectionChange={(key) => {
														if (key) setOriginCity(key as string);
													}}
													size="sm"
													variant="bordered"
													isClearable={false}
												>
													{cityItems(originCityList)}
												</Autocomplete>
												<Autocomplete
													aria-label={text.origin_company_label}
													label={text.origin_company_label}
													selectedKey={effectiveOriginCompany || null}
													onSelectionChange={(key) => {
														if (key) setOriginCompany(key as string);
													}}
													size="sm"
													variant="bordered"
													isClearable={false}
												>
													{originCompanies.map((company) => (
														<AutocompleteItem
															key={company}
															textValue={companyName(company)}
														>
															{companyName(company)}
														</AutocompleteItem>
													))}
												</Autocomplete>
											</div>
											<Switch
												isSelected={onlyDiscovered}
												onValueChange={setOnlyDiscovered}
												size="sm"
											>
												<span className="text-xs">
													{text.filter_discovered_only}
												</span>
											</Switch>
										</Step>

										<Step
											number={2}
											icon={<IconPackage size={18} />}
											title={text.step_cargo}
										>
											<Autocomplete
												aria-label={text.cargo_label}
												label={text.cargo_label}
												placeholder={text.cargo_placeholder}
												selectedKey={effectiveCargo || null}
												onSelectionChange={(key) => {
													if (key) setSelectedCargo(key as string);
												}}
												size="sm"
												variant="bordered"
												isClearable={false}
												description={
													cargoList.length === 0
														? text.no_cargos
														: text.cargo_hint
												}
											>
												{cargoList.map((cargo) => (
													<AutocompleteItem
														key={cargo}
														textValue={cargoName(cargo)}
													>
														{cargoName(cargo)}
													</AutocompleteItem>
												))}
											</Autocomplete>
											<Switch
												isSelected={showUnusual}
												onValueChange={setShowUnusual}
												size="sm"
												color="warning"
											>
												<span className="text-xs">{text.show_unusual}</span>
											</Switch>
										</Step>

										<Step
											number={3}
											icon={<IconFlag size={18} />}
											title={text.step_destination}
										>
											<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
												<Autocomplete
													aria-label={text.dest_city_label}
													label={text.dest_city_label}
													selectedKey={effectiveDestCity || null}
													onSelectionChange={(key) => {
														if (key) setDestCity(key as string);
													}}
													size="sm"
													variant="bordered"
													isClearable={false}
												>
													{cityItems(destCityList)}
												</Autocomplete>
												<Autocomplete
													aria-label={text.dest_company_label}
													label={text.dest_company_label}
													selectedKey={effectiveDestCompany || null}
													onSelectionChange={(key) => {
														if (key) setDestCompany(key as string);
													}}
													size="sm"
													variant="bordered"
													isClearable={false}
												>
													{destCompanies.map((company) => (
														<AutocompleteItem
															key={company}
															textValue={companyName(company)}
														>
															{companyName(company)}
														</AutocompleteItem>
													))}
												</Autocomplete>
											</div>
										</Step>

										<Step
											number={4}
											icon={<IconTruckDelivery size={18} />}
											title={text.step_start}
										>
											<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
												<StartOption
													icon={<IconNavigation size={18} />}
													title={text.mode_offer_title}
													description={text.mode_offer_desc}
													selected={startMode === "offer"}
													onSelect={() => setSelectedStartMode("offer")}
												/>
												<StartOption
													icon={<IconMapPin size={18} />}
													title={text.mode_teleport_title}
													description={text.mode_teleport_desc}
													selected={startMode === "teleport"}
													unavailableReason={noPlaceReason}
													onSelect={() => setSelectedStartMode("teleport")}
												/>
												<StartOption
													icon={<IconBolt size={18} />}
													title={text.mode_take_title}
													description={text.mode_take_desc}
													selected={startMode === "take_now"}
													unavailableReason={takeNowReason}
													onSelect={() => setSelectedStartMode("take_now")}
												/>
											</div>

											<div className="flex flex-wrap items-center gap-2">
												<span className="text-default-500 text-xs">
													{text.urgency_label}
												</span>
												{[
													text.urgency_normal,
													text.urgency_urgent,
													text.urgency_critical,
												].map((label, index) => (
													<Chip
														key={label}
														as="button"
														size="sm"
														variant={urgency === index ? "solid" : "flat"}
														color={urgency === index ? "primary" : "default"}
														onClick={() => setUrgency(index)}
													>
														{label}
													</Chip>
												))}
											</div>

											<button
												type="button"
												onClick={() => setShowAdvanced(!showAdvanced)}
												aria-expanded={showAdvanced}
												className="text-default-500 hover:text-default-700 flex w-fit items-center gap-1 text-xs"
											>
												<IconChevronDown
													size={16}
													className={classNames(
														"transition-transform",
														showAdvanced && "rotate-180"
													)}
												/>
												{text.advanced}
											</button>

											{showAdvanced && (
												<div className="border-default-200 flex flex-col gap-3 rounded-xl border p-3">
													{!usesOwnTrailer && (
														<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
															<Select
																label={text.trailer_label}
																selectedKeys={
																	effectiveTrailerDef
																		? new Set([effectiveTrailerDef])
																		: new Set([])
																}
																onSelectionChange={(keys) => {
																	const val = Array.from(keys)[0] as string;
																	if (val) setSelectedTrailerDef(val);
																}}
																size="sm"
																variant="bordered"
															>
																{trailerDefinitionsList.map((t) => (
																	<SelectItem
																		key={t.definition}
																		textValue={t.label}
																	>
																		{t.label}
																	</SelectItem>
																))}
															</Select>
															<Select
																label={text.variant_label}
																selectedKeys={
																	effectiveTrailerVar
																		? new Set([effectiveTrailerVar])
																		: new Set([])
																}
																onSelectionChange={(keys) => {
																	const val = Array.from(keys)[0] as string;
																	if (val) setSelectedTrailerVar(val);
																}}
																size="sm"
																variant="bordered"
															>
																{trailerVariants.map((t) => (
																	<SelectItem
																		key={t.variant}
																		textValue={t.variant}
																	>
																		{t.variant}
																	</SelectItem>
																))}
															</Select>
														</div>
													)}
													<div className="flex flex-col gap-1">
														<div className="text-default-500 flex justify-between text-xs">
															<span>{text.units_count_label}</span>
															<b>{effectiveUnits}</b>
														</div>
														<Slider
															size="sm"
															step={1}
															minValue={1}
															maxValue={Math.max(maxUnits, 2)}
															isDisabled={maxUnits <= 1}
															value={effectiveUnits}
															onChange={(val) => setUnitsCount(val as number)}
															aria-label={text.units_count_label}
														/>
													</div>
												</div>
											)}
										</Step>

										{routeData?.current_job && startMode !== "take_now" && (
											<Warning
												text={
													<div className="text-xs">
														{text.active_job_warning}
													</div>
												}
											/>
										)}
										<p className="text-default-400 text-xs">
											{text.close_game_note}
										</p>
									</>
								)}
							</ModalBody>

							<ModalFooter className="border-default-200 flex flex-wrap items-center justify-between gap-3 border-t">
								{appliedMode || loadingData ? (
									<span />
								) : (
									<div className="flex min-w-0 flex-col text-xs">
										<span className="truncate font-semibold">
											{effectiveOriginCity && effectiveDestCity
												? `${cityName(effectiveOriginCity)} → ${cityName(effectiveDestCity)}`
												: ""}
										</span>
										<span className="text-default-500 truncate">
											{effectiveCargo ? cargoName(effectiveCargo) : ""} ·{" "}
											{effectiveUnits} u ·{" "}
											{text.distance_estimate.replace(
												"{km}",
												distanceKm.toString()
											)}
										</span>
									</div>
								)}
								<div className="flex items-center gap-2">
									{appliedMode || loadingData ? (
										<Button variant="light" onPress={onClose}>
											{text.btn_close}
										</Button>
									) : (
										<>
											<Button
												isIconOnly
												variant="light"
												aria-label={text.btn_convoy}
												title={text.btn_convoy}
												isDisabled={!canApply || usesOwnTrailer}
												onPress={exportConvoyCode}
											>
												{copiedConvoy ? (
													<IconCheck size={18} />
												) : (
													<IconShare size={18} />
												)}
											</Button>
											<Button variant="light" onPress={onClose}>
												{text.btn_close}
											</Button>
											<Button
												endContent={<IconRoute size={18} />}
												isLoading={isApplying}
												isDisabled={!canApply}
												color="success"
												onPress={applyCustomRoute}
											>
												{applyLabel}
											</Button>
										</>
									)}
								</div>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default CreateRouteModal;
