import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleStackIcon,
} from "@heroicons/react/20/solid";
import { BsChevronBarLeft, BsChevronBarRight } from "react-icons/bs";

type DebugButtonProps = {
  icon: string;
  onClick?: () => void;
};

const DebugButton = ({ icon, onClick }: DebugButtonProps): JSX.Element => {
  return (
    <button
      type="button"
      className="bg-white px-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
      onClick={onClick}
    >
      <span className="sr-only">icon</span>
      {icon === "Start" ? (
        <BsChevronBarLeft className=" h-5 w-5" aria-hidden="true" title="Go to start" />
      ) : null}
      {icon === "PPrevious" ? (
        <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" title="100 cycles back" />
      ) : null}
      {icon === "Previous" ? (
        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" title="1 cycle back" />
      ) : null}
      {icon === "Stack" ? (
        <CircleStackIcon className="h-5 w-5" aria-hidden="true" title="Print current stack" />
      ) : null}
      {icon === "Forward" ? (
        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" title="1 cycles" />
      ) : null}
      {icon === "FForward" ? (
        <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" title="100 cycles" />
      ) : null}
      {icon === "End" ? (
        <BsChevronBarRight className="h-5 w-5" aria-hidden="true" title="Go to end" />
      ) : null}
    </button>
  );
};

export default DebugButton;
