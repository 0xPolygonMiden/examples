import { ReactNode, useEffect, useRef, useState } from "react";

type PopoverProps = {
    title: string;
    elementId: string;
    children: ReactNode;
    onClickPrevious?: () => void;
    onClickNext?: () => void;
}

const Popover = ({title, elementId, children, onClickPrevious, onClickNext}: PopoverProps) => {
    const [element, setElement] = useState<HTMLElement | null>();
    const popoverRef = useRef(null);

    useEffect(() => {
        const el = (document as any).getElementById(elementId);

        if (!el) {
            console.log(
                `Popover with title "${title}" and elementId "${elementId}" could not find the element with id "${elementId}".`
            );
            return;
        }

        setElement(el);
    }, [elementId]);

    if (!element) {
        return null;
    }

    // //add a border to the element by adding a class
    // element.classList.add('popover-element');

    // //position the popover next to the element always limited by the viewport
    // const elementRect = element.getBoundingClientRect();
    // const popoverRect = (popoverRef.current as any).getBoundingClientRect();
    // const viewportWidth = window.innerWidth;
    // const viewportHeight = window.innerHeight;

    // let top = elementRect.top + elementRect.height + 10;
    // let left = elementRect.left + elementRect.width / 2 - popoverRect.width / 2;

    // if (top + popoverRect.height > viewportHeight) {
    //     top = elementRect.top - popoverRect.height - 10;
    // }

    // if (left + popoverRect.width > viewportWidth) {
    //     left = elementRect.left + elementRect.width - popoverRect.width;
    // }

    // (popoverRef.current as any).style.top = `${top}px`;
    // (popoverRef.current as any).style.left = `${left}px`;

    return <>
        <div className="popover" ref={popoverRef}>
            <div className="header">
                <span>{title}</span>
                <div>
                    <i className="fas fa-chevron-left" onClick={onClickPrevious} />
                    <i className="fas fa-chevron-right" onClick={onClickNext} />
                </div>
            </div>
            {children}
        </div>        
    </>;
};

export default Popover;