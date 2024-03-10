import { join, documentDir } from "@tauri-apps/api/path";
import { descriptFiles } from "./utils/fileEdit";

import Home from "./routes/pages/Home";

const App = () => {
    const test = async () => {
        const documentDirString = await documentDir();
        const dir = await join(
            documentDirString,
            "Euro Truck Simulator 2",
            "profiles",
            "536962657269616E5F4D6F64735F43617A79",
            "save",
            "2"
        );

        const profiles = await descriptFiles(dir);
    };
    return (
        <div>
            <Home />
            <button onClick={test} />
        </div>
    );
};

export default App;
