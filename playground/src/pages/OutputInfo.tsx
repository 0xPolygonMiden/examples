import { formatBeautifyNumbersArray } from '../utils/helper_functions';

import 'katex/dist/katex.min.css';

type ProgramInfoProps = {
  output: string;
};

const OutputInfo = (props: ProgramInfoProps): JSX.Element => {
  return (
    <div className="flex w-full h-fit rounded-xl border overflow-y-scroll border-secondary-4">
      <div className="flex flex-col w-full">
        <div className="bg-secondary-main z-10 py-4 flex sticky top-0 text-white items-center">
          <h1 className="pl-5 text-left text-base font-semibold">Output</h1>
        </div>

        <div className="h-px bg-secondary-4"></div>

        <div className="pb-20 pt-5">
          <h1 className="pl-5 text-left text-green text-xs font-normal">
            {formatBeautifyNumbersArray(props.output)}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default OutputInfo;
