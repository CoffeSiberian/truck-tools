import { getSlaveTrailersIdWorkerTypes } from "../../types/fileEditTypes";

self.onmessage = (event: getSlaveTrailersIdWorkerTypes) => {
    let trailerId: null | string = null;
    let maxRound = 70;

    for (let i = event.data.index; i < event.data.saveGame.length; i++) {
        if (maxRound === 0) return null;
        maxRound--;

        const split = event.data.saveGame[i].split(":");
        if (split[0] === " slave_trailer") {
            if (split[1] === " null") break;
            trailerId = split[1];
            break;
        }
    }

    self.postMessage(trailerId);
};
