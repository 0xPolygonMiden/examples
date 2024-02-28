import React, { useEffect, useState } from 'react';
import { isMobile } from 'mobile-device-detect';
import DropDown from '../components/DropDown';
import MidenInputs from '../components/CodingEnvironment/MidenInputs';
import MidenEditor from '../components/CodingEnvironment/MidenCode';
import InstructionTable from './InstructionTable';

import init, {
  DebugExecutor,
  Outputs,
  run_program,
  prove_program,
  verify_program,
  DebugCommand,
  DebugOutput
} from 'miden-wasm';
import toast, { Toaster } from 'react-hot-toast';
import {
  getExample,
  checkInputs,
  checkOutputs,
  formatDebuggerOutput,
  formatMemory,
  formatBeautifyNumbersArray
} from '../utils/helper_functions';
import { PlayIcon, PlusIcon } from '@heroicons/react/24/solid';
import { emptyOutput, exampleCode, exampleInput } from '../utils/constants';
import ProgramInfo from './ProgramInfo';
import ProofInfo from './ProofInfo';
import DebugInfo from './DebugInfo';
import MemoryInfo from '../components/CodingEnvironment/MemoryInfo';
import ExplainerPage from './Explainer';
import OutputInfo from './OutputInfo';

export default function CodingEnvironment(): JSX.Element {
  const [isProcessing, setIsProcessing] = useState(false);

  const [isTestExperimentVisible, setIsTestExperimentVisible] = useState(true);
  const [isInstructionVisible, setIsInstructionVisible] = useState(!isMobile);

  const [isProgramInfoVisible, setIsProgramInfoVisible] = useState(false);
  const [isProofInfoVisible, setIsProofInfoVisible] = useState(false);
  const [debugOutput, setDebugOutput] = useState<DebugOutput | null>(null);

  /**
   * This sets the inputs to the default values.
   */
  const [inputs, setInputs] = React.useState(exampleInput);
  const [inputStringValue, setInputStringValue] = React.useState(exampleInput);

  /**
   * This sets the code to the default values.
   */
  const [code, setCode] = React.useState(exampleCode);

  /**
   * This sets the output to the default values.
   */
  const [output, setOutput] = React.useState(emptyOutput);

  const [programInfo, setProgramInfo] = React.useState(emptyOutput);

  /**
   * This sets the proof to the default proof.
   */
  const [proof, setProof] = useState<Uint8Array | null>(null);

  /**
   * Determines when to show the debug menu
   */
  const [showDebug, setShowDebug] = useState(false);
  const [isHelpVisible, setIsHelpVisible] = useState(false);

  const [operandValue, setOperandValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [disableForm, setDisableForm] = useState(false);

  const [stackOutputValue, setStackOutputValue] = useState('');
  const [isStackOutputVisible, setIsStackOutputVisible] = useState(false);
  const [isCodeEditorVisible, setIsCodeEditorVisible] = useState(false);
  const [codeUploadContent, setCodeUploadContent] = useState('');

  const [adviceValue, setAdviceValue] = useState('');
  const [isAdviceFocused, setIsAdviceFocused] = useState(false);
  const [isAdviceStackLayoutVisible, setIsAdviceStackLayoutVisible] =
    useState(false);

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    if (!operandValue) {
      setIsInputFocused(false);
    }
  };

  const handleAdviceFocus = () => {
    setIsAdviceFocused(true);
  };

  const handleAdviceBlur = () => {
    if (!adviceValue) {
      setIsAdviceFocused(false);
    }
  };

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        // If the copying was successful
        toast.success('Copied!');
      })
      .catch((err) => {
        toast.error('Failed to copy: ' + err);
      });
  };

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

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  const executeDebug = async (command: DebugCommand, params?: bigint) => {
    try {
      if (!debugExecutor) {
        throw new Error('debugExecutor is undefined');
      }
      if (typeof params !== 'undefined') {
        const debugOutput: DebugOutput = debugExecutor.execute(command, params);
        setOutput(formatDebuggerOutput(debugOutput));
        console.log('memory', formatMemory(debugOutput.memory));
        console.log('stack', debugOutput.stack);

        setDebugOutput(debugOutput);
      } else {
        const debugOutput: DebugOutput = debugExecutor.execute(command);
        console.log('memory', formatMemory(debugOutput.memory));
        console.log('stack', debugOutput.stack);

        setOutput(formatDebuggerOutput(debugOutput));
        setDebugOutput(debugOutput);
      }
    } catch (error) {
      setOutput('Error: Check the developer console for details.');
    }
  };

  /**
   * This handles a change in the selected example.
   * If a new example is selected using the dropdown, the inputs and
   * the code are updated.
   */
  const handleSelectChange = async (exampleChange: string) => {
    disableDebug();
    setProof(null);
    setDisableForm(false);

    const value = exampleChange;

    // set the current example to the selected one
    if (value === 'addition') {
      setInputs(exampleInput);
      setCode(exampleCode);
      setOutput(emptyOutput);
      return;
    }

    if (value === 'advice_provider') {
      setDisableForm(true);
      setIsCodeEditorVisible(true);
      console.log('ADVICE');
    }

    // retrieve the example data and update the inputs and code
    const example_code = await getExample(value);
    setInputs(await example_code[0]);
    setCode(await example_code[1]);

    if (isCodeEditorVisible) {
      console.log('ADVICE');
      setCodeUploadContent(await example_code[0]);
    }

    // reset the output
    setOutput(emptyOutput);
  };

  const hideAllRightSideLayout = () => {
    setIsInstructionVisible(false);
    setIsProgramInfoVisible(false);
    setShowDebug(false);
    setIsProofInfoVisible(false);
    setIsStackOutputVisible(false);
    setIsTestExperimentVisible(false);
  };

  useEffect(() => {
    let inputString;

    if (isCodeEditorVisible) {
      setInputStringValue(codeUploadContent);
      return;
    }

    let operandParts = '[]';
    if (operandValue) {
      operandParts = operandValue
        .toString()
        .split(',')
        .filter((value) => value !== '')
        .map((value) => value.trim())
        .map((value) => `"${value}"`)
        .toString();
    }

    if (adviceValue) {
      // If adviceValue is not empty

      const adviceParts = adviceValue
        .toString()
        .split(',')
        .filter((value) => value !== '')
        .map((value) => value.trim())
        .map((value) => `"${value}"`)
        .toString();

      inputString = `{
        "operand_stack": [${operandParts}],
        "advice_stack": [${adviceParts}]
    }`;
    } else {
      // If adviceValue is empty
      inputString = `{
        "operand_stack": [${operandParts}],
        "advice_stack": []
    }`;
    }

    setInputStringValue(inputString);
  }, [operandValue, adviceValue]);

  useEffect(() => {
    setInputStringValue(codeUploadContent);
  }, [codeUploadContent]);

  useEffect(() => {
    if (!inputs) {
      return;
    }

    try {
      const inputCheck = checkInputs(inputs);
      if (!inputCheck.isValid) {
        return;
      }

      setAdviceValue('');
      setOperandValue('');
      const inputObject = JSON.parse(inputs);
      if (inputObject.operand_stack) {
        setOperandValue(formatBeautifyNumbersArray(inputObject.operand_stack));
      }

      if (inputObject.advice_stack) {
        setAdviceValue(formatBeautifyNumbersArray(inputObject.advice_stack));
        setIsAdviceStackLayoutVisible(true);
      }
    } catch (error: any) {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      console.log('Inputs must be a valid JSON object: ${error.message}');
    }
  }, [inputs]);

  const onInputPlusClick = () => {
    setIsAdviceStackLayoutVisible(!isAdviceStackLayoutVisible);
    setAdviceValue('');
    setIsAdviceFocused(false);
  };

  const handleOperandValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow numbers and commas
    const regex = /^[0-9, ]*$/;
    const newValue = e.target.value;

    if (regex.test(newValue)) {
      setOperandValue(newValue);
    }
  };

  const handleAdviceValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow numbers and commas
    const regex = /^[0-9, ]*$/;
    const newValue = e.target.value;

    if (regex.test(newValue)) {
      setAdviceValue(newValue);
    }
  };

  const onTestAndExperimentClick = () => {
    if (isTestExperimentVisible) return;

    hideAllRightSideLayout();

    setIsTestExperimentVisible(true);
    setIsInstructionVisible(true);
    setIsHelpVisible(false);
  };

  const onInstructionClick = () => {
    if (isInstructionVisible) return;

    hideAllRightSideLayout();
    setIsTestExperimentVisible(true);
    setIsInstructionVisible(!isInstructionVisible);
    setIsHelpVisible(false);
  };

  const onHelpClick = () => {
    if (isHelpVisible) return;

    setIsHelpVisible(!isHelpVisible);
    setIsTestExperimentVisible(false);
    setIsInstructionVisible(false);
  };

  /**
   * This runs the program using the MidenVM and displays the output.
   * It runs the Rust program that is imported above.
   */
  const runProgram = async () => {
    setIsProcessing(true);
    disableDebug();
    init()
      .then(() => {
        setProof(null);

        const inputCheck = checkInputs(inputStringValue);

        console.log('input string', inputStringValue);
        if (!inputCheck.isValid) {
          setOutput(inputCheck.errorMessage);
          toast.error('Execution failed');
          hideAllRightSideLayout();
          setProgramInfo(inputCheck.errorMessage);
          setIsProgramInfoVisible(true);
          return;
        }
        try {
          const start = Date.now();

          const { program_hash, stack_output, cycles, trace_len }: Outputs =
            run_program(code, inputStringValue);

          hideAllRightSideLayout();

          setStackOutputValue(stack_output.toString());
          setOutput(`{
            "stack_output" : [${stack_output.toString()}],
            "trace_len" : ${trace_len}
            }`);
          setProgramInfo(
            `Program Hash: ${program_hash}\nCycles: ${cycles}\nTrace_len: ${trace_len}`
          );
          setIsProgramInfoVisible(true);
          setIsStackOutputVisible(true);
          toast.success(`Execution successful in ${Date.now() - start} ms`);
        } catch (error) {
          hideAllRightSideLayout();
          setProgramInfo(`Error: ${error}`);
          setIsProgramInfoVisible(true);
          setOutput(`Error: ${error}`);
        }
      })
      .finally(() => setIsProcessing(false));
  };

  /**
   * This proves the program using the MidenVM and displays the output.
   * It runs the Rust program that is imported above.
   */
  const proveProgram = async () => {
    setIsProcessing(true);
    disableDebug();
    toast.loading('Proving ...', { id: 'provingToast' });
    init()
      .then(() => {
        setProof(null);

        const inputCheck = checkInputs(inputStringValue);
        console.log('input string', inputStringValue);

        if (!inputCheck.isValid) {
          setOutput(inputCheck.errorMessage);

          hideAllRightSideLayout();
          setProgramInfo(inputCheck.errorMessage);
          setIsProgramInfoVisible(true);
          toast.error('Proving failed', {
            id: 'provingToast'
          });
          return;
        }
        try {
          const start = Date.now();
          const {
            program_hash,
            cycles,
            stack_output,
            trace_len,
            overflow_addrs,
            proof
          }: Outputs = prove_program(code, inputStringValue);
          const overflow = overflow_addrs ? overflow_addrs.toString() : '[]';
          setProgramInfo(
            `Program Hash: ${program_hash}
            Cycles: ${cycles}
            Trace_len: ${trace_len}`
          );
          setOutput(`{
            "stack_output" : [${stack_output.toString()}],
            "overflow_addrs" : [${overflow}],
            "trace_len" : ${trace_len}
            }`);

          toast.success(`Proving successful in ${Date.now() - start} ms`, {
            id: 'provingToast'
          });

          // Store the proof if it exists

          hideAllRightSideLayout();

          if (proof) {
            setProof(proof);
            setIsProofInfoVisible(true);
          }

          setIsProgramInfoVisible(true);
        } catch (error) {
          setOutput(`Error: ${error}`);
          hideAllRightSideLayout();
          setProgramInfo(`Error: ${error}`);
          setIsProgramInfoVisible(true);
          toast.error(`Error: ${error}`, {
            id: 'provingToast'
          });
        }
      })
      .finally(() => setIsProcessing(false));
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
        toast.error('Debugging failed');
        return;
      }
      try {
        hideAllRightSideLayout();

        setShowDebug(true);
        setDebugExecutor(new DebugExecutor(code, inputs));
        setOutput('Debugging session started');

        setDebugOutput(null);
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
        setOutput('There is no proof to verify. \nDid you prove the program?');
        toast.error('Verification failed');
        return;
      }
      const inputCheck = checkInputs(inputs);
      const outputCheck = checkOutputs(output);
      if (!inputCheck.isValid) {
        setOutput(inputCheck.errorMessage);
        toast.error('Verification failed');
        return;
      } else if (!outputCheck.isValid) {
        setOutput(outputCheck.errorMessage);
        toast.error('Verification failed');
        return;
      }
      try {
        const start = Date.now();
        const result = verify_program(code, inputs, output, proof);
        toast.success(
          'Verification successful in ' +
            (Date.now() - start) +
            ' ms with a security level of ' +
            result +
            'bits.'
        );
      } catch (error) {
        setOutput(`Error: ${error}`);
        toast.error('Verification failed');
      }
    });
  };

  const onJSONEditorClick = () => {
    setIsCodeEditorVisible(true);
  };

  const onFormEditorClick = () => {
    setIsCodeEditorVisible(false);
  };

  return (
    <div className="bg-primary h-full w-full overflow-y-hidden">
      <Toaster />
      <div className="bg-secondary-main w-full flex items-center py-6 px-16">
        <button onClick={onTestAndExperimentClick}>
          <h1
            className={classNames(
              'flex text-sm items-center font-semibold cursor-pointer',
              isTestExperimentVisible
                ? 'text-white'
                : 'text-secondary-1 hover:text-white'
            )}
          >
            TEST & EXPERIMENT
          </h1>
        </button>

        {!isMobile && (
          <button onClick={onInstructionClick}>
            <h1
              className={classNames(
                'flex text-sm ml-8 items-center font-semibold cursor-pointer',
                isInstructionVisible
                  ? 'text-white'
                  : 'text-secondary-1 hover:text-white'
              )}
            >
              INSTRUCTIONS
            </h1>
          </button>
        )}

        <button onClick={onHelpClick}>
          <h1
            className={classNames(
              'flex text-sm ml-8 items-center font-semibold cursor-pointer',
              isHelpVisible ? 'text-white' : 'text-secondary-1 hover:text-white'
            )}
          >
            HELP
          </h1>
        </button>
      </div>

      {isHelpVisible && (
        <div className="flex bg-secondary-3 lg:px-4 pt-4 w-full h-full overflow-scroll">
          <ExplainerPage />
        </div>
      )}

      {!isHelpVisible && (
        <div className="flex flex-col lg:flex-row lg:px-4 pt-4 w-full h-full overflow-y-hidden">
          <div className="flex flex-col h-full w-full lg:w-1/2 mr-4 ${ isMobile ? px-3 }">
            <div className="flex flex-col h-3/6 rounded-lg border bg-secondary-main border-secondary-4">
              <div className="h-14 flex items-center py-3 px-4">
                <DropDown onExampleValueChange={handleSelectChange} />
                <button
                  className="flex items-center ml-3 text-white text-xs font-normal border z-10 rounded-lg border-secondary-4 py-2 px-2.5"
                  onClick={runProgram}
                  disabled={isProcessing}
                >
                  Run
                  <PlayIcon className="h-3 w-3 fill-accent-2 ml-1.5" />
                </button>
                {!isMobile && (
                  <button
                    className="flex items-center ml-3 text-white text-xs font-normal border z-10 rounded-lg border-secondary-4 py-2 px-2.5"
                    onClick={startDebug}
                    disabled={isProcessing}
                  >
                    Debug
                  </button>
                )}
                <button
                  className="flex items-center ml-3 text-white text-xs font-normal border z-10 rounded-lg border-secondary-4 py-2 px-2.5"
                  onClick={proveProgram}
                  disabled={isProcessing}
                >
                  Prove
                </button>
                {isMobile && (
                  <button
                    className={`flex items-center ml-3 text-white text-xs font-normal border z-10 rounded-lg border-secondary-4 py-2 px-2.5 ${
                      proof
                        ? 'text-white border-secondary-4'
                        : 'text-gray-500 border-gray-500'
                    }`}
                    onClick={verifyProgram}
                    disabled={isProcessing || !proof}
                  >
                    Verify
                  </button>
                )}
              </div>

              <div className="h-px bg-secondary-4 mb-4"></div>
              <MidenEditor
                value={code}
                showDebug={showDebug}
                onChange={setCode}
                handleCopyClick={handleCopyClick}
                executeDebug={executeDebug}
              />
            </div>

            <div className="mt-5">
              <div className="flex w-full h-56 rounded-xl bg-secondary-main grow overflow-hidden border border-secondary-4">
                <div className="flex flex-col h-54 w-full">
                  <div className="bg-secondary-main z-10 py-4 flex sticky top-0 text-white items-center">
                    <h1 className="pl-5 text-left text-base font-semibold">
                      Inputs
                    </h1>

                    <div className="flex ml-auto mr-5">
                      <button
                        onClick={!disableForm ? onFormEditorClick : undefined}
                        className={classNames(
                          'text-left mr-3 text-base font-semibold',
                          !disableForm
                            ? 'cursor-pointer'
                            : 'cursor-not-allowed opacity-50',
                          !isCodeEditorVisible && !disableForm
                            ? 'text-white'
                            : 'text-secondary-6'
                        )}
                      >
                        <h1>FORM</h1>
                      </button>

                      <button onClick={onJSONEditorClick}>
                        <h1
                          className={classNames(
                            'text-left text-secondary-6 text-base font-semibold cursor-pointer',
                            isCodeEditorVisible
                              ? 'text-white'
                              : 'text-secondary-6'
                          )}
                        >
                          JSON
                        </h1>
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-secondary-4"></div>

                  <div className="flex w-full overflow-auto ">
                    {!isCodeEditorVisible && (
                      <div className="flex flex-col w-full pt-4">
                        <div className="flex justify-center items-baseline relative grow border-none">
                          <input
                            type="text"
                            value={operandValue}
                            onChange={handleOperandValueChange}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            className="bg-transparent w-full focus:ring-0 text-green pt-4 pb-2 pl-16 outline-none border-none"
                          />
                          <label
                            htmlFor="input"
                            className={`absolute text-base text-secondary-6 font-bold left-2 transition-all ${
                              isInputFocused || operandValue
                                ? 'text-xs top-0 text-green'
                                : 'text-sm top-4'
                            }`}
                          >
                            Operand Stack
                          </label>

                          <PlusIcon
                            onClick={onInputPlusClick}
                            className={classNames(
                              'h-6 w-6 ml-1.5 mr-3 hover:cursor-pointer',
                              isAdviceStackLayoutVisible
                                ? 'fill-green'
                                : 'fill-secondary-6'
                            )}
                          />
                        </div>

                        <div className="h-px bg-secondary-4 mb-4"></div>

                        {isAdviceStackLayoutVisible && (
                          <div>
                            <div className="flex justify-center h-fit items-baseline relative grow border-none ml-12">
                              <input
                                type="text"
                                value={adviceValue}
                                onChange={handleAdviceValueChange}
                                onFocus={handleAdviceFocus}
                                onBlur={handleAdviceBlur}
                                className="bg-transparent w-full focus:ring-0 text-green pt-4 pb-2 pl-16 outline-none border-none"
                              />
                              <label
                                htmlFor="advicestack"
                                className={`absolute text-base text-secondary-6 font-bold left-2 transition-all ${
                                  isAdviceFocused || adviceValue
                                    ? 'text-xs top-0 text-green'
                                    : 'text-sm top-4'
                                }`}
                              >
                                Advice Stack
                              </label>
                            </div>
                            <div className="h-px bg-secondary-4 mb-4 ml-12"></div>
                          </div>
                        )}
                      </div>
                    )}
                    {isCodeEditorVisible && (
                      <MidenInputs
                        value={inputs}
                        onChange={setCodeUploadContent}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full lg:w-1/2 gap-y-6 mt-4 lg:mt-0">
            {!isMobile && isInstructionVisible && (
              <div className="h-4/6 rounded-xl border relative overflow-y-scroll border-secondary-4">
                <InstructionTable />
              </div>
            )}

            {isStackOutputVisible && (
              <div className="flex ${ isMobile ? px-3 }">
                <OutputInfo output={stackOutputValue} />
              </div>
            )}

            {isProgramInfoVisible && (
              <div className="flex ${ isMobile ? px-3 }">
                <ProgramInfo programInfo={programInfo} />
              </div>
            )}

            {isProofInfoVisible && (
              <div className="flex ${ isMobile ? px-3 }">
                <ProofInfo proofText={proof} verifyProgram={verifyProgram} />
              </div>
            )}

            {showDebug && (
              <div className="flex">
                <DebugInfo debugOutput={debugOutput} />
              </div>
            )}
            {showDebug && debugOutput && (
              <div className="flex">
                <MemoryInfo debugOutput={debugOutput} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
