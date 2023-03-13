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
  Outputs,
  run_program,
  prove_program,
  verify_program,
} from "miden-wasm";
import toast, { Toaster } from "react-hot-toast";
import {
  addNewlineAfterWhitespace,
  getExample,
  checkInputs,
  checkOutputs,
} from "../utils/helper_functions";
import { emptyOutput, exampleCode, exampleInput } from "../utils/constants";

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
  const [proof, setProof] = useState<Uint8Array>(new Uint8Array(0));

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
    const value = exampleChange;
    // set the current example to the selected one
    setExample(value);

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
      const inputCheck = checkInputs(inputs);
      if (!inputCheck.isValid) {
        setOutput(inputCheck.errorMessage);
        toast.error("Execution failed");
        return;
      }
      try {
        const { stack_output, cycles }: Outputs = run_program(code, inputs);
        setOutput(`{
"stack_output" : [${stack_output.toString()}],
"cycles" : ${cycles}
}`);
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
    init().then(() => {
      disableDebug();
      const inputCheck = checkInputs(inputs);
      if (!inputCheck.isValid) {
        setOutput(inputCheck.errorMessage);
        toast.error("Proving failed");
        return;
      }
      try {
        const { stack_output, cycles, overflow_addrs, proof }: Outputs =
          prove_program(code, inputs);
        setOutput(`{
"stack_output" : [${stack_output.toString()}],
"overflow_addrs" : [${overflow_addrs ? overflow_addrs.toString() : ""}],
"cycles" : ${cycles}
}`);
        // Store the proof if >0 (empty proof is 0)
        if (proof) {
          if (proof.length > 0) {
            setProof(proof);
          }
        }
      } catch (error) {
        setOutput("Error: Check the developer console for details.");
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
      if (typeof params !== 'undefined') {
        const result = debugExecutor.execute(command, params);
        setOutput(addNewlineAfterWhitespace(result));
      } else {
        const result = debugExecutor.execute(command);
        setOutput(addNewlineAfterWhitespace(result));
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
      const inputCheck = checkInputs(inputs);
      const outputCheck = checkOutputs(outputs, proof);
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
        const result = verify_program(code, inputs, outputs, proof);
        setOutput(
          `Verification succeeded with a security level of ${result} bits. \n \n \n`
        );
        toast.success("Verification successful");
      } catch (error) {
        setOutput("Error: Check the developer console for details.");
        toast.error("Verification failed");
      }
    });
  };

  return (
    <>
      <div className="ml-2 mr-2 pt-3 h-30 grid grid-cols-5 gap-4 content-center">
        <DropDown onExampleValueChange={handleSelectChange} />
        <ActionButton label="Run" onClick={runProgram} />
        <ActionButton label="Debug" onClick={startDebug} />
        <ActionButton label="Prove" onClick={proveProgram} />
        <ActionButton label="Verify" onClick={verifyProgram} />
        <Toaster />
      </div>
      {showDebug ? (
        <div className="flex justify-center pt-6">
          <DebugButton
            icon="PPrevious"
            onClick={() => executeDebug(DebugCommand.RewindAll)}
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
            onClick={() => executeDebug(DebugCommand.PlayAll)}
          />
        </div>
      ) : null}
      <div className="box-border pt-6">
        <div className="grid grid-cols-2 gap-4 ml-2 mr-2">
          <div className="box-border">
            <h1 className="heading">Inputs</h1>
            <CodeMirror
              value={inputs}
              height="100%"
              maxHeight="150px"
              theme={oneDark}
              onChange={setInputs}
            />
          </div>
          <div className="box-border">
            <h1 className="heading">Outputs</h1>
            <CodeMirror
              value={outputs}
              height="100%"
              maxHeight="150px"
              theme={eclipse}
              onChange={setOutput}
            />
          </div>
        </div>
      </div>
      <div className="box-border pt-6 ml-2 mr-2">
        <div className="box-border">
          <h1 className="heading">Miden Assembly Code</h1>
          <CodeMirror
            value={code}
            height="100%"
            theme={oneDark}
            onChange={setCode}
            maxHeight="1000px"
          />
        </div>
      </div>
    </>
  );
}
