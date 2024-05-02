import { findTrailerIndexWorkerTypes } from "../../types/fileEditTypes";

self.onmessage = (event: findTrailerIndexWorkerTypes) => {
    let trailerIndex: null | number = null;

    for (let i = 0; i < event.data.arrFile.length; i++) {
        const splitTrailerMas = event.data.arrFile[i].split(":");

        if (splitTrailerMas[1] === event.data.trailerId + " {") {
            trailerIndex = i;
            break;
        }
    }

    self.postMessage(trailerIndex);
};
