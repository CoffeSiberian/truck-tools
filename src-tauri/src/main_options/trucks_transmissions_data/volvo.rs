use crate::structs::vec_trucks::TransmissionStruct;

/*
888     888          888                       8888888888 888    888
888     888          888                       888        888    888
888     888          888                       888        888    888
Y88b   d88P  .d88b.  888 888  888  .d88b.      8888888    8888888888
 Y88b d88P  d88""88b 888 888  888 d88""88b     888        888    888
  Y88o88P   888  888 888 Y88  88P 888  888     888        888    888
   Y888P    Y88..88P 888  Y8bd8P  Y88..88P     888        888    888
    Y8P      "Y88P"  888   Y88P    "Y88P"      888        888    888

 .d8888b.  888                            d8b
d88P  Y88b 888                            Y8P
888    888 888
888        888  8888b.  .d8888b  .d8888b  888  .d8888b
888        888     "88b 88K      88K      888 d88P"
888    888 888 .d888888 "Y8888b. "Y8888b. 888 888
Y88b  d88P 888 888  888      X88      X88 888 Y88b.
 "Y8888P"  888 "Y888888  88888P'  88888P' 888  "Y8888P
*/

pub const VOLVO_FH_CLASSIC_AT2812D: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed.volvo.fh16.transmission",
    name: "I-Shift AT2812D",
    speeds: "12",
    retarder: false,
    ratio: "14.94 - 1.00",
    code: "/def/vehicle/truck/volvo.fh16/transmission/12_speed.sii",
};

pub const VOLVO_FH_CLASSIC_ATO3512D: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_o.volvo.fh16.transmission",
    name: "I-Shift ATO3512D",
    speeds: "12",
    retarder: false,
    ratio: "11.73 - 0.78",
    code: "/def/vehicle/truck/volvo.fh16/transmission/12_speed_over.sii",
};

pub const VOLVO_FH_CLASSIC_4500: TransmissionStruct = TransmissionStruct {
    name_id: "allison.volvo.fh16.transmission",
    name: "Allison 4500",
    speeds: "6",
    retarder: false,
    ratio: "4.70 - 0.67",
    code: "/def/vehicle/truck/volvo.fh16/transmission/allison.sii",
};

pub const VOLVO_FH_CLASSIC_ATO3512F_ASO_ULC: TransmissionStruct = TransmissionStruct {
    name_id: "ato3512f_au.volvo.fh16.transmission",
    name: "I-Shift ATO3512F + ASO-ULC",
    speeds: "12+2",
    retarder: false,
    ratio: "32.04 - 0.78",
    code: "/def/vehicle/truck/volvo.fh16/transmission/ato3512f_aso.sii",
};

pub const VOLVO_FH_CLASSIC_AT2812D_R: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_r.volvo.fh16.transmission",
    name: "I-Shift AT2812D R",
    speeds: "12",
    retarder: true,
    ratio: "14.94 - 1.00",
    code: "/def/vehicle/truck/volvo.fh16/transmission/12_speed_ret.sii",
};

pub const VOLVO_FH_CLASSIC_ATO3512D_R: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_ro.volvo.fh16.transmission",
    name: "I-Shift ATO3512D R",
    speeds: "12",
    retarder: true,
    ratio: "11.73 - 0.78",
    code: "/def/vehicle/truck/volvo.fh16/transmission/12_speed_ret_over.sii",
};

pub const VOLVO_FH_CLASSIC_4500_R: TransmissionStruct = TransmissionStruct {
    name_id: "allison_r.volvo.fh16.transmission",
    name: "Allison 4500 R",
    speeds: "6",
    retarder: true,
    ratio: "4.70 - 0.67",
    code: "/def/vehicle/truck/volvo.fh16/transmission/allison_retarder.sii",
};

