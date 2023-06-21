import { ReactNode } from "react"

type WidgetPileProps = {
    children: ReactNode
}

const WidgetPile = ({children}: WidgetPileProps) => {
    return <>
        <div className="widget-pile">
            {children}
        </div>
    </>;
};

export default WidgetPile;  