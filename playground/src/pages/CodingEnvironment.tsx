import React, { useState } from "react";
import { oneDark } from "@codemirror/theme-one-dark";
import { eclipse } from "@uiw/codemirror-theme-eclipse";
import ActionButton from "../components/ActionButton";
import DropDown from "../components/DropDown";
import DebugButton from "../components/DebugButtons";
import CodeMirror from "@uiw/react-codemirror";
import init, {
  DebugCommand,
  DebugExecutor,
  DebugOutput,
  Outputs,
  run_program,
  prove_program,
  verify_program,
} from "miden-wasm";
import toast, { Toaster } from "react-hot-toast";
import {
  getExample,
  checkInputs,
  checkOutputs,
  formatDebuggerOutput,
} from "../utils/helper_functions";
import { emptyOutput, exampleCode, exampleInput } from "../utils/constants";
import OverlayButton from "../components/OverlayButton";

export default function CodingEnvironment(): JSX.Element {
  /**
   * This sets the inputs to the default values.
   */
  const [inputs, setInputs] = React.useState(exampleInput);

  /**
   * This sets the code to the default values.
   */
  const [code, setCode] = React.useState(exampleCode);

  /**
   * This sets the outputs to the default values.
   */
  const [outputs, setOutput] = React.useState(emptyOutput);

  /**
   * This sets the proof to the default proof.
   */
  const [proof, setProof] = useState<Uint8Array | null>(null);

  /**
   * Determines when to show the debug menu
   */
  const [showDebug, setShowDebug] = useState(false);

  /**
   * This sets the debugExecutor such that we can store it for a session.
   */
  const [debugExecutor, setDebugExecutor] = useState<DebugExecutor | null>(
    null
  );
  function disableDebug() {
    setShowDebug(false);
    setDebugExecutor(null);
  }

  /**
   * This handles a change in the selected example.
   * If a new example is selected using the dropdown, the inputs and
   * the code are updated.
   */
  const [, setExample] = React.useState<string>();
  const handleSelectChange = async (exampleChange: string) => {
    disableDebug();
    setProof(null);
    const value = exampleChange;
    // set the current example to the selected one
    setExample(value);
    if (value === "example") {
      setInputs(exampleInput);
      setCode(exampleCode);
      setOutput(emptyOutput);
      return;
    }
    // retrieve the example data and update the inputs and code
    const example_code = await getExample(value);
    setInputs(await example_code[0]);
    setCode(await example_code[1]);

    // reset the output
    setOutput(emptyOutput);
  };

  /**
   * This runs the program using the MidenVM and displays the output.
   * It runs the Rust program that is imported above.
   */
  const runProgram = async () => {
    init().then(() => {
      disableDebug();
      setProof(null);
      const inputCheck = checkInputs(inputs);
      if (!inputCheck.isValid) {
        setOutput(inputCheck.errorMessage);
        toast.error("Execution failed");
        return;
      }
      try {
        const start = Date.now();
        const { stack_output, trace_len }: Outputs = run_program(code, inputs);
        setOutput(`{
"stack_output" : [${stack_output.toString()}],
"trace_len" : ${trace_len}
}`);
        toast.success(`Execution successful in ${Date.now() - start} ms`);
      } catch (error) {
        setOutput("Error: Check the developer console for details.");
      }
    });
  };

  /**
   * This proves the program using the MidenVM and displays the output.
   * It runs the Rust program that is imported above.
   */
  const proveProgram = async () => {
    toast.loading("Proving ...", { id: "provingToast" });
    init().then(() => {
      disableDebug();
      setProof(null);
      const inputCheck = checkInputs(inputs);
      if (!inputCheck.isValid) {
        setOutput(inputCheck.errorMessage);
        toast.error("Proving failed");
        return;
      }
      try {
        const start = Date.now();
        const { stack_output, trace_len, overflow_addrs, proof }: Outputs =
          prove_program(code, inputs);
        const overflow = overflow_addrs ? overflow_addrs.toString() : null;
        if (overflow) {
          setOutput(`{
"stack_output" : [${stack_output.toString()}],
"overflow_addrs" : [${overflow}],
"trace_len" : ${trace_len}
}`);
        } else {
          setOutput(`{
"stack_output" : [${stack_output.toString()}],
"trace_len" : ${trace_len}
}`);
        }

        toast.success(`Proving successful in ${Date.now() - start} ms`, {
          id: "provingToast",
        });

        // Store the proof if it exists
        if (proof) {
          setProof(proof);
        }
      } catch (error) {
        setOutput("Error: Check the developer console for details.");
        toast.error("Proving failed");
      }
    });
  };

  /**
   * It starts a debugging session.
   * It stores the DebugExecutor in the session.
   * It opens the Debug Menu.
   */
  const startDebug = async () => {
    init().then(() => {
      const inputCheck = checkInputs(inputs);
      if (!inputCheck.isValid) {
        setOutput(inputCheck.errorMessage);
        toast.error("Debugging failed");
        return;
      }
      try {
        setShowDebug(true);
        setDebugExecutor(new DebugExecutor(code, inputs));
        setOutput("Debugging session started");
      } catch (error) {
        setOutput("Error: Check the developer console for details.");
      }
    });
  };

  /**
   * This executes a command in the debug menu.
   */
  const executeDebug = async (command: DebugCommand, params?: bigint) => {
    try {
      if (!debugExecutor) {
        throw new Error("debugExecutor is undefined");
      }
      if (typeof params !== "undefined") {
        const debugOutput: DebugOutput = debugExecutor.execute(command, params);
        setOutput(formatDebuggerOutput(debugOutput));
      } else {
        const debugOutput: DebugOutput = debugExecutor.execute(command);
        setOutput(formatDebuggerOutput(debugOutput));
      }
    } catch (error) {
      setOutput("Error: Check the developer console for details.");
    }
  };

  /**
   * This verifies the proof that is stored in the session.
   * It runs the Rust program that is imported above.
   * It returns true if the proof is valid, and false otherwise.
   * As inputs we need program_info, stack_input, stack_output, and proof.
   */
  const verifyProgram = async () => {
    init().then(() => {
      disableDebug();
      if (!proof) {
        setOutput("There is no proof to verify. \nDid you prove the program?");
        toast.error("Verification failed");
        return;
      }
      const inputCheck = checkInputs(inputs);
      const outputCheck = checkOutputs(outputs);
      if (!inputCheck.isValid) {
        setOutput(inputCheck.errorMessage);
        toast.error("Verification failed");
        return;
      } else if (!outputCheck.isValid) {
        setOutput(outputCheck.errorMessage);
        toast.error("Verification failed");
        return;
      }
      try {
        const start = Date.now();
        const result = verify_program(code, inputs, outputs, proof);
        toast.success(
          "Verification successful in " +
            (Date.now() - start) +
            " ms with a security level of " +
            result +
            "bits."
        );
      } catch (error) {
        setOutput("Error: Check the developer console for details.");
        toast.error("Verification failed");
      }
    });
  };

  return (
    <>
      <Toaster />
      <div className="ml-2 mr-2 pt-3 h-30 grid grid-cols-6 gap-4 content-center">
        <DropDown onExampleValueChange={handleSelectChange} />
        <ActionButton label="Run" onClick={runProgram} disabled={false} />
        <ActionButton label="Debug" onClick={startDebug} disabled={false} />
        <ActionButton label="Prove" onClick={proveProgram} disabled={false} />
        <ActionButton
          label="Verify"
          onClick={verifyProgram}
          disabled={!proof}
        />
        <OverlayButton label="Show Proof" disabled={!proof} proof={proof} />
      </div>
      <div className="box-border pt-6">
        <div className="grid grid-cols-2 gap-4 ml-2 mr-2">
          <div className="box-border">
            <h1 className="heading">Inputs</h1>
            <CodeMirror
              value={inputs}
              height="150px"
              theme={oneDark}
              onChange={setInputs}
            />
          </div>
          <div className="box-border">
            <h1 className="heading">Outputs </h1>
            <CodeMirror
              value={outputs}
              height="150px"
              theme={eclipse}
              onChange={setOutput}
            />
            {showDebug ? (
              <div className="flex pt-0 gap-x-1">
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
        </div>
      </div>
      <div className="box-border pt-6 ml-2 mr-2">
        <div className="box-border">
          <h1 className="heading">Miden Assembly Code</h1>
          <CodeMirror
            value={code}
            height="500px"
            theme={oneDark}
            onChange={setCode}
            basicSetup={{
              foldGutter: true,
              highlightActiveLineGutter: true,
              dropCursor: true,
              allowMultipleSelections: false,
              indentOnInput: false,
              lineNumbers: true,
              syntaxHighlighting: true,
              bracketMatching: true,
              autocompletion: true,
              highlightActiveLine: true,
            }}
          />
        </div>
      </div>
    </>
  );
}
