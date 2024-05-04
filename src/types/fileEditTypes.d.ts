export interface findMyTrailerIdResTypes extends MessageEvent {
    res: string | null;
}

export interface findTrailerIndexResTypes extends MessageEvent {
    res: string | null;
}

export interface setCargoMassTrailerWorkerResTypes extends MessageEvent {
    data: string[] | null;
}

export interface setCargoMassTrailerWorkerTypes extends MessageEvent {
    data: {
        index: number;
        saveGame: string[];
        cargoMass: string;
    };
}

export interface getSlaveTrailersIdResTypes extends MessageEvent {
    res: string | null;
}

export interface arrFileWorkerResTypes extends MessageEvent {
    data: string[];
}

export interface arrFileWorkerTypes extends MessageEvent {
    data: string;
}
