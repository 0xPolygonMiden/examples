import { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import EditorLabel from "./EditorLabel";
import Editor from "./Editor";
import Widget from "../Widget";
import StorageDialog from "../StorageDialog";
import { useState } from "react";

type MidenInputsProps = {
    theme: ReactCodeMirrorProps["theme"];
};

const MidenInputs = (props: MidenInputsProps): JSX.Element => {
    const [storageDialogOKText, StorageDialogOKText] = useState<string | React.ReactNode>("OK");
    const [showStorageDialog, setShowStorageDialog] = useState<boolean>(false);
    const [storageDialogFor, setStorageDialogFor] = useState<"load" | "save">("load");

    const handleClickSave = () => {
        console.log("Save");
        setStorageDialogFor("save");
        setShowStorageDialog(true);
    }
    const handleClickLoad = () => {
        console.log("Load");
        setStorageDialogFor("load");
        setShowStorageDialog(true);
    } 

    return <>
        <Widget collapsible={false} collapsed={false}>
        <Widget.Header name="Inputs">
                <div className="panel">
                    <button type="button" className="fas fa-save" onClick={handleClickSave} />
                    <button type="button"  className="fas fa-folder-open" onClick={handleClickLoad} />
                </div>
            </Widget.Header>
            <Widget.Body>
                <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Id sequi assumenda optio blanditiis nulla. Itaque quibusdam 
                    nulla doloremque dolorum repellendus nihil, aliquid asperiores
                    vero? Accusamus sapiente voluptate accusantium architecto modi!
                </p>
            </Widget.Body>
        </Widget>
        
        {/* <StorageDialog
            title="Save to Storage"
            filter={{
                type: "application/wasm",
            }}
            show={showSaveStorageDialog}
            filename={filename}
            okText={<>Save<i className="fas fa-save" /></>}
            onOk={
                file => {
                    setFilename(file.name);
                    file.value = code;
                    save(0, file);
                    setShowSaveStorageDialog(false);
                }
            }
            onCancel={() => setShowSaveStorageDialog(false)}
        />

        <StorageDialog
            filter={{
                type: "application/wasm",
            }}
            show={showLoadStorageDialog}
            filename={filename}
            okText={<>Load<i className="fas fa-folder-open" /></>}
            onOk={
                async file => {
                    setFilename(file.name);
                    
                    setCode(file.value)

                    setShowLoadStorageDialog(false);
                }
            }
            onCancel={() => setShowLoadStorageDialog(false)}
        /> */}
    </>
}

export default MidenInputs