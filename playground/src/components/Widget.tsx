import { Children, ReactNode, cloneElement } from "react";

type WidgetProps = {
    children: ReactNode,
    name?: string,
    collapsible?: boolean
    extended?: boolean
}

const Header = ({ children, name, collapsible, extended }: WidgetProps) => {
    return <>
        <div className="widget-header">
            <div>
                <h2>{name}</h2>
                {
                    collapsible && (
                        extended 
                            ? <i className="fas fa-chevron-up"></i>
                            : <i className="fas fa-chevron-down"></i>
                    )
                }
            </div>
            <div>{children}</div>
        </div>
    </>;
};

const Body = ({ children, extended }: WidgetProps) => {
    return <>
        <div className="widget-body">
            {children}
        </div>
    </>;
};


const Widget = ({ children, name, collapsible = true, extended = true }: WidgetProps) => {
    return <>
        <div className="widget">
            {
                Children.map(children, (child: any) => {
                    return cloneElement(child, {
                        name,
                        collapsible,
                        extended
                    });
                })
            }
        </div>
    </>;
};


Widget.Header = Header;
Widget.Body = Body;

export default Widget;