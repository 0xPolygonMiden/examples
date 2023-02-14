import ActionButton from "./components/ActionButton";
import DropDown from "./components/DropDown";
import InstructionTable from "./components/InstructionTable";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { eclipse } from "@uiw/codemirror-theme-eclipse";
import init, { run_program, prove_program } from "miden-wasm";
import MidenLogo from "./components/MidenLogo";
import Link from "./components/Link";


async function getExample(example: string) {
    const inputs = fetch(`https://raw.githubusercontent.com/0xPolygonMiden/examples/main/examples/${example}.inputs`)
    const masm = fetch(`https://raw.githubusercontent.com/0xPolygonMiden/examples/main/examples/${example}.masm`)
    return [(await inputs).text(), (await masm).text()];
  }

function App() {

  /**
  * This sets the inputs to the default values.
  */  

  const exampleInput =     `{
    "stack_init": ["0"],
    "advice_tape": ["0"]
}`
  const [inputs, setInputs] = React.useState(exampleInput);

  const exampleCode =   `begin
  push.1
  push.2
  add
end`

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

  const [example, setExample] = React.useState<string>();
  console.log(example)
  const handleSelectChange = async (exampleChange: string) => {
    const value = exampleChange;
    // set the current example to the selected one
    setExample(value)

    // retrieve the example data and update the inputs and code
    const example_code = await getExample(value)
    setInputs(await example_code[0])
    setCode(await example_code[1])    

    // reset the output
    setOutput(emptyOutput)
  }

  /**
  * This runs the program using the MidenVM and displays the output.
  * It runs the Rust program that is imported above.
  */ 

  const runProgram = async () => {
    init().then(() => {
      try {
        const resp = run_program(code, inputs, numOfOutputs);
        console.log(resp.toString());
        setOutput(`Miden VM Program Output
Stack = [${resp.toString()}]
Cycles = <available with Miden VM v0.4>`);
      } catch (error) {
        setOutput("Error: Check the developer console for details.");
      }
        })};
  

  /**
  * This proves the program using the MidenVM and displays the output.
  * It runs the Rust program that is imported above.
  */ 

    const proveProgram = async () => {
      init().then(() => {
        try {
          const resp = prove_program(code, inputs, numOfOutputs);
          console.log(resp.toString());
          const stack_output = resp.slice(0, numOfOutputs);
          const overflow_addrs = resp.slice(numOfOutputs, resp.length);
          setOutput(`Miden VM Program Output
Stack = [${stack_output.toString()}]
Overflow Address = [${overflow_addrs.toString()}]
Cycles = <available with Miden VM v0.4>`);
        } catch (error) {
          setOutput("Error: Check the developer console for details.");
        }
          })};
    
  /**
  * We need to add the following:
  * Verify, and Debug as functions that can be called.
  */ 

  return (
    <>
        <div className="flex items-center justify-between flex-wrap bg-blue-700 p-6">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
              <MidenLogo />
              <span className="font-semibold text-xl tracking-tight">Playground for Miden Examples in Miden Assembly
              </span>
          </div>
          <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
            <div className="text-sm lg:flex-grow">
              <Link label="Docs" address="https://wiki.polygon.technology/docs/miden/user_docs/assembly/main" />
              <Link label="Examples" address="https://github.com/0xPolygonMiden/examples#available-examples" />
              <Link label="Homepage" address="https://polygon.technology/solutions/polygon-miden/" />
            </div>
          </div>
        </div>

        <div className="ml-2 mr-2 pt-3 h-30 grid grid-cols-5 gap-4 content-center">
            
            <DropDown onExampleValueChange={handleSelectChange}/>
            <ActionButton label="Run" onClick={runProgram} />
            <ActionButton label="Debug" /> 
            <ActionButton label="Prove" onClick={proveProgram} />
            <ActionButton label="Verify" />

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
        <div className="box-border pt-6">
          <div className="grid grid-cols-2 gap-4 ml-2 mr-2">
            <div className="box-border">
              <h1 className="heading">Miden Assembly Code</h1>
              <CodeMirror
                  value={code}
                  height="100%"
                  theme={oneDark}
                  onChange={setCode}
                  maxHeight="500px"
                />
            </div>
            <div className="box-border">
              <h1 className="heading">Instructions Set</h1>
              <InstructionTable />
            </div>
          </div>
        </div>  
    </>
  );
}

export default App;
