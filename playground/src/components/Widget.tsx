import { Children, ReactNode, cloneElement, useContext, useState } from "react";
import WidgetProps from "../types/WidgetProps";

const Header = ({ children, name, collapsible, collapsed , onToggleCollapsed, className, style}: WidgetProps) => {
    const [panelsVisible, setPanelsVisible] = useState(true);

    return <>
        <div className={"widget-header " + className} style={style}>
            <div className="widget-header-utils">
                <h2 className="widget-header-name">{name}</h2>
                {
                    collapsible && (
                        <div className="widget-header-collapsible" onClick={onToggleCollapsed}>
                            {collapsed 
                                ? <i className="fas fa-chevron-down" />
                                : <i className="fas fa-chevron-up" />
                            }
                        </div>
                    )
                }
            </div>
            {
                children && (
                    <div className="widget-header-toggle-panels mobile-only">
                        <i className="fas fa-bars" onClick={() => setPanelsVisible(!panelsVisible)} />
                    </div>
                )
            }
            {children && <div className={`widget-header-panels expand-on-mobile ${panelsVisible ? "" : "hidden" }`}>{children}</div> }
        </div>
    </>;
};

const Body = ({ children, className, style }: WidgetProps) => {
    return <>
        <div className={"widget-body " + className} style={style}>
            {children}
        </div>
    </>;
};


const Footer = ({ children, className, style }: WidgetProps) => {
    return <>
        <div className={"widget-footer " + className} style={style}>
            {children}
        </div>
    </>
}

const Widget = ({ children, name = "Widget", collapsible = true, collapsed = true, hidden = false, expandable = false, expanded = false , className, style }: WidgetProps) => {
    const [collapsedState, setCollapsedState] = useState(collapsed);

    const toggleCollapsed = () => setCollapsedState(!collapsedState);
    
    const header = Children.toArray(children).find(child => (child as any).type === Header);
    const body = Children.toArray(children).find(child => (child as any).type === Body);
    const footer = Children.toArray(children).find(child => (child as any).type === Footer);

    return <>
        <div className={`widget ${collapsedState && 'collapsed'} ${expanded && 'expanded'}`} >
            {header && cloneElement(header as any, { collapsible, collapsed: collapsedState,  onToggleCollapsed: toggleCollapsed }) }
            {body && cloneElement(body as any) }
            {footer && cloneElement(footer as any)}
        </div>
    </>;
};


Widget.Header = Header;
Widget.Body = Body;
Widget.Footer = Footer;

export default Widget;