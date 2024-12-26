export interface Settings {
	tab_title: string;
	title: string;
	document_dialog_title: string;
	input_change_theme: InputChnageTheme;
	input_change_language: Input;
	input_enable_console: string;
	input_enable_128_slots: string;
	input_opacity_profile: string;
	input_document_folder: Input;
	btn_reset: string;
}

export interface Input {
	label: string;
	placeholder: string;
}

export interface InputChnageTheme {
	label: string;
	placeholder: string;
	options: Options;
}

export interface Options {
	system: string;
	light: string;
	dark: string;
}
