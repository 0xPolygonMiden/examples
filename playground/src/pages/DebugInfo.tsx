import { DebugOutput } from 'miden-wasm';

import 'katex/dist/katex.min.css';

type DebugInfoProps = {
  debugOutput: DebugOutput | null;
};

const DebugInfo = (props: DebugInfoProps): JSX.Element => {
  return (
    <div className="flex w-full h-fit rounded-xl overflow-hidden border border-secondary-4">
      <div className="flex flex-col w-full">
        <div className="bg-secondary-main z-10 py-4 flex sticky top-0 text-white items-center">
          <h1 className="pl-5 text-left text-base font-semibold">
            Program Info
          </h1>
        </div>

        <div className="h-px bg-secondary-4"></div>

        {!props.debugOutput && (
          <div className="pb-20 pt-5">
            <h1 className="pl-5 text-left text-white text-xs font-normal">
              Debugging has started
            </h1>
          </div>
        )}

        {props.debugOutput && (
          <div className="pb-4 w-full">
            <div className="pt-4 pb-4 flex top-0 text-white items-center">
              <h1 className="pl-4 text-left text-base font-semibold">
                Clock Cycle
              </h1>

              <h1 className="pl-20 text-left text-secondary-5 text-base font-semibold">
                {props?.debugOutput?.clk}
              </h1>
            </div>

            <div className="h-px bg-secondary-4"></div>

            <div className="pt-4 pb-4 flex top-0 text-white items-center justify-between pr-4">
              <h1 className="pl-4 text-left text-base font-semibold">
                Assembly Instruction
              </h1>

              <h1 className="pl-4 text-left text-secondary-5 text-base font-semibold">
                {props?.debugOutput?.instruction
                  ? props?.debugOutput?.instruction
                  : ''}
              </h1>

              <h1 className="pl-4 text-left text-base font-semibold">
                Operation
              </h1>

              <h1 className="pl-4 text-left text-secondary-5 text-base font-semibold">
                {props?.debugOutput?.operation_index
                  ? props?.debugOutput?.operation_index
                  : ''}
              </h1>

              <h1 className="pl-4 text-left text-base font-semibold">
                VM Operation
              </h1>

              <h1 className="pl-4 text-left text-secondary-5 text-base font-semibold">
                {props?.debugOutput?.op ? props?.debugOutput?.op : ''}
              </h1>
            </div>

            <div className="h-px bg-secondary-4"></div>

            <div className="pt-4 pb-4 flex top-0 text-white items-center">
              <h1 className="pl-4 text-left text-base font-semibold">Stack</h1>

              <div className="grid grid-cols-8 gap-x-1 ml-4 w-full gap-y-4 mr-4">
                {Array.from<bigint>(props.debugOutput.stack).map(
                  (item, index) => (
                    <div
                      key={index.toString()}
                      className="relative flex justify-center items-baseline"
                    >
                      <div className="bg-transparent w-full pt-4 pl-12 border-none flex items-center">
                        <span className="text-secondary-5">
                          {item.toString()}
                        </span>
                      </div>
                      <label
                        className={`absolute text-[8px] font-bold transition-all top-0 text-green`}
                      >
                        {index}
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugInfo;
