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
 * Helper function to iterate over the inputs and check if they are valid.
 */
export function checkFields(jsonInput: JSON): [boolean, string] {
  let returnValue : [boolean, string] = [true, ""];

  for ( const key in jsonInput ) {
    if (key === "cycles") {
      continue;
    }

    if (!checkField(jsonInput, key)[0]) {
      returnValue = [
        checkField(jsonInput, key)[0], 
        checkField(jsonInput, key)[1]
      ];
      break;
    }

  }

  return returnValue;
}

/**
 * Helper function to check if a field contains at least one number and only numbers.
 */
export function checkField(jsonField: JSON, key: string): [boolean, string] {
  
  const jsonInput = jsonField[key as keyof typeof jsonField];

  if (!Array.isArray(jsonInput)) {
    const errorMessage = `${key} must be an array of numbers. \n\n\n`;

    return [false, errorMessage];
  }

  if (
    Object.values(jsonInput).length === 0 ||
    Object.values(jsonInput).some(isNaN)
  ) {
    const errorMessage = `${key} must contain at least one number, 
and it can only contain numbers. \n\n`;

    return [false, errorMessage];
  }

  return [true, ""];
}
