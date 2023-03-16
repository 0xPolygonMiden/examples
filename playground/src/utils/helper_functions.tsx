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
  
  return checkFields(jsonInput)
}

/**
 * We check the outputs and return true or false. We allow:
 * - a valid JSON object containing stack_output (and overflows if present)
 * - only numbers as values
 */
export function checkOutputs(
  jsonString: string,
  proof: Uint8Array
): checkedData {
  if (jsonString === "") {
    const errorMessage = `We need some outputs to verify the program.
Did you prove the program first?`;

    return { isValid: false, errorMessage: errorMessage };
  }

  if (proof.length === 0) {
    const errorMessage = `The proof is empty.
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

  return checkFields(jsonOutput)
}

/**
 * Helper function to format the debug output.
 */
export function addNewlineAfterWhitespace(str: string): string {
  let inSquareBrackets = false;
  let result = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '[') {
      inSquareBrackets = true;
    } else if (str[i] === ']') {
      inSquareBrackets = false;
    }
    if (!inSquareBrackets && /\s/.test(str[i])) {
      result += '\n';
    } else {
      result += str[i];
    }
  }
  return result;
}

