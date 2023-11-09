import type Settings from "../types/Settings";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeProvider";

export const useTheme = (): {
    theme: Settings["theme"];
    setTheme: (theme: Settings["theme"]) => void;
} => {
    const { theme, setTheme } = useContext(ThemeContext);
    return {
        theme,
        setTheme
    }
}
export default useTheme;