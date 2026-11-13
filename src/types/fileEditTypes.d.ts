import { SaveGame, ProfileDir, Model } from "@/types/SaveGameTypes";
import { IColor } from "react-color-palette";

export type themeTypes = "light" | "dark";
export type themeTypesSystem = "system" | "light" | "dark";

export interface responseRustTypes {
	res: boolean;
}

export interface responseProfileSaves extends responseRustTypes {
	save_games: SaveGame[];
}

export interface responseProfileSavesCount extends responseRustTypes {
	saves: number;
}

export interface responseTrucksInfo extends responseRustTypes {
	models: Model[];
}

export interface responseProfileDir extends responseRustTypes {
	profiles: ProfileDir[];
}

export interface responseSystemTheme extends responseRustTypes {
	theme: themeTypes;
}

export interface responseGetDeveloperValues extends responseRustTypes {
	developer: boolean;
	console: boolean;
	active_max_convoy_mode: boolean;
}

export interface licensePlateSaved {
	id: string;
	text: string;
	color_margin: boolean;
	text_color: IColor;
	bg_color: IColor;
}

export interface listLicensePlateSaved {
	license_plates_ets2: licensePlateSaved[];
}

export interface IColorRgbToValidate {
	readonly r: number;
	readonly g: number;
	readonly b: number;
	readonly a: number;
}

export interface IColorHsvToValidate {
	readonly h: number;
	readonly s: number;
	readonly v: number;
	readonly a: number;
}

export interface SaveTrucks {
	brand_name: string;
	truck_id: string;
	truck_number: number;
}

export interface ResponseSaveGameTrucks extends responseRustTypes {
	current_truck_id: string;
	trucks: SaveTrucks[];
}

export interface SaveTrailers {
	brand_name: string;
	trailer_id: string;
	trailer_number: number;
}

export interface ResponseSaveGameTrailers extends responseRustTypes {
	current_trailer_id: string | null;
	trailers: SaveTrailers[];
}

export interface ResponseSaveCameraPositions extends responseRustTypes {
	location: string;
	rotation: string;
}

export interface CoachPaintJob {
	path: string;
	name: string;
}

export interface CoachPart extends CoachPaintJob {
	model: string;
}

export interface CoachRoute {
	id: string;
	source: string;
	targets: string[];
	distance: number;
	minutes: number;
}

export interface CoachJobOptions {
	res: boolean;
	status: "ready" | "active_job" | "no_coach" | "no_routes";
	coach_id: string | null;
	capacity: number;
	routes: CoachRoute[];
	stops: string[];
	connections: CoachConnection[];
}

export interface CoachConnection {
	source: string;
	target: string;
}

export interface CoachJobRequest {
	generation: "offer" | "accepted";
	offer_id: string | null;
	coach_id: string;
	source: string;
	targets: string[];
	passengers: number;
	departure_delay: number;
}

export type CoachJobError =
	| "read_error"
	| "write_error"
	| "active_job"
	| "no_coach"
	| "no_routes"
	| "changed_save"
	| "invalid_route"
	| "invalid_request"
	| "unsupported_save"
	| "navigation_error";

export interface CoachJobResponse {
	res: boolean;
	error: CoachJobError | null;
}

export interface SaveCoach {
	id: string;
	model: string;
	odometer: number | null;
	license_plate: string;
	paint_job: string | null;
	paint_color: string | null;
	paint_jobs: CoachPaintJob[];
	engine: string | null;
	transmission: string | null;
	engines: CoachPart[];
	transmissions: CoachPart[];
}

export interface ResponseSaveCoaches extends responseRustTypes {
	current_coach_id: string | null;
	coaches: SaveCoach[];
}

export type CoachEdit =
	| { action: "engine" | "transmission"; path: string }
	| { action: "repair" }
	| { action: "repair_all" }
	| { action: "odometer"; km: number }
	| {
			action: "license_plate";
			text: string;
			background: string;
			foreground: string;
			margin: boolean;
	  }
	| {
			action: "paint_job";
			path: string;
			color: string | null;
	  };
