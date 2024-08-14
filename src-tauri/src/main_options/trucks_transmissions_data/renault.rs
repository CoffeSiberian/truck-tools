use crate::structs::vec_trucks::TransmissionStruct;

/*_____    ______   _   _              _    _   _        _______   
|  __ \  |  ____| | \ | |     /\     | |  | | | |      |__   __|  
| |__) | | |__    |  \| |    /  \    | |  | | | |         | |     
|  _  /  |  __|   | . ` |   / /\ \   | |  | | | |         | |     
| | \ \  | |____  | |\  |  / ____ \  | |__| | | |____     | |     
|_|  \_\ |______| |_| \_| /_/    \_\  \____/  |______|    |_|   
|  __ \  |  __ \  |  ____| |  \/  | |_   _| | |  | | |  \/  |
| |__) | | |__) | | |__    | \  / |   | |   | |  | | | \  / |
|  ___/  |  _  /  |  __|   | |\/| |   | |   | |  | | | |\/| |
| |      | | \ \  | |____  | |  | |  _| |_  | |__| | | |  | |
|_|      |_|  \_\ |______| |_|  |_| |_____|  \____/  |_|  |_|
*/


pub const RENAULT_PREMIUM_A12: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed.renault.premium.transmission",
    name: "Optidriver AT2412D",
    speeds: "12",
    retarder: false,
    ratio: "14.94 - 1.0",
    code: "/def/vehicle/truck/renault.premium/transmission/12_speed.sii",
};

pub const RENAULT_PREMIUM_A12_O: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_o.renault.premium.transmission",
    name: "Optidriver ATO2612D",
    speeds: "12",
    retarder: false,
    ratio: "11.73 - 0.78",
    code: "/def/vehicle/truck/renault.premium/transmission/12_speed_over.sii",
};

pub const RENAULT_PREMIUM_AT12_R: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_r.renault.premium.transmission",
    name: "Optidriver AT2412D R",
    speeds: "12",
    retarder: true,
    ratio: "14.94 - 1.0",
    code: "/def/vehicle/truck/renault.premium/transmission/12_speed_ret.sii",
};

pub const RENAULT_PREMIUM_AT12_RO: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_ro.renault.premium.transmission",
    name: "Optidriver ATO2612D R",
    speeds: "12",
    retarder: true,
    ratio: "11.73 - 0.78",
    code: "/def/vehicle/truck/renault.premium/transmission/12_speed_ret_over.sii",
};

pub const RENAULT_PREMIUM_ALLISON: TransmissionStruct = TransmissionStruct {
    name_id: "allison.renault.premium.transmission",
    name: "Allison 4500",
    speeds: "6",
    retarder: false,
    ratio: "4.7 - 0.67",
    code: "/def/vehicle/truck/renault.premium/transmission/allison.sii",
};

pub const RENAULT_PREMIUM_ALLISON_R: TransmissionStruct = TransmissionStruct {
    name_id: "allison_r.renault.premium.transmission",
    name: "Allison 4500 R",
    speeds: "6",
    retarder: true,
    ratio: "4.7 - 0.67",
    code: "/def/vehicle/truck/renault.premium/transmission/allison_retarder.sii",
};

pub const RENAULT_PREMIUM_ZF16: TransmissionStruct = TransmissionStruct {
    name_id: "zf16as2630to.renault.premium.transmission",
    name: "ZF 16AS2630TO",
    speeds: "16",
    retarder: false,
    ratio: "14.12 - 0.83",
    code: "/def/vehicle/truck/renault.premium/transmission/zf_16as2630to.sii",
};

pub const RENAULT_PREMIUM_ZF16_R: TransmissionStruct = TransmissionStruct {
    name_id: "zf16as2631to.renault.premium.transmission",
    name: "ZF 16AS2631TO R",
    speeds: "16",
    retarder: true,
    ratio: "14.12 - 0.83",
    code: "/def/vehicle/truck/renault.premium/transmission/zf16as2631to.sii",
};

/*   
_____    ______   _   _              _    _   _        _______         _______ 
|  __ \  |  ____| | \ | |     /\     | |  | | | |      |__   __|       |__   __|
| |__) | | |__    |  \| |    /  \    | |  | | | |         | |             | |   
|  _  /  |  __|   | . ` |   / /\ \   | |  | | | |         | |             | |   
| | \ \  | |____  | |\  |  / ____ \  | |__| | | |____     | |       _     | |   
|_|  \_\ |______| |_| \_| /_/    \_\  \____/  |______|    |_|      (_)    |_|   
*/



pub const RENAULT_T_ALLISON: TransmissionStruct = TransmissionStruct {
    name_id: "allison.renault.t.transmission",
    name: "Allison 4500",
    speeds: "6",
    retarder: false,
    ratio: "4.7 - 0.67",
    code: "/def/vehicle/truck/renault.t/transmission/allison.sii",
};

pub const RENAULT_T_ALLISON_R: TransmissionStruct = TransmissionStruct {
    name_id: "allison_r.renault.t.transmission",
    name: "Allison 4500 R",
    speeds: "6",
    retarder: true,
    ratio: "4.7 - 0.67",
    code: "/def/vehicle/truck/renault.t/transmission/allison_retarder.sii",
};

pub const RENAULT_T_AT12: TransmissionStruct = TransmissionStruct {
    name_id: "at2612f.renault.t.transmission",
    name: "Optidriver AT2612F",
    speeds: "12",
    retarder: false,
    ratio: "14.94 - 1.0",
    code: "/def/vehicle/truck/renault.t/transmission/at2612f.sii",
};

pub const RENAULT_T_AT12_R: TransmissionStruct = TransmissionStruct {
    name_id: "at2612fr.renault.t.transmission",
    name: "Optidriver AT2612F R",
    speeds: "12",
    retarder: true,
    ratio: "14.94 - 1.0",
    code: "/def/vehicle/truck/renault.t/transmission/at2612fr.sii",
};

pub const RENAULT_T_ATO12: TransmissionStruct = TransmissionStruct {
    name_id: "ato2612f.renault.t.transmission",
    name: "Optidriver ATO2612F",
    speeds: "12",
    retarder: false,
    ratio: "11.73 - 0.79",
    code: "/def/vehicle/truck/renault.t/transmission/ato2612f.sii",
};

pub const RENAULT_T_AT14: TransmissionStruct = TransmissionStruct {
    name_id: "ato2614f.renault.t.transmission",
    name: "Optidriver Xtended ATO2614F",
    speeds: "14",
    retarder: false,
    ratio: "32.04 - 0.79",
    code: "/def/vehicle/truck/renault.t/transmission/ato2614f.sii",
};

pub const RENAULT_T_AT14_R: TransmissionStruct = TransmissionStruct {
    name_id: "ato2614fr.renault.t.transmission",
    name: "Optidriver Xtended ATO2614F R",
    speeds: "14",
    retarder: true,
    ratio: "32.04 - 0.79",
    code: "/def/vehicle/truck/renault.t/transmission/ato2614fr.sii",
};

/*_____    ______   _   _              _    _   _        _______   
|  __ \  |  ____| | \ | |     /\     | |  | | | |      |__   __|  
| |__) | | |__    |  \| |    /  \    | |  | | | |         | |     
|  _  /  |  __|   | . ` |   / /\ \   | |  | | | |         | |     
| | \ \  | |____  | |\  |  / ____ \  | |__| | | |____     | |     
|_|  \_\ |______| |_| \_| /_/    \_\  \____/  |______|    |_|   
__  __               _____   _   _   _    _   __  __ 
|  \/  |     /\      / ____| | \ | | | |  | | |  \/  |
| \  / |    /  \    | |  __  |  \| | | |  | | | \  / |
| |\/| |   / /\ \   | | |_ | | . ` | | |  | | | |\/| |
| |  | |  / ____ \  | |__| | | |\  | | |__| | | |  | |
|_|  |_| /_/    \_\  \_____| |_| \_|  \____/  |_|  |_|
*/

pub const RENAULT_MAGNUM_AT12: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed.renault.magnum.transmission",
    name: "Optidriver AT2412D",
    speeds: "12",
    retarder: false,
    ratio: "14.94 - 1.0",
    code: "/def/vehicle/truck/renault.magnum/transmission/12_speed.sii",
};

pub const RENAULT_MAGNUM_AT12_O: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_o.renault.magnum.transmission",
    name: "Optidriver ATO2612D",
    speeds: "12",
    retarder: false,
    ratio: "11.73 - 0.78",
    code: "/def/vehicle/truck/renault.magnum/transmission/12_speed_over.sii",
};

pub const RENAULT_MAGNUM_AT12_R: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_r.renault.magnum.transmission",
    name: "Optidriver AT2412D R",
    speeds: "12",
    retarder: true,
    ratio: "14.94 - 1.0",
    code: "/def/vehicle/truck/renault/magnum/transmission/12_speed_ret.sii",
};

pub const RENAULT_MAGNUM_AT12_RO: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_ro.renault.magnum.transmission",
    name: "Optidriver ATO2612D R",
    speeds: "12",
    retarder: true,
    ratio: "11.73 - 0.78",
    code: "/def/vehicle/truck/renault.magnum/transmission/12_speed_ret_over.sii",
};

pub const RENAULT_MAGNUM_ALLISON: TransmissionStruct = TransmissionStruct {
    name_id: "allison.renault.magnum.transmission",
    name: "Allison 4500",
    speeds: "6",
    retarder: false,
    ratio: "4.7 - 0.67",
    code: "/def/vehicle/truck/renault.magnum/transmission/allison.sii",
};

pub const RENAULT_MAGNUM_ALLISON_R: TransmissionStruct = TransmissionStruct {
    name_id: "allison_r.renault.magnum.transmission",
    name: "Allison 4500 R",
    speeds: "6",
    retarder: true,
    ratio: "4.7 - 0.67",
    code: "/def/vehicle/truck/renault.magnum/transmission/allison_retarder.sii",
};

pub const RENAULT_MAGNUM_ZF16: TransmissionStruct = TransmissionStruct {
    name_id: "zf16as2630to.renault.magnum.transmission",
    name: "ZF 16AS2630TO",
    speeds: "16",
    retarder: false,
    ratio: "14.12 - 0.83",
    code: "/def/vehicle/truck/renault.magnum/transmission/zf_16as2630to.sii",
};

pub const RENAULT_MAGNUM_ZF16_R: TransmissionStruct = TransmissionStruct {
    name_id: "zf16as2631to.renault.magnum.transmission",
    name: "ZF 16AS2631TO R",
    speeds: "16",
    retarder: true,
    ratio: "14.12 - 0.83",
    code: "/def/vehicle/truck/renault.magnum/transmission/zf_16as2631to.sii",
};


