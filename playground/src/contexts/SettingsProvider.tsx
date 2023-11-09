import { createContext, ReactNode, useState, useEffect } from "react";
import type Settings from "../types/Settings";
import type SettingsContextType from "../types/SettingsContextType";
import useStorage from "../hooks/useStorage";
import defaultSettings from "../data/defaultSettings.json";

export const SettingsContext = createContext({} as SettingsContextType);
const localStorageKey = "settings";


export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const { save, load } = useStorage();
    const [settings, _setSettings] = useState<Settings>({
        ...defaultSettings as Settings,
        ...load(localStorageKey) as Partial<Settings>,

        //Force these to be default values
        widgets: defaultSettings.widgets,
        widgetPiles: defaultSettings.widgetPiles
    });

    const disablePopovers = () => {
        _setSettings({
            ...settings,
            showPopovers: false
        });
    }

    const setSettings = (setting: string, value: any) => {
        _setSettings({
            ...settings,
            [setting]: value
        });
    }

    useEffect(() => {
        save(localStorageKey, settings);
    }, [settings, save]);


    return <>
        <SettingsContext.Provider value={{
            ...settings,
            setSettings,
            disablePopovers
    }}>
        <div id="config-theme" data-theme={settings.theme}>
            {children}
        </div>
        </SettingsContext.Provider>
    </>
}

export default SettingsProvider;