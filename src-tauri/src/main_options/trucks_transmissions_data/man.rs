use crate::structs::vec_trucks::TransmissionStruct;

/*
__  __              _   _     _______    _____  __   __
|  \/  |     /\     | \ | |   |__   __|  / ____| \ \ / /
| \  / |    /  \    |  \| |      | |    | |  __   \ V /
| |\/| |   / /\ \   | . ` |      | |    | | |_ |   > <
| |  | |  / ____ \  | |\  |      | |    | |__| |  / . \
|_|  |_| /_/    \_\ |_| \_|      |_|     \_____| /_/ \_\

*/

pub const MAN_TGX_ZF12: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed.man.tgx.transmission",
    name: "ZF 12AS2330TD",
    speeds: "12",
    retarder: false,
    ratio: "15.86 - 1.00",
    code: "/def/vehicle/truck/man.tgx/transmission/12_speed.sii",
};

pub const MAN_TGX_ZF12_O: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_o.man.tgx.transmission",
    name: "ZF 12AS3140TO",
    speeds: "12",
    retarder: false,
    ratio: "12.29 - 0.78",
    code: "/def/vehicle/truck/man.tgx/transmission/12_speed_over.sii",
};

pub const MAN_TGX_ZF12_R: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_r.man.tgx.transmission",
    name: "ZF 12AS2331TD R",
    speeds: "12",
    retarder: true,
    ratio: "15.86 - 1.00",
    code: "/def/vehicle/truck/man.tgx/transmission/12_speed_ret.sii",
};

pub const MAN_TGX_ZF12_RO: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_ro.man.tgx.transmission",
    name: "ZF 12AS3141TO R",
    speeds: "12",
    retarder: true,
    ratio: "12.29 - 0.78",
    code: "/def/vehicle/truck/man.tgx/transmission/12_speed_ret_over.sii",
};

pub const MAN_TGX_ALLISON: TransmissionStruct = TransmissionStruct {
    name_id: "allison.man.tgx.transmission",
    name: "Allison 4500",
    speeds: "6",
    retarder: false,
    ratio: "4.70- 0.67",
    code: "/def/vehicle/truck/man.tgx/transmission/allison.sii",
};

pub const MAN_TGX_ALLISON_R: TransmissionStruct = TransmissionStruct {
    name_id: "allison_r.man.tgx.transmission",
    name: "Allison 4500 R",
    speeds: "6",
    retarder: true,
    ratio: "4.70- 0.67",
    code: "/def/vehicle/truck/man.tgx/transmission/allison_retarder.sii",
};

/*__  __              _   _     _______    _____  __   __    ______   _    _     __
|  \/  |     /\     | \ | |   |__   __|  / ____| \ \ / /   |  ____| | |  | |   / /
| \  / |    /  \    |  \| |      | |    | |  __   \ V /    | |__    | |  | |  / /_
| |\/| |   / /\ \   | . ` |      | |    | | |_ |   > <     |  __|   | |  | | | '_ \
| |  | |  / ____ \  | |\  |      | |    | |__| |  / . \    | |____  | |__| | | (_) |
|_|  |_| /_/    \_\ |_| \_|      |_|     \_____| /_/ \_\   |______|  \____/   \___/
*/

pub const MAN_TGX_E6_ALLISON: TransmissionStruct = TransmissionStruct {
    name_id: "allison.man.tgx_euro6.transmission",
    name: "Allison 4500",
    speeds: "6",
    retarder: false,
    ratio: "4.70 - 0.67",
    code: "/def/vehicle/truck/man.tgx_euro6/transmission/allison.sii",
};

pub const MAN_TGX_E6_ALLISON_R: TransmissionStruct = TransmissionStruct {
    name_id: "allison_r.man.tgx_euro6.transmission",
    name: "Allison 4500 R",
    speeds: "6",
    retarder: true,
    ratio: "4.70 - 0.67",
    code: "/def/vehicle/truck/man.tgx_euro6/transmission/allison.sii",
};

pub const MAN_TGX_E6_DD: TransmissionStruct = TransmissionStruct {
    name_id: "zf12as2330td.man.tgx_euro6.transmission",
    name: "TipMatic 12AS2330 DD",
    speeds: "12",
    retarder: false,
    ratio: "15.86 - 1.00",
    code: "/def/vehicle/truck/man.tgx_euro6/transmission/zf_12as2330td.sii",
};

pub const MAN_TGX_E6_DD_R: TransmissionStruct = TransmissionStruct {
    name_id: "zf12as2331td.man.tgx_euro6.transmission",
    name: "TipMatic 12AS2330 DD R",
    speeds: "12",
    retarder: true,
    ratio: "15.86 - 1.00",
    code: "/def/vehicle/truck/man.tgx_euro6/transmission/zf_12as2331td.sii",
};

pub const MAN_TGX_E6_OD: TransmissionStruct = TransmissionStruct {
    name_id: "zf12as3140to.man.tgx_euro6.transmission",
    name: "TipMatic 12AS3140 OD",
    speeds: "12",
    retarder: false,
    ratio: "12.29 - 0.78",
    code: "/def/vehicle/truck/man.tgx_euro6/transmission/zf_12as3140to.sii",
};

pub const MAN_TGX_E6_OD_R: TransmissionStruct = TransmissionStruct {
    name_id: "zf12as3141to.man.tgx_euro6.transmission",
    name: "TipMatic 12AS3141 OD R",
    speeds: "12",
    retarder: true,
    ratio: "12.29 - 0.78",
    code: "/def/vehicle/truck/man.tgx_euro6/transmission/zf_12as3141to.sii",
};

pub const MAN_TGX_E6_ZF: TransmissionStruct = TransmissionStruct {
    name_id: "zf16as2630to.man.tgx_euro6.transmission",
    name: "ZF 16AS2630TO",
    speeds: "16",
    retarder: false,
    ratio: "14.12 - 0.83",
    code: "/def/vehicle/truck/man.tgx_euro6/transmission/zf_16as2630to.sii",
};

pub const MAN_TGX_E6_ZF_R: TransmissionStruct = TransmissionStruct {
    name_id: "zf16as2631to.man.tgx_euro6.transmission",
    name: "ZF 16AS2630TO R",
    speeds: "16",
    retarder: true,
    ratio: "14.12 - 0.83",
    code: "/def/vehicle/truck/man.tgx_euro6/transmission/zf_16as2631to.sii",
};
