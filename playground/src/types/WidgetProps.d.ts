import { ReactNode } from "react";

type WidgetProps = {
    children?: ReactNode,
    name?: string,
    collapsible?: boolean,
    collapsed?: boolean,
    onToggleCollapsed?: () => void,
    hidden?: boolean,
    expandable?: boolean,
    expanded?: boolean,
    className?: string,
    style?: React.CSSProperties,
}

export default WidgetProps;