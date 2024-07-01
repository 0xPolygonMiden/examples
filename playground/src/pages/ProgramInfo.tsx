import 'katex/dist/katex.min.css';

export interface ProgramInfoInterface {
  program_hash?: string;
  cycles?: number;
  trace_len?: number;
  error?: string;
}

type ProgramInfoProps = {
  programInfo: ProgramInfoInterface;
};

const ProgramInfo = (props: ProgramInfoProps): JSX.Element => {
  const { programInfo } = props;

  return (
    <div className="flex flex-col w-full h-fit rounded-xl border overflow-hidden border-secondary-4">
      <div className="flex flex-col w-full">
        <div className="bg-secondary-main w-full z-10 py-4 flex sticky top-0 text-secondary-7 items-center">
          <h1 className="pl-5 text-left text-base font-normal">Program Info</h1>
        </div>

        <div className="h-px bg-secondary-4"></div>

        <div className="pb-20 pt-5">
          {programInfo.error ? (
            <h1
              className="pl-5 text-left text-white text-sm font-normal break-words"
              style={{ whiteSpace: 'pre-line' }}
            >
              Error: {programInfo.error}
            </h1>
          ) : (
            <>
              {programInfo.program_hash && (
                <>
                  <p
                    className="pl-5 text-left text-secondary-6 text-sm font-normal"
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    Program Hash:
                  </p>
                  <p
                    className="pl-5 text-left text-white mt-2 text-sm font-normal break-words"
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {programInfo.program_hash}
                  </p>

                  <div className="flex flex-col md:flex-row mt-4">
                    <p
                      className="pl-5 text-left text-secondary-6 text-sm font-normal"
                      style={{ whiteSpace: 'pre-line' }}
                    >
                      Cycles:
                      <span className="text-white ml-1">
                        {programInfo.cycles}
                      </span>
                    </p>
                    <p
                      className="pl-5 text-left text-secondary-6 text-sm font-normal mt-2 md:mt-0 md:ml-4"
                      style={{ whiteSpace: 'pre-line' }}
                    >
                      Trace Length:
                      <span className="text-white ml-1">
                        {programInfo.trace_len}
                      </span>
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramInfo;
