import { createContext, ReactNode } from "react";
import type StorageContextType from "../types/StorageContextType";

export const StorageContext = createContext({} as StorageContextType);

export const StorageProvider = ({ children }: { children: ReactNode }) => {
    const save = (key: string, value: any) => {
        const dataString = JSON.stringify(value);
        localStorage.setItem(key, dataString);
    }

    const load = (key: string):any => {
        const dataString = localStorage.getItem(key);
        const data = dataString ? JSON.parse(dataString) : {};

        return data;
    }

    return <>
        <StorageContext.Provider value={{
            save,
            load        
        }}>
            {children}
        </StorageContext.Provider>
    </>
}

export default StorageProvider;