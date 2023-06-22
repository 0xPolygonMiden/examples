import { useState } from 'react';
import Popover from './Popover';

const popovers = [
    {
        title: 'Run',
        elementId: 'runbtn',
        children: <p>This is one example of something cool!</p>,
    }
]

const PopoverManager = () => {
    const [total, setTotal] = useState(popovers.length);
    const [id, setId] = useState(0);
    const [hide, setHide] = useState(false);

    const handleNext = () => {
        setId(id + 1);
        if (id >= total) {
            setId(total);
            setHide(true);
        }
    }

    const handlePrevious = () => {
        setId(id - 1);
        if (id <= 0) {
            setId(0);
            handleFirst();
        }
    }

    const handleFirst = () => {
        return true;
    }
    const handleLast = () => {
        setHide(true);
    }

    console.log(popovers);

    return <>
        <div className="popover-manager">
            {popovers.map((popover, index) => {
                return <Popover key={index} title={popover.title} elementId={popover.elementId} onClickPrevious={handlePrevious} onClickNext={handleNext}>
                    {popover.children}
                </Popover>
            })}
        </div>
    </>;
};

export default PopoverManager;