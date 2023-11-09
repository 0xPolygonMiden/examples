import { createContext } from "react";
import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

import useSettings from "../hooks/useSettings";
import CssBaseline from '@mui/material/CssBaseline';

import type ThemeContextType from "../types/ThemeContextType";

declare module '@mui/material/Button' {
    interface ButtonPropsVariantOverrides {
        circular: true;
    }
}

export const ThemeContext = createContext({} as ThemeContextType);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { theme, setSettings } = useSettings();

    const setTheme = (newTheme: string) => {
        setSettings("theme", newTheme);
    }

    return <>
        <ThemeContext.Provider value={{
            theme,
            setTheme
        }}>
            <MUIThemeProvider theme={createTheme({
                palette: {
                    mode: theme as PaletteMode,
                }
            })}>
                <CssBaseline />

                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    </>
}


export default ThemeProvider;