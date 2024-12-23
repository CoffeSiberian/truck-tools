export interface Trucks {
	trucks: TrucksClass;
}

export interface TrucksClass {
	tab_title: string;
	change_truck_engine: ChangeTruck;
	change_truck_transmission: ChangeTruck;
	license_plate: FillAllTrucksFuel;
	repair_truck: FillAllTrucksFuel;
	repair_all_trucks: FillAllTrucksFuel;
	fill_fuel: FillAllTrucksFuel;
	fill_all_trucks_fuel: FillAllTrucksFuel;
	infinite_fuel: InfiniteFuel;
}

export interface ChangeTruck {
	label_card: string;
	description_card: string;
	modal: ChangeTruckEngineModal;
}

export interface ChangeTruckEngineModal {
	title: string;
	description: string;
	warning_message: WarningMessage;
	input_brands: Input;
	input_models: Input;
	input_engines?: Input;
	btn_close: string;
	btn_remove_badge: string;
	btn_apply: string;
	input_transmissions?: Input;
}

export interface Input {
	label: string;
	placeholder: string;
}

export interface WarningMessage {
	title: string;
	message: string;
}

export interface FillAllTrucksFuel {
	label_card: string;
	description_card: string;
	modal: FillAllTrucksFuelModal;
}

export interface FillAllTrucksFuelModal {
	title: string;
	description: string;
	btn_close: string;
	btn_apply: string;
}

export interface InfiniteFuel {
	label_card: string;
	description_card: string;
	modal: InfiniteFuelModal;
}

export interface InfiniteFuelModal {
	title: string;
	description: string;
	warning_message: WarningMessage;
	btn_close: string;
	btn_restore_fuel: string;
	btn_apply: string;
}
