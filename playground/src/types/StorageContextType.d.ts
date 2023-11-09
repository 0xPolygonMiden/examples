
type StorageContextType = {
    save: (key: string, value: any) => void;
    load: (key: string) => any;
};

export default StorageContextType;