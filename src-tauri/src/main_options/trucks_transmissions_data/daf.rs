use crate::structs::vec_trucks::TransmissionStruct;

/*_____               ______    __   __  ______ 
|  __ \      /\     |  ____|   \ \ / / |  ____|
| |  | |    /  \    | |__       \ V /  | |__   
| |  | |   / /\ \   |  __|       > <   |  __|  
| |__| |  / ____ \  | |         / . \  | |     
|_____/  /_/    \_\ |_|        /_/ \_\ |_|     
*/

pub const DAF_XF_ZF12: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed.daf.xf.transmission",
    name: "ZF 12AS2330TD",
    speeds: "12",
    retarder: false,
    ratio: "15.86 - 1.00",
    code: "/def/vehicle/truck/daf.xf/transmission/12_speed.sii",
};


pub const DAF_XF_ZF12_O: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_o.daf.xf.transmission",
    name: "ZF 12AS2530TO",
    speeds: "12",
    retarder: false,
    ratio: "12.33 - 0.78",
    code: "/def/vehicle/truck/daf.xf/transmission/12_speed_over.sii",
};

pub const DAF_XF_ZF12_R: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_r.daf.xf.transmission",
    name: "ZF 12AS2331TD R",
    speeds: "12",
    retarder: true,
    ratio: "15.86 - 1.00",
    code: "/def/vehicle/truck/daf.xf/transmission/12_speed_ret.sii",
};

pub const DAF_XF_ZF12_RO: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_ro.daf.xf.transmission",
    name: "ZF 12AS2531TO R",
    speeds: "12",
    retarder: true,
    ratio: "12.33 - 0.78",
    code: "/def/vehicle/truck/daf.xf/transmission/12_speed_ret_over.sii",
};

pub const DAF_XF_ALLISON: TransmissionStruct = TransmissionStruct {
    name_id: "allison.daf.xf.transmission",
    name: "Allison 4500",
    speeds: "6",
    retarder: false,
    ratio: "4.7 - 0.67",
    code: "/def/vehicle/truck/daf.xf/transmission/allison.sii",
};

pub const DAF_XF_ALLISON_R: TransmissionStruct = TransmissionStruct {
    name_id: "allison_r.daf.xf.transmission",
    name: "Allison 4500 R",
    speeds: "6",
    retarder: true,
    ratio: "4.7 - 0.67",
    code: "/def/vehicle/truck/daf.xf/transmission/allison_retarder.sii",
};

pub const DAF_XF_ZF16: TransmissionStruct = TransmissionStruct {
    name_id: "zf16as2630to.daf.xf.transmission",
    name: "ZF 16AS2630TO",
    speeds: "16",
    retarder: false,
    ratio: "14.12 - 0.83",
    code: "/def/vehicle/truck/daf.xf/transmission/zf_16as2630to.sii",
};

pub const DAF_XF_ZF16_R: TransmissionStruct = TransmissionStruct {
    name_id: "zf16as2631to.daf.xf.transmission",
    name: "ZF 16AS2631TO R",
    speeds: "16",
    retarder: true,
    ratio: "14.12 - 0.83",
    code: "/def/vehicle/truck/daf.xf/transmission/zf_16as2631to.sii",
};

/*_____               ______    __   __  ______ 
|  __ \      /\     |  ____|   \ \ / / |  ____|
| |  | |    /  \    | |__       \ V /  | |__   
| |  | |   / /\ \   |  __|       > <   |  __|  
| |__| |  / ____ \  | |         / . \  | |     
|_____/  /_/    \_\ |_|        /_/ \_\ |_|
______   _    _   _____     ____        __  
|  ____| | |  | | |  __ \   / __ \      / /  
| |__    | |  | | | |__) | | |  | |    / /_  
|  __|   | |  | | |  _  /  | |  | |   | '_ \ 
| |____  | |__| | | | \ \  | |__| |   | (_) |
|______|  \____/  |_|  \_\  \____/     \___/      
*/

