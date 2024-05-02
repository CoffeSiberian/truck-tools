import { setCargoMassTrailerWorkerTypes } from "../../types/fileEditTypes";

self.onmessage = (event: setCargoMassTrailerWorkerTypes) => {
    let saveGame: null | string[] = null;

    const saveGameDeep = JSON.parse(JSON.stringify(event.data.saveGame));

    for (let i = event.data.index; i < saveGameDeep.length; i++) {
        const splitCargoMas = saveGameDeep[i].split(":");

        if (splitCargoMas[0] === " cargo_mass") {
            saveGameDeep[i] = " cargo_mass: " + event.data.cargoMass;
            saveGame = saveGameDeep;
            break;
        }
    }

    self.postMessage(saveGame);
};
