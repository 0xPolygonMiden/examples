import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { toast } from 'react-hot-toast'


type ProofModalProps = {
    proof?: Uint8Array | null;
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function ProofModal({ proof, open, setOpen }: ProofModalProps) {
    const closeButtonRef = useRef(null)

    const proofToString = () => {
        if (proof) {
            return Array.from(proof)
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("")
        } else {
            return "No proof available"
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(proofToString());
        toast.success("Proof copied to clipboard");
        setOpen(false);
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={closeButtonRef} onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <Dialog.Title>
                                    Here's your proof (size: {proof ? proof.length / 1000 : null} kb)
                                </Dialog.Title>
                                <div className="mt-2 max-h-96 overflow-y-scroll flex">
                                    <p className="w-full break-words font-extralight text-gray-900 text-sm">
                                        {proofToString()}
                                    </p>
                                </div>
                                < div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 sm:col-start-2"
                                        onClick={() => setOpen(false)}
                                        ref={closeButtonRef}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                        onClick={handleCopy}
                                    >
                                        Copy Proof
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root >
    )
}
