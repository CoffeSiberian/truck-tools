export interface findMyTrailerIdResTypes extends MessageEvent {
    res: string | null;
}

export interface findTrailerIndexResTypes extends MessageEvent {
    res: string | null;
}

export interface setCargoMassTrailerResTypes extends MessageEvent {
    res: string[] | null;
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
