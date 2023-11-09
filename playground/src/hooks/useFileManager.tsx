import { useContext } from "react";
import { FileManagerContext } from "../contexts/FileManagerProvider";

const useFileManager = () => {
    const context = useContext(FileManagerContext);
    if (!context) {
        throw new Error("useFileManager must be used within a FileManagerProvider");
    }
    return context;
}

export default useFileManager;
