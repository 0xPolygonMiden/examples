import { createContext, useEffect, useState } from "react";
import LocalStorage from "../plugins/StoragePlugins/LocalStorage";

interface ProviderProps {
    children: React.ReactNode;
}

type StorageContextProps = {
    listPlugins: () => StoragePlugin[];
    addPlugin: (plugin: StoragePlugin) => void;
    list: (plugin: number, location?: string ) => Promise<StorageFile[]>;
    get: (plugin: number, id: string) => Promise<string>;
    save: (plugin: number, file: File) => Promise<boolean>;
    remove: (plugin: number, id: string) => Promise<boolean>;
}



export const StorageContext = createContext({} as StorageContextProps);

export const StorageProvider = ({ children }: ProviderProps) => {
    const [plugins, setPlugins] = useState<StoragePlugin[]>([
        new LocalStorage()
    ]); 
    
    useEffect(() => {
        plugins[0].save({id:'0', location: "/", name: "dir1", type: "directory", size: 1234, lastModified: 0, value: "1234"});
        plugins[0].save({id:'1',location: "/", name: "dir2", type: "directory", size: 1234, lastModified: 0, value: "1234"});
        plugins[0].save({id:'2',location: "/dir1/", name: "file1", type: "wasm", size: 1234, lastModified: 0, value: "1234"});
        plugins[0].save({id:'3',location: "/dir1/", name: "file2", type: "wasm", size: 1234, lastModified: 0, value: "1234"});
        plugins[0].save({id:'4',location: "/dir2/", name: "Dir 2 file1", type: "wasm", size: 1234, lastModified: 0, value: "1234"});
        plugins[0].save({id:'5',location: "/dir2/", name: "Dir 2 file2", type: "wasm", size: 1234, lastModified: 0, value: "1234"});
        plugins[0].save({id:'6',location: "/dir2/", name: "dir3", type: "directory", size: 1234, lastModified: 0, value: "1234"});
        plugins[0].save({id:'7',location: "/dir2/dir3/", name: "Dir3 file1", type: "wasm", size: 1234, lastModified: 0, value: "1234"});
        plugins[0].save({id:'8',location: "/dir2/dir3/", name: "Dir 3 file2", type: "wasm", size: 1234, lastModified: 0, value: "1234"});
        plugins[0].save({id:'9',location: "/", name: "file1", type: "wasm", size: 1234, lastModified: 0, value: "1234"});
        plugins[0].save({id:'10',location: "/", name: "file2", type: "wasm", size: 1234, lastModified: 0, value: "1234"});
    }, []);

    const listPlugins = () => { return plugins }
    const addPlugin = async (plugin: StoragePlugin) => {return false}
    const list = async (plugin: number, location = '' ) => { 
        return await plugins[plugin].list(location);
     }
    const get = async (plugin: number, id: string) => { 
        return await plugins[plugin].get(id);
    }
    const save = async (plugin: number, file: File) => { 
        return await plugins[plugin].save(file);
     }
    const remove = async (plugin: number, id: string) => { 
        return await plugins[plugin].remove(id);
     }

    return (
        <StorageContext.Provider value={{ 
            listPlugins,
            addPlugin,
            list,
            get,
            save,
            remove
        }}> {children} </StorageContext.Provider>
    );
}

export default StorageProvider;
