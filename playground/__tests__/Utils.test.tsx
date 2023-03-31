import "@testing-library/jest-dom";
import {
  checkInputs,
  checkOutputs,
} from "../src/utils/helper_functions";

const output_example_incl_errors = `{
    "stack_output": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "overflows": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "trace_len": 10,
    "empty": [],
    "stack_output_non_number": [1, 2, 3, 4, 5, 6, 7, 8, 9, "a"],
    "stack_output_2" : [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    }`;

const output_example_incl_errors_json = JSON.parse(output_example_incl_errors);

const output_example_correct = `{
    "stack_output": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "overflows": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "trace_len": 10
    }`;

const output_example_correct_json = JSON.parse(output_example_correct);

/** Testing the checkInputs function */
const incorrect_json = `{`;
const emptyJson = '{}';
const correct_json_no_stack_or_advice = `{
    "stack": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}`;
const correct_input = `{
    "operand_stack": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "advice_stack": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}`;

describe("checkInputs function", () => {
  it("should return true if inputs are empty", async () => {
    expect(checkInputs("")).toStrictEqual({ isValid: true, errorMessage: "" });
  });

  it("should return false if input is incorrect JSON", async () => {
    expect(checkInputs(incorrect_json)).toStrictEqual({
      isValid: false,
      errorMessage: "Inputs must be a valid JSON object: Unexpected end of JSON input",
    });
  });

  it("should return false if neither 'operand_stack' nor 'advice_stack' is there", async () => {
    expect(checkInputs(emptyJson)).toStrictEqual({
      isValid: false,
      errorMessage: `Miden VM Inputs can be empty or
we need either a operand_stack or
an advice_stack.`,
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
const correct_json_no_stack_outputs = `{
    "stack": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}`;

describe("checkOutputs function", () => {
  it("should return false if outputs are empty", async () => {
    expect(checkOutputs("")).toStrictEqual({
      isValid: false,
      errorMessage: `We need some outputs to verify the program.
Did you prove the program first?`,
    });
  });


  it("should return false if outputs is incorrect JSON", async () => {
    expect(checkOutputs(incorrect_json)).toStrictEqual({
      isValid: false,
      errorMessage: `Miden VM Outputs need to be a valid JSON object:
Expected property name or '}' in JSON at position 1
Did you prove the program first?`,
    });
  });

  it("should return false if 'stack_outputs' is missing", async () => {
    expect(checkOutputs(correct_json_no_stack_outputs)).toStrictEqual({
      isValid: false,
      errorMessage: `We need some outputs to verify the program.
Did you prove the program first?`,
    });
  });

  it("should return true if input is correct", async () => {
    expect(checkOutputs(output_example_correct)).toStrictEqual({
      isValid: true,
      errorMessage: "",
    });
  });
});
