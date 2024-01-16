import { useState } from 'react';

import 'katex/dist/katex.min.css';

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
        <div className="bg-secondary-main z-10 py-4 flex sticky top-0 text-white items-center">
          <h1 className="pl-5 text-left text-base font-semibold">Proof</h1>

          <button
            className="flex items-center ml-auto text-white text-xs font-normal border z-10 rounded-lg border-secondary-4 py-2 px-2.5"
            onClick={saveFile}
          >
            Download
          </button>

          <button
            className="flex items-center ml-3 mr-3 text-white text-xs font-normal border z-10 rounded-lg border-secondary-4 py-2 px-2.5"
            onClick={props.verifyProgram}
          >
            Verify
          </button>
        </div>

        <div className="h-px bg-secondary-4"></div>

        <div className="pb-20 pt-5 w-full">
          <h1 className="pl-5 w-full text-left text-wrap text-ellipsis text-white text-xs font-normal">
            {props.proofText}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ProofInfo;