pub const DAF_XF_EURO6_ZF12: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed.daf.xf_euro6.transmission",
    name: "ZF 12AS2330TD",
    speeds: "12",
    retarder: false,
    ratio: "15.86 - 1.00",
    code: "/def/vehicle/truck/daf.xf_euro6/transmission/12_speed.sii",
};

pub const DAF_XF_EURO6_ZF12_O: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_o.daf.xf_euro6.transmission",
    name: "ZF 12AS2530TO",
    speeds: "12",
    retarder: false,
    ratio: "12.33 - 0.78",
    code: "/def/vehicle/truck/daf.xf_euro6/transmission/12_speed_over.sii",
};

pub const DAF_XF_EURO6_ZF12_R: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_r.daf.xf_euro6.transmission",
    name: "ZF 12AS2331TD R",
    speeds: "12",
    retarder: true,
    ratio: "15.86 - 1.00",
    code: "/def/vehicle/truck/daf.xf_euro6/transmission/12_speed_ret.sii",
};

pub const DAF_XF_EURO6_ZF12_RO: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_ro.daf.xf_euro6.transmission",
    name: "ZF 12AS2531TO R",
    speeds: "12",
    retarder: true,
    ratio: "12.33 - 0.78",
    code: "/def/vehicle/truck/daf.xf_euro6/transmission/12_speed_ret_over.sii",
};

pub const DAF_XF_EURO6_ALLISON: TransmissionStruct = TransmissionStruct {
    name_id: "allison.daf.xf_euro6.transmission",
    name: "Allison 4500",
    speeds: "6",
    retarder: false,
    ratio: "4.7 - 0.67",
    code: "/def/vehicle/truck/daf.xf_euro6/transmission/allison.sii",
};

pub const DAF_XF_EURO6_ALLISON_R: TransmissionStruct = TransmissionStruct {
    name_id: "allison_r.daf.xf_euro6.transmission",
    name: "Allison 4500 R",
    speeds: "6",
    retarder: true,
    ratio: "4.7 - 0.67",
    code: "/def/vehicle/truck/daf.xf_euro6/transmission/allison_retarder.sii",
};

pub const DAF_XF_EURO6_ZF_12TX: TransmissionStruct = TransmissionStruct {
    name_id: "zf12tx2420td.daf.xf_euro6.transmission",
    name: "ZF 12TX2420TD",
    speeds: "12",
    retarder: false,
    ratio: "16.69 - 1.0",
    code: "/def/vehicle/truck/daf.xf_euro6/transmission/zf_12tx2420td.sii",
};

pub const DAF_XF_EURO6_ZF_12TX_R: TransmissionStruct = TransmissionStruct {
    name_id: "zf12tx2421td.daf.xf_euro6.transmission",
    name: "ZF 12TX2421TD R",
    speeds: "12",
    retarder: true,
    ratio: "16.69 - 1.0",
    code: "/def/vehicle/truck/daf.xf_euro6/transmission/zf_12tx2421td.sii",
};

pub const DAF_XF_EURO6_ZF_12T: TransmissionStruct = TransmissionStruct {
    name_id: "zf12tx2610to.daf.xf_euro6.transmission",
    name: "ZF 12TX2610TO",
    speeds: "12",
    retarder: false,
    ratio: "12.92 - 0.77",
    code: "/def/vehicle/truck/daf.xf_euro6/transmission/zf_12tx2610to.sii",
};

pub const DAF_XF_EURO6_ZF_12T_R: TransmissionStruct = TransmissionStruct {
    name_id: "zf12tx2611to.daf.xf_euro6.transmission",
    name: "ZF 12TX2611TO R",
    speeds: "12",
    retarder: true,
    ratio: "12.92 - 0.77",
    code: "/def/vehicle/truck/daf.xf_euro6/transmission/zf_12tx2611to.sii",
};

pub const DAF_XF_EURO6_ZF_16A: TransmissionStruct = TransmissionStruct {
    name_id: "zf16as2630to.daf.xf_euro6.transmission",
    name: "ZF 16AS2630TO",
    speeds: "16",
    retarder: false,
    ratio: "14.12 - 0.83",
    code: "/def/vehicle/truck/daf.xf_euro6/transmission/zf_16as2630to.sii",
};

