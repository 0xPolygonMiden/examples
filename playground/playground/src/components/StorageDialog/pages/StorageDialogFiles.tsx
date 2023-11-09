import { useState, useContext, useEffect } from "react";
import { StorageContext } from "../../../contexts/StorageProvider";
import Panel from "../../Panel";

interface StorageDialogFilesProps {
    filter: StorageFilter;
    plugin: number;
    onFileSelect: (file: StorageFile) => void;
    onClose: () => void;
}

const iconMemeType: IconMemeType = {
    "masm": process.env.PUBLIC_URL + "/assets/img/storage_code.svg",
    "input": process.env.PUBLIC_URL + "/assets/img/storage_data.svg",
    "dir": process.env.PUBLIC_URL + "/assets/img/storage_directory.svg"
};

const StorageDialogFiles = ({filter, plugin, onFileSelect, onClose}: StorageDialogFilesProps) => {
    const { list, listPlugins } = useContext(StorageContext);
    const [ location, setLocation ] = useState('/');
    const [ history, setHistory ] = useState<string[]>([location]);
    const [files, setFiles] = useState<StorageFile[]>([]);
    const [filteredFiles, setFilteredFiles] = useState<StorageFile[]>([]);
    const [filterName, setFilterName] = useState<string>("");
    const [filename, setFilename] = useState<string>("");
    const [showNewFilename, setShowNewFilename] = useState<boolean>(false);
    const scheme = listPlugins()[plugin].name + ":/";

    useEffect(() => {
        const f = [...files];
    
        if (filterName) {
            const filteredFiles = f.filter(item =>
                item.name.toLowerCase().includes(filterName.toLowerCase())
            );
            setFilteredFiles(filteredFiles);
        } else {
            setFilteredFiles(f);
        }
    }, [filterName]);

    useEffect(() => {
        const update = async () => {
            const files = await list(plugin, location);
            setFiles(files);
        }

        update();
    }, [plugin, location]);


    const handleNewFileClick = () => {
        setShowNewFilename(true);
        if(filename === "") {
            return;
        }

        if(onFileSelect){
            onFileSelect({
                id: Math.random().toString(36).substr(2, 9),
                name: filename,
                location: location,
                type: "wasm",
                size: 0,
                lastModified: 0,
                value: ""
            });
        }
    }

    const handleFileClick = async (file: StorageFile) => {
        if (file.type === "dir") {
            const newPath = file.location + file.name + "/";
            setLocation(newPath);
            setHistory([...history, newPath]);
        } else {
            onFileSelect(file)
        }

    }

    const handleBackClick = () => {
        if(history.length <= 1) {
            onClose();
            return;
        }
        setLocation(history[history.length - 2] || '' );
        setHistory(history.slice(0, history.length - 1));
    }


    return <>
        <div className="storage-dialog-files">
            <div className="storage-dialog-plugins-header">
                <Panel>
                    <button className="btn" onClick={handleNewFileClick}>{filename ?'Save':'New File'}<i className="fas fa-file" /></button>
                    {showNewFilename && <>
                        <button className="stretch">
                            <input type="text" placeholder="Filename" value={filename} onChange={e => setFilename(e.target.value)} />
                        </button>
                    </>}
                    <button className="stretch">
                        <input type="text" placeholder="Search" value={filterName} onChange={e => setFilterName(e.target.value)} />  
                        <i className="fas fa-search" />
                    </button>
                </Panel>
                <Panel><span className="breadcrumbs">{scheme}{location}</span></Panel>
            </div>
            <div className="storage-dialog-files-body">
                <div className="card btn go-back" onClick={handleBackClick}>
                    <i className="icon btn fas fa-arrow-left"/>
                </div>    
                {files.map((file, index) => {
                    return <div className="card btn card-file" key={index} onClick={() => handleFileClick(file)}>
                        <div className="icon">
                            <img src={iconMemeType[file.type]} alt={file.type} width={50} />
                        </div>
                        <div className="content">
                            <div className="title">{file.name}</div>
                        </div>
                    </div>;
                })}
            </div>
        </div>        
    </>;
};

export default StorageDialogFiles;