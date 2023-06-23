import { ReactNode } from "react"

type WidgetPileProps = {
    children: ReactNode
    expanded?: boolean
}

const WidgetPile = ({children, expanded}: WidgetPileProps) => {
    return <>
        <div className={`widget-pile ${expanded && 'expanded'}`}>
            {children}
        </div>
    </>;
};

export default WidgetPile;  