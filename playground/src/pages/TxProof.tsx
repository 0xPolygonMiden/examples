import React from "react";
import ActionButton from "../components/ActionButton";
import toast, { Toaster } from "react-hot-toast";
import init, {
    prepare_transaction,
    prove_transaction,
    verify_transaction,
  } from "miden-wasm";


export default function TxProofPage(): JSX.Element {
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [showPrepVideo, setShowPrepVideo] = React.useState(false);
    const [showProveVideo, setShowProveVideo] = React.useState(false);
    const [prepared, setPrepared] = React.useState(false);
    const [proven, setProven] = React.useState(false);

    const [proof, setProof] = React.useState<Uint8Array | null>(null);
    const [stackInputs, setStackInputs] = React.useState<BigUint64Array | null>(null);
    const [stackOutputs, setStackOutputs] = React.useState<BigUint64Array | null>(null);
    const [programHash, setProgramHash] = React.useState<BigUint64Array | null>(null);


    /**
   * This prepares the transaction.
   * It runs the Rust program that is imported above.
   */
    const prepareTransaction = async () => {
        setIsProcessing(true);
        setShowPrepVideo(true);
        init().then(() => {
        try {
            console.log("Preparing transaction");
            const start = Date.now();
            const preparedTransaction = prepare_transaction();
            console.log(preparedTransaction);
            toast.success(`Preparation successful in ${Date.now() - start} ms`, {duration: 4000});
        } catch (error) {
            toast.error(`Something is wrong`);
        }
        }).finally(() => {
            setIsProcessing(false);
            setPrepared(true);});
            setProven(false);
    };
    
    
    /**
   * This proves the transaction.
   * It runs the Rust program that is imported above.
   */
    const proveTransaction = async () => {
        setIsProcessing(true);
        setShowProveVideo(true);
        init().then(() => {
        try {
            console.log("Proving transaction");
            const start = Date.now();
            const provenTransaction = prove_transaction();
            
            setProof(provenTransaction.proof);
            setStackInputs(provenTransaction.stack_inputs);
            setStackOutputs(provenTransaction.stack_outputs);
            setProgramHash(provenTransaction.program_hash);

            console.log(provenTransaction);
            toast.success(`Proof successful in ${Date.now() - start} ms`, {duration: 4000});
        } catch (error) {
            toast.error(`Something is wrong`);
        }
        }).finally(() => {
            setIsProcessing(false);
            setProven(true);
        });
    };
    

    const verifyTransaction = async () => {
        setIsProcessing(true);
        init().then(() => {
            try {
                if (!proof || !stackInputs || !stackOutputs || !programHash) {
                    console.log("There is no proof to verify. \nDid you prove the program?");
                    toast.error("Verification failed");
                    return;
                  }
                console.log("Verifying transaction");
                const start = Date.now();
                const verified_transaction = verify_transaction(stackInputs, stackOutputs, programHash , proof);
                console.log(verified_transaction);
                toast.success(`Verification successful in ${Date.now() - start} ms`);
            } catch (error) {
                toast.error(`Something is wrong`);
            }
            }).finally(() => {
                setIsProcessing(false);
            });
    };

    const onVideoEnd = () => {
        setShowPrepVideo(false);
        setShowProveVideo(false);
    }

    return (
        <><div className="pb-4">
            <Toaster />
            <div className="bg-gray-100 sticky top-0 z-10 px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center gap-4">
                <ActionButton label="Prepare Transaction" onClick={prepareTransaction} disabled={isProcessing} fixedWidth={true} />
                <ActionButton label="Prove Transaction" onClick={proveTransaction} disabled={isProcessing || !prepared || showPrepVideo} fixedWidth={true} />
                <ActionButton
                    label="Verify Proof"
                    onClick={verifyTransaction}
                    disabled={isProcessing || !proven || !prepared || showPrepVideo}
                    fixedWidth={true} />
            </div>
            <div className="bg-gray-100 sm:rounded-lg flex justify-center">
                {showPrepVideo && !showProveVideo && (
                    <div className="bg-gray-100 sm:w-60 md:w-120 lg:w-240">
                        <video src={process.env.PUBLIC_URL + '/miden_tx_demo_prepare.mp4'} width="100%" autoPlay onEnded={onVideoEnd} playsInline />
                    </div>
                )}
                {showProveVideo && !showPrepVideo && (
                    <div className="bg-gray-100 sm:w-60 md:w-120 lg:w-240">
                        <video src={process.env.PUBLIC_URL + '/miden_tx_demo_prove.mp4'} width="100%" autoPlay onEnded={onVideoEnd} playsInline />
                    </div>
                )}
                {!showPrepVideo && !showProveVideo && prepared && !proven && (
                    <div className="bg-gray-100 sm:w-60 md:w-120 lg:w-240 space-y-512">
                        <img src={process.env.PUBLIC_URL + '/miden_tx_demo_prepared.png'} width="100%" />
                    </div>
                )}
                {!showPrepVideo && !showProveVideo && prepared && proven && (
                    <div className="bg-gray-100 sm:w-60 md:w-120 lg:w-240 space-y-512">
                        <img src={process.env.PUBLIC_URL + '/miden_tx_demo_proven.png'} width="100%" />
                    </div>
                )}
            </div>
        </div></>
    );
}
