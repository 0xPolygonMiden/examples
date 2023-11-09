import SettingsWidget from "./SettingsWidget";

type Settings = {
    theme: string;
    language: "en";
    widgets: { [id: string]: SettingsWidget };
    widgetPiles: Array<Array<string>>; 
    showPopovers: boolean;
    inputs: string;
    code: string;
    disablePopovers?: () => void;
}


export default Settings;