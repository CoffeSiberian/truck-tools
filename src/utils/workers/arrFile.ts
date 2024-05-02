import { arrFileWorkerTypes } from "../../types/fileEditTypes";

self.onmessage = (event: arrFileWorkerTypes) => {
    self.postMessage(event.data.split("\r\n"));
};
