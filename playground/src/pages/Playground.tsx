import { Fragment } from "react";
import Nav from "../components/Nav";
import WidgetPile from "../components/WidgetPile";
import useWidgets from "../hooks/useWidgets";

const Playground = () => {
    const { widgets, getWidgetByName } = useWidgets();
    
    return <>
        <div id="coding-environment">
            <Nav />
            <div className="container">
                {Object.keys(widgets).map((widgetKey, index) => {
                    const widgetMemoized = getWidgetByName(widgetKey);
                    const enabled = widgets[widgetKey].enabled;

                    if (!enabled) return  <Fragment key={index}></Fragment>

                    return <Fragment key={index}>
                        <WidgetPile>
                            {widgetMemoized}
                        </WidgetPile>
                    </Fragment>
                })}
            </div>
        </div>
    </>;
};

export default Playground;
