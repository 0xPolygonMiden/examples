import "@testing-library/jest-dom";
import {
  addNewlineAfterWhitespace,
  checkFields,
  checkField,
  checkInputs,
  checkOutputs,
} from "../src/utils/helper_functions";

const output_example_incl_errors = `{
    "stack_output": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "overflows": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "cycles": 10,
    "empty": [],
    "stack_output_non_number": [1, 2, 3, 4, 5, 6, 7, 8, 9, "a"],
    "stack_output_2" : [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    }`;

const output_example_incl_errors_json = JSON.parse(output_example_incl_errors);

const output_example_correct = `{
    "stack_output": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "overflows": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "cycles": 10
    }`;

const output_example_correct_json = JSON.parse(output_example_correct);

/** Testing the checkField function */
describe("checkField function", () => {
  it("should return false if the field is not an array", async () => {
    expect(checkField(output_example_incl_errors_json, "cycles")).toStrictEqual(
      {
        isValid: false,
        errorMessage: "cycles must be an array of numbers. \n\n\n",
      }
    );
  });

  it("should return false if the field is empty", async () => {
    expect(checkField(output_example_incl_errors_json, "empty")).toStrictEqual({
      isValid: false,
      errorMessage: `empty must contain at least one number, 
and it can only contain numbers. \n\n`,
    });
  });

  it("should return false if the field contains a non-number", async () => {
    expect(
      checkField(output_example_incl_errors_json, "stack_output_non_number")
    ).toStrictEqual({
      isValid: false,
      errorMessage: `stack_output_non_number must contain at least one number, 
and it can only contain numbers. \n\n`,
    });
  });

  it("should return true if the field is valid", async () => {
    expect(
      checkField(output_example_incl_errors_json, "stack_output")
    ).toStrictEqual({ isValid: true, errorMessage: "" });
  });
});

/** Testing the checkFields function */
describe("checkFields function", () => {
  it("should return false if JSON contains errors", async () => {
    expect(checkFields(output_example_incl_errors_json)).toStrictEqual(
      /** expect that the loop breaks at the first incorrect Field (cycles should be skipped) */
      {
        isValid: false,
        errorMessage: `empty must contain at least one number, 
and it can only contain numbers. \n\n`,
      }
    );
  });

  it("should return false if JSON is correct", async () => {
    expect(checkFields(output_example_correct_json)).toStrictEqual({
      isValid: true,
      errorMessage: "",
    });
  });
});

/** Testing the checkInputs function */
const incorrect_json = `{`;
const correct_json_no_stack_or_advice = `{
    "stack": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}`;
const correct_input = `{
    "stack_init": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "advice_tape": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}`;

describe("checkInputs function", () => {
  it("should return true if inputs are empty", async () => {
    expect(checkInputs("")).toStrictEqual({ isValid: true, errorMessage: "" });
  });

  it("should return false if input is incorrect JSON", async () => {
    expect(checkInputs(incorrect_json)).toStrictEqual({
      isValid: false,
      errorMessage: `Miden VM Inputs need to be a valid JSON object:
Expected property name or '}' in JSON at position 1`,
    });
  });

  it("should return false if neither 'stack_init' nor 'advice_tape' is there", async () => {
    expect(checkInputs(correct_json_no_stack_or_advice)).toStrictEqual({
      isValid: false,
      errorMessage: `Miden VM Inputs can be empty or 
we need either a stack_init or 
an advice_tape.`,
    });
  });

  it("should return true if input is correct", async () => {
    expect(checkInputs(correct_input)).toStrictEqual({
      isValid: true,
      errorMessage: "",
    });
  });
});

/** Testing the checkOutputs function */
const empty_proof = new Uint8Array(0);
const proof = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
const correct_json_no_stack_outputs = `{
    "stack": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}`;

describe("checkOutputs function", () => {
  it("should return false if outputs are empty", async () => {
    expect(checkOutputs("", proof)).toStrictEqual({
      isValid: false,
      errorMessage: `We need some outputs to verify the program.
Did you prove the program first?`,
    });
  });

  it("should return false if proof is empty", async () => {
    expect(checkOutputs(output_example_correct, empty_proof)).toStrictEqual({
      isValid: false,
      errorMessage: `The proof is empty.
Did you prove the program first?`,
    });
  });

  it("should return false if outputs is incorrect JSON", async () => {
    expect(checkOutputs(incorrect_json, proof)).toStrictEqual({
      isValid: false,
      errorMessage: `Miden VM Outputs need to be a valid JSON object:
Expected property name or '}' in JSON at position 1
Did you prove the program first?`,
    });
  });

  it("should return false if 'stack_outputs' is missing", async () => {
    expect(checkOutputs(correct_json_no_stack_outputs, proof)).toStrictEqual({
      isValid: false,
      errorMessage: `We need some outputs to verify the program.
Did you prove the program first?`,
    });
  });

  it("should return true if input is correct", async () => {
    expect(checkOutputs(output_example_correct, proof)).toStrictEqual({
      isValid: true,
      errorMessage: "",
    });
  });
});

/** Testing the addNewlineAfterWhitespace function */

const testStr = 'This is a [test string] with some\nwhitespace.';
describe("addNewlineAfterWhitespace function", () => {
  it("should do what it is told", async () => {
    expect(addNewlineAfterWhitespace(testStr)).toStrictEqual(`This
is
a
[test string]
with
some
whitespace.`
    );
  });
});
