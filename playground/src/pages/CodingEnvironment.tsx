import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { isMobile } from 'mobile-device-detect';
import DropDown from '../components/DropDown';
import MidenInputs from '../components/CodingEnvironment/MidenInputs';
import MidenEditor, {
  MidenCodeHandles
} from '../components/CodingEnvironment/MidenCode';
import InstructionTable from './InstructionTable';
import Joyride, {
  CallBackProps,
  STATUS,
  Step,
  TooltipRenderProps
} from 'react-joyride';

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
import { PlusIcon } from '@heroicons/react/24/solid';
import {
  ArrowDownTrayIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import {
  LOCAL_STORAGE,
  emptyOutput,
  exampleCode,
  exampleInput
} from '../utils/constants';
import ProgramInfo, { ProgramInfoInterface } from './ProgramInfo';
import ProofInfo from './ProofInfo';
import DebugInfo from './DebugInfo';
import MemoryInfo from '../components/CodingEnvironment/MemoryInfo';
import ExplainerPage from './Explainer';
import OutputInfo from './OutputInfo';
import SizeDropDown from '../components/CodingEnvironment/SizeDropDown';
import OnboardingDialog from '../components/OnboardingDialog';

const worker = new Worker(new URL('./proveWorker.js', import.meta.url));

export default function CodingEnvironment(): JSX.Element {
  const [isProcessing, setIsProcessing] = useState(false);

  const TEST_EXPERIMENT_TAB = 'test_experiment_tab';
  const INSTRUCTIONS_TAB = 'instructions_tab';
  const HELP_TAB = 'help_tab';

  const [selectedTab, setSelectedTab] = useState(TEST_EXPERIMENT_TAB);

  const [isProgramInfoVisible, setIsProgramInfoVisible] = useState(true);
  const [isProofInfoVisible, setIsProofInfoVisible] = useState(false);
  const [debugOutput, setDebugOutput] = useState<DebugOutput | null>(null);

  const midenCodeRef = useRef<MidenCodeHandles>(null);

  /**
   * This sets the inputs to the default values.
   */
  const [inputs, setInputs] = React.useState(
    localStorage.getItem(LOCAL_STORAGE.INPUT_STRING) ?? exampleInput
  );
  const isInitialRender = useRef(true);

  /**
   * This sets the code to the default values.
   */
  const [code, setCode] = React.useState('');

  const [run, setRun] = useState(false);

  /**
   * This sets the output to the default values.
   */
  const [output, setOutput] = React.useState(emptyOutput);

  const [codeSize, setCodeSize] = React.useState(12);

  const [searchQuery, setSearchQuery] = useState('');

  const [programInfo, setProgramInfo] = React.useState<ProgramInfoInterface>(
    {}
  );

  const [stepIndex, setStepIndex] = React.useState(0);

  /**
   * This sets the proof to the default proof.
   */
  const [proof, setProof] = useState<Uint8Array | null>(null);

  /**
   * Determines when to show the debug menu
   */
  const [showDebug, setShowDebug] = useState(false);

  const [operandValue, setOperandValue] = useState(
    localStorage.getItem(LOCAL_STORAGE.OPERAND_VALUE) ?? ''
  );
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [disableForm, setDisableForm] = useState(false);

  const [stackOutputValue, setStackOutputValue] = useState('');
  const [isStackOutputVisible, setIsStackOutputVisible] = useState(true);
  const [isCodeEditorVisible, setIsCodeEditorVisible] = useState(false);
  const [codeUploadContent, setCodeUploadContent] = useState(
    localStorage.getItem(LOCAL_STORAGE.CODE_UPLOAD_CONTENT) ?? ''
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [adviceValue, setAdviceValue] = useState(
    localStorage.getItem(LOCAL_STORAGE.ADVICE_VALUE) ?? ''
  );
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

  const handleDownloadCode = () => {
    console.log('asdfasdfadsf');
    if (midenCodeRef.current) {
      midenCodeRef.current.downloadCode();
    }
  };

  useLayoutEffect(() => {
    const savedCode = localStorage.getItem(LOCAL_STORAGE.MIDEN_CODE);
    const savedCodeSize = localStorage.getItem(LOCAL_STORAGE.MIDEN_CODE_SIZE);
    const jsonEditorVisible =
      localStorage.getItem(LOCAL_STORAGE.JSON_EDITOR_VISIBLE) ?? 'false';
    const onboardingShown =
      localStorage.getItem(LOCAL_STORAGE.ONBOARDING_SHOWN) ?? 'false';

    if (jsonEditorVisible !== null) {
      setIsCodeEditorVisible(JSON.parse(jsonEditorVisible));
    }

    if (onboardingShown) {
      setIsDialogOpen(!JSON.parse(onboardingShown));
    }

    if (savedCode) {
      setCode(savedCode);
    }
    if (savedCodeSize) {
      setCodeSize(Number(savedCodeSize));
    }
  }, []);

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
    setDebugOutput(null);
  }

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  const executeDebug = async (command: DebugCommand, params?: bigint) => {
    try {
      if (!debugExecutor) {
        throw new Error('debugExecutor is undefined');
      }
      // If the command is rewind and the output is 'Debugging session started', do nothing
      // There is a bug that lets the DebugExecutor freeze when the rewind command
      // is called at start
      if (
        output == 'Debugging session started' &&
        command == DebugCommand.Rewind
      ) {
        return;
      }
      if (typeof params !== 'undefined') {
        const debugOutput: DebugOutput = debugExecutor.execute(command, params);
        console.log('memory', formatMemory(debugOutput.memory));
        console.log('stack', debugOutput.stack);

        setOutput(formatDebuggerOutput(debugOutput));
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

    // reset the output
    setOutput(emptyOutput);

    localStorage.setItem(LOCAL_STORAGE.SELECTED_EXAMPLE_ITEM, exampleChange);

    const value = exampleChange;

    // set the current example to the selected one
    if (value === 'addition') {
      setInputs(exampleInput);
      setCode(exampleCode);
      setOutput(emptyOutput);
      return;
    }

    // this is hack and we need to change it.
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
      setCodeUploadContent(await example_code[0]);
    }
  };

  const handleSizeChange = async (newSize: number) => {
    setCodeSize(newSize);

    localStorage.setItem(LOCAL_STORAGE.MIDEN_CODE_SIZE, newSize.toString());
  };

  const hideAllRightSideLayout = () => {
    setIsProgramInfoVisible(false);
    setShowDebug(false);
    setIsProofInfoVisible(false);
    setIsStackOutputVisible(false);
  };

  useEffect(() => {
    let inputString;

    console.log('advice value changed', adviceValue, operandValue);

    if (isCodeEditorVisible) {
      setInputs(codeUploadContent);
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

    setInputs(inputString);

    localStorage.setItem(LOCAL_STORAGE.CODE_UPLOAD_CONTENT, inputString);
    localStorage.setItem(LOCAL_STORAGE.INPUT_STRING, inputString);
    localStorage.setItem(LOCAL_STORAGE.ADVICE_VALUE, adviceValue);
    localStorage.setItem(LOCAL_STORAGE.OPERAND_VALUE, operandValue);
  }, [operandValue, adviceValue]);

  useEffect(() => {
    setInputs(codeUploadContent);
    if (codeUploadContent) {
      localStorage.setItem(
        LOCAL_STORAGE.CODE_UPLOAD_CONTENT,
        codeUploadContent
      );
    }
  }, [codeUploadContent]);

  useEffect(() => {
    if (code) {
      localStorage.setItem(LOCAL_STORAGE.MIDEN_CODE, code);
    }
  }, [code]);

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

      // console.log('they camee here', inputs);

      if (inputObject.operand_stack) {
        setOperandValue(formatBeautifyNumbersArray(inputObject.operand_stack));
      }

      if (inputObject.advice_stack && inputObject.advice_stack.length > 0) {
        setAdviceValue(formatBeautifyNumbersArray(inputObject.advice_stack));

        setIsAdviceStackLayoutVisible(true);
      } // eslint-disable-next-line
    } catch (error: any) {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      // eslint-disable-line @typescript-eslint/no-explicit-any
      console.log('Inputs must be a valid JSON object: ${error.message}');
    } // eslint-disable-line @typescript-eslint/no-explicit-any
  }, [inputs]);

  const onInputPlusClick = () => {
    if (isAdviceStackLayoutVisible) {
      setAdviceValue('');
    } else {
      setAdviceValue('0');
    }
    setIsAdviceStackLayoutVisible(!isAdviceStackLayoutVisible);
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

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    localStorage.setItem(LOCAL_STORAGE.ONBOARDING_SHOWN, 'true');
  };

  const handleTakeTour = () => {
    setRun(true);
    setIsDialogOpen(false);
    localStorage.setItem(LOCAL_STORAGE.ONBOARDING_SHOWN, 'true');
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
    if (selectedTab === TEST_EXPERIMENT_TAB) return;

    setSelectedTab(TEST_EXPERIMENT_TAB);
    setIsProgramInfoVisible(true);
    setIsStackOutputVisible(true);
  };

  const onInstructionClick = () => {
    setSelectedTab(INSTRUCTIONS_TAB);
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

        const inputCheck = checkInputs(inputs);

        if (!inputCheck.isValid) {
          setOutput(inputCheck.errorMessage);
          toast.error('Execution failed');
          hideAllRightSideLayout();
          setProgramInfo({ error: inputCheck.errorMessage });
          setIsProgramInfoVisible(true);
          return;
        }
        try {
          const start = Date.now();

          console.log('the data for program issss', code);

          const { program_hash, stack_output, cycles, trace_len }: Outputs =
            run_program(code, inputs);

          hideAllRightSideLayout();

          setStackOutputValue(stack_output.toString());
          setOutput(`{
            "stack_output" : [${stack_output.toString()}],
            "trace_len" : ${trace_len}
            }`);

          setProgramInfo({
            program_hash: program_hash,
            cycles: cycles,
            trace_len: trace_len
          });
          setIsProgramInfoVisible(true);
          setIsStackOutputVisible(true);
          toast.success(`Execution successful in ${Date.now() - start} ms`);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          hideAllRightSideLayout();
          setProgramInfo({ error: errorMessage });
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
  const proveProgram = useCallback(() => {
    setIsProcessing(true);
    disableDebug();
    toast.loading('Proving ...', { id: 'provingToast' });

    worker.onmessage = (e) => {
      console.log('Worker message:', e.data); // Log the message for debugging

      const { success, result, error } = e.data;

      if (success) {
        if (!result) {
          console.error('Result is undefined:', e.data);
          setOutput('Error: Result is undefined');
          toast.error('Error: Result is undefined', {
            id: 'provingToast'
          });
          setIsProcessing(false);
          return;
        }

        const { programInfo, output, proof, stackOutput, duration } = result;

        setStackOutputValue(stackOutput);
        setProgramInfo(programInfo);
        setOutput(output);
        toast.success(`Proving successful in ${duration} ms`, {
          id: 'provingToast'
        });

        hideAllRightSideLayout();

        if (proof) {
          setProof(proof);
          setIsProofInfoVisible(true);
          setIsStackOutputVisible(true);
        }

        setIsProgramInfoVisible(true);
      } else {
        setOutput(`Error: ${error}`);
        hideAllRightSideLayout();
        setProgramInfo({ error });
        setIsProgramInfoVisible(true);
        toast.error(`Error: ${error}`, {
          id: 'provingToast'
        });
      }

      setIsProcessing(false);
    };

    worker.postMessage({ code, inputs });
  }, [code, inputs]);

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
    localStorage.setItem(
      LOCAL_STORAGE.JSON_EDITOR_VISIBLE,
      JSON.stringify(true)
    );
    setIsCodeEditorVisible(true);
  };

  const onFormEditorClick = () => {
    localStorage.setItem(
      LOCAL_STORAGE.JSON_EDITOR_VISIBLE,
      JSON.stringify(false)
    );
    setIsCodeEditorVisible(false);
  };

  const onHelpClick = () => {
    if (selectedTab === HELP_TAB) return;

    setSelectedTab(HELP_TAB);
  };

  interface CustomTooltipProps {
    title: string;
    content: string;
    step: number;
    totalSteps: number;
    skipProps: TooltipRenderProps['primaryProps'];
    primaryProps: TooltipRenderProps['primaryProps'];
  }

  const customStyles = {
    options: {
      arrowColor: '#333',
      backgroundColor: '#201F28',
      overlayColor: '#201F28',
      primaryColor: '#201F28',
      textColor: '#FFF',
      width: 400,
      zIndex: 1000
    },
    tooltipContainer: {
      backgroundColor: '#1A1A1A',
      borderRadius: '0.5rem',
      color: '#FFF'
    },
    tooltipContent: {
      fontSize: '0.875rem',
      color: '#FFF'
    },
    buttonNext: {
      backgroundColor: '#0C0C0C',
      color: '#FFF',
      padding: '0.5rem 1rem',
      borderRadius: '8px'
    },
    buttonBack: {
      color: '#FFF',
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem'
    },
    buttonSkip: {
      color: '#FFF'
    },
    spotlight: {
      borderRadius: '0.5rem'
    }
  };

  const CustomTooltip: React.FC<
    CustomTooltipProps & { step: number; totalSteps: number }
  > = ({ title, content, step, totalSteps, skipProps, primaryProps }) => {
    // Function to handle the skip button click
    const handleSkip = (event: React.MouseEvent<HTMLButtonElement>) => {
      // Add your custom logic here
      console.log('Skip button clicked');

      // Call the provided onSkip function
      skipProps.onClick(event);
    };

    return (
      <div className="bg-[#201F28] p-4 rounded-lg">
        <div className="mb-2">
          <h3 className="text-base text-white font-bold">{title}</h3>
          <p className="text-sm text-secondary-1">{content}</p>
          <p className="text-sm text-[#9A6FFF] mt-2">{`${step}/${totalSteps} Steps`}</p>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handleSkip}
            className="text-sm text-[#B2B2B2] hover:underline"
          >
            Skip
          </button>
          <button
            onClick={primaryProps.onClick}
            className="bg-[#0C0C0C] text-white text-sm px-4 py-2 rounded-lg"
          >
            Next <span className="ml-1 text-accent-1">→</span>
          </button>
        </div>
      </div>
    );
  };

  interface CustomStep extends Step {
    stepNumber: number;
    totalSteps: number;
  }

  const steps: CustomStep[] = [
    {
      target: '.miden-code-layout',
      content: 'Here you can write Miden Assembly programs',
      title: 'Write your code',
      stepNumber: 1,
      totalSteps: 4,
      placement: 'right',
      disableBeacon: true
    },
    {
      target: '.input-code-layout',
      title: 'Inject your inputs',
      content: 'You can inject public and private inputs',
      stepNumber: 2,
      totalSteps: 4,
      disableBeacon: true
    },
    {
      target: '.example-drop-down',
      title: 'Explore the examples',
      content: 'Look at the examples to get a better understanding',
      stepNumber: 3,
      totalSteps: 4,
      placement: 'bottom'
    },
    {
      target: '.run-layout',
      title: 'Execute your programs',
      content: 'You can run, prove or even step through the program execution',
      stepNumber: 4,
      totalSteps: 4,
      placement: 'bottom'
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, type } = data;

    if (type === 'step:after' && action === 'next') {
      setStepIndex(index + 1);
    }
  };

  return (
    <div className="bg-primary h-full w-full overflow-y-hidden">
      <OnboardingDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onTakeTour={handleTakeTour}
      />
      <Joyride
        steps={steps}
        stepIndex={stepIndex}
        continuous={true}
        styles={customStyles}
        run={run}
        callback={handleJoyrideCallback}
        tooltipComponent={({ step, backProps, primaryProps, skipProps }) => (
          <CustomTooltip
            title={step.title as string}
            content={step.content as string}
            step={(step as CustomStep).stepNumber}
            totalSteps={(step as CustomStep).totalSteps}
            skipProps={skipProps}
            primaryProps={primaryProps}
          />
        )}
      />
      <Toaster />
      <div className="bg-secondary-main w-full flex px-4 py-4 sm:py-6 sm:px-16">
        <button onClick={onTestAndExperimentClick}>
          <h1
            className={classNames(
              'flex text-sm items-center font-semibold cursor-pointer relative pb-1',
              selectedTab === TEST_EXPERIMENT_TAB
                ? 'text-white after:content-[""] after:absolute after:bottom-[-16px] after:left-0 after:w-full after:h-0.5 after:bg-accent-1'
                : 'text-secondary-1 hover:text-white'
            )}
          >
            TEST & EXPERIMENT
          </h1>
        </button>

        <button onClick={onInstructionClick} className="ml-8 hidden sm:block">
          <h1
            className={classNames(
              'flex text-sm font-semibold cursor-pointer relative pb-1',
              selectedTab === INSTRUCTIONS_TAB
                ? 'text-white after:content-[""] after:absolute after:bottom-[-16px] after:left-0 after:w-full after:h-0.5 after:bg-accent-1'
                : 'text-secondary-1 hover:text-white'
            )}
          >
            INSTRUCTIONS
          </h1>
        </button>

        <button onClick={onHelpClick} className="ml-8">
          <h1
            className={classNames(
              'flex text-sm font-semibold cursor-pointer relative pb-1',
              selectedTab === HELP_TAB
                ? 'text-white after:content-[""] after:absolute after:bottom-[-16px] after:left-0 after:w-full after:h-0.5 after:bg-accent-1'
                : 'text-secondary-1 hover:text-white'
            )}
          >
            HELP
          </h1>
        </button>
      </div>

      {selectedTab === HELP_TAB && (
        <div className="flex bg-secondary-3 lg:px-4 pt-4 w-full h-full overflow-scroll">
          <ExplainerPage />
        </div>
      )}

      {selectedTab === INSTRUCTIONS_TAB && (
        <div className="p-12 h-full">
          <div className="flex">
            <h1 className="text-white text-xl mb-5 font-semibold">
              Miden Virtual Machine Instruction Set Reference
            </h1>
            <div className="ml-auto pr-8">
              <input
                type="text"
                name="search"
                id="search"
                value={searchQuery}
                autoComplete="off"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-secondary-3 bg-secondary-4 text-white  sm:text-sm rounded-xl w-60 focus:ring-accent-2 focus:border-accent-2"
                placeholder="Search for a keyword"
              />
            </div>
          </div>

          <InstructionTable searchQuery={searchQuery} />
        </div>
      )}

      {selectedTab === TEST_EXPERIMENT_TAB && (
        <div className="flex flex-col lg:flex-row lg:px-4 pt-4 w-full h-full overflow-y-auto">
          <div className="flex flex-col h-fit sm:h-full w-full lg:w-1/2 mr-0 px-3 sm:px-0 sm:mr-4">
            <div className="flex flex-col sm:h-3/6 rounded-lg border bg-primary border-secondary-4">
              <div className="h-14 flex items-center py-3 px-4">
                <SizeDropDown onSizeValueChange={handleSizeChange} />

                {/* <button
                  className="sm:flex hidden items-center hover:bg-secondary-8 mr-3 text-white text-xs font-normal border z-10 rounded-lg border-secondary-4 py-2 px-2.5"
                  onClick={runProgram}
                  disabled={isProcessing}
                >
                  <PlusIcon className="h-4 w-4 stroke-1 stroke-accent-1" />
                </button> */}
                <button
                  className="sm:flex hidden items-center hover:bg-secondary-8 mr-3 text-white text-xs font-normal border z-10 rounded-lg border-secondary-4 py-2 px-2.5"
                  onClick={handleDownloadCode}
                  disabled={isProcessing}
                >
                  <ArrowDownTrayIcon className="h-4 w-4 stroke-2 stroke-accent-1" />
                </button>
                <button
                  className="sm:flex hidden items-center hover:bg-secondary-8 text-white text-xs font-normal border z-10 rounded-lg border-secondary-4 py-2 px-2.5"
                  onClick={handleCopyClick}
                  disabled={isProcessing}
                >
                  <DocumentDuplicateIcon className="h-4 w-4 stroke-2 stroke-accent-1" />
                </button>

                <div className="w-px h-4 sm:flex hidden bg-secondary-4 ml-3 mr-3"></div>
                <div className="flex run-layout">
                  <button
                    className="flex items-center hover:bg-secondary-8 text-white text-xs font-normal border z-10 rounded-lg border-secondary-4 py-2 px-2.5"
                    onClick={runProgram}
                    disabled={isProcessing}
                  >
                    Run
                    <PlayIcon className="h-4 w-4 hover:bg-secondary-8 stroke-2 stroke-accent-1 ml-1.5" />
                  </button>
                  {!isMobile && (
                    <button
                      className="flex items-center ml-3 hover:bg-secondary-8 text-white text-xs font-normal border z-10 rounded-lg border-secondary-4 py-2 px-2.5"
                      onClick={startDebug}
                      disabled={isProcessing}
                    >
                      Debug
                    </button>
                  )}
                  <button
                    className="flex items-center hover:bg-secondary-8 ml-3 mr-3 sm:mr-0 text-white text-xs font-normal border z-10 rounded-lg border-secondary-4 py-2 px-2.5"
                    onClick={proveProgram}
                    disabled={isProcessing}
                  >
                    Prove
                  </button>
                </div>

                <div className="ml-auto example-drop-down">
                  <DropDown onExampleValueChange={handleSelectChange} />
                </div>
              </div>

              <div className="h-px bg-secondary-4"></div>
              <MidenEditor
                ref={midenCodeRef}
                value={code}
                codeSize={codeSize}
                showDebug={showDebug}
                onChange={setCode}
                executeDebug={executeDebug}
              />
            </div>

            <div className="mt-5">
              <div
                className={`flex w-full rounded-xl grow overflow-hidden border border-secondary-4 ${
                  isCodeEditorVisible ? 'h-56' : 'h-fit'
                }`}
              >
                <div className="flex flex-col w-full">
                  <div className="bg-secondary-main z-10 py-4 flex sticky top-0 text-secondary-7 items-center">
                    <h1 className="pl-5 text-left text-base font-normal">
                      Input
                    </h1>

                    <div className="flex ml-auto mr-5">
                      <button
                        onClick={!disableForm ? onFormEditorClick : undefined}
                        className={classNames(
                          'text-left mr-3 text-base font-normal',
                          !disableForm
                            ? 'cursor-pointer'
                            : 'cursor-not-allowed opacity-50',
                          !isCodeEditorVisible && !disableForm
                            ? 'text-white'
                            : 'text-secondary-6'
                        )}
                      >
                        <h1>Forms</h1>
                      </button>

                      <button onClick={onJSONEditorClick}>
                        <h1
                          className={classNames(
                            'text-left text-secondary-6 text-base font-normal cursor-pointer',
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

                  <div className="flex w-full overflow-auto input-code-layout">
                    {!isCodeEditorVisible && (
                      <div className="flex flex-col w-full pt-4">
                        <div className="flex justify-between w-full items-center border-none">
                          <div className="flex flex-col grow pl-4">
                            <label
                              htmlFor="input"
                              className={`text-sm text-secondary-7 font-normal transition-all ${
                                isInputFocused || operandValue
                                  ? 'text-xs top-0 text-green'
                                  : 'text-sm top-4'
                              }`}
                            >
                              Public Input
                            </label>
                            <input
                              type="text"
                              value={operandValue}
                              onChange={handleOperandValueChange}
                              onFocus={handleInputFocus}
                              onBlur={handleInputBlur}
                              className="bg-transparent w-full text-sm focus:ring-0 pl-0 text-accent-1 pt-2 pb-2 outline-none border-none"
                            />
                          </div>

                          <PlusIcon
                            onClick={onInputPlusClick}
                            className={classNames(
                              'h-6 w-6 ml-1.5 mr-3 hover:cursor-pointer',
                              isAdviceStackLayoutVisible
                                ? 'fill-accent-1'
                                : 'fill-secondary-6'
                            )}
                          />
                        </div>

                        <div className="h-px bg-secondary-4"></div>

                        {isAdviceStackLayoutVisible && (
                          <div className="flex flex-col justify-center h-fit mt-4 grow border-none ml-4">
                            <label
                              htmlFor="advicestack"
                              className={`text-sm text-secondary-7 font-normal transition-all ${
                                isAdviceFocused || adviceValue
                                  ? 'text-xs top-0 text-accent-1'
                                  : 'text-sm top-4'
                              }`}
                            >
                              Private Input
                            </label>
                            <input
                              type="text"
                              value={adviceValue}
                              onChange={handleAdviceValueChange}
                              onFocus={handleAdviceFocus}
                              onBlur={handleAdviceBlur}
                              className="bg-transparent w-full focus:ring-0 text-sm pl-0 text-accent-1 pt-2 pb-2 outline-none border-none"
                            />
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

          <div className="flex flex-col w-full lg:w-1/2 sm:gap-y-6 mt-4 mb-32 lg:mt-0">
            {isStackOutputVisible && (
              <div className="flex mx-3 sm:px-0">
                <OutputInfo output={stackOutputValue} />
              </div>
            )}

            {isProgramInfoVisible && (
              <div className="flex mt-4 lg:mt-0 mx-3 sm:px-0">
                <ProgramInfo programInfo={programInfo} />
              </div>
            )}

            {isProofInfoVisible && (
              <div className="flex mt-4 lg:mt-0 mx-3 sm:px-0">
                <ProofInfo proofText={proof} verifyProgram={verifyProgram} />
              </div>
            )}

            {showDebug && (
              <div className="flex mt-4 lg:mt-0 mx-3 sm:px-0">
                <DebugInfo debugOutput={debugOutput} />
              </div>
            )}
            {showDebug && debugOutput && (
              <div className="flex mt-4 lg:mt-0 mx-3 sm:px-0">
                <MemoryInfo debugOutput={debugOutput} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
