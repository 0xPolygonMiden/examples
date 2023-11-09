import { createContext, useEffect, useState } from "react";
import LocalStorage from "../plugins/StoragePlugins/LocalStorage";
import defaultStorage from "../data/defaultStorage.json";
import Buffer from "buffer";
import { StoragePlugin } from "../types/StoragePlugin";


interface ProviderProps {
    children: React.ReactNode;
}

type StorageContextProps = {
    listPlugins: () => StoragePlugin[];
    addPlugin: (plugin: StoragePlugin) => void;
    list: (plugin: number, location?: string ) => Promise<StorageFile[]>;
    get: (plugin: number, id: string) => Promise<string>;
    save: (plugin: number, file: StorageFile) => Promise<boolean>;
    remove: (plugin: number, id: string) => Promise<boolean>;
}



export const StorageContext = createContext({} as StorageContextProps);

export const StorageProvider = ({ children }: ProviderProps) => {
    const [plugins, setPlugins] = useState<StoragePlugin[]>([
        new LocalStorage()
    ]); 
    
    useEffect(() => {
        defaultStorage.forEach((file: Partial<StorageFile>) => {
            plugins[0].save(file);
        });
    }, []);

    const listPlugins = () => { return plugins }
    const addPlugin = async (plugin: StoragePlugin) => {return false}
    const list = async (plugin: number, location = '' ) => { 
        return await plugins[plugin].list(location);
     }
    const get = async (plugin: number, id: string) => { 
        return await plugins[plugin].get(id);
    }
    const save = async (plugin: number, file: StorageFile) => { 
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
