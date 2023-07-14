import { createContext, useEffect, useState } from "react";
import LocalStorage from "../plugins/StoragePlugins/LocalStorage";

interface ProviderProps {
    children: React.ReactNode;
}

type StorageContextProps = {
    listPlugins: () => StoragePlugin[];
    addPlugin: (plugin: StoragePlugin) => void;
    list: (plugin: number) => string[];
    get: (plugin: number, key: string) => string;
    save: (plugin: number, key: string, content: string) => boolean;
    remove: (plugin: number, key: string) => boolean;
}



export const StorageContext = createContext({} as StorageContextProps);

export const StorageProvider = ({ children }: ProviderProps) => {
    const [plugins, setPlugins] = useState<StoragePlugin[]>([
        new LocalStorage()
    ]); 

    useEffect(() => {
        console.log("StorageProvider: ", plugins);
    }, [plugins]);

    const listPlugins = () => { return plugins }
    const addPlugin = (plugin: StoragePlugin) => {return false}
    const list = (plugin: number) => { return [] }
    const get = (plugin: number, key: string) => { return "" }
    const save = (plugin: number, key: string, content: string) => { return false }
    const remove = (plugin: number, key: string) => { return false }

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