pub const DAF_XF_EURO6_ZF_16A_R: TransmissionStruct = TransmissionStruct {
    name_id: "zf16as2631to.daf.xf_euro6.transmission",
    name: "ZF 16AS2631TO R",
    speeds: "16",
    retarder: true,
    ratio: "14.12 - 0.83",
    code: "/def/vehicle/truck/daf.xf_euro6/transmission/zf_16as2631to.sii",
};

pub const DAF_XF_EURO6_ZF16: TransmissionStruct = TransmissionStruct {
    name_id: "zf16tx2640to.daf.xf_euro6.transmission",
    name: "ZF 16TX2640TO",
    speeds: "16",
    retarder: false,
    ratio: "14.68 - 0.82",
    code: "/def/vehicle/truck/daf.xf_euro6/transmission/zf_16tx2640to.sii",
};

pub const DAF_XF_EURO6_ZF16_R: TransmissionStruct = TransmissionStruct {
    name_id: "zf16tx2641to.daf.xf_euro6.transmission",
    name: "ZF 16TX2641TO R",
    speeds: "16",
    retarder: true,
    ratio: "14.68 - 0.82",
    code: "/def/vehicle/truck/daf.xf_euro6/transmission/zf_16tx2641to.sii",
};

/*_____               ______  
|  __ \      /\     |  ____|  
| |  | |    /  \    | |__    
| |  | |   / /\ \   |  __|   
| |__| |  / ____ \  | |       
|_____/  /_/    \_\ |_|           
  ___     ___    ___    __ 
 |__ \   / _ \  |__ \  /_ |
    ) | | | | |    ) |  | |
   / /  | | | |   / /   | |
  / /_  | |_| |  / /_   | |
 |____|  \___/  |____|  |_|
*/


pub const DAF_2021_ZF12T: TransmissionStruct = TransmissionStruct {
    name_id: "zf12tx2420td.daf.2021.transmission",
    name: "ZF 12TX2420TD",
    speeds: "12",
    retarder: false,
    ratio: "16.69 - 1.0",
    code: "/def/vehicle/truck/daf.2021/transmission/zf_12tx2420td.sii",
};

pub const DAF_2021_ZF12T_R: TransmissionStruct = TransmissionStruct {
    name_id: "zf12tx2421td.daf.2021.transmission",
    name: "ZF 12TX2421TD R",
    speeds: "12",
    retarder: true,
    ratio: "16.69 - 1.0",
    code: "/def/vehicle/truck/daf.2021/transmission/zf_12tx2421td.sii",
};

pub const DAF_2021_ZF12: TransmissionStruct = TransmissionStruct {
    name_id: "zf12tx2610to.daf.2021.transmission",
    name: "ZF 12TX2610TO",
    speeds: "12",
    retarder: false,
    ratio: "12.92 - 0.77",
    code: "/def/vehicle/truck/daf.2021/transmission/zf_12tx2610to.sii",
};

pub const DAF_2021_ZF12_R: TransmissionStruct = TransmissionStruct {
    name_id: "zf12tx2611to.daf.2021.transmission",
    name: "ZF 12TX2611TO R",
    speeds: "12",
    retarder: true,
    ratio: "12.92 - 0.77",
    code: "/def/vehicle/truck/daf.2021/transmission/zf_12tx2611to.sii",
};

pub const DAF_2021_ZF16: TransmissionStruct = TransmissionStruct {
    name_id: "zf16tx2640to.daf.2021.transmission",
    name: "ZF 16TX2640TO",
    speeds: "16",
    retarder: false,
    ratio: "14.68 - 0.82",
    code: "/def/vehicle/truck/daf.2021/transmission/zf_16tx2640to.sii",
};

pub const DAF_2021_ZF16_R: TransmissionStruct = TransmissionStruct {
    name_id: "zf16tx2641to.daf.2021.transmission",
    name: "ZF 16TX2641TO R",
    speeds: "16",
    retarder: true,
    ratio: "14.68 - 0.82",
    code: "/def/vehicle/truck/daf.2021/transmission/zf_16tx2641to.sii",
};

