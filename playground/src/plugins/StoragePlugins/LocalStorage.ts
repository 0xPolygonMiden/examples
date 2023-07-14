class LocalStorage implements StoragePlugin {
    private localStorageBaseKey = 'storage';
    public name = 'Browser Storage';

    public constructor(localStorageBaseKey?: string){
        this.localStorageBaseKey = localStorageBaseKey || "storage"
    }

    public list = async (key?: string) => {
        if(!key) {
            key = '/';
        }

        const storageKey = `${this.localStorageBaseKey}-${key}`;

        // Get all keys that start with the storageKey
        const keys = Object.keys(localStorage).filter(k => k.startsWith(storageKey));

        /*
            /dir1/file1
            /dir1/file2
            /dir2/file1
            /dir2/file2
            /file1  
            /file2

            only the following should be returned
            /dir1
            /dir2
            /file1
            /file2
        */

        // Get the unique directories
        const directories = keys.map(k => k.replace(storageKey, '').split('/')[0]).filter((v, i, a) => a.indexOf(v) === i);

        // Get the unique files
        const files = keys.map(k => k.replace(storageKey, '').split('/').slice(1).join('/')).filter((v, i, a) => a.indexOf(v) === i);

        // Create the StorageFile objects
        const storageFiles = directories.map(d => {
            return {
                name: d,
                type: 'directory',
                size: 0,
                lastModified: 0,
                value: ''
            } as StorageFile;
        }).concat(files.map(f => {
            return {
                name: f,
                type: 'file',
                size: 0,
                lastModified: 0,
                value: ''
            } as StorageFile;
        }));

        return storageFiles;

    }
        
    public get = async (key: string) => {
        const storageKey = `${this.localStorageBaseKey}-${key}`;
        try {
            const storageValue = localStorage.getItem(storageKey);
            if(storageValue){
                return JSON.parse(storageValue);
            }
        } catch (error) {
            return {} as StorageFile;
        }
    }
    public save = async (key: string, value: any) => {
        const storageKey = `${this.localStorageBaseKey}-${key}`;
        try {
            localStorage.setItem(storageKey, JSON.stringify(value));
            return true;
        } catch (error) {
            return false;
        }
    }
    public remove = async (key: string) => {
        const storageKey = `${this.localStorageBaseKey}-${key}`;
        try {
            localStorage.removeItem(storageKey);
            return true;
        } catch (error) {
            return false;
        }
    }
    
}

export default LocalStorage;