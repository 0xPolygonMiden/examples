import React, { createElement } from "react";
import Settings from "../types/Settings";
import useSettings from "./useSettings";

//widgets
import Editor from "../components/widgets/Editor";
import Instructions from "../components/widgets/Instructions";
import Explainer from "../components/widgets/Explainer";

const useWidgets = (): {
    widgets: Settings["widgets"];
    setWidgets: (widgets: Settings["widgets"]) => void;
    getWidgetByName: (name: string) => React.ReactNode;
} => {
    const { widgets, setSettings } = useSettings();
    return {
        widgets,
        setWidgets: (widgets: Settings["widgets"]) => {
            setSettings("widgets", widgets);
        },
        getWidgetByName: (name: string):React.ReactNode => {
            switch (name) {
                case "editor":
                    return createElement(Editor, { key: name });
                case "instructions":
                    return createElement(Instructions, { key: name });
                case "explainer":
                    return createElement(Explainer, { key: name });
                default:
                    return createElement("div", { key: name }, `Widget ${name} not found`);
            }
        },
    }
}

export default useWidgets;