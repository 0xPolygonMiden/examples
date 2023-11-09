import useFileManager from "../../hooks/useFileManager"

interface PluginsListProps {
    isSelected: (isSelected: boolean) => void
}

const PluginsList = ({isSelected}: PluginsListProps) => {
    const { listPlugins, setPlugin } = useFileManager();

    if (!listPlugins) return (<div>loading...</div>);
    if (!setPlugin) return (<div>loading...</div>);

    const handleSelectPlugin = (plugin: string) => {
        setPlugin(plugin);
        isSelected(true);
    }

    return <>
        {listPlugins().map((plugin: string) => (
            <div className="card" key={plugin} onClick={e => handleSelectPlugin(plugin)}>
                <div className="icon">
                    <img src={`/assets/img/plugins/${plugin}.svg`} alt={plugin} />
                    <span>{plugin}</span>
                </div>
            </div>
        ))}        
    </>
}

export default PluginsList