export interface Trailers {
	lang: string;
	trailers: TrailersClass;
}

export interface TrailersClass {
	tab_title: string;
	license_plate: LicensePlate;
	modify_job_weight: LicensePlate;
	unlock_trailer_country: UnlockTrailerCountry;
	modify_trailer_weight: ModifyTrailerWeight;
	repair_trailer: LicensePlate;
	repair_all_trailer: LicensePlate;
}

export interface LicensePlate {
	label_card: string;
	description_card: string;
	modal: LicensePlateModal;
}

export interface LicensePlateModal {
	title: string;
	description: string;
	btn_open: string;
	btn_close: string;
	btn_apply: string;
	input_weight?: InputWeight;
}

export interface InputWeight {
	label: string;
	placeholder: string;
}

export interface ModifyTrailerWeight {
	label_card: string;
	description_card: string;
	modal: ModifyTrailerWeightModal;
}

export interface ModifyTrailerWeightModal {
	title: string;
	description: string;
	input_chassis_weight: InputWeight;
	input_mass_weight: InputMassWeight;
	btn_open: string;
	btn_close: string;
	btn_apply: string;
}

export interface InputMassWeight {
	title: string;
	placeholder: string;
}

export interface UnlockTrailerCountry {
	label_card: string;
	description_card: string;
	modal: UnlockTrailerCountryModal;
}

export interface UnlockTrailerCountryModal {
	title: string;
	description: string;
	warning_message: WarningMessage;
	btn_open: string;
	btn_close: string;
	btn_apply: string;
	btn_how_to_use: string;
}

export interface WarningMessage {
	title: string;
	message: string;
}
