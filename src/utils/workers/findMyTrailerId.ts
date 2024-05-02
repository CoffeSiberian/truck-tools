import { findMyTrailerIdWorkerTypes } from "../../types/fileEditTypes";

self.onmessage = function (event: findMyTrailerIdWorkerTypes) {
    let myTrailerId: null | string = null;

    for (let i = 0; i < event.data.length; i++) {
        const splitTrailerMas = event.data[i].split(":");

        if (splitTrailerMas[0] === " my_trailer") {
            myTrailerId = splitTrailerMas[1];
            break;
        }
    }

    self.postMessage(myTrailerId);
};
