import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid';

type DebugButtonProps = {
  icon: string;
  onClick?: () => void;
};

const DebugButton = ({ icon, onClick }: DebugButtonProps): JSX.Element => {
  let tooltipText = "";
  switch(icon) {
    case 'PPrevious':
      tooltipText = "100 cycles back";
      break;
    case 'Previous':
      tooltipText = "1 cycle back";
      break;
    case 'Forward':
      tooltipText = "1 cycle forward";
      break;
    case 'FForward': 
      tooltipText = "100 cycles forward";
      break;
  }
  return (
    <button
      type="button"
      className="bg-white px-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
      onClick={onClick}
      title={tooltipText}
    >
      <span className="sr-only">icon</span>
      {icon === 'PPrevious' ? (
        <ChevronDoubleLeftIcon
          className="h-5 w-5"
          aria-hidden="true"
          title={tooltipText}
        />
      ) : null}
      {icon === 'Previous' ? (
        <ChevronLeftIcon
          className="h-5 w-5"
          aria-hidden="true"
          title={tooltipText}
        />
      ) : null}
      {icon === 'Forward' ? (
        <ChevronRightIcon
          className="h-5 w-5"
          aria-hidden="true"
          title={tooltipText}
        />
      ) : null}
      {icon === 'FForward' ? (
        <ChevronDoubleRightIcon
          className="h-5 w-5"
          aria-hidden="true"
          title={tooltipText}
        />
      ) : null}
    </button>
  );
};

export default DebugButton;
