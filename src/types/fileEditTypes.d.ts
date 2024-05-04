export interface findMyTrailerIdResTypes extends MessageEvent {
    res: string | null;
}

export interface findTrailerIndexResTypes extends MessageEvent {
    res: number | null;
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

export interface getSlaveTrailersIdWorkerResTypes extends MessageEvent {
    data: string | null;
}

export interface getSlaveTrailersIdWorkerTypes extends MessageEvent {
    data: {
        index: number;
        saveGame: string[];
    };
}

export interface arrFileWorkerResTypes extends MessageEvent {
    data: string[];
}

export interface arrFileWorkerTypes extends MessageEvent {
    data: string;
}
