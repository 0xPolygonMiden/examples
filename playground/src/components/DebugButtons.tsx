import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon, CircleStackIcon } from '@heroicons/react/20/solid'

type DebugButtonProps = {
    icon: string;
    onClick?: () => void;
  };

const DebugButton = ({ icon, onClick }: DebugButtonProps): JSX.Element => {
  return (
      <button
        type="button"
        className="relative inline-flex items-center rounded-l-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
        onClick={onClick}
      >
        <span className="sr-only">icon</span>
        { icon === "PPrevious" ? <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" /> : null }
        { icon === "Previous" ? <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" /> : null }
        { icon === "Stack" ? <CircleStackIcon className="h-5 w-5" aria-hidden="true" /> : null }
        { icon === "Forward" ? <ChevronRightIcon className="h-5 w-5" aria-hidden="true" /> : null }
        { icon === "FForward" ? <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" /> : null }
      </button>
  )
}

export default DebugButton;
