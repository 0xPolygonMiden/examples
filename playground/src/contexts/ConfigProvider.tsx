import React, { ReactNode, createContext, useState } from 'react';

type ConfigContextType = {
    darkmode: boolean;
    toggleDarkmode: () => void;
    showConfigWindow: boolean;
    enableConfigWindow: boolean;
    setDefaultConfig: () => void;
}

type ProviderProps = {
    children: ReactNode;
}

export const ConfigContext = createContext<ConfigContextType>({} as ConfigContextType);

export const ConfigProvider = ({ children }: ProviderProps) => {
    const [darkmode, setDarkmode] = useState(localStorage.getItem('darkmode') === 'false' ? false : true);
    const [enableConfigWindow, setEnableConfigWindow] = useState(localStorage.getItem('enableConfigWindow') === 'true' ? true: false); 
    const [showConfigWindow, setShowConfigWindow] = useState(false);

    const setDefaultConfig = () => {
        localStorage.clear();
    }

    const toggleDarkmode = () => {
        const newState = !darkmode;
        localStorage.setItem('darkmode', newState ? 'true' : 'false');
        setDarkmode(newState);
    }

    //create a global function to enable config window accessible from the browser console
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
                setDefaultConfig
            }}>
            {children}
        </ConfigContext.Provider>
    );
}

export default ConfigProvider;