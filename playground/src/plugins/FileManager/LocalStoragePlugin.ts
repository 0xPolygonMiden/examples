 import { useEffect, useState } from "react"
import FileManager from "../../types/FileManager"
import File from "../../types/File"
import defaultLocalStorage from "../../data/defaultLocalStorage.json";

interface LocalStoragePluginOptions {
    key: string
}

const LocalStoragePlugin = ({key}:LocalStoragePluginOptions):FileManager =>{
    //This plugin implements the FileManager interface using the browser's localStorage
    const [ files, setFiles ] = useState<{[path:string]:File}>(
        JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultLocalStorage))
    )
    
    useEffect(() => {
        localStorage.setItem(key,JSON.stringify(files))
    },[files])

    const save = async (path: string, content?: string) => {
        const file:File = {
            name: path.split("/").pop() || "",
            type: content?"file":"dir",
            path,
            content: content || ""
        }
        setFiles({...files,[path]:file})
    }
    const load = async (path: string) => {
        const file = files[path]
        return file.content
    }
    const list = async (path: string) => {
        return Object.values(files).filter(file => file.path.startsWith(path))
    }
    const remove = async (path: string) => {
        const newFiles = {...files}
        delete newFiles[path]
        setFiles(newFiles)
    }

    return {
        save,
        load,
        remove,
        list
    }
    
}

export default LocalStoragePlugin
