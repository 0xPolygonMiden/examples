import { useState, createContext } from "react"
import FileManager from "../types/FileManager"
import FileManagerOpen from "../types/FileManagerOpen"
import LocalStoragePlugin from "../plugins/FileManager/LocalStoragePlugin"
import FileManagerModal from "../components/FileManager/FileManagerModal"

export const FileManagerContext = createContext<FileManager>({} as FileManager);

const FileManagerProvider = ({children}:any) => {
    const [ selectedPlugin, setPlugin] = useState<string>("localstorage")
    const [ showFileManager, setShowFileManager ] = useState<boolean>(false)
    const [ openOptions, setOpenOptions ] = useState<FileManagerOpen | undefined>()
    const [ plugins, setPlugins] = useState<Array<{id: string, name: string, plugin: FileManager}>>([
        {id: 'localstorage', name: "Local Storage", plugin: LocalStoragePlugin({key:"localstorage"})}
    ])

    const getPlugin = (id: string) => { 
        const plugin = plugins.find((plugin) => plugin.id === id)
        if (!plugin) throw new Error(`Plugin ${id} not found`)
        return plugin.plugin
    }

    const open = ({title,okText,cancelText,onOk,onCancel,onClose}:FileManagerOpen) => {
        setOpenOptions({title,okText,cancelText,onOk,onCancel,onClose});
        setShowFileManager(true);
    }
    const close = () => {
        setOpenOptions(undefined);
        setShowFileManager(false);
    }
    const save = async (path: string, content: string) => {
        const plugin = getPlugin(selectedPlugin)
        plugin.save(path,content)
    }
    const load = async (path: string) => {
        const plugin = getPlugin(selectedPlugin)
        return await plugin.load(path)
    }
    const list = async (path: string) => {
        const plugin = getPlugin(selectedPlugin)
        return await plugin.list(path)
    }
    const remove = async (path: string) => {
        const plugin = getPlugin(selectedPlugin)
        return await plugin.remove(path)
    }
    const listPlugins = () => {
        return plugins.map((plugin) => plugin.id)
    }

    return <FileManagerContext.Provider value={{
        open,
        close,
        save,
        load,
        remove,
        list,
        listPlugins,
        setPlugin,
    }}>
        {children}
        {showFileManager && <FileManagerModal
            title={openOptions?.title || ""}
            okText={openOptions?.okText || ""}
            cancelText={openOptions?.cancelText || ""}
            onOk={openOptions?.onOk || (() => {})}
            onCancel={openOptions?.onCancel || (() => {})}
            onClose={openOptions?.onClose || (() => {})}
        />}
    </FileManagerContext.Provider>
}

export default FileManagerProvider