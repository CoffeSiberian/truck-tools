export interface LicensePlate {
	input_license_plate: InputLicensePlate;
	input_colored_margin: string;
	input_license_plate_list_store: InputLicensePlate;
	title_select_bg_color: string;
	title_select_text_color: string;
	btn_store: string;
	btn_load: string;
	btn_delete: string;
}

export interface InputLicensePlate {
	label: string;
	placeholder: string;
}
