import React, { useState } from "react";
import { oneDark } from "@codemirror/theme-one-dark";
import { eclipse } from "@uiw/codemirror-theme-eclipse";
import ActionButton from "../components/ActionButton";
import DropDown from "../components/DropDown";
import MidenInputs from "../components/CodingEnvironment/MidenInputs";
import MidenOutputs from "../components/CodingEnvironment/MidenOutputs";
import MidenEditor from "../components/CodingEnvironment/MidenCode";
import ProofModal from "../components/CodingEnvironment/ProofModal";
import init, {
  DebugExecutor,
  Outputs,
  run_program,
  prove_program,
  verify_program,
  prepare_transaction,
  prove_transaction,
  verify_transaction,
} from "miden-wasm";
import toast, { Toaster } from "react-hot-toast";
import {
  getExample,
  checkInputs,
  checkOutputs,
} from "../utils/helper_functions";
import { emptyOutput, exampleCode, exampleInput } from "../utils/constants";

export default function CodingEnvironment(): JSX.Element {

  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * This sets the inputs to the default values.
   */
  const [inputs, setInputs] = React.useState(exampleInput);

  /**
   * This sets the code to the default values.
   */
  const [code, setCode] = React.useState(exampleCode);

  /**
   * This sets the output to the default values.
   */
  const [output, setOutput] = React.useState(emptyOutput);

  /**
   * This sets the proof to the default proof.
   */
  const [proof, setProof] = useState<Uint8Array | null>(null);

  /**
   * Determines when to show the debug menu
   */
  const [showDebug, setShowDebug] = useState(false);


  /** Manages the display of the proof */
  const [proofModalOpen, setProofModalOpen] = useState(false);

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
    if (value === "addition") {
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
    setIsProcessing(true);
    disableDebug();
    init().then(() => {
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
        setOutput(`Error: ${error}`);
      }
    }).finally(() => setIsProcessing(false));
  };

  /**
   * This proves the program using the MidenVM and displays the output.
   * It runs the Rust program that is imported above.
   */
  const proveProgram = async () => {
    setIsProcessing(true);
    disableDebug();
    toast.loading("Proving ...", { id: "provingToast" });
    init().then(() => {
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
        setOutput(`Error: ${error}`);
        toast.error("Proving failed");
      }
    }).finally(() => setIsProcessing(false));
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
        setOutput(`Error: ${error}`);
      }
    });
  };

  /**
   * This verifies the proof that is stored in the session.
   * It runs the Rust program that is imported above.
   * It returns true if the proof is valid, and false otherwise.
   * As inputs we need program_info, stack_input, stack_output, and proof.
   */
  const verifyProgram = async () => {
    disableDebug();
    init().then(() => {
      if (!proof) {
        setOutput("There is no proof to verify. \nDid you prove the program?");
        toast.error("Verification failed");
        return;
      }
      const inputCheck = checkInputs(inputs);
      const outputCheck = checkOutputs(output);
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
        const result = verify_program(code, inputs, output, proof);
        toast.success(
          "Verification successful in " +
          (Date.now() - start) +
          " ms with a security level of " +
          result +
          "bits."
        );
      } catch (error) {
        setOutput(`Error: ${error}`);
        toast.error("Verification failed");
      }
    });
  };

  return (
    <div className="pb-4">
      <Toaster />
      <div className="bg-gray-100 sticky top-0 z-10 px-4 sm:px-6 lg:px-8 py-6 grid lg:grid-cols-6 sm:grid-cols-3 grid-cols-2 gap-4 content-center">
        <DropDown onExampleValueChange={handleSelectChange} />
        <ActionButton label="Run" onClick={runProgram} disabled={isProcessing} />
        <ActionButton label="Debug" onClick={startDebug} disabled={isProcessing} />
        <ActionButton label="Prove" onClick={proveProgram} disabled={isProcessing} />
        <ActionButton
          label="Verify"
          onClick={verifyProgram}
          disabled={isProcessing || !proof}
        />
        <ActionButton
          label="Show Proof"
          onClick={() => setProofModalOpen(true)}
          disabled={isProcessing || !proof}
        />
        <ProofModal proof={proof} open={proofModalOpen} setOpen={setProofModalOpen} />
        {/* <OverlayButton label="Show Proof" disabled={!proof} proof={proof} /> */}
      </div>
      <div className="px-4 sm:px-6 lg:px-8 pt-6 box-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MidenInputs value={inputs} onChange={setInputs} theme={oneDark} />
          <MidenOutputs value={output} onChange={setOutput} theme={eclipse} showDebug={showDebug} debugExecutor={debugExecutor} />
        </div>
      </div>
      <div className="px-4 sm:px-6 lg:px-8 pt-6 box-border">
        <MidenEditor value={code} onChange={setCode} theme={oneDark} />
      </div>
    </div>
  );
}