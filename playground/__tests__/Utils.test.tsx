import "@testing-library/jest-dom";
import { checkFields, checkField } from "../src/utils/helper_functions";

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
            [false, "cycles must be an array of numbers. \n\n\n"]);
    });
    
    it("should return false if the field is empty", async () => {
        expect(checkField(output_example_incl_errors_json, "empty")).toStrictEqual(
            [false, "empty must contain at least one number, \nand it can only contain numbers. \n\n"]);
    });

    it("should return false if the field contains a non-number", async () => {
        expect(checkField(output_example_incl_errors_json, "stack_output_non_number")).toStrictEqual(
            [false, "stack_output_non_number must contain at least one number, \nand it can only contain numbers. \n\n"]);
    });

    it("should return true if the field is valid", async () => {
        expect(checkField(output_example_incl_errors_json, "stack_output")).toStrictEqual(
            [true, ""]);
    });
});

/** Testing the checkFields function */
describe("checkFields function", () => {
    it("should return false if JSON contains errors", async () => {
        expect(checkFields(output_example_incl_errors_json)).toStrictEqual(
            /** expect that the loop breaks at the first incorrect Field (cycles should be skipped) */
            [false, "empty must contain at least one number, \nand it can only contain numbers. \n\n"]);
    });
    
    it("should return false if JSON is correct", async () => {
        expect(checkFields(output_example_correct_json)).toStrictEqual(
            [true, ""]);
    });
});
