import FileManagerOpen from "./FileManagerOpen";
import File from "./File";

type FileManager = {
    save: (path: string, content: string) => Promise<void>,
    load: (path: string) => Promise<string>,
    list: (path: string) => Promise<File[]>,
    remove: (path: string) => Promise<void>,
    listPlugins?: () => string[],
    open?: (options: FileManagerOpen) => any,
    close?: () => void,
    setPlugin?: (name: string) => void,
    openOptions?: FileManagerOpen,
};


export default FileManager;