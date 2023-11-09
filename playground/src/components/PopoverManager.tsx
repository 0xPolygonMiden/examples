import { useState, useContext } from 'react';
import Popover from './Popover';
import useSettings from '../hooks/useSettings';
import popovers from '../data/popovers.json';

const PopoverManager = () => {
    const { showPopovers, disablePopovers } = useSettings();
    const [id, setId] = useState(0);
    const [hide, setHide] = useState(!showPopovers);

    if(!showPopovers) return null;

    const total = popovers.length;

    const handleNext = () => {
        setId(id + 1);
        if (id >= total) {
            setId(total);
            handleLast();
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
        setId(-1);
        if(disablePopovers){
            disablePopovers();
        }
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
                    onClickClose={handleLast}
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