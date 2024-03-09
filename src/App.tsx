import { Button } from "primereact/button";
import { documentDir } from "@tauri-apps/api/path";
import { readProfileNames } from "./utils/fileEdit";

const App = () => {
    const test = async () => {
        const dirDocs = await documentDir();
        const profiles = await readProfileNames();
        // console.log(profiles);
    };
    return (
        <div>
            <h1>Welcome to Tauri!</h1>
            <Button onClick={test} label="Click Me" />
        </div>
    );
};

export default App;
