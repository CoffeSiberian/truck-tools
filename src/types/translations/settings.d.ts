export interface Settings {
	lang: string;
	title: string;
	input_chnage_theme: InputChnageTheme;
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
