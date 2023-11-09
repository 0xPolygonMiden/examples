import type Settings from "./Settings";

type SettingsContextType = Settings & {
    setSettings: (setting: string, value: any) => void;
};

export default SettingsContextType;