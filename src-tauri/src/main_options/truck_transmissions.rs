use super::trucks_transmissions_data::scania::{
    SCANIA_R_2009_GA867, SCANIA_R_2009_GA867R, SCANIA_R_2009_GRSO_905, SCANIA_R_2009_GRSO_905R,
    SCANIA_R_2009_GRSO_925, SCANIA_R_2009_GRSO_925R, SCANIA_R_2009_GRS_905, SCANIA_R_2009_GRS_905R,
    SCANIA_R_GA867, SCANIA_R_GA867R, SCANIA_R_GRSO_905, SCANIA_R_GRSO_905R, SCANIA_R_GRSO_925,
    SCANIA_R_GRSO_925R, SCANIA_R_GRS_905, SCANIA_R_GRS_905R, SCANIA_STREAMLINE_GA867,
    SCANIA_STREAMLINE_GA867R, SCANIA_STREAMLINE_GRSO_905, SCANIA_STREAMLINE_GRSO_905R,
    SCANIA_STREAMLINE_GRSO_925, SCANIA_STREAMLINE_GRSO_925R, SCANIA_STREAMLINE_GRS_905,
    SCANIA_STREAMLINE_GRS_905R, SCANIA_S_GA867, SCANIA_S_GA867R, SCANIA_S_GRSO_905,
    SCANIA_S_GRSO_905R, SCANIA_S_GRSO_925, SCANIA_S_GRSO_925R, SCANIA_S_GRS_905, SCANIA_S_GRS_905R,
};
use super::trucks_transmissions_data::volvo::{
    VOLVO_FH_4500, VOLVO_FH_4500_R, VOLVO_FH_AT2812D, VOLVO_FH_AT2812D_R, VOLVO_FH_ATO3512D,
    VOLVO_FH_ATO3512D_R, VOLVO_FH_ATO3512F_ASO_ULC, VOLVO_FH_ATO3512F_R_ASO_ULC,
    VOLVO_FH_CLASSIC_4500, VOLVO_FH_CLASSIC_4500_R, VOLVO_FH_CLASSIC_AT2812D,
    VOLVO_FH_CLASSIC_AT2812D_R, VOLVO_FH_CLASSIC_ATO3512D, VOLVO_FH_CLASSIC_ATO3512D_R,
    VOLVO_FH_CLASSIC_ATO3512F_ASO_ULC, VOLVO_FH_CLASSIC_ATO3512F_R_ASO_ULC,
};
use crate::structs::vec_trucks::TransmissionStruct;

pub const SCANIA_R_TRANSMISSION: [TransmissionStruct<'static>; 8] = [
    SCANIA_R_GA867,
    SCANIA_R_GA867R,
    SCANIA_R_GRSO_905,
    SCANIA_R_GRSO_905R,
    SCANIA_R_GRSO_925,
    SCANIA_R_GRSO_925R,
    SCANIA_R_GRS_905,
    SCANIA_R_GRS_905R,
];

pub const SCANIA_S_TRANSMISSION: [TransmissionStruct<'static>; 8] = [
    SCANIA_S_GA867,
    SCANIA_S_GA867R,
    SCANIA_S_GRSO_905,
    SCANIA_S_GRSO_905R,
    SCANIA_S_GRSO_925,
    SCANIA_S_GRSO_925R,
    SCANIA_S_GRS_905,
    SCANIA_S_GRS_905R,
];

pub const SCANIA_R_2009_TRANSMISSION: [TransmissionStruct<'static>; 8] = [
    SCANIA_R_2009_GA867,
    SCANIA_R_2009_GA867R,
    SCANIA_R_2009_GRSO_905,
    SCANIA_R_2009_GRSO_905R,
    SCANIA_R_2009_GRSO_925,
    SCANIA_R_2009_GRSO_925R,
    SCANIA_R_2009_GRS_905,
    SCANIA_R_2009_GRS_905R,
];

pub const SCANIA_STREAMLINE_TRANSMISSION: [TransmissionStruct<'static>; 8] = [
    SCANIA_STREAMLINE_GA867,
    SCANIA_STREAMLINE_GA867R,
    SCANIA_STREAMLINE_GRSO_905,
    SCANIA_STREAMLINE_GRSO_905R,
    SCANIA_STREAMLINE_GRSO_925,
    SCANIA_STREAMLINE_GRSO_925R,
    SCANIA_STREAMLINE_GRS_905,
    SCANIA_STREAMLINE_GRS_905R,
];

pub const VOLVO_FH_TRANSMISSION: [TransmissionStruct<'static>; 8] = [
    VOLVO_FH_AT2812D,
    VOLVO_FH_AT2812D_R,
    VOLVO_FH_ATO3512D,
    VOLVO_FH_ATO3512D_R,
    VOLVO_FH_ATO3512F_ASO_ULC,
    VOLVO_FH_ATO3512F_R_ASO_ULC,
    VOLVO_FH_4500,
    VOLVO_FH_4500_R,
];

pub const VOLVO_FH_CLASSIC_TRANSMISSION: [TransmissionStruct<'static>; 8] = [
    VOLVO_FH_CLASSIC_AT2812D,
    VOLVO_FH_CLASSIC_AT2812D_R,
    VOLVO_FH_CLASSIC_ATO3512D,
    VOLVO_FH_CLASSIC_ATO3512D_R,
    VOLVO_FH_CLASSIC_ATO3512F_ASO_ULC,
    VOLVO_FH_CLASSIC_ATO3512F_R_ASO_ULC,
    VOLVO_FH_CLASSIC_4500,
    VOLVO_FH_CLASSIC_4500_R,
];
