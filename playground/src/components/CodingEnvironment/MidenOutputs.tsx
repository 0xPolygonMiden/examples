import { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import {
    DebugCommand,
    DebugExecutor,
    DebugOutput,
} from "miden-wasm";
import DebugButton from "../DebugButtons";
import {
    formatDebuggerOutput,
} from "../../utils/helper_functions";
import Editor from "./Editor";
import EditorLabel from "./EditorLabel";

type MidenOutputsProps = {
    showDebug: boolean;
    debugExecutor: DebugExecutor | null;
    value: string;
    onChange: (value: string) => void;
    theme: ReactCodeMirrorProps["theme"];
};

const MidenOutputs = ({ showDebug, debugExecutor, ...props }: MidenOutputsProps): JSX.Element => {
    /** This executes a command in the debug menu. */
    const executeDebug = async (command: DebugCommand, params?: bigint) => {
        try {
            if (!debugExecutor) {
                throw new Error("debugExecutor is undefined");
            }
            if (typeof params !== "undefined") {
                const debugOutput: DebugOutput = debugExecutor.execute(command, params);
                props.onChange(formatDebuggerOutput(debugOutput));
            } else {
                const debugOutput: DebugOutput = debugExecutor.execute(command);
                props.onChange(formatDebuggerOutput(debugOutput));
            }
        } catch (error) {
            props.onChange("Error: Check the developer console for details.");
        }
    };

    return (
        <div className="min-w-0 flex-1 box-border">
            <div className="flex justify-between">
                <EditorLabel label="outputs" />
                {showDebug ? (
                    <div className="flex gap-x-1">
                        <DebugButton
                            icon="Start"
                            onClick={() => executeDebug(DebugCommand.RewindAll)}
                        />
                        <DebugButton
                            icon="PPrevious"
                            onClick={() => executeDebug(DebugCommand.Rewind, BigInt(100))}
                        />
                        <DebugButton
                            icon="Previous"
                            onClick={() => executeDebug(DebugCommand.Rewind, BigInt(1))}
                        />
                        <DebugButton
                            icon="Stack"
                            onClick={() => executeDebug(DebugCommand.PrintState)}
                        />
                        <DebugButton
                            icon="Forward"
                            onClick={() => executeDebug(DebugCommand.Play, BigInt(1))}
                        />
                        <DebugButton
                            icon="FForward"
                            onClick={() => executeDebug(DebugCommand.Play, BigInt(100))}
                        />
                        <DebugButton
                            icon="End"
                            onClick={() => executeDebug(DebugCommand.PlayAll)}
                        />
                    </div>
                ) : null}
            </div>
            <Editor height="250px" {...props} />
        </div>
    )
}

export default MidenOutputs