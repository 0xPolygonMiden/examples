import { useState, useContext } from "react";
import { ConfigContext } from "../contexts/ConfigProvider";

const ConfigWindow = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { setDefaultConfig, toggleDarkmode, enableConfigWindow } = useContext(ConfigContext);

    if (!enableConfigWindow) return null;

    const toggleOpen = () => setIsOpen(!isOpen);
    return <>
        <div className="config-window">
            <div className="header" onClick={toggleOpen}>
                <i className="fas fas-gears" />
                Config Window
            </div>
            <div className={`body ${isOpen && 'open'}`}>
                <button onClick={setDefaultConfig}>Set Defaults</button>
                <button onClick={toggleDarkmode}>Toggle Theme</button>
            </div>
        </div>
    </>;
};

export default ConfigWindow;