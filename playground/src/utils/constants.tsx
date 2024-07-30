export const exampleInput = `{
    "operand_stack": ["0"],
    "advice_stack": ["0"]
}`;

export const exampleCode = `# This is a basic program that pushes 1 and 2 onto the stack and adds them.
# The result is then pushed onto the stack.

begin
  push.1
  push.2
  add
end`;

export const emptyOutput = '\n \n \n \n \n \n \n \n';

export const LOCAL_STORAGE = {
  MIDEN_CODE: 'miden_code',
  SELECTED_EXAMPLE_ITEM: 'selected_example_item',
  MIDEN_CODE_SIZE: 'miden_code_size',
  CODE_UPLOAD_CONTENT: 'code_upload_content',
  JSON_EDITOR_VISIBLE: 'json_editor_visible',
  ADVICE_VALUE: 'advice_value',
  OPERAND_VALUE: 'operand_value',
  INPUT_STRING: 'input_string',
  ONBOARDING_SHOWN: 'onboarding_shown'
};
