import { createContext, useEffect, useState } from "react";
import defaultStorage from "../data/defaultStorage.json";

interface ProviderProps {
    children: React.ReactNode;
}

type StorageContextProps = {
    save: (key: string, value: any) => void;
    load: (key: string) => any;
    remove: (key: string) => void;
    getStorage: (filter: Filter) => Storage;
}



export const StorageContext = createContext({} as StorageContextProps);

export const StorageProvider = ({ children }: ProviderProps) => {
    const [storage, setStorage] = useState<Storage>(JSON.parse(JSON.stringify(defaultStorage)));
    const storageKey = "storage";
    
    useEffect(() => {
        const storageData = localStorage.getItem(storageKey);
        if (storageData) {
            setStorage(JSON.parse(storageData));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(storage));
    },[storage]);

    const save = (key: string, value: any) => {
        const newStorage = {
            ...storage,
            [key]: value
        }

        setStorage(newStorage);
    }

    const load = (key: string) => {
        return storage[key];
    }

    const remove = (key: string) => {
        const newStorage = {
            ...storage
        }

        delete newStorage[key];

        setStorage(newStorage);

    }

    const getStorage = (filter: Filter) => {
        let newStorage = storage;

        if (filter.name) {
            const filtered = Object.fromEntries(Object.entries(newStorage).filter(([key, value]) => value.name === filter.name));
            newStorage = {
                ...newStorage,
                ...filtered
            }
        }

        if (filter.type) {
            const filtered = Object.fromEntries(Object.entries(newStorage).filter(([key, value]) => value.type === filter.type));
            newStorage = {
                ...newStorage,
                ...filtered
            }
        }

        return newStorage;

    }


    return <StorageContext.Provider value={{
        save,
        load,
        remove,
        getStorage 
    }}>{children}</StorageContext.Provider>;
}

export default StorageProvider;
