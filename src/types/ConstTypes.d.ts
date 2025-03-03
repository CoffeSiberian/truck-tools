export interface ATR_Values {
	name: string;
	img: string;
}

export interface BrandModelTypes {
	key: string;
	name: string;
}

export interface BrandType {
	key: string;
	name: string;
	models: BrandModelTypes[];
	icon: string;
}
