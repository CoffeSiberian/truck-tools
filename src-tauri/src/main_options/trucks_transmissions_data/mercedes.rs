use crate::structs::vec_trucks::TransmissionStruct;

/*__  __   ______   _____     _____   ______   _____    ______    _____                 _____   _______   _____     ____     _____ 
|  \/  | |  ____| |  __ \   / ____| |  ____| |  __ \  |  ____|  / ____|       /\      / ____| |__   __| |  __ \   / __ \   / ____|
| \  / | | |__    | |__) | | |      | |__    | |  | | | |__    | (___        /  \    | |         | |    | |__) | | |  | | | (___  
| |\/| | |  __|   |  _  /  | |      |  __|   | |  | | |  __|    \___ \      / /\ \   | |         | |    |  _  /  | |  | |  \___ \ 
| |  | | | |____  | | \ \  | |____  | |____  | |__| | | |____   ____) |    / ____ \  | |____     | |    | | \ \  | |__| |  ____) |
|_|  |_| |______| |_|  \_\  \_____| |______| |_____/  |______| |_____/    /_/    \_\  \_____|    |_|    |_|  \_\  \____/  |_____/ 
*/

pub const MERCEDES_ACTROS_G12: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed.mercedes.actros.transmission",
    name: "PowerShift G281-12",
    speeds: "12",
    retarder: false,
    ratio: "14.93 - 1.0",
    code: "/def/vehicle/truck/mercedes.actros/transmission/12_speed.sii",
};

pub const MERCEDES_ACTROS_G12_O: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_o.mercedes.actros.transmission",
    name: "PowerShift G330-12",
    speeds: "12",
    retarder: false,
    ratio: "11.639 - 0.775",
    code: "/def/vehicle/truck/mercedes.actros/transmission/12_speed_over.sii",
};

pub const MERCEDES_ACTROS_G12_R: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_r.mercedes.actros.transmission",
    name: "PowerShift G281-12 R",
    speeds: "12",
    retarder: true,
    ratio: "14.93 - 1.0",
    code: "/def/vehicle/truck/mercedes.actros/transmission/12_speed_ret.sii",
};

pub const MERCEDES_ACTROS_G12_RO: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_ro.mercedes.actros.transmission",
    name: "PowerShift G330-12 R",
    speeds: "12",
    retarder: true,
    ratio: "11.639 - 0.775",
    code: "/def/vehicle/truck/mercedes.actros/transmission/12_speed_ret_over.sii",
};

pub const MERCEDES_ACTROS_ALLISON: TransmissionStruct = TransmissionStruct {
    name_id: "allison.mercedes.actros.transmission",
    name: "Allison 4500",
    speeds: "6",
    retarder: false,
    ratio: "4.7 - 0.67",
    code: "/def/vehicle/truck/mercedes.actros/transmission/allison.sii",
};

pub const MERCEDES_ACTROS_ALLISON_R: TransmissionStruct = TransmissionStruct {
    name_id: "allison_r.mercedes.actros.transmission",
    name: "Allison 4500 R",
    speeds: "6",
    retarder: true,
    ratio: "4.7 - 0.67",
    code: "/def/vehicle/truck/mercedes.actros/transmission/allison_retarder.sii",
};

pub const MERCEDES_ACTROS_G16: TransmissionStruct = TransmissionStruct {
    name_id: "g280_16.mercedes.actros.transmission",
    name: "PowerShift G280-16",
    speeds: "16",
    retarder: false,
    ratio: "11.722 - 0.687",
    code: "/def/vehicle/truck/mercedes.actros/transmission/g280_16.sii",
};

pub const MERCEDES_ACTROS_G16_R: TransmissionStruct = TransmissionStruct {
    name_id: "g280_16_r.mercedes.actros.transmission",
    name: "PowerShift G280-16 R",
    speeds: "16",
    retarder: true,
    ratio: "11.722 - 0.687",
    code: "/def/vehicle/truck/mercedes.actros/transmission/g280_16_r.sii",
};

