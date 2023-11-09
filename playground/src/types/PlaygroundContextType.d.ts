
import { DebugExecutor} from 'miden-wasm';

type PlaygroundContextType = {
    reset: () => void,
    code: string,
    setCode: (code: string) => void,
    inputs: string,
    setInputs: (inputs: string) => void,
    isDebugging: boolean,
    setIsDebugging: (isDebugging: boolean) => void,
    debug: () => void,
    setDebug: (debug: () => void) => void,
    outputs: Outputs,
    error: any,
    isRunning: boolean,

    wasmIsInitialized: boolean,

    //miden_wasm
    run: () => Promise<Outputs>,
    prove: () => Promise<Outputs>,
    // prove_program: (code_frontend: string, inputs_frontend: string) => Outputs,
    // verify_program: (code_frontend: string, inputs_frontend: string, outputs_frontend: string, proof: Uint8Array) => number
    
};

export default PlaygroundContextType;