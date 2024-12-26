export interface Profile {
	profile: ProfileClass;
}

export interface ProfileClass {
	tab_title: string;
	add_money: AddMoney;
	add_experience: AddExperience;
	garage_status: GarageStatus;
	visited_cities: VisitedCities;
	dealer_visited: DealerVisited;
	skills_points: SkillsPoints;
}

export interface AddMoney {
	label_card: string;
	description_card: string;
	modal: AddMoneyModal;
}

export interface AddExperience {
	label_card: string;
	description_card: string;
	modal: AddExperienceModal;
}

export interface GarageStatus {
	label_card: string;
	description_card: string;
	modal: GarageStatusModal;
}

export interface VisitedCities {
	label_card: string;
	description_card: string;
	modal: VisitedCitiesModal;
}

export interface DealerVisited {
	label_card: string;
	description_card: string;
	modal: DealerVisitedModal;
}

export interface AddExperienceModal {
	title: string;
	description: string;
	btn_open: string;
	btn_close: string;
	btn_apply: string;
	input_experience: Input;
}

export interface GarageStatusModal {
	title: string;
	description: string;
	btn_open: string;
	btn_close: string;
	btn_apply: string;
	input_garage_status: InputGarageStatus;
}

export interface VisitedCitiesModal {
	title: string;
	description: string;
	btn_open: string;
	btn_close: string;
	btn_apply: string;
	input_city_status: InputStatus;
}

export interface DealerVisitedModal {
	title: string;
	description: string;
	btn_open: string;
	btn_close: string;
	btn_apply: string;
	input_dealer_status: InputStatus;
}

export interface AddMoneyModal {
	title: string;
	description: string;
	btn_open: string;
	btn_close: string;
	btn_apply: string;
	input_money: Input;
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
