import { useEffect, useState } from "react";
import { StoragePlugin } from "../../types/StoragePlugin";

class LocalStorage implements StoragePlugin {
    public name = 'Local Storage';
    public icon = process.env.PUBLIC_URL +  '/assets/img/storage_logo.svg';
    private key = 'storage';

    public constructor(key?: string) {
        if (key) {
            this.key = key;
        }
    }

    private getLocalStorage = (): StorageFile[] => {
        const storage = localStorage.getItem(this.key );
        if (storage) {
            return JSON.parse(storage);
        }

        return [];
    }

    private setLocalStorage = (storage: StorageFile[]) => {
        localStorage.setItem(this.key, JSON.stringify(storage));
    }

    public list = async (location: string): Promise<StorageFile[]> => {
        if(location === '') {
            location = '/';
        }
        
        const storage = this.getLocalStorage();
        return storage.filter(file => file.location === location);
    }

    public get = async (id: string): Promise<string> => {
        const storage = this.getLocalStorage();
        const file = storage.find(file => file.id === id);
        if (file) {
            return file.value;
        }

        return '';
    }

    public save = async (file: Partial<StorageFile>): Promise<boolean> => {
        const storage = this.getLocalStorage();

        const id = file.id || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const location = file.location || '/';
        const name = file.name || 'Untitled';
        const type = file.type || 'unknown';
        const value = file.value || '';
        const size = file.size || value.length;
        const lastModified = Date.now();

        let index = storage.findIndex(f => f.id === file.id);
        if (index === -1) {
            index = storage.length;
        }

        storage[index] = file as StorageFile;

        this.setLocalStorage([...storage]);

        return true;
    }

    public remove = async (id: string): Promise<boolean> => {
        const storage = this.getLocalStorage();
        const index = storage.findIndex(file => file.id === id);
        if (index > -1) {
            storage.splice(index, 1);
            this.setLocalStorage([...storage]);
            return true;
        }

        return false;
    }
}


export default LocalStorage;