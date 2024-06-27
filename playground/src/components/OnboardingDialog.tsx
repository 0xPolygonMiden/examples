import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

interface OnboardingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTakeTour: () => void;
}

const OnboardingDialog: React.FC<OnboardingDialogProps> = ({
  isOpen,
  onClose,
  onTakeTour
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] p-3 rounded-lg shadow-lg max-w-md w-full">
        <div className="mb-4">
          <img
            src={require('../../src/resources/onboarding.png')}
            alt="Welcome"
            className="rounded-lg w-full"
          />
        </div>

        <h2 className="text-sm font-semibold text-[#C0BEC6]">Welcome to the</h2>

        <p className="text-white text-xl mt-2">Miden Playground</p>
        <div className="flex justify-between mt-10 items-center">
          <button className="text-[#C0BEC6] text-sm" onClick={onClose}>
            Skip tour
          </button>
          <button
            className=" text-white border-2 border-secondary-8 text-sm px-2 py-2 rounded-md flex items-center"
            onClick={onTakeTour}
          >
            Take a tour
            <ArrowRightIcon className="h-4 w-10 fill-accent-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingDialog;
