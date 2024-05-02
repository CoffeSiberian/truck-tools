export interface findMyTrailerIdWorkerResTypes extends MessageEvent {
    data: string | null;
}

export interface findMyTrailerIdWorkerTypes extends MessageEvent {
    data: string[];
}

export interface findTrailerIndexWorkerResTypes extends MessageEvent {
    data: number | null;
}

export interface findTrailerIndexWorkerTypes extends MessageEvent {
    data: {
        arrFile: string[];
        trailerId: string;
    };
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
