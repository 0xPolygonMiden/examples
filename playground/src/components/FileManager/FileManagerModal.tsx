import { useState } from "react";
import useFileManager from "../../hooks/useFileManager";
import FileManagerOpen from "../../types/FileManagerOpen"
import PluginsList from "./PluginsList";
import FileList from "./FileList";
import Modal from "../Modal";

const FileManagerModal = ({ title, okText, cancelText, onOk, onCancel, onClose }: FileManagerOpen) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [pluginIsSelected, setPluginIsSelected] = useState<boolean>(false);
    const [isNewFile, setIsNewFile] = useState<boolean>(false);

    const { close } = useFileManager();

    const handleClose = () => {
        onClose && onClose();
        close && close();
    }

    const handleOk = () => {
        if (isNewFile) setSelected(selected || '/new_file');
        if (!selected) return;
        onOk && onOk(selected);
        handleClose();
    }

    const hangleCancel = () => {
        setSelected(null);
        onCancel && onCancel();
        handleClose();
    }

    return <>
        <Modal
            title={title}
            onOk={handleOk}
            onCancel={hangleCancel}
            onClose={handleClose}
            isOpen={true}
            okText={okText}
            cancelText={cancelText}
        >
            <div className="toolbar">
                <button onClick={e => setIsNewFile(true)}>
                    {!isNewFile
                        ? <span>New File</span>
                        : <input type="text" className="path" value={selected || '/new_file'} onChange={e => setSelected(e.target.value)} />
                    }
                    <i className="fas fa-plus" />
                </button>
            </div>
            <div className="filemanager">
                {
                    pluginIsSelected
                        ? <PluginsList isSelected={setPluginIsSelected} />
                        : <FileList setSelected={setSelected} />
                }
            </div>

        </Modal>
    </>
}

export default FileManagerModal