pub const VOLVO_FH_CLASSIC_ATO3512F_R_ASO_ULC: TransmissionStruct = TransmissionStruct {
    name_id: "ato3512fr_au.volvo.fh16.transmission",
    name: "I-Shift ATO3512F R + ASO-ULC",
    speeds: "12+2",
    retarder: true,
    ratio: "32.04 - 0.78",
    code: "/def/vehicle/truck/volvo.fh16/transmission/ato3512f_r_aso.sii",
};

/*
888     888          888                       8888888888 888    888
888     888          888                       888        888    888
888     888          888                       888        888    888
Y88b   d88P  .d88b.  888 888  888  .d88b.      8888888    8888888888
 Y88b d88P  d88""88b 888 888  888 d88""88b     888        888    888
  Y88o88P   888  888 888 Y88  88P 888  888     888        888    888
   Y888P    Y88..88P 888  Y8bd8P  Y88..88P     888        888    888
    Y8P      "Y88P"  888   Y88P    "Y88P"      888        888    888
*/

pub const VOLVO_FH_AT2812D: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed.volvo.fh16_2012.transmission",
    name: "I-Shift AT2812D",
    speeds: "12",
    retarder: false,
    ratio: "14.94 - 1.00",
    code: "/def/vehicle/truck/volvo.fh16_2012/transmission/12_speed.sii",
};

pub const VOLVO_FH_ATO3512D: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_o.volvo.fh16_2012.transmission",
    name: "I-Shift ATO3512D",
    speeds: "12",
    retarder: false,
    ratio: "11.73 - 0.78",
    code: "/def/vehicle/truck/volvo.fh16_2012/transmission/12_speed_over.sii",
};

pub const VOLVO_FH_4500: TransmissionStruct = TransmissionStruct {
    name_id: "allison.volvo.fh16_2012.transmission",
    name: "Allison 4500",
    speeds: "6",
    retarder: false,
    ratio: "4.70 - 0.67",
    code: "/def/vehicle/truck/volvo.fh16_2012/transmission/allison.sii",
};

pub const VOLVO_FH_ATO3512F_ASO_ULC: TransmissionStruct = TransmissionStruct {
    name_id: "ato3512f_au.volvo.fh16_2012.transmission",
    name: "I-Shift ATO3512F + ASO-ULC",
    speeds: "12+2",
    retarder: false,
    ratio: "32.04 - 0.78",
    code: "/def/vehicle/truck/volvo.fh16_2012/transmission/ato3512f_aso.sii",
};

pub const VOLVO_FH_AT2812D_R: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_r.volvo.fh16_2012.transmission",
    name: "I-Shift AT2812D R",
    speeds: "12",
    retarder: true,
    ratio: "14.94 - 1.00",
    code: "/def/vehicle/truck/volvo.fh16_2012/transmission/12_speed_ret.sii",
};

pub const VOLVO_FH_ATO3512D_R: TransmissionStruct = TransmissionStruct {
    name_id: "12_speed_ro.volvo.fh16_2012.transmission",
    name: "I-Shift ATO3512D R",
    speeds: "12",
    retarder: true,
    ratio: "11.73 - 0.78",
    code: "/def/vehicle/truck/volvo.fh16_2012/transmission/12_speed_ret_over.sii",
};

pub const VOLVO_FH_4500_R: TransmissionStruct = TransmissionStruct {
    name_id: "allison_r.volvo.fh16_2012.transmission",
    name: "Allison 4500 R",
    speeds: "6",
    retarder: true,
    ratio: "4.70 - 0.67",
    code: "/def/vehicle/truck/volvo.fh16_2012/transmission/allison_retarder.sii",
};

pub const VOLVO_FH_ATO3512F_R_ASO_ULC: TransmissionStruct = TransmissionStruct {
    name_id: "ato3512fr_au.volvo.fh16_2012.transmission",
    name: "I-Shift ATO3512F R + ASO-ULC",
    speeds: "12+2",
    retarder: true,
    ratio: "32.04 - 0.78",
    code: "/def/vehicle/truck/volvo.fh16_2012/transmission/ato3512f_r_aso.sii",
};
