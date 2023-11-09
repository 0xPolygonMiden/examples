import { useContext } from "react";
import { ConfigContext } from "../contexts/ConfigProvider";

const Nav = () => {
    const {setWidget, widgets} = useContext(ConfigContext);
    return <>
        <nav>
            <a 
                className={widgets.editor.visible ? "active" : ""}
                onClick={() => setWidget("editor", {
                    visible: !widgets.editor.visible
            })}>
                Test & Experiment
            </a>
            <a 
                id="show-instructions"
                className={widgets.instructions.visible ? "active" : ""}
                onClick={() => setWidget("instructions", {
                    visible: !widgets.instructions.visible
            })}>
                Instructions
            </a>
        </nav>
    </>;
};

export default Nav;