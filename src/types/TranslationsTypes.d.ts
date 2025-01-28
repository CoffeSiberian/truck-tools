/**
 * Auto-generated interfaces for more convenience when writing translations
 * https://app.quicktype.io/
 * Remember to disable “Merge similar classes” to not have optional parameters
 */

export type Langs =
	| "en-US"
	| "es-CL"
	| "zh-Hans"
	| "fr-FR"
	| "vi-VN"
	| "pt-BR"
	| "ko-KR"
	| "zh-Hant"
	| "uk-UA"
	| "de-DE";

export interface TranslationsTypes {
	components: Components;
	menu_options: MenuOptions;
}

export interface Components {
	alert_on_save_default: AlertOnSaveDefault;
	license_plate: ComponentsLicensePlate;
	player_profile: PlayerProfile;
	profile_error: ProfileError;
	updater: Updater;
}

export interface AlertOnSaveDefault {
	error: string;
	succes: string;
}

export interface ComponentsLicensePlate {
	btn_delete: string;
	btn_load: string;
	btn_store: string;
	input_colored_margin: string;
	input_license_plate: Input;
	input_license_plate_list_store: Input;
	title_select_bg_color: string;
	title_select_text_color: string;
}

export interface Input {
	label: string;
	placeholder: string;
}

export interface PlayerProfile {
	btn_profile: string;
	dropdown: Dropdown;
	input_select_profile: InputSelectProfile;
	input_select_save: Input;
	no_selected_profile: string;
	no_selected_save: string;
	total_saves: string;
}

export interface Dropdown {
	profile_options: ProfileOptions;
	save_game_options: SaveGameOptions;
}

export interface ProfileOptions {
	btn_backup_profile: BtnBackupProfile;
	btn_clone_profile: BtnCloneProfile;
	btn_copy_config: BtnCopyConfig;
	btn_rename_profile: BtnRenameProfile;
	title: string;
}

export interface BtnBackupProfile {
	description: string;
	label: string;
	modal: BtnBackupProfileModal;
}

export interface BtnBackupProfileModal {
	btn_apply: string;
	btn_close: string;
	btn_open_folder: string;
	description: string;
	input_backup_destination: Input;
	save_folder_dialog: SaveFolderDialog;
	title: string;
}

export interface SaveFolderDialog {
	filters_name: FiltersName;
	title: string;
}

export interface FiltersName {
	zip: string;
}

export interface BtnCloneProfile {
	description: string;
	label: string;
	modal: BtnCloneProfileModal;
}

export interface BtnCloneProfileModal {
	btn_apply: string;
	btn_close: string;
	description: string;
	input_new_name: Input;
	title: string;
}

export interface BtnCopyConfig {
	description: string;
	label: string;
	modal: BtnCopyConfigModal;
}

export interface BtnCopyConfigModal {
	btn_apply: string;
	btn_close: string;
	description: string;
	input_select_profile: Input;
	title: string;
}

export interface BtnRenameProfile {
	description: string;
	label: string;
	modal: BtnRenameProfileModal;
}

export interface BtnRenameProfileModal {
	btn_apply: string;
	btn_close: string;
	description: string;
	input_new_name: Input;
	title: string;
}

export interface SaveGameOptions {
	btn_decrypt_save: Btn;
	btn_open_folder: Btn;
	title: string;
}

export interface Btn {
	description: string;
	label: string;
}

export interface InputSelectProfile {
	label: string;
	options: InputSelectProfileOptions;
	placeholder: string;
}

export interface InputSelectProfileOptions {
	save_load: string;
}

export interface ProfileError {
	btn_how_to: string;
	btn_how_to_disable: string;
	description: string;
	title: string;
}

export interface Updater {
	alert_message: string;
	btn_cancel: string;
	btn_manual_update: string;
	btn_update_now: string;
	downloading: string;
	release_notes: string;
	title: string;
	version: string;
}

export interface MenuOptions {
	about: About;
	profile: Profile;
	settings: Settings;
	trailers: Trailers;
	trucks: Trucks;
}

export interface About {
	description: string;
	tab_title: string;
}

export interface Profile {
	add_experience: AddExperience;
	add_money: AddMoney;
	dealer_visited: DealerVisited;
	garage_status: GarageStatus;
	skills_points: SkillsPoints;
	tab_title: string;
	visited_cities: VisitedCities;
}

export interface AddExperience {
	description_card: string;
	label_card: string;
	modal: AddExperienceModal;
}

export interface AddExperienceModal {
	btn_apply: string;
	btn_close: string;
	btn_open: string;
	description: string;
	input_experience: Input;
	title: string;
}

export interface AddMoney {
	description_card: string;
	label_card: string;
	modal: AddMoneyModal;
}

export interface AddMoneyModal {
	btn_apply: string;
	btn_close: string;
	btn_open: string;
	description: string;
	input_money: Input;
	title: string;
}

export interface DealerVisited {
	description_card: string;
	label_card: string;
	modal: DealerVisitedModal;
}

export interface DealerVisitedModal {
	btn_apply: string;
	btn_close: string;
	btn_open: string;
	description: string;
	input_dealer_status: InputDealerStatus;
	title: string;
}

export interface InputDealerStatus {
	label: string;
	options: InputDealerStatusOptions;
}

export interface InputDealerStatusOptions {
	unvisit_all: string;
	visit_all: string;
}

export interface GarageStatus {
	description_card: string;
	label_card: string;
	modal: GarageStatusModal;
}

export interface GarageStatusModal {
	btn_apply: string;
	btn_close: string;
	btn_open: string;
	description: string;
	input_garage_status: InputGarageStatus;
	title: string;
}

export interface InputGarageStatus {
	label: string;
	options: InputGarageStatusOptions;
}

export interface InputGarageStatusOptions {
	large_garage: string;
	medium_garage: string;
	sell_garage: string;
	small_garage: string;
}

export interface SkillsPoints {
	description_card: string;
	label_card: string;
	modal: SkillsPointsModal;
}

export interface SkillsPointsModal {
	btn_apply: string;
	btn_close: string;
	btn_open: string;
	description: string;
	eco_driving: string;
	fragile_cargo: string;
	high_value_cargo: string;
	input_skills_points: InputSkillsPoints;
	just_in_time_delivery: string;
	long_distance: string;
	title: string;
}

export interface InputSkillsPoints {
	corrosive: string;
	explosives: string;
	flammable_liquids: string;
	flammable_solids: string;
	gases: string;
	label: string;
	placeholder: string;
	toxic_and_infectious: string;
}

export interface VisitedCities {
	description_card: string;
	label_card: string;
	modal: VisitedCitiesModal;
}

export interface VisitedCitiesModal {
	btn_apply: string;
	btn_close: string;
	btn_open: string;
	description: string;
	input_city_status: InputCityStatus;
	title: string;
}

export interface InputCityStatus {
	label: string;
	options: InputDealerStatusOptions;
}

export interface Settings {
	btn_reset: string;
	document_dialog_title: string;
	input_change_language: Input;
	input_change_theme: InputChangeTheme;
	input_document_folder: Input;
	input_enable_128_slots: string;
	input_enable_console: string;
	input_opacity_profile: string;
	tab_title: string;
	title: string;
}

export interface InputChangeTheme {
	label: string;
	options: InputChangeThemeOptions;
	placeholder: string;
}

export interface InputChangeThemeOptions {
	dark: string;
	light: string;
	system: string;
}

export interface Trailers {
	license_plate: TrailersLicensePlate;
	modify_job_weight: ModifyJobWeight;
	modify_trailer_weight: ModifyTrailerWeight;
	repair_all_trailer: RepairAllTrailer;
	repair_trailer: RepairTrailer;
	tab_title: string;
	unlock_trailer_country: UnlockTrailerCountry;
}

