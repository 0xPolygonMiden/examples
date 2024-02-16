import { DebugOutput } from 'miden-wasm';

import 'katex/dist/katex.min.css';
import { formatMemory } from '../../utils/helper_functions';

type MemoryInfoProps = {
  debugOutput: DebugOutput | null;
};

const MemoryInfo = (props: MemoryInfoProps): JSX.Element => {
  return (
    <div className="flex w-full h-fit rounded-xl overflow-hidden border border-secondary-4">
      <div className="flex flex-col w-full">
        <div className="bg-secondary-main z-10 py-4 flex sticky top-0 text-white items-center">
          <h1 className="pl-5 text-left text-base font-semibold">Memory</h1>
        </div>

        <div className="h-px bg-secondary-4"></div>

        <div className="py-4">
          <div className="flex flex-wrap overflow-auto h-40">
            {props.debugOutput &&
              formatMemory(props.debugOutput.memory).map(
                (memoryString, index) => (
                  <div key={memoryString} className="w-1/3 p-2">
                    <div className="text-white text-sm p-4 rounded">
                      {memoryString}
                    </div>
                  </div>
                )
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryInfo;