/*__  __   ______   _____     _____   ______   _____    ______    _____     _   _   ______  __          __                _____   _______   _____     ____     _____ 
|  \/  | |  ____| |  __ \   / ____| |  ____| |  __ \  |  ____|  / ____|   | \ | | |  ____| \ \        / /       /\      / ____| |__   __| |  __ \   / __ \   / ____|
| \  / | | |__    | |__) | | |      | |__    | |  | | | |__    | (___     |  \| | | |__     \ \  /\  / /       /  \    | |         | |    | |__) | | |  | | | (___  
| |\/| | |  __|   |  _  /  | |      |  __|   | |  | | |  __|    \___ \    | . ` | |  __|     \ \/  \/ /       / /\ \   | |         | |    |  _  /  | |  | |  \___ \ 
| |  | | | |____  | | \ \  | |____  | |____  | |__| | | |____   ____) |   | |\  | | |____     \  /\  /       / ____ \  | |____     | |    | | \ \  | |__| |  ____) |
|_|  |_| |______| |_|  \_\  \_____| |______| |_____/  |______| |_____/    |_| \_| |______|     \/  \/       /_/    \_\  \_____|    |_|    |_|  \_\  \____/  |_____/ 
*/

pub const MERCEDES_NEW_ACTROS_G12: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed.mercedes.actros2014.transmission",
    name: "PowerShift G281-12",
    speeds: "12",
    retarder: false,
    ratio: "14.93 - 1.0",
    code: "/def/vehicle/truck/mercedes.actros2014/transmission/12_speed.sii",
};

pub const MERCEDES_NEW_ACTROS_G12_O: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_o.mercedes.actros2014.transmission",
    name: "PowerShift G330-12",
    speeds: "12",
    retarder: false,
    ratio: "11.639 - 0.775",
    code: "/def/vehicle/truck/mercedes.actros2014/transmission/12_speed_over.sii",
};

pub const MERCEDES_NEW_ACTROS_G12_R: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_r.mercedes.actros2014.transmission",
    name: "PowerShift G281-12 R",
    speeds: "12",
    retarder: true,
    ratio: "14.93 - 1.0",
    code: "/def/vehicle/truck/mercedes.actros2014/transmission/12_speed_ret.sii",
};

pub const MERCEDES_NEW_ACTROS_G12_RO: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_ro.mercedes.actros2014.transmission",
    name: "PowerShift G330-12 R",
    speeds: "12",
    retarder: true,
    ratio: "11.639 - 0.775",
    code: "/def/vehicle/truck/mercedes.actros2014/transmission/12_speed_ret_over.sii",
};

pub const MERCEDES_NEW_ACTROS_ALLISON: TransmissionStruct = TransmissionStruct {
    name_id: "allison.mercedes.actros2014.transmission",
    name: "Allison 4500",
    speeds: "6",
    retarder: false,
    ratio: "4.7 - 0.67",
    code: "/def/vehicle/truck/mercedes.actros2014/transmission/allison.sii",
};

pub const MERCEDES_NEW_ACTROS_ALLISON_R: TransmissionStruct = TransmissionStruct {
    name_id: "allison_r.mercedes.actros2014.transmission",
    name: "Allison 4500 R",
    speeds: "6",
    retarder: true,
    ratio: "4.7 - 0.67",
    code: "/def/vehicle/truck/mercedes.actros2014/transmission/allison_retarder.sii",
};

pub const MERCEDES_NEW_ACTROS_G16: TransmissionStruct = TransmissionStruct {
    name_id: "g280_16.mercedes.actros2014.transmission",
    name: "PowerShift G280-16",
    speeds: "16",
    retarder: false,
    ratio: "11.722 - 0.687",
    code: "/def/vehicle/truck/mercedes.actros2014/transmission/g280_16.sii",
};

pub const MERCEDES_NEW_ACTROS_G16_R: TransmissionStruct = TransmissionStruct {
    name_id: "g280_16_r.mercedes.actros2014.transmission",
    name: "PowerShift G280-16 R",
    speeds: "16",
    retarder: true,
    ratio: "11.722 - 0.687",
    code: "/def/vehicle/truck/mercedes.actros2014/transmission/g280_16_r.sii",
};
