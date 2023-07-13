import { createContext, useEffect } from "react";

interface ProviderProps {
    children: React.ReactNode;
}

type StorageContextProps = {
    save: (key: string, value: any) => void;
    load: (key: string) => any;
    remove: (key: string) => void;
}

export const StorageContext = createContext({} as StorageContextProps);

export const StorageProvider = ({ children }: ProviderProps) => {
    const storageKey = "storage";

    useEffect(() => {
        //if storage doesn't exist, create it
        if (!localStorage.getItem(storageKey)) {
            localStorage.setItem(storageKey, JSON.stringify({}));
    }, []);

    const save = (key: string, value: any) => {
        //save to localstorage
        //return true if saved, false if not

        const storage = localStorage.getItem(storageKey);
        if (storage) {
            const parsedStorage = JSON.parse(storage);
            const newStorage = {
                ...parsedStorage,
                [key]: value
            };

            localStorage.setItem(storageKey, JSON.stringify(newStorage));

            return true;
        }

        return false;
    }
    const load = (key: string) => {
        //load from localstorage
        //return value

        const storage = localStorage.getItem(storageKey);
        if (storage) {
            const parsedStorage = JSON.parse(storage);
            return parsedStorage[key];
        }

        return null;
    }
    const remove = (key: string) => {
        //remove from localstorage
        //return true if removed, false if not

        const storage = localStorage.getItem(storageKey);
        if (storage) {
            const parsedStorage = JSON.parse(storage);
            delete parsedStorage[key];

            localStorage.setItem(storageKey, JSON.stringify(parsedStorage));

            return true;
        }

        return false;
    }

    return <StorageContext.Provider value={{
        save,
        load,
        remove 
    }}>{children}</StorageContext.Provider>;
}

export default StorageProvider;
