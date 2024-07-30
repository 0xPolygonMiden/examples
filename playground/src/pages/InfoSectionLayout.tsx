import React from 'react';
import OutputInfo from './OutputInfo'; // Adjust the path as needed
import ProgramInfo from './ProgramInfo'; // Adjust the path as needed
import ProofInfo from './ProofInfo'; // Adjust the path as needed
import DebugInfo from './DebugInfo'; // Adjust the path as needed
import MemoryInfo from '../components/CodingEnvironment/MemoryInfo';

interface InfoSectionProps {
  isStackOutputVisible: boolean;
  stackOutputValue: string;
  isProgramInfoVisible: boolean;
  programInfo: any;
  isProofInfoVisible: boolean;
  proof: Uint8Array | null;
  verifyProgram: () => void;
  showDebug: boolean;
  debugOutput: any;
}

const InfoSectionLayout: React.FC<InfoSectionProps> = ({
  isStackOutputVisible,
  stackOutputValue,
  isProgramInfoVisible,
  programInfo,
  isProofInfoVisible,
  proof,
  verifyProgram,
  showDebug,
  debugOutput
}) => (
  <div className="flex flex-col flex-grow w-full h-full sm:gap-y-6 mt-4 lg:mt-0">
    {isStackOutputVisible && (
      <div className="flex mx-0 sm:mx-3 sm:px-0">
        <OutputInfo output={stackOutputValue} />
      </div>
    )}

    {isProgramInfoVisible && (
      <div className="flex mt-4 lg:mt-0 mx-0 sm:mx-3 sm:px-0">
        <ProgramInfo programInfo={programInfo} />
      </div>
    )}

    {isProofInfoVisible && (
      <div className="flex mt-4 lg:mt-0 mx-0 sm:mx-3 sm:px-0">
        <ProofInfo proofText={proof} verifyProgram={verifyProgram} />
      </div>
    )}

    {showDebug && (
      <div className="flex mt-4 lg:mt-0 mx-0 sm:mx-3 sm:px-0">
        <DebugInfo debugOutput={debugOutput} />
      </div>
    )}
    {showDebug && debugOutput && (
      <div className="flex mt-4 lg:mt-0 mx-0 sm:mx-3 sm:px-0">
        <MemoryInfo debugOutput={debugOutput} />
      </div>
    )}
  </div>
);

export default InfoSectionLayout;
