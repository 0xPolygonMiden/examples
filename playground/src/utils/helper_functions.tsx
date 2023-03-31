import * as yup from 'yup';
import type { DebugOutput } from 'miden-wasm';

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

// Parser for advice_map
const adviceMapParser = yup
  .object()
  .test(
    'advice_map_keys',
    'advice_map keys must be 64-character-long hexadecimal strings',
    (value) => {
      if (!value) return true;
      return Object.keys(value).every((key) => /^[0-9a-fA-F]{64}$/.test(key));
    }
  )
  .test(
    'advice_map_values',
    'advice_map values must be arrays of numbers',
    (value) => {
      if (!value) return true;
      return Object.values(value).every(
        (arr) =>
          Array.isArray(arr) && arr.every((num) => typeof num === 'number')
      );
    }
  )
  .notRequired();

// Schema for operand_stack and advice_stack
const integerStringArraySchema = (inputName: string) => {
  return yup
    .mixed()
    .test(
      'is-integer',
      `${inputName} must contain strings representing valid numbers.`,
      (value) => {
        if (typeof value === 'string') {
          return Number.isInteger(parseInt(value ?? ''));
        }
        return false;
      }
    );
};

// Schema for merkle_store
const merkleStoreParser = yup
  .array()
  .of(
    yup
      .object()
      .shape({
        merkle_tree: yup
          .array()
          .of(
            yup
              .string()
              .length(64)
              .matches(
                /^[0-9a-fA-F]+$/,
                'merkle_tree leaf must be a 64-character hexadecimal string'
              )
              .required()
          )
          .notRequired(),
        sparse_merkle_tree: yup
          .array()
          .of(
            yup.tuple([
              yup.number().required(),
              yup
                .string()
                .length(64)
                .matches(
                  /^[0-9a-fA-F]+$/,
                  'sparse_merkle_tree leaf must be a 64-character hexadecimal string'
                )
                .required()
            ])
          )
          .notRequired()
      })
      .test(
        'no_additional_properties',
        "merkle_store can only contain 'merkle_tree' or 'sparse_merkle_tree' objects",
        (value) => {
          const allowedProperties = ['merkle_tree', 'sparse_merkle_tree'];
          const objectKeys = Object.keys(value);
          return objectKeys.every((key) => allowedProperties.includes(key));
        }
      )
  )
  .notRequired();

// Schema for the whole input
const inputSchema = yup
  .object()
  .shape({
    operand_stack: yup
      .array()
      .of(integerStringArraySchema('operand_stack'))
      .notRequired(),
    advice_stack: yup
      .array()
      .of(integerStringArraySchema('advice_stack'))
      .notRequired(),
    advice_map: adviceMapParser,
    merkle_store: merkleStoreParser
  })
  .noUnknown(
    "Only 'operand_stack', 'advice_stack', 'advice_map', and 'merkle_store' are allowed at the root level."
  );


export const checkInputs = (
  inputString: string
): checkedData => {
  // Short circuit if the input is empty
  if (inputString === '') {
    return { isValid: true, errorMessage: '' };
  }

  // Parse the input string to JSON
  let input: JSON;
  try {
    input = JSON.parse(inputString);
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    const errorMessage = `Inputs must be a valid JSON object: ${error.message}`;
    return { isValid: false, errorMessage: errorMessage };
  }

  try {
    inputSchema.validateSync(input, { strict: true, stripUnknown: false });
    return { isValid: true, errorMessage: '' };
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return { isValid: false, errorMessage: `Invalid inputs: ${error.message}` };
  }
};

const outputSchema = yup.object().shape({
  stack_output: yup.array().of(yup.number().integer().min(0)).required(),
  overflow_addrs: yup.array().of(yup.number().integer().min(0)).notRequired(),
  trace_len: yup.number().integer().min(0).optional(),
});

/**
 * We check the outputs and return true or false. We allow:
 * - a valid JSON object containing stack_output (and overflows if present)
 * - only numbers as values
 */
export function checkOutputs(jsonString: string): checkedData {
  if (jsonString === '') {
    const errorMessage = `We need some outputs to verify the program. Did you prove the program first?`;
    return { isValid: false, errorMessage: errorMessage };
  }

  // Parse the json output
  let jsonOutput!: JSON;
  try {
    jsonOutput = JSON.parse(jsonString);
  } catch (e: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    const errorMessage = `Miden VM Outputs need to be a valid JSON object:
${e.message}
Did you prove the program first?`;
    return { isValid: false, errorMessage: errorMessage };
  }

  try {
    outputSchema.validateSync(jsonOutput, { strict: true, stripUnknown: false });
    return { isValid: true, errorMessage: '' };
  } catch(error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return { isValid: false, errorMessage: `Invalid outputs: ${error.message}` };
  }
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
Assembly Instruction: ${debugOutput.instruction ? debugOutput.instruction : ''}
Number of Operations: ${
    debugOutput.num_of_operations ? debugOutput.num_of_operations : ''
  }
Rel. Operation Index: ${
    debugOutput.operation_index ? debugOutput.operation_index : ''
  }
VM Operation: ${debugOutput.op ? debugOutput.op : ''}
Memory (Addr, Mem): ${formatMemory(debugOutput.memory)}
`;

  return output;
}

/**
 * Helper function to format the Memory in the Debug Output.
 */
export function formatMemory(memory: BigUint64Array): string {
  let output = '';
  for (let i = 0; i < memory.length; i += 5) {
    const memorySlice = memory.slice(i, i + 5);
    output += `[${memorySlice[0]}]: [${memorySlice[1]}, ${memorySlice[2]}, ${memorySlice[3]}, ${memorySlice[4]}] \n           `;
  }
  return output;
}
