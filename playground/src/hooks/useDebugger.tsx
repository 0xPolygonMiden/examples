import { useEffect, useState } from "react";
import { DebugExecutor, DebugOutput, DebugCommand } from "miden-wasm";
import usePlayground from "./usePlayground";

interface DebuggerOutputs {
    clock: string;
    stack: string;
    instruction: string;
    num_of_operations: string;
    operation_index: string;
    op: string;
    memory: string;
}

export function formatDebuggerOutput(debugOutput: DebugOutput): DebuggerOutputs {
    return {
        clock: debugOutput.clk ? debugOutput.clk.toString() : "",
        stack: debugOutput.stack.toString() || "",
        instruction: debugOutput.instruction || "",
        num_of_operations: debugOutput.num_of_operations?.toString() || "",
        operation_index: debugOutput.operation_index ? debugOutput.operation_index.toString() : "",
        op: debugOutput.op || "",
        memory: formatMemory(debugOutput.memory)
    }
}

/**
 * Helper function to format the Memory in the Debug Output.
 */
export function formatMemory(memory: BigUint64Array): string {
    let output = '';
    for (let i = 0; i < memory.length; i += 5) {
        const memorySlice = memory.slice(i, i + 5);
        output += `[${memorySlice[0]}]: [${memorySlice[1]}, ${memorySlice[2]}, ${memorySlice[3]}, ${memorySlice[4]}] \n           `;
    }
    return output;
}

const useDebugger = () => {
    const { code, inputs } = usePlayground();
    const [executor, setExecutor] = useState<DebugExecutor>(new DebugExecutor(code, inputs));
    const [outputs, setOutputs] = useState<DebuggerOutputs>({} as DebuggerOutputs);


    const execute = (command: DebugCommand, param?: bigint | undefined) => {

        try {
            if (param !== undefined) {
                const outputs = executor.execute(command, param);
                setOutputs(formatDebuggerOutput(outputs));
            } else {
                const outputs = executor.execute(command);
                setOutputs(formatDebuggerOutput(outputs));
            }
        } catch (e) {
            console.error(e);
            try {
                executor.free();
            } catch (e) {
                console.error(e);
            }
            setExecutor(new DebugExecutor("", "{}"));
        }
    }

    const free = () => {
        if (!executor) return;
        try {
            executor.free();
            setExecutor(new DebugExecutor("", "{}"));
        } catch (e) {
            console.error(e);
        }
    }

    return {
        execute,
        free,
        outputs
    }
}

export default useDebugger;
export {
    DebugOutput,
    DebugCommand
};
