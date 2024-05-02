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
