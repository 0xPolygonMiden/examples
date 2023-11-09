import { ReactNode } from "react"

type WidgetPileProps = {
    children: ReactNode
    expanded?: boolean,
    className?: string,
    style?: React.CSSProperties
}

const WidgetPile = ({children, expanded, className, style}: WidgetPileProps) => {
    return <div className={"widget-pile-container " + className} >
        <div className={`widget-pile ${expanded && 'expanded'}`} style={style}>
            {children}
        </div>
    </div>;
};

export default WidgetPile;  