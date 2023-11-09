import useWidgets from "../hooks/useWidgets";

const NavButton = ({widgetName, text}: {widgetName: string, text: string}) => {
    const {widgets, setWidgets} = useWidgets();

    if(!widgets[widgetName]) throw new Error(`Widget ${widgetName} does not exist`);

    return <a 
        className={widgets[widgetName].enabled ? "active" : ""}
        onClick={() => setWidgets({
            ...widgets,
            [widgetName]: {
                ...widgets[widgetName],
                enabled: !widgets[widgetName].enabled
            }
        })}>
        {text}
    </a>
}

export default NavButton;