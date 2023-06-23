import React, { ReactNode, createContext, useState } from 'react';
import * as defaultWidgets from '../utils/widgets.json';

type ConfigContextType = {
    darkmode: boolean;
    toggleDarkmode: () => void;
    showConfigWindow: boolean;
    enableConfigWindow: boolean;
    setDefaultConfig: () => void;
    showPopovers: boolean;
    disablePopovers: () => void;
    widgets: WidgetsState;
    setWidget: (key: string, value: any) => void;
}

type ProviderProps = {
    children: ReactNode;
}

type WidgetsState = {
    [key: string]: {
        [key: string]: any;
    }
}

export const ConfigContext = createContext<ConfigContextType>({} as ConfigContextType);

export const ConfigProvider = ({ children }: ProviderProps) => {
    const [darkmode, setDarkmode] = useState(localStorage.getItem('darkmode') === 'false' ? false : true);
    const [enableConfigWindow, setEnableConfigWindow] = useState(localStorage.getItem('enableConfigWindow') === 'true' ? true: false); 
    const [showPopovers, setShowPopovers] = useState(localStorage.getItem('showPopovers') === 'false' ? false: true);
    const [showConfigWindow, setShowConfigWindow] = useState(false);
    const [widgets, setWidgets] = useState({
        instructions: {
            visible: false,
            collapsed: true,
        },
        editor: {
            visible: true,
            collapsed: false,
        }
    } as WidgetsState); 

    const setWidget = (key: string, value: any) => {
        setWidgets({
            ...widgets,
            [key]: value
        });
    }

    const setDefaultConfig = () => {
        localStorage.clear();
    }

    const disablePopovers = () => {
        localStorage.setItem('showPopovers', 'false');
        setShowPopovers(false);
    }

    const toggleDarkmode = () => {
        const newState = !darkmode;
        localStorage.setItem('darkmode', newState ? 'true' : 'false');
        setDarkmode(newState);
    }

    (window as any).enableConfigWindow = () => {
        localStorage.setItem('enableConfigWindow', 'true');
        setEnableConfigWindow(true);

        return 'Config Window Enabled';
    }
    

    return (
        <ConfigContext.Provider
            value={{
                darkmode,
                toggleDarkmode,
                showConfigWindow,
                enableConfigWindow,
                setDefaultConfig,
                showPopovers,
                disablePopovers,
                widgets,
                setWidget
            }}>
            <div id="config-theme" data-theme={darkmode ? 'dark' : 'light'}>
                {children}
            </div>
        </ConfigContext.Provider>
    );
}

export default ConfigProvider;