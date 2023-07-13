import useState from "react";
import ActionButton from "../components/ActionButton";
import toast, { Toaster } from "react-hot-toast";
import init, {
    prepare_transaction,
    prove_transaction,
    verify_transaction,
  } from "miden-wasm";


export default function TxProofPage(): JSX.Element {
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPrepVideo, setShowPrepVideo] = useState(false);
    const [showProveVideo, setShowProveVideo] = useState(false);
    const [prepared, setPrepared] = useState(false);
    const [proven, setProven] = useState(false);

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
            toast.success(`Preparation successful in ${Date.now() - start} ms`);
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
            console.log(provenTransaction);
            toast.success(`Proven successful in ${Date.now() - start} ms`);
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
                console.log("Verifying transaction");
                const start = Date.now();
                const verified_transaction = verify_transaction();
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
        </div>
        <div className="bg-white sm:rounded-lg flex justify-center">
                {showPrepVideo && !showProveVideo && (
                    <div className="sm:w-60 md:w-120 lg:w-240">
                        <video src={process.env.PUBLIC_URL + '/miden_tx_demo_prepare.mp4'} width="100%" autoPlay onEnded={onVideoEnd} />
                    </div>
                )}
                {showProveVideo && !showPrepVideo && (
                    <div className="sm:w-60 md:w-120 lg:w-240">
                        <video src={process.env.PUBLIC_URL + '/miden_tx_demo_prove.mp4'} width="100%" autoPlay onEnded={onVideoEnd} />
                    </div>
                )}
        </div></>
    );
}
