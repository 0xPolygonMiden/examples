import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import 'katex/dist/katex.min.css';
import { measureSizeInKB } from '../utils/helper_functions';

type ProofInfoProps = {
  proofText: Uint8Array | null;
  verifyProgram: () => void;
};

const ProofInfo = (props: ProofInfoProps): JSX.Element => {
  const saveFile = () => {
    if (!props.proofText) {
      return;
    }
    const blob = new Blob([props.proofText], {
      type: 'text/plain'
    });

    // Step 3: Create a URL for the Blob
    const fileDownloadUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = fileDownloadUrl;
    link.download = 'proof.txt'; // File name for download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(fileDownloadUrl);
  };

  return (
    <div className="flex w-full h-fit rounded-xl overflow-hidden border border-secondary-4">
      <div className="flex flex-col w-full">
        <div className="bg-secondary-main z-10 py-4 flex sticky top-0 text-secondary-7 items-center">
          <h1 className="pl-5 text-left text-base font-semibold">Proof</h1>

          {props.proofText && (
            <div className="rounded-2xl text-xs px-2 py-1 bg-secondary-8 ml-3 text-accent-1">
              {measureSizeInKB(props.proofText)} KB
            </div>
          )}

          <button
            className="flex items-center ml-auto hover:bg-secondary-8 text-white text-xs font-normal border z-10 rounded-lg border-secondary-4 py-2 px-2.5"
            onClick={saveFile}
          >
            <ArrowDownTrayIcon className="h-4 w-4 stroke-2 stroke-accent-1" />
          </button>

          <button
            className="flex items-center hover:bg-secondary-8 ml-3 mr-3 text-white text-xs font-normal border z-10 rounded-lg border-secondary-4 py-2 px-2.5"
            onClick={props.verifyProgram}
          >
            Verify
          </button>
        </div>

        <div className="h-px bg-secondary-4"></div>

        <div className="pb-20 h-40 py-5 w-full overflow-y-scroll">
          <h1 className="px-5 text-white text-sm font-medium font-geist-mono break-words">
            {props.proofText}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ProofInfo;
