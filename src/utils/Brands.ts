// images
import ScaniaIcon from "@/static/icons/brands/scania.svg";
import VolvoIcon from "@/static/icons/brands/volvo.svg";
import ManIcon from "@/static/icons/brands/man.svg";
import DafIcon from "@/static/icons/brands/daf.svg";
import MercedesIcon from "@/static/icons/brands/mercedes.svg";
import RenaultIcon from "@/static/icons/brands/renault.svg";
import IvecoIcon from "@/static/icons/brands/iveco.svg";

// types
import { BrandType } from "@/types/ConstTypes";

export const BRANDS_ETS2: BrandType[] = [
	{
		name: "Scania",
		models: [
			{ key: "s_2024e", name: "Scania S BEV" },
			{ key: "s_2016", name: "Scania S" },
			{ key: "r_2016", name: "Scania R" },
			{ key: "streamline", name: "Scania Streamline" },
			{ key: "r", name: "Scania R 2009" },
		],
		icon: ScaniaIcon,
	},
	{
		name: "Volvo",
		models: [
			{ key: "fh16", name: "Volvo FH" },
			{ key: "fh16_2012", name: "Volvo FH Classic" },
		],
		icon: VolvoIcon,
	},
	{
		name: "MAN",
		models: [
			{ key: "tgx_2020", name: "MAN TGX 2020" },
			{ key: "tgx_euro6", name: "MAN TGX Euro 6" },
			{ key: "tgx", name: "MAN TGX" },
		],
		icon: ManIcon,
	},
	{
		name: "DAF",
		models: [
			{ key: "xd", name: "DAF XD" },
			{ key: "2021", name: "DAF 2021" },
			{ key: "xf", name: "DAF XF" },
			{ key: "xf_euro6", name: "DAF XF EURO6" },
		],
		icon: DafIcon,
	},
	{
		name: "Mercedes-Benz",
		models: [
			{ key: "actros", name: "Mercedes-Benz Actros" },
			{ key: "actros2014", name: "Mercedes-Benz New Actros" },
		],
		icon: MercedesIcon,
	},
	{
		name: "Renault",
		models: [
			{ key: "etech_t", name: "Renault E-Tech" },
			{ key: "t", name: "Renault T" },
			{ key: "magnum", name: "Renault Magnum" },
			{ key: "premium", name: "Renault Premium" },
		],
		icon: RenaultIcon,
	},
	{
		name: "Iveco",
		models: [
			{ key: "hiway", name: "Iveco Hi-Way" },
			{ key: "stralis", name: "Iveco Stralis" },
		],
		icon: IvecoIcon,
	},
];
