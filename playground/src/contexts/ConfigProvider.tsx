import React, { createContext, useState } from 'react';

type ConfigContextType = {
    darkmode: boolean;
    toggleDarkmode: () => void;
}

export const ConfigContext = createContext<ConfigContextType>({} as ConfigContextType);

export const ConfigProvider = ({ children }: any) => {
    const [darkmode, setDarkmode] = useState(true);

    const toggleDarkmode = () => setDarkmode(!darkmode);

    return (
        <ConfigContext.Provider
            value={{
                darkmode,
                toggleDarkmode
            }}>
            {children}
        </ConfigContext.Provider>
    );
}

export default ConfigProvider;