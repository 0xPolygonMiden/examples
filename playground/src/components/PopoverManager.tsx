import { useState, useContext } from 'react';
import Popover from './Popover';
import { ConfigContext } from '../contexts/ConfigProvider';

const popovers = [
    {
        title: 'Run',
        elementId: 'runbtn',
        children: <p>This is one example of something cool!</p>,
    },
    {
        title: 'Debug',
        elementId: 'debugbtn',
        children: <p>This is another example of something cool!</p>,
    },
]

const PopoverManager = () => {
    const [id, setId] = useState(0);
    const [hide, setHide] = useState(false);
    const {showPopovers,disablePopovers} = useContext(ConfigContext);

    if(!showPopovers) return null;

    const total = popovers.length;

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
            setId(-1);
            handleFirst();
        }
    }

    const handleFirst = () => {
        return true;
    }
    const handleLast = () => {
        setHide(true);
        disablePopovers();
    }

    return <>
        <div className="popover-manager">
            {popovers.map((popover, index) => {
                return <Popover 
                    key={index} 
                    enabled={id === index} 
                    title={popover.title} 
                    elementId={popover.elementId} 
                    onClickPrevious={handlePrevious} 
                    onClickNext={handleNext}
                    onClickClose={handleNext}
                    hasNext={id < total - 1}
                    hasPrevious={id > 0}
                >
                    {popover.children}
                </Popover>
            })}
        </div>
    </>;
};

export default PopoverManager;