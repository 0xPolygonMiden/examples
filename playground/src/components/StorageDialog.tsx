import { useState } from "react";
import Dialog from "./Dialog";

interface StorageDialogProps {
    filter: Filter;
    show?: boolean;
    filename?: string;
    onLoad?: (filename: string) => void;
    onSave?: (filename: string) => void;
}

const StorageDialog = ({filter, show, filename, onLoad, onSave}: StorageDialogProps) => {
    const [selected, setSelected] = useState<string>("");

    const handleOnLoad = () => {
        if(onLoad) {
            onLoad(selected);
        }
    }

    const handleOnSave = () => {
        if(onSave) {
            onSave(filename || "");
        }
    }


    return <>
        <Dialog>
            <Dialog.Header title="Storage" />
            <Dialog.Body>
                <div className="filters">
                    <div className="filter">
                        <label>Filter</label>
                        <input type="text" />
                    </div>
                </div>
                <div className="storage">
                    <div className="storage-item">
                        <input type="radio" name="storage" value="file1" onChange={(e) => setSelected(e.target.value)} />
                        <label>file1</label>
                    </div>
                    <div className="storage-item">
                        <input type="radio" name="storage" value="file2" onChange={(e) => setSelected(e.target.value)} />
                        <label>file2</label>
                    </div>
                    <div className="storage-item">
                        <input type="radio" name="storage" value="file3" onChange={(e) => setSelected(e.target.value)} />
                        <label>file3</label>
                    </div>
                </div>
            </Dialog.Body>
            <Dialog.Footer>
                <div className="panel">
                    <button className="cancel">Cancel</button>
                    <button className="ok" onClick={handleOnLoad}>Load</button>
                    <button className="ok" onClick={handleOnSave}>Save</button>
                </div>
            </Dialog.Footer>
        </Dialog>
    </>;
};

export default StorageDialog;