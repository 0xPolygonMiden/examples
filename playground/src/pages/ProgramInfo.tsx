import 'katex/dist/katex.min.css';

type ProgramInfoProps = {
  programInfo: string;
};

const ProgramInfo = (props: ProgramInfoProps): JSX.Element => {
  return (
    <div className="flex w-full h-fit rounded-xl border overflow-y-scroll border-borderColor">
      <div className="flex flex-col w-full">
        <div className="bg-secondary-main z-10 py-4 flex sticky top-0 text-secondary-7 items-center">
          <h1 className="pl-5 text-left text-base font-normal">Program Info</h1>
        </div>

        <div className="h-px bg-secondary-4"></div>

        <div className="pb-20 pt-5">
          <h1
            className="pl-5 text-left text-white text-xs font-normal"
            style={{ whiteSpace: 'pre-line' }}
          >
            {props.programInfo}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ProgramInfo;
