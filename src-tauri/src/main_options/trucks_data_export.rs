use super::truck_engines::{
    SCANIA_R_2009_ENGINES, SCANIA_R_ENGINES, SCANIA_STREAMLINE_ENGINES, SCANIA_S_ENGINES, VOLVO_FH,
    VOLVO_FH_CLASSIC, MAN_TGX, MAN_TGX_EURO6, MERCEDES_ACTROS, MERCEDES_NEW_ACTROS, RENAULT_PREMIUM,
    RENAULT_MAGNUM, RENAULT_T, DAF_XF, DAF_XF_EURO6, DAF_2021, IVECO_HIWAY, IVECO_STRALIS,
};
use super::truck_transmissions::{
    SCANIA_R_2009_TRANSMISSION, SCANIA_R_TRANSMISSION, SCANIA_STREAMLINE_TRANSMISSION,
    SCANIA_S_TRANSMISSION, VOLVO_FH_CLASSIC_TRANSMISSION, VOLVO_FH_TRANSMISSION, 
    MAN_TGX_TRANSMISSION, MAN_TGX_EU6_TRANSMISSION,
    DAF_2021_TRANSMISSION, DAF_XF_EU6_TRANSMISSION, DAF_XF_TRANSMISSION, 
    IVECO_HIWAY_TRANSMISSION, IVECO_STRALIS_TRANSMISSION, 
    MERCEDES_ACTROS_TRANSMISSION, MERCEDES_NEW_ACTROS_TRANSMISSION,
    RENAULT_PREMIUM_TRANSMISSION, RENAULT_MAGNUM_TRANSMISSION, RENAULT_T_TRANSMISSION,
};
use crate::structs::vec_trucks::{BrandDaf, BrandIveco, BrandMan, BrandMercedes, BrandRenault, BrandScania, BrandVolvo, TruckBrands, TruckValues};
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
    let man: BrandMan = BrandMan {
        man_tgx: TruckValues {
            engines: MAN_TGX.to_vec(),
            transmissions: MAN_TGX_TRANSMISSION.to_vec(),
        },
        man_tgx_eu6: TruckValues {
            engines: MAN_TGX_EURO6.to_vec(),
            transmissions: MAN_TGX_EU6_TRANSMISSION.to_vec(),
        },
    };

    let renault: BrandRenault = BrandRenault {
        renault_magnum: TruckValues {
            engines: RENAULT_MAGNUM.to_vec(),
            transmissions: RENAULT_MAGNUM_TRANSMISSION.to_vec(),
        },
        renault_premium: TruckValues {
            engines: RENAULT_PREMIUM.to_vec(),
            transmissions: RENAULT_PREMIUM_TRANSMISSION.to_vec(),
        },
        renault_t: TruckValues {
            engines: RENAULT_T.to_vec(),
            transmissions: RENAULT_T_TRANSMISSION.to_vec(),
        },
    };

    let iveco: BrandIveco = BrandIveco {
        iveco_hiway: TruckValues {
            engines: IVECO_HIWAY.to_vec(),
            transmissions: IVECO_HIWAY_TRANSMISSION.to_vec(),
        },
        iveco_stralis: TruckValues {
            engines: IVECO_STRALIS.to_vec(),
            transmissions: IVECO_STRALIS_TRANSMISSION.to_vec(),
        },
    };

    let daf: BrandDaf = BrandDaf {
        daf_xf: TruckValues {
            engines: DAF_XF.to_vec(),
            transmissions: DAF_XF_TRANSMISSION.to_vec(),
        },
        daf_xf_euro6: TruckValues {
            engines: DAF_XF_EURO6.to_vec(),
            transmissions: DAF_XF_EU6_TRANSMISSION.to_vec(),
        },
        daf_2021: TruckValues {
            engines: DAF_2021.to_vec(),
            transmissions: DAF_2021_TRANSMISSION.to_vec(),
        },
    };

    let mercedes: BrandMercedes = BrandMercedes {
        mercedes_actros: TruckValues {
            engines: MERCEDES_ACTROS.to_vec(),
            transmissions: MERCEDES_ACTROS_TRANSMISSION.to_vec(),
        },
        mercedes_new_actros: TruckValues {
            engines: MERCEDES_NEW_ACTROS.to_vec(),
            transmissions: MERCEDES_NEW_ACTROS_TRANSMISSION.to_vec(),
        },
    };

    return TruckBrands { scania, volvo, man, iveco, daf, renault, mercedes };
}
