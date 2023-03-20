use miden_vm::{
    math::{Felt, FieldElement},
    AdviceInputs, MemAdviceProvider, StackInputs, StackOutputs,
};

/// We derive Deserialize/Serialize so we can persist app state on shutdown.
#[derive(serde::Deserialize, serde::Serialize)]
pub struct Outputs {
    pub stack_output: Vec<u64>,
    pub trace_len: Option<usize>,
    pub overflow_addrs: Option<Vec<u64>>,
    pub proof: Option<Vec<u8>>,
}

/// We derive Deserialize/Serialize so we can persist app state on shutdown.
#[derive(serde::Deserialize, serde::Serialize)]
pub struct InputFile {
    pub stack_init: Option<Vec<String>>,
    pub advice_tape: Option<Vec<String>>,
}

pub struct Inputs {
    pub stack_inputs: StackInputs,
    pub advice_provider: MemAdviceProvider,
    pub stack_outputs: StackOutputs,
}

impl Inputs {
    pub fn new() -> Self {
        Self {
            stack_inputs: StackInputs::new(vec![Felt::ZERO]),
            advice_provider: MemAdviceProvider::default(),
            stack_outputs: StackOutputs::new(vec![], vec![]),
        }
    }

    pub fn deserialize_inputs(&mut self, inputs: &str) -> Result<(), String> {
        match inputs.trim().is_empty() {
            true => Ok(()),
            false => {
                let inputs_des: InputFile =
                    serde_json::from_str(&inputs).map_err(|e| e.to_string())?;

                self.stack_inputs = self.parse_stack_inputs(&inputs_des).unwrap();
                self.advice_provider = self.parse_advice_provider(&inputs_des).unwrap();

                Ok(())
            }
        }
    }

    // Parse the outputs as str and return a vector of u64
    pub fn deserialize_outputs(&mut self, outputs_as_str: &str) -> Result<(), String> {
        let outputs_as_json: Outputs =
            serde_json::from_str(&outputs_as_str).map_err(|e| e.to_string())?;

        let outputs = StackOutputs::new(
            outputs_as_json.stack_output,
            outputs_as_json.overflow_addrs.unwrap_or(vec![]),
        );

        self.stack_outputs = outputs.clone();

        Ok(())
    }

    // Parse stack_init vector of strings to a vector of u64
    fn parse_advice_provider(
        &mut self,
        advice_input_file: &InputFile,
    ) -> Result<MemAdviceProvider, String> {
        let tape = advice_input_file
            .advice_tape
            .as_ref()
            .map(Vec::as_slice)
            .unwrap_or(&[])
            .iter()
            .map(|v| v.parse::<u64>().map_err(|e| e.to_string()))
            .collect::<Result<Vec<_>, _>>()?;
        let advice_inputs = AdviceInputs::default()
            .with_tape_values(tape)
            .map_err(|e| e.to_string())?;

        Ok(MemAdviceProvider::from(advice_inputs))
    }

    // Parse advice_tape vector of strings to a vector of u64
    fn parse_stack_inputs(&mut self, stack_input_file: &InputFile) -> Result<StackInputs, String> {
        let stack_inputs = stack_input_file
            .stack_init
            .as_ref()
            .map(Vec::as_slice)
            .unwrap_or(&[])
            .iter()
            .map(|v| v.parse::<u64>().map_err(|e| e.to_string()))
            .collect::<Result<Vec<_>, _>>()?;

        StackInputs::try_from_values(stack_inputs).map_err(|e| e.to_string())
    }
}

//#[test]
//fn test_parse_output() {
//    let output_str: &str = r#"
//    {
//        "stack_output": [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//        "overflow_addrs": [0, 1],
//        "trace_len": 1024
//    }"#;
//
//    let output: Outputs = parse_str_to_outputs(&output_str).unwrap();
//    assert_eq!(
//        output.stack_output,
//        vec![3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
//    );
//    assert_eq!(output.overflow_addrs, Some(vec![0, 1]));
//}