use super::truck_engines::{
    SCANIA_R_2009_ENGINES, SCANIA_R_ENGINES, SCANIA_STREAMLINE_ENGINES, SCANIA_S_ENGINES, VOLVO_FH,
    VOLVO_FH_CLASSIC,
};
use super::truck_transmissions::{
    SCANIA_R_2009_TRANSMISSION, SCANIA_R_TRANSMISSION, SCANIA_STREAMLINE_TRANSMISSION,
    SCANIA_S_TRANSMISSION, VOLVO_FH_CLASSIC_TRANSMISSION, VOLVO_FH_TRANSMISSION,
};
use crate::structs::vec_trucks::{brand_scania, brand_volvo, truck_brands, truck_values};

pub fn get_trucks_values() -> truck_brands {
    let scania: brand_scania = brand_scania {
        scania_r: truck_values {
            engines: SCANIA_R_ENGINES.to_vec(),
            transmissions: SCANIA_R_TRANSMISSION.to_vec(),
        },
        scania_s: truck_values {
            engines: SCANIA_S_ENGINES.to_vec(),
            transmissions: SCANIA_S_TRANSMISSION.to_vec(),
        },
        scania_streamline: truck_values {
            engines: SCANIA_STREAMLINE_ENGINES.to_vec(),
            transmissions: SCANIA_STREAMLINE_TRANSMISSION.to_vec(),
        },
        scania_r_2009: truck_values {
            engines: SCANIA_R_2009_ENGINES.to_vec(),
            transmissions: SCANIA_R_2009_TRANSMISSION.to_vec(),
        },
    };

    let volvo: brand_volvo = brand_volvo {
        volvo_fh: truck_values {
            engines: VOLVO_FH.to_vec(),
            transmissions: VOLVO_FH_TRANSMISSION.to_vec(),
        },
        volvo_fh_classic: truck_values {
            engines: VOLVO_FH_CLASSIC.to_vec(),
            transmissions: VOLVO_FH_CLASSIC_TRANSMISSION.to_vec(),
        },
    };

    return truck_brands { scania, volvo };
}
