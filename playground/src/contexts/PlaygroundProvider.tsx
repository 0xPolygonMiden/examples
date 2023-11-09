import { createContext, useState, ReactNode, useEffect } from "react";
import type PlaygroundContextType from "../types/PlaygroundContextType";
import useStorage from "../hooks/useStorage";
import init, {
    DebugExecutor,
    Outputs,
    run_program,
    prove_program,
    verify_program
} from 'miden-wasm';


interface RunOutput {
    overflow_addrs?: string;
    trace_len?: string;
    proof?: string;
    stack_output?: string;
}

export function formatRunOutputs(output: Outputs): RunOutput {
    let overflow_addrs = "";
    let trace_len = "";
    let proof = "";
    let stack_output = "";

    if (output.overflow_addrs) {
        overflow_addrs = output.overflow_addrs.toString();
    }

    if (output.trace_len) {
        trace_len = output.trace_len.toString();
    }

    if (output.proof) {
        proof = output.proof.toString();
    }

    if (output.stack_output) {
        stack_output = output.stack_output.toString();
    }
    
    return {
        overflow_addrs,
        trace_len,
        proof,
        stack_output
    }
}


export const PlaygroundContext = createContext({} as PlaygroundContextType);

export const PlaygroundProvider = ({ children }: { children: ReactNode }) => {
    const { save, load } = useStorage();
    const [code, setCode] = useState(load("settings").code);
    const [inputs, setInputs] = useState(load("settings").inputs);
    const [isDebugging, setIsDebugging] = useState(false);
    const [wasmIsInitialized, setWasmIsInitialized] = useState(false);
    const [outputs, setOutputs] = useState({} as RunOutput);
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        try {
            init().then((initOutput) => {
                setWasmIsInitialized(true);
            });
        } catch (e) {
            console.error(e);
        }
    }, []);

    useEffect(() => {
        try {
            const data = load('playground');
            if (data) {
                setCode(data.code);
                setInputs(data.inputs);
            }
        } catch (e) {
            console.error(e);
        }
    }, [load]);

    useEffect(() => {
        save('playground', {
            code,
            inputs
        });
    }, [code, inputs, save]);

    const run = async () => {
        let outputs = {} as Outputs;
        setIsRunning(true);
        try {
            outputs = await run_program(code, inputs);
            setOutputs(formatRunOutputs(outputs));
        } catch (e: any) {
            console.error(e);
            setError(typeof (e) === 'string' ? e : JSON.stringify(e));
        }
        setIsRunning(false);
    }

    const prove = async () => {
        let outputs = {} as Outputs;
        setIsRunning(true);
        try {
            outputs = await prove_program(code, inputs);
        } catch (e: any) {
            setError(typeof (e) === 'string' ? e : JSON.stringify(e));
        }
        setOutputs(formatRunOutputs(outputs));
        setIsRunning(false);
    }

    const reset = async () => {
        //resets all to default state
        setIsDebugging(false);
        setOutputs({} as RunOutput);
        setError("");
        setIsRunning(false);
    }
    return <>
        <PlaygroundContext.Provider value={{
            reset,
            code,
            setCode,
            inputs,
            setInputs,
            isDebugging,
            setIsDebugging,
            debug: () => { },
            setDebug: () => { },
            outputs,
            error,
            isRunning,

            wasmIsInitialized,

            run,
            prove,
            // prove_program,
            // verify_program

        }}>
            {children}
        </PlaygroundContext.Provider>
    </>
}

export default PlaygroundProvider;