import { useState, useRef} from "react";

const Debugger = () => {
    const [running, setRunning] = useState(false);
    const [isHorizontal, setIsHorizontal] = useState(false);
    const ref = useRef(null);

    const handleDrag = () => {
        //move the debugger

        const x = (ref.current as any).getBoundingClientRect().x;
        const y = (ref.current as any).getBoundingClientRect().y;
        
        const mouseX = (window.event as any).clientX || 0;
        const mouseY = (window.event as any).clientY || 0;

        const deltaX = mouseX - x;
        const deltaY = mouseY - y;

        (ref.current as any).style.left = `${x + deltaX}px`;
        (ref.current as any).style.top = `${y + deltaY}px`;

    }

    const handleDoubleClick = () => {
        setIsHorizontal(!isHorizontal);
    }

    return <>
        <div id="debugger" className={`${isHorizontal ? 'horizontal' : 'vertical'}`} draggable onDrag={handleDrag}  ref={ref}>
            { running
                ? <i className="fas fa-pause" />
                : <i className="fas fa-play" />
            }
            <i className="fas fa-step-forward" />
            <i className="fas fa-step-backward" />
            <i className="fas fa-undo" />
            <i className="fas fa-stop" />
            <br />
            <i className="fas fa-bars" onDoubleClick={handleDoubleClick} />

        </div>
    </>;
};

export default Debugger;