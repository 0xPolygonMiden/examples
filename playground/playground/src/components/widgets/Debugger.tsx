import { useState, useRef} from "react";
import Draggable from 'react-draggable';

const Debugger = () => {
    const [running, setRunning] = useState(false);
    const [isHorizontal, setIsHorizontal] = useState(false);


    const handleDoubleClick = () => {
        setIsHorizontal(!isHorizontal);
    }

    return <>
        <Draggable
        
        >
            <div id="debugger" className={`${isHorizontal ? 'horizontal' : 'vertical'}`} >
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
        </Draggable>
    </>;
};

export default Debugger;