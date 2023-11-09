import Settings from "../types/Settings";
import useSettings from "./useSettings";

const useWidgetPiles = (): {
    widgetPiles: Settings["widgetPiles"];
    setWidgetPiles: (widgets: Settings["widgetPiles"]) => void;
} => {
    const { widgetPiles, setSettings } = useSettings();
    return {
        widgetPiles,
        setWidgetPiles: (widgetPiles: Settings["widgetPiles"]) => {
            setSettings("widgetPiles", widgetPiles);
        }
    }
}

export default useWidgetPiles;