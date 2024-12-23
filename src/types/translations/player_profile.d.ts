export interface PlayerProfile {
	lang: string;
	no_selected_profile: string;
	total_saves: string;
	input_select_profile: InputSelectProfile;
	input_select_save: Input;
	btn_profile: string;
	dropdown: Dropdown;
}

export interface Dropdown {
	save_game_options: SaveGameOptions;
	profile_options: ProfileOptions;
}

export interface ProfileOptions {
	title: string;
	btn_backup_profile: BtnBackupProfile;
	btn_rename_profile: BtnCloneProfileClass;
	btn_clone_profile: BtnCloneProfileClass;
	btn_copy_config: BtnCloneProfileClass;
}

export interface BtnBackupProfile {
	label: string;
	description: string;
	modal: BtnBackupProfileModal;
}

export interface BtnBackupProfileModal {
	title: string;
	description: string;
	input_backup_destination: Input;
	save_folder_dialog: SaveFolderDialog;
	btn_close: string;
	btn_apply: string;
}

export interface Input {
	label: string;
	placeholder: string;
}

export interface SaveFolderDialog {
	title: string;
	filters_name: FiltersName;
}

export interface FiltersName {
	zip: string;
}

export interface BtnCloneProfileClass {
	label: string;
	description: string;
	modal: BtnCloneProfileModal;
}

export interface BtnCloneProfileModal {
	title: string;
	description: string;
	input_new_name?: Input;
	btn_close: string;
	btn_apply: string;
	input_select_profile?: Input;
}

export interface SaveGameOptions {
	title: string;
	btn_open_folder: BtnDecryptSaveClass;
	btn_decrypt_save: BtnDecryptSaveClass;
}

export interface BtnDecryptSaveClass {
	label: string;
	description: string;
}

export interface InputSelectProfile {
	label: string;
	placeholder: string;
	options: Options;
}

export interface Options {
	save_load: string;
}
