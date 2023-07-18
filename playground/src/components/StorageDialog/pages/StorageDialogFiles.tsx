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
    "wasm": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/WebAssembly_Logo.svg/900px-WebAssembly_Logo.svg.png?20171120175633",
    "json": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/JSON_vector_logo.svg/1200px-JSON_vector_logo.svg.png",
    "octet-stream": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/WebAssembly_Logo.svg/900px-WebAssembly_Logo.svg.png?20171120175633",
    "directory": "https://png.pngtree.com/element_our/png/20181213/folder-vector-icon-png_267455.jpg",
};

const StorageDialogFiles = ({filter, plugin, onFileSelect, onClose}: StorageDialogFilesProps) => {
    const { list, listPlugins } = useContext(StorageContext);
    const [ location, setLocation ] = useState('/');
    const [ history, setHistory ] = useState<string[]>([location]);
    const [files, setFiles] = useState<StorageFile[]>([]);
    const [filteredFiles, setFilteredFiles] = useState<StorageFile[]>([]);
    const [filterName, setFilterName] = useState<string>("");
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

    const handleFileClick = async (file: StorageFile) => {
        if (file.type === "directory") {
            const newPath = file.location + file.name + "/";
            setLocation(newPath);
            setHistory([...history, newPath]);
        } else {
            onFileSelect(file)
        }

        console.log(file);
    }

    const handleBackClick = () => {
        if(history.length <= 1) {
            onClose();
            return;
        }
        setLocation(history[history.length - 2] || '' );
        setHistory(history.slice(0, history.length - 1));
    }

    // console.log({
    //     plugin:listPlugins()[plugin],
    //     location,
    //     files,
    //     filteredFiles,
    //     filterName
    // })

    return <>
        <div className="storage-dialog-files">
            <div className="storage-dialog-plugins-header">
                <Panel>
                    <button className="btn">New File<i className="fas fa-file" /></button>
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
                    return <div className="card btn" key={index} onClick={() => handleFileClick(file)}>
                        <div className="icon">
                            <img src={iconMemeType[file.type]} alt={file.type} />
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