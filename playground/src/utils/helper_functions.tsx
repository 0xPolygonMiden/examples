import type { DebugOutput } from "miden-wasm";

/**
 * Helper function to get the example from the examples repo.
 */
export async function getExample(example: string) {
  const inputs = fetch(
    `https://raw.githubusercontent.com/0xPolygonMiden/examples/main/examples/${example}.inputs`
  );
  const masm = fetch(
    `https://raw.githubusercontent.com/0xPolygonMiden/examples/main/examples/${example}.masm`
  );
  return [(await inputs).text(), (await masm).text()];
}

/**
 * Helper interface as return object from the checking functions.
 */
export interface checkedData {
  isValid: boolean;
  errorMessage: string;
}

/**
 * Helper function to iterate over the inputs and check if they are valid.
 */
export function checkFields(jsonInput: JSON): checkedData {
  let returnValue: checkedData = { isValid: true, errorMessage: "" };

  for (const key in jsonInput) {
    if (key === "trace_len") {
      continue;
    }

    const checkFieldResult = checkField(jsonInput, key);
    if (!checkFieldResult.isValid) {
      returnValue = checkFieldResult;
      break;
    }
  }

  return returnValue;
}

/**
 * Helper function to check if a field contains at least one number and only numbers.
 */
export function checkField(jsonField: JSON, key: string): checkedData {
  const jsonInput = jsonField[key as keyof typeof jsonField];

  if (!Array.isArray(jsonInput)) {
    const errorMessage = `${key} must be an array of numbers.`;

    return { isValid: false, errorMessage: errorMessage };
  }

  if (
    Object.values(jsonInput).length === 0 ||
    Object.values(jsonInput).some(isNaN)
  ) {
    const errorMessage = `${key} must contain at least one number, 
and it can only contain numbers.`;

    return { isValid: false, errorMessage: errorMessage };
  }

  return { isValid: true, errorMessage: "" };
}

/**
 * We check the inputs and return true or false. We allow:
 * - an empty input, and
 * - a valid JSON object containing stack_init or advice_tape (or both)
 * if the values are numbers
 */
export function checkInputs(jsonString: string): checkedData {
  if (jsonString === "") {
    return { isValid: true, errorMessage: "" };
  }

  let jsonInput!: JSON;

  try {
    jsonInput = JSON.parse(jsonString);
  } catch (e: any) {// eslint-disable-line @typescript-eslint/no-explicit-any

    const errorMessage = `Miden VM Inputs need to be a valid JSON object:
${e.message}`;
    return { isValid: false, errorMessage: errorMessage };
  }

  if (
    !Object.keys(jsonInput).includes("stack_init") &&
    !Object.keys(jsonInput).includes("advice_tape")
  ) {
    const errorMessage = `Miden VM Inputs can be empty or 
we need either a stack_init or 
an advice_tape.`;

    return { isValid: false, errorMessage: errorMessage };
  }

  return checkFields(jsonInput);
}

/**
 * We check the outputs and return true or false. We allow:
 * - a valid JSON object containing stack_output (and overflows if present)
 * - only numbers as values
 */
export function checkOutputs(jsonString: string): checkedData {
  if (jsonString === "") {
    const errorMessage = `We need some outputs to verify the program.
Did you prove the program first?`;

    return { isValid: false, errorMessage: errorMessage };
  }

  let jsonOutput!: JSON;

  try {
    jsonOutput = JSON.parse(jsonString);
  } catch (e: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
    const errorMessage = `Miden VM Outputs need to be a valid JSON object:
${e.message}
Did you prove the program first?`;

    return { isValid: false, errorMessage: errorMessage };
  }

  if (!Object.keys(jsonOutput).includes("stack_output")) {
    const errorMessage = `We need some outputs to verify the program.
Did you prove the program first?`;

    return { isValid: false, errorMessage: errorMessage };
  }

  return checkFields(jsonOutput);
}

/**
 * Helper function to get next power of 2.
 */

export function nextPowerOf2(x: number): number {
  let power = 1;
  while (power < x) {
    power <<= 1;
  }
  return Math.max(power, 1024);
}

/**
 * Helper function to format the Debugger output.
 */
export function formatDebuggerOutput(debugOutput: DebugOutput): string {
  const output = `Clock: ${debugOutput.clk}
Stack: [${debugOutput.stack.toString()}]
Assembly Instruction: ${debugOutput.instruction ? debugOutput.instruction : ""}
Number of Operations: ${
    debugOutput.num_of_operations ? debugOutput.num_of_operations : ""
  }
Rel. Operation Index: ${
    debugOutput.operation_index ? debugOutput.operation_index : ""
  }
VM Operation: ${debugOutput.op ? debugOutput.op : ""}
Memory (Addr, Mem): ${formatMemory(debugOutput.memory)}
`;

  return output;
}

/**
 * Helper function to format the Memory in the Debug Output.
 */
export function formatMemory(memory: BigUint64Array): string {
  let output = "";
  for (let i = 0; i < memory.length; i += 5) {
    const memorySlice = memory.slice(i, i + 5);
    output += `[${memorySlice[0]}]: [${memorySlice[1]}, ${memorySlice[2]}, ${memorySlice[3]}, ${memorySlice[4]}] \n                    `;
  }
  return output;
}
