import { useEffect, useState } from "react";
import Dialog from "./Dialog";

interface StorageDialogProps {
    title?: string;
    filter: Filter;
    show?: boolean;
    filename?: string;
    onOk?: (filename: string) => void;
    okText?: string | React.ReactNode;
    onCancel?: () => void;
}

const defaultData = [
    {
        name: "test",
        type: "application/wasm",
        size: 1234,
        modified: new Date(),
        content: new Uint8Array(1234)
    },
    {
        name: "Fibonacci",
        type: "application/wasm",
        size: 1234,
        modified: new Date(),
        content: new Uint8Array(1234)
    },
    {
        name: "Abc 12 ",
        type: "application/wasm",
        size: 234,
        modified: new Date(),
        content: new Uint8Array(1234)
    },
    {
        name: "test",
        type: "application/wasm",
        size: 1234,
        modified: new Date(),
        content: new Uint8Array(1234)
    },
    {
        name: "test",
        type: "application/wasm",
        size: 1234,
        modified: new Date(),
        content: new Uint8Array(1234)
    },

]

interface IconMemeType {
    [key: string]: string;
    "application/wasm": string;
    "application/json": string;
    "application/octet-stream": string;
}

const iconMemeType: IconMemeType = {
    "application/wasm": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/WebAssembly_Logo.svg/900px-WebAssembly_Logo.svg.png?20171120175633",
    "application/json": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/JSON_vector_logo.svg/1200px-JSON_vector_logo.svg.png",
    "application/octet-stream": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/WebAssembly_Logo.svg/900px-WebAssembly_Logo.svg.png?20171120175633",
};

const StorageDialog = ({ title, filter, show, filename, onOk, okText, onCancel }: StorageDialogProps) => {
    const [selected, setSelected] = useState<string>("");
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [filterName, setFilterName] = useState<string>("");
    const [data, setData] = useState<any[]>(defaultData);

    // useEffect(() => {
    //     const d = [...data];

    //     d.sort((a,c) => {
    //         if (a.name < c.name) return -1;
    //         if (a.name > c.name) return 1;
    //         return 0;
    //     })

    //     setData(d);
    // }, [data]);

    useEffect(() => {
        const index = data.findIndex(d => d.name === filename);
        setSelectedIndex(index);

    }, [selectedIndex]);
    
    useEffect(() => {
        const d = [...defaultData];
    
        if (filterName) {
            const filteredData = d.filter(item =>
                item.name.toLowerCase().includes(filterName.toLowerCase())
            );
            setData(filteredData);
        } else {
            setData(d);
        }
    }, [filterName]);
    
    return <>
        <Dialog>
            <Dialog.Header title={title} />
            <Dialog.Body>
                <div className="filters">
                    <div className="panel">
                        <button className="btn">New File<i className="fas fa-file" /></button>
                        <button className="stretch">
                            <input type="text" placeholder="Search" value={filterName} onChange={e => setFilterName(e.target.value)} />  
                            <i className="fas fa-search" />
                        </button>
                    </div>
                </div>
                <div className="files">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th className="stretch">Name</th>
                                <th className="stretch">Size</th>
                                <th className="stretch">Modified</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((file, index) => {
                                const memeType = file.type ? file.type : "application/octet-stream";
                                const iconSrc = iconMemeType[memeType];
                                const size = !file.size ? "0" : file.size > 1024 ? (file.size / 1024).toFixed(2) + "Kb": file.size + "B";

                                return <>
                                    <tr key={index} onClick={() => setSelectedIndex(index)} onDoubleClick={() => {onOk && onOk(filename || "")}} className={selectedIndex === index ? 'selected': ''}>
                                        <td><img src={iconSrc} width="20" /></td>
                                        <td>{file.name}</td>
                                        <td style={{textAlign: "right"}}>{size}</td>
                                        <td>{file.modified.toLocaleDateString()}</td>
                                        <td><i className="fas fa-times btn" /></td>
                                    </tr>
                                </>
                            })}
                        </tbody>
                    </table>
                </div>
            </Dialog.Body>
            <Dialog.Footer>
                <div className="panel">
                    <button className="btn" onClick={onCancel}>Cancel<i className="fas fa-ban" /></button>
                    <button className="btn" onClick={filename => onOk}>{okText ? okText : 'OK'}</button>
                </div>
            </Dialog.Footer>
        </Dialog>
    </>;
};

export default StorageDialog;