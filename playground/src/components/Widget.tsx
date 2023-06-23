import { Children, ReactNode, cloneElement, useContext, useState } from "react";
import { ConfigContext } from "../contexts/ConfigProvider";

type WidgetProps = {
    children?: ReactNode,
    name?: string,
    collapsible?: boolean,
    collapsed?: boolean,
    onToggleCollapsed?: () => void,
    hidden?: boolean,
}

const Header = ({ children, name, collapsible, collapsed , onToggleCollapsed}: WidgetProps) => {
    return <>
        <div className="widget-header">
            <div>
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
            <div>{children}</div>
        </div>
    </>;
};

const Body = ({ children }: WidgetProps) => {
    return <>
        <div className={`widget-body`}>
            {children}
        </div>
    </>;
};


const Footer = ({ children }: WidgetProps) => {
    return <>
        <div className={`widget-footer`}>
            {children}
        </div>
    </>
}

const Widget = ({ children, name = "Widget", collapsible = true, collapsed = true, hidden = false }: WidgetProps) => {
    const [collapsedState, setCollapsedState] = useState(collapsed);
    const {widgets} = useContext(ConfigContext);

    const toggleCollapsed = () => setCollapsedState(!collapsedState);
    
    const header = Children.toArray(children).find(child => (child as any).type === Header);
    const body = Children.toArray(children).find(child => (child as any).type === Body);
    const footer = Children.toArray(children).find(child => (child as any).type === Footer);

    return <>
        <div className={`widget ${collapsedState && 'collapsed'}`} >
            {header 
                ? cloneElement(header as any, { collapsible, collapsed: collapsedState,  onToggleCollapsed: toggleCollapsed }) 
                : <Header name={name} collapsible={collapsible} collapsed={collapsedState} onToggleCollapsed={toggleCollapsed} />
            }
            {body 
                ? cloneElement(body as any) 
                : <Body  />
            }
            {footer && cloneElement(footer as any)}
        </div>
    </>;

    
};


Widget.Header = Header;
Widget.Body = Body;
Widget.Footer = Footer;

export default Widget;