import React, { useState } from "react";
import { oneDark } from "@codemirror/theme-one-dark";
import { eclipse } from "@uiw/codemirror-theme-eclipse";
import ActionButton from "../components/ActionButton";
import DropDown from "../components/DropDown";
import CodeMirror from "@uiw/react-codemirror";
import init, {
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
} from "../utils/helper_functions";
import { emptyOutput, exampleCode, exampleInput } from "../utils/constants";

function CodingEnvironment(): JSX.Element {
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
   * This handles a change in the selected example.
   * If a new example is selected using the dropdown, the inputs and 
   * the code are updated.
   */
  const [, setExample] = React.useState<string>();
  const handleSelectChange = async (exampleChange: string) => {
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
      const inputCheck = checkInputs(inputs);
        if (!inputCheck.isValid) {
          setOutput(inputCheck.errorMessage);
          toast.error("Execution failed");
          return
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
      const inputCheck = checkInputs(inputs);
      if (!inputCheck.isValid) {
        setOutput(inputCheck.errorMessage);
        toast.error("Proving failed");
        return
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
   * We need to add logic to Verify, and Debug.
   */
  const debugProgram = async () => {
    init().then(() => {
      toast.error("Not yet available");
    });
  };

  /**
   * This verifies the proof that is stored in the session.
   * It runs the Rust program that is imported above.
   * It returns true if the proof is valid, and false otherwise.
   * As inputs we need program_info, stack_input, stack_output, and proof.
   */
  const verifyProgram = async () => {
    init().then(() => {
      const inputCheck = checkInputs(inputs);
      const outputCheck = checkOutputs(outputs, proof);
      if (!inputCheck.isValid) {
        setOutput(inputCheck.errorMessage);
        toast.error("Verification failed");
        return
      } else if (!outputCheck.isValid) {
        setOutput(outputCheck.errorMessage);
        toast.error("Verification failed");
        return
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
        <ActionButton label="Debug" onClick={debugProgram} />
        <ActionButton label="Prove" onClick={proveProgram} />
        <ActionButton label="Verify" onClick={verifyProgram} />
        <Toaster />
      </div>
      <div className="box-border pt-6">
        <div className="grid grid-cols-2 gap-4 ml-2 mr-2">
          <div className="box-border">
            <h1 className="heading">Inputs</h1>
            <CodeMirror
              value={inputs}
              height="100%"
              maxHeight="80px"
              theme={oneDark}
              onChange={setInputs}
            />
          </div>
          <div className="box-border">
            <h1 className="heading">Outputs</h1>
            <CodeMirror
              value={outputs}
              height="100%"
              maxHeight="80px"
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

export default CodingEnvironment;
