// images ets2
import ScaniaIcon from "@/static/icons/brands/ets2/scania.webp";
import VolvoIcon from "@/static/icons/brands/ets2/volvo.webp";
import ManIcon from "@/static/icons/brands/ets2/man.webp";
import DafIcon from "@/static/icons/brands/ets2/daf.webp";
import MercedesIcon from "@/static/icons/brands/ets2/mercedes.webp";
import RenaultIcon from "@/static/icons/brands/ets2/renault.webp";
import IvecoIcon from "@/static/icons/brands/ets2/iveco.webp";

// images ats
import KenworthIcon from "@/static/icons/brands/ats/kenworth.webp";
import InternationalIcon from "@/static/icons/brands/ats/international.webp";
import PeterbiltIcon from "@/static/icons/brands/ats/peterbilt.webp";
import MackIcon from "@/static/icons/brands/ats/mack.webp";
import Westernstar from "@/static/icons/brands/ats/westernstar.webp";
import Freightliner from "@/static/icons/brands/ats/freightliner.webp";

// types
import { BrandType } from "@/types/ConstTypes";

export const BRANDS_ETS2: BrandType[] = [
	{
		key: "scania",
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
		key: "volvo",
		name: "Volvo",
		models: [
			{ key: "fh16", name: "Volvo FH3" },
			{ key: "fh16_2012", name: "Volvo FH4" },
			{ key: "fh_2021", name: "Volvo FH5" },
			{ key: "fh_2024", name: "Volvo FH6" },
		],
		icon: VolvoIcon,
	},
	{
		key: "man",
		name: "MAN",
		models: [
			{ key: "tgx_2020", name: "MAN TGX 2020" },
			{ key: "tgx_euro6", name: "MAN TGX Euro 6" },
			{ key: "tgx", name: "MAN TGX" },
		],
		icon: ManIcon,
	},
	{
		key: "daf",
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
		key: "mercedes",
		name: "Mercedes-Benz",
		models: [
			{ key: "actros", name: "Mercedes-Benz Actros" },
			{ key: "actros2014", name: "Mercedes-Benz New Actros" },
		],
		icon: MercedesIcon,
	},
	{
		key: "renault",
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
		key: "iveco",
		name: "Iveco",
		models: [
			{ key: "hiway", name: "Iveco Hi-Way" },
			{ key: "stralis", name: "Iveco Stralis" },
			{ key: "sway", name: "Iveco S-Way" },
		],
		icon: IvecoIcon,
	},
];

export const BRANDS_ATS: BrandType[] = [
	{
		key: "kenworth",
		name: "Kenworth",
		models: [
			{ key: "t680", name: "Kenworth T680" },
			{ key: "t680_2022", name: "Kenworth T680 2022" },
			{ key: "w900", name: "Kenworth W900" },
		],
		icon: KenworthIcon,
	},
	{
		key: "freightliner",
		name: "Freightliner",
		models: [
			{ key: "cascadia2019", name: "Freightliner Cascadia 2019" },
			{ key: "cascadia2024", name: "Freightliner Cascadia 2024" },
		],
		icon: Freightliner,
	},
	{
		key: "volvo",
		name: "Volvo",
		models: [
			{ key: "vnl", name: "Volvo VNL" },
			{ key: "vnl2018", name: "Volvo VNL 2018" },
		],
		icon: VolvoIcon,
	},
	{
		key: "westernstar",
		name: "Western Star",
		models: [
			{ key: "49x", name: "Western Star 49X" },
			{ key: "5700xe", name: "Western Star 5700XE" },
			{ key: "57x", name: "Western Star 57X" },
		],
		icon: Westernstar,
	},
	{
		key: "peterbilt",
		name: "Peterbilt",
		models: [
			{ key: "389", name: "Peterbilt 389" },
			{ key: "579", name: "Peterbilt 579" },
		],
		icon: PeterbiltIcon,
	},
	{
		key: "intnational",
		name: "International",
		models: [
			{ key: "9900i", name: "International 9900i" },
			{ key: "lonestar", name: "International LoneStar" },
			{ key: "lt", name: "International LT" },
		],
		icon: InternationalIcon,
	},
	{
		key: "mack",
		name: "Mack",
		models: [
			{ key: "anthem", name: "Mack Anthem" },
			{ key: "pinnacle", name: "Mack Pinnacle" },
		],
		icon: MackIcon,
	},
];