export interface TrailersLicensePlate {
	description_card: string;
	label_card: string;
	modal: LicensePlateModal;
}

export interface LicensePlateModal {
	btn_apply: string;
	btn_close: string;
	btn_open: string;
	description: string;
	title: string;
}

export interface ModifyJobWeight {
	description_card: string;
	label_card: string;
	modal: ModifyJobWeightModal;
}

export interface ModifyJobWeightModal {
	btn_apply: string;
	btn_close: string;
	btn_open: string;
	description: string;
	input_weight: Input;
	title: string;
}

export interface ModifyTrailerWeight {
	description_card: string;
	label_card: string;
	modal: ModifyTrailerWeightModal;
}

export interface ModifyTrailerWeightModal {
	btn_apply: string;
	btn_close: string;
	btn_open: string;
	description: string;
	input_body_mass: Input;
	input_chassis_mass: Input;
	title: string;
}

export interface RepairAllTrailer {
	description_card: string;
	label_card: string;
	modal: LicensePlateModal;
}

export interface RepairTrailer {
	description_card: string;
	label_card: string;
	modal: LicensePlateModal;
}

export interface UnlockTrailerCountry {
	description_card: string;
	label_card: string;
	modal: UnlockTrailerCountryModal;
}

export interface UnlockTrailerCountryModal {
	btn_apply: string;
	btn_close: string;
	btn_how_to_use: string;
	btn_open: string;
	description: string;
	title: string;
	warning_message: WarningMessage;
}

export interface WarningMessage {
	message: string;
	title: string;
}

export interface Trucks {
	change_truck_engine: ChangeTruckEngine;
	change_truck_transmission: ChangeTruckTransmission;
	fill_all_trucks_fuel: FillAllTrucksFuel;
	fill_fuel: FillFuel;
	infinite_fuel: InfiniteFuel;
	license_plate: TrucksLicensePlate;
	repair_all_trucks: RepairAllTrucks;
	repair_truck: RepairTruck;
	tab_title: string;
}

export interface ChangeTruckEngine {
	description_card: string;
	label_card: string;
	modal: ChangeTruckEngineModal;
}

export interface ChangeTruckEngineModal {
	btn_apply: string;
	btn_close: string;
	btn_open: string;
	btn_remove_badge: string;
	description: string;
	input_brands: Input;
	input_engines: Input;
	input_models: Input;
	title: string;
	warning_message: WarningMessage;
}

export interface ChangeTruckTransmission {
	description_card: string;
	label_card: string;
	modal: ChangeTruckTransmissionModal;
}

export interface ChangeTruckTransmissionModal {
	btn_apply: string;
	btn_close: string;
	btn_open: string;
	btn_remove_badge: string;
	description: string;
	input_brands: Input;
	input_models: Input;
	input_transmissions: Input;
	title: string;
	warning_message: WarningMessage;
}

export interface FillAllTrucksFuel {
	description_card: string;
	label_card: string;
	modal: LicensePlateModal;
}

export interface FillFuel {
	description_card: string;
	label_card: string;
	modal: LicensePlateModal;
}

export interface InfiniteFuel {
	description_card: string;
	label_card: string;
	modal: InfiniteFuelModal;
}

export interface InfiniteFuelModal {
	btn_apply: string;
	btn_close: string;
	btn_open: string;
	btn_restore_fuel: string;
	description: string;
	title: string;
	warning_message: WarningMessage;
}

export interface TrucksLicensePlate {
	description_card: string;
	label_card: string;
	modal: LicensePlateModal;
}

export interface RepairAllTrucks {
	description_card: string;
	label_card: string;
	modal: LicensePlateModal;
}

export interface RepairTruck {
	description_card: string;
	label_card: string;
	modal: LicensePlateModal;
}
