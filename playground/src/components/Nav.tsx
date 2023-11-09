import { Fragment } from "react";
import useWidgets from "../hooks/useWidgets";
import NavButton from "./NavButton";

const Nav = () => {
    const { widgets } = useWidgets();
    return <>
        <nav>
            {Object.keys(widgets).map((widgetKey, index) => {
                if(!widgets[widgetKey].nav) return <></>;

                const widget = widgets[widgetKey];
                return <Fragment key={index}>
                    <NavButton widgetName={widgetKey} text={widget.name} />
                </Fragment>
            })}
        </nav>
    </>;
};

export default Nav;