use super::truck_engines::{
    SCANIA_R_2009_ENGINES, SCANIA_R_ENGINES, SCANIA_STREAMLINE_ENGINES, SCANIA_S_ENGINES, VOLVO_FH,
    VOLVO_FH_CLASSIC,
};
use super::truck_transmissions::{
    SCANIA_R_2009_TRANSMISSION, SCANIA_R_TRANSMISSION, SCANIA_STREAMLINE_TRANSMISSION,
    SCANIA_S_TRANSMISSION, VOLVO_FH_CLASSIC_TRANSMISSION, VOLVO_FH_TRANSMISSION,
};
use crate::structs::vec_trucks::{BrandScania, BrandVolvo, TruckBrands, TruckValues};

pub fn get_trucks_values() -> TruckBrands {
    let scania: BrandScania = BrandScania {
        scania_r: TruckValues {
            engines: SCANIA_R_ENGINES.to_vec(),
            transmissions: SCANIA_R_TRANSMISSION.to_vec(),
        },
        scania_s: TruckValues {
            engines: SCANIA_S_ENGINES.to_vec(),
            transmissions: SCANIA_S_TRANSMISSION.to_vec(),
        },
        scania_streamline: TruckValues {
            engines: SCANIA_STREAMLINE_ENGINES.to_vec(),
            transmissions: SCANIA_STREAMLINE_TRANSMISSION.to_vec(),
        },
        scania_r_2009: TruckValues {
            engines: SCANIA_R_2009_ENGINES.to_vec(),
            transmissions: SCANIA_R_2009_TRANSMISSION.to_vec(),
        },
    };

    let volvo: BrandVolvo = BrandVolvo {
        volvo_fh: TruckValues {
            engines: VOLVO_FH.to_vec(),
            transmissions: VOLVO_FH_TRANSMISSION.to_vec(),
        },
        volvo_fh_classic: TruckValues {
            engines: VOLVO_FH_CLASSIC.to_vec(),
            transmissions: VOLVO_FH_CLASSIC_TRANSMISSION.to_vec(),
        },
    };

    return TruckBrands { scania, volvo };
}
