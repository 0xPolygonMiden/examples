import { ReactNode, useEffect, useRef, useState } from "react";

type PopoverProps = {
    enabled: boolean;
    title: string;
    elementId: string;
    children: ReactNode;
    onClickPrevious?: () => void;
    onClickNext?: () => void;
    onClickClose?: () => void;
    hasNext?: boolean;
    hasPrevious?: boolean;
}

const Popover = ({ title, enabled = false, elementId, children, onClickPrevious, onClickNext, onClickClose, hasNext, hasPrevious}: PopoverProps) => {
    const [element, setElement] = useState<HTMLElement | null>();
    const popoverRef = useRef(null);

    useEffect(() => {
        const el = (document as any).getElementById(elementId);

        if (!el) {
            console.log(
                `Popover with title "${title}" and elementId "${elementId}" could not find the element with id "${elementId}".`
            );

            console.log(el);
            return;
        }

        setElement(el);

        if (element && popoverRef.current ) {

            //position the popover next to the element always limited by the viewport
            const elementRect = element.getBoundingClientRect();
            const popoverRect = (popoverRef.current as any).getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const gap = 3;

            let top = elementRect.top + elementRect.height + gap;
            let left = elementRect.left + elementRect.width / 2;

            if (top + popoverRect.height > viewportHeight) {
                top = elementRect.top - popoverRect.height - gap;
            }

            if (left + popoverRect.width > viewportWidth) {
                left = viewportWidth - 250 ;
            }

            (popoverRef.current as any).style.top = `${top}px`;
            (popoverRef.current as any).style.left = `${left}px`;

        }

    }, [element, popoverRef.current]);

    if (!element ) { return null; }
    if (enabled && element) {
        //add a border to the element by adding a class
        element.classList.add('popover-element');
    } else {
        //remove the border from the element by removing the class
        element.classList.remove('popover-element');
    }

    return <>
        <div className={`popover ${enabled && 'enabled'}`} ref={popoverRef} >
            <div className="header">
                <span>{title}</span>
                <div className="operations">
                    {hasPrevious && <i className="fas fa-chevron-left" onClick={onClickPrevious} /> }
                    {hasNext
                        ? <i className="fas fa-chevron-right" onClick={onClickNext} /> 
                        : <i className="fas fa-times" onClick={onClickClose} />
                    }
                </div>
            </div>
            <div className="body">
                {children}
            </div>
        </div>
    </>;
};

export default Popover;