import React from "react";
import { oneDark } from "@codemirror/theme-one-dark";
import { eclipse } from "@uiw/codemirror-theme-eclipse";
import ActionButton from "../components/ActionButton";
import DropDown from "../components/DropDown";
import CodeMirror from "@uiw/react-codemirror";
import init, { run_program, prove_program } from "miden-wasm";
import toast, { Toaster } from "react-hot-toast";

async function getExample(example: string) {
  const inputs = fetch(
    `https://raw.githubusercontent.com/0xPolygonMiden/examples/main/examples/${example}.inputs`
  );
  const masm = fetch(
    `https://raw.githubusercontent.com/0xPolygonMiden/examples/main/examples/${example}.masm`
  );
  return [(await inputs).text(), (await masm).text()];
}

function CodingEnvironment() {
  /**
   * Helper function to check if input contains only numbers.
   */
  function checkInputField(jsonField: JSON, key: string) {
    const jsonInput = jsonField[key as keyof typeof jsonField];

    if (!Array.isArray(jsonInput)) {
      const errorMessage = `If you use ${key},
      it must be an array of numbers.`;

      toast.error(errorMessage);
      setOutput(errorMessage);

      return false;
    }

    if (
      Object.values(jsonInput).length === 0 ||
      Object.values(jsonInput).some(isNaN)
    ) {
      const errorMessage = `If you use ${key}, 
      it must contain at least one number, 
      and it can only contain numbers.`;

      toast.error(errorMessage);
      setOutput(errorMessage);

      return false;
    }

    return true;
  }

  /**
   * We check the inputs and return true or false. We allow:
   * - an empty input, and
   * - a valid JSON object containing stack_init or advice_tape (or both)
   * if the values are numbers
   */
  function checkInputs(jsonString: string) {
    if (jsonString === "") {
      return true;
    }

    let jsonInput!: JSON;

    try {
      jsonInput = JSON.parse(jsonString);
    } catch (e: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      const errorMessage = `Miden VM Inputs need to be a valid JSON object:
${e.message}`;

      toast.error(errorMessage);

      setOutput(errorMessage);

      return false;
    }

    if (
      !Object.keys(jsonInput).includes("stack_init") &&
      !Object.keys(jsonInput).includes("advice_tape")
    ) {
      const errorMessage = `Miden VM Inputs can be empty or 
we need either a stack_init or 
an advice_tape.`;

      toast.error(errorMessage);

      setOutput(errorMessage);

      return false;
    }
    Object.keys(jsonInput).forEach((key) => {
      checkInputField(jsonInput, key);
    });

    return true;
  }

  /**
   * This sets the inputs to the default values.
   */

  const exampleInput = `{
    "stack_init": ["0"],
    "advice_tape": ["0"]
}`;
  const [inputs, setInputs] = React.useState(exampleInput);

  const exampleCode = `begin
  push.1
  push.2
  add
end`;

  const [code, setCode] = React.useState(exampleCode);

  /**
   * This sets the output and number of outputs to the default values.
   * Set to 16 now, that should change dynamically.
   */

  const emptyOutput = "\n \n \n \n";
  const [output, setOutput] = React.useState(emptyOutput);

  /**
   * This handles the number of outputs that are returned to the user.
   * It is not optimal to fix that to a certain number, but for
   * the sake of simplicity we do it for now.
   */
  const numOfOutputs = 16;

  /**
   * This handles a change in the selected example.
   * If a new example is selected using the dropdown, the code and inputs are updated.
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
      try {
        if (checkInputs(inputs)) {
          const resp = run_program(code, inputs, numOfOutputs);

          setOutput(`Miden VM Program Output
Stack = [${resp.toString()}]
Cycles = <available with Miden VM v0.4>`);
        }
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
      try {
        if (checkInputs(inputs)) {
          const resp = prove_program(code, inputs, numOfOutputs);
          const stack_output = resp.slice(0, numOfOutputs);
          const overflow_addrs = resp.slice(numOfOutputs, resp.length);

          setOutput(`Miden VM Program Output
Stack = [${stack_output.toString()}]
Overflow Address = [${overflow_addrs.toString()}]
Cycles = <available with Miden VM v0.4>`);
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
  const verifyProgram = async () => {
    init().then(() => {
      toast.error("Not yet available");
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
              value={output}
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
