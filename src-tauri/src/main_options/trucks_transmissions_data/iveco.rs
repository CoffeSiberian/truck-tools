use crate::structs::vec_trucks::TransmissionStruct;

/*_____  __      __  ______    _____    ____      _    _   _____  __          __            __     __
|_   _| \ \    / / |  ____|  / ____|  / __ \    | |  | | |_   _| \ \        / /     /\     \ \   / /
  | |    \ \  / /  | |__    | |      | |  | |   | |__| |   | |    \ \  /\  / /     /  \     \ \_/ /
  | |     \ \/ /   |  __|   | |      | |  | |   |  __  |   | |     \ \/  \/ /     / /\ \     \   /
 _| |_     \  /    | |____  | |____  | |__| |   | |  | |  _| |_     \  /\  /     / ____ \     | |
|_____|     \/     |______|  \_____|  \____/    |_|  |_| |_____|     \/  \/     /_/    \_\    |_|
*/

pub const IVECO_HIWAY_ZF12: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed.iveco.hiway.transmission",
    name: "ZF 12AS2330TD",
    speeds: "12",
    retarder: false,
    ratio: "15.86 - 1.0",
    code: "/def/vehicle/truck/iveco.hiway/transmission/12_speed.sii",
};

pub const IVECO_HIWAY_ZF12_O: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_o.iveco.hiway.transmission",
    name: "ZF 12AS2530TO",
    speeds: "12",
    retarder: false,
    ratio: "12.33 - 0.78",
    code: "/def/vehicle/truck/iveco.hiway/transmission/12_speed_over.sii",
};

pub const IVECO_HIWAY_ZF12_R: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_r.iveco.hiway.transmission",
    name: "ZF 12AS2331TD R",
    speeds: "12",
    retarder: true,
    ratio: "15.86 - 1.0",
    code: "/def/vehicle/truck/iveco.hiway/transmission/12_speed_r.sii",
};

pub const IVECO_HIWAY_ZF12_RO: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_ro.iveco.hiway.transmission",
    name: "ZF 12AS2531TO R",
    speeds: "12",
    retarder: true,
    ratio: "12.33 - 0.78",
    code: "/def/vehicle/truck/iveco.hiway/transmission/12_speed_ret_over.sii",
};

pub const IVECO_HIWAY_ALLISON: TransmissionStruct = TransmissionStruct {
    name_id: "allison.iveco.hiway.transmission",
    name: "Allison 4500",
    speeds: "6",
    retarder: false,
    ratio: "4.7 - 0.67",
    code: "/def/vehicle/truck/iveco.hiway/transmission/allison.sii",
};

pub const IVECO_HIWAY_ALLISON_R: TransmissionStruct = TransmissionStruct {
    name_id: "allison_r.iveco.hiway.transmission",
    name: "Allison 4500 R",
    speeds: "6",
    retarder: true,
    ratio: "4.7 - 0.67",
    code: "/def/vehicle/truck/iveco.hiway/transmission/allison_retarder.sii",
};

pub const IVECO_HIWAY_ZF16: TransmissionStruct = TransmissionStruct {
    name_id: "zf16as2630to.iveco.hiway.transmission",
    name: "ZF 16AS2630TO",
    speeds: "16",
    retarder: false,
    ratio: "14.12 - 0.83",
    code: "/def/vehicle/truck/iveco.hiway/transmission/zf_16as2630to.sii",
};

pub const IVECO_HIWAY_ZF16_R: TransmissionStruct = TransmissionStruct {
    name_id: "zf16as2631to.iveco.hiway.transmission",
    name: "ZF 16AS2631TO R",
    speeds: "16",
    retarder: true,
    ratio: "14.12 - 0.83",
    code: "/def/vehicle/truck/iveco.hiway/transmission/zf_16as2631to.sii",
};

/* __  __      __  ______    _____    ____
|_   _| \ \    / / |  ____|  / ____|  / __ \
  | |    \ \  / /  | |__    | |      | |  | |
  | |     \ \/ /   |  __|   | |      | |  | |
 _| |_     \  /    | |____  | |____  | |__| |
|_____|     \/     |______|  \_____|  \____/
   _____   _______   _____               _        _____    _____
  / ____| |__   __| |  __ \      /\     | |      |_   _|  / ____|
 | (___      | |    | |__) |    /  \    | |        | |   | (___
  \___ \     | |    |  _  /    / /\ \   | |        | |    \___ \
  ____) |    | |    | | \ \   / ____ \  | |____   _| |_   ____) |
 |_____/     |_|    |_|  \_\ /_/    \_\ |______| |_____| |_____/
*/

pub const IVECO_STRALIS_ZF12: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed.iveco.stralis.transmission",
    name: "ZF 12AS2330TD",
    speeds: "12",
    retarder: false,
    ratio: "15.86 - 1.0",
    code: "/def/vehicle/truck/iveco.stralis/transmission/12_speed.sii",
};

pub const IVECO_STRALIS_ZF12_O: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_o.iveco.stralis.transmission",
    name: "ZF 12AS2530TO",
    speeds: "12",
    retarder: false,
    ratio: "12.33 - 0.78",
    code: "/def/vehicle/truck/iveco.stralis/transmission/12_speed_over.sii",
};

pub const IVECO_STRALIS_ZF12_R: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_r.iveco.stralis.transmission",
    name: "ZF 12AS2331TD R",
    speeds: "12",
    retarder: true,
    ratio: "15.86 - 1.0",
    code: "/def/vehicle/truck/iveco.stralis/transmission/12_speed_ret.sii",
};

pub const IVECO_STRALIS_ZF12_RO: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_ro.iveco.stralis.transmission",
    name: "ZF 12AS2531TO R",
    speeds: "12",
    retarder: true,
    ratio: "12.33 - 0.78",
    code: "/def/vehicle/truck/iveco.stralis/transmission/12_speed_ret_over.sii",
};

pub const IVECO_STRALIS_ALLISON: TransmissionStruct = TransmissionStruct {
    name_id: "allison.iveco.stralis.transmission",
    name: "Allison 4500",
    speeds: "6",
    retarder: false,
    ratio: "4.7 - 0.67",
    code: "/def/vehicle/truck/iveco.stralis/transmission/allison.sii",
};

pub const IVECO_STRALIS_ALLISON_R: TransmissionStruct = TransmissionStruct {
    name_id: "allison_r.iveco.stralis.transmission",
    name: "Allison 4500 R",
    speeds: "6",
    retarder: true,
    ratio: "4.7 - 0.67",
    code: "/def/vehicle/truck/iveco.stralis/transmission/allison_r.sii",
};

pub const IVECO_STRALIS_ZF16: TransmissionStruct = TransmissionStruct {
    name_id: "zf16as2630to.iveco.stralis.transmission",
    name: "ZF 16AS2630TO",
    speeds: "16",
    retarder: false,
    ratio: "14.12 - 0.83",
    code: "/def/vehicle/truck/iveco.stralis/transmission/zf_16as2630to.sii",
};

pub const IVECO_STRALIS_ZF16_R: TransmissionStruct = TransmissionStruct {
    name_id: "zf16as2631to.iveco.stralis.transmission",
    name: "ZF 16AS2631TO R",
    speeds: "16",
    retarder: true,
    ratio: "14.12 - 0.83",
    code: "/def/vehicle/truck/iveco.stralis/transmission/zf_16as2631to.sii",
};
