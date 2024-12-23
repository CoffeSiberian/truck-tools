export interface Settings {
	profile: Profile;
}

export interface Profile {
	tab_title: string;
	add_money: AddExperience;
	add_experience: AddExperience;
	garage_status: AddExperience;
	visited_cities: AddExperience;
	dealer_visited: AddExperience;
	skills_points: SkillsPoints;
}

export interface AddExperience {
	label_card: string;
	description_card: string;
	modal: AddExperienceModal;
}

export interface AddExperienceModal {
	title: string;
	description: string;
	input_experience?: Input;
	btn_open: string;
	btn_close: string;
	btn_apply: string;
	input_money?: Input;
	input_dealer_status?: InputStatus;
	input_garage_status?: InputGarageStatus;
	input_city_status?: InputStatus;
}

export interface InputStatus {
	label: string;
	options: InputCityStatusOptions;
}

export interface InputCityStatusOptions {
	visit_all: string;
	unvisit_all: string;
}

export interface Input {
	label: string;
	placeholder: string;
}

export interface InputGarageStatus {
	label: string;
	options: InputGarageStatusOptions;
}

export interface InputGarageStatusOptions {
	sell_garage: string;
	small_garage: string;
	medium_garage: string;
	large_garage: string;
}

export interface SkillsPoints {
	label_card: string;
	description_card: string;
	modal: SkillsPointsModal;
}

export interface SkillsPointsModal {
	title: string;
	description: string;
	input_skills_points: InputSkillsPoints;
	long_distance: string;
	high_value_cargo: string;
	fragile_cargo: string;
	just_in_time_delivery: string;
	eco_driving: string;
	btn_open: string;
	btn_close: string;
	btn_apply: string;
}

export interface InputSkillsPoints {
	label: string;
	placeholder: string;
	explosives: string;
	gases: string;
	flammable_liquids: string;
	flammable_solids: string;
	toxic_and_infectious: string;
	corrosive: string;
}
