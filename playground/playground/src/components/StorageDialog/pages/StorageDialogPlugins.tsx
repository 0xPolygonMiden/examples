import { useContext, useState } from "react";
import { StorageContext } from "../../../contexts/StorageProvider";

interface StorageDialogPluginsProps {
    onPluginSelect: (pluginId: number) => void;
}

const StorageDialogPlugins = ({onPluginSelect}: StorageDialogPluginsProps) => {
    const { listPlugins } = useContext(StorageContext);
    const [plugins, setPlugins] = useState(listPlugins());

    return <>        
        <div className="storage-dialog-plugins">
            {plugins.map((plugin, index) => {
                return <div className="card" key={index} onClick={() => onPluginSelect(index)} style={{cursor:"pointer"}}>
                    <div className="icon">
                        <img src={plugin.icon} alt={plugin.name} width={100} />
                    </div>
                    <div className="content">
                        <div className="title">{plugin.name}</div>
                    </div>
                </div>;
            })}
        </div>
    </>;
};

export default StorageDialogPlugins;