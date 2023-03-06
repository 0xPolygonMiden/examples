mod expected_test_proof;
use miden_vm::math::{Felt, FieldElement};
use miden_vm::{
    AdviceInputs, Assembler, Kernel, MemAdviceProvider, ProgramInfo, ProofOptions, StackInputs,
};
use miden_vm::utils::Serializable;
use wasm_bindgen::prelude::*;
extern crate console_error_panic_hook;

/// We derive Deserialize/Serialize so we can persist app state on shutdown.
#[derive(serde::Deserialize, serde::Serialize)]
pub struct InputFile {
    pub stack_init: Option<Vec<String>>,
    pub advice_tape: Option<Vec<String>>,
}

#[wasm_bindgen(getter_with_clone)]
pub struct Outputs {
    pub stack_output: Vec<u64>, 
    pub trace_length: usize,
    pub program_info: Option<Vec<u8>>,
    pub overflow_addrs: Option<Vec<u64>>,
    pub proof: Option<Vec<u8>>,
}

// Parse stack_init vector of strings to a vector of u64
fn parse_advice_provider(advice_input_file: &InputFile) -> Result<MemAdviceProvider, String> {
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
fn parse_stack_inputs(stack_input_file: &InputFile) -> Result<StackInputs, String> {
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

/// Runs the Miden VM with the given inputs
#[wasm_bindgen]
pub fn run_program(asm: &str, inputs_frontend: &str, output_count: u16) -> Outputs {

    let assembler = Assembler::default();
    let program = assembler.compile(&asm).expect("Could not compile source");

    let mut stack_input = StackInputs::new([Felt::ZERO; 1].to_vec());
    let mut advice_provider = MemAdviceProvider::default();

    if inputs_frontend.trim().is_empty() == false {
        let inputs_des: InputFile = serde_json::from_str(&inputs_frontend)
            .map_err(|err| format!("Failed to deserialize input data - {}", err))
            .unwrap();

        stack_input = parse_stack_inputs(&inputs_des).unwrap();
        advice_provider = parse_advice_provider(&inputs_des).unwrap();
    }

    let trace = miden_vm::execute(&program, stack_input, advice_provider)
        .map_err(|err| format!("Failed to generate exection trace = {:?}", err))
        .unwrap();

    let result = Outputs{
        stack_output: trace.stack_outputs().stack_truncated(output_count as usize).to_vec(), 
        trace_length: trace.get_trace_len(),
        program_info: None,
        overflow_addrs: None,
        proof: None,
    };

    result
}

/// Proves the program with the given inputs
#[wasm_bindgen]
pub fn prove_program(asm: &str, inputs_frontend: &str, output_count: u16) -> Outputs {

    let assembler = Assembler::default();
    let program = assembler.compile(&asm).expect("Could not compile source");

    let mut stack_input = StackInputs::new([Felt::ZERO; 4].to_vec());
    let mut advice_provider = MemAdviceProvider::default();

    // TODO: We must catch all cases of inputs. Input can be not a valid json,
    // input can be empty, stack_init can be empty, advice_tape can be empty. And all combinations.
    if inputs_frontend.trim().is_empty() == false {
        let inputs_des: InputFile = serde_json::from_str(&inputs_frontend)
            .map_err(|err| format!("Failed to deserialize input data - {}", err))
            .unwrap();

        stack_input = parse_stack_inputs(&inputs_des).unwrap();
        advice_provider = parse_advice_provider(&inputs_des).unwrap();
    }

    // default (96 bits of security)
    let proof_options = ProofOptions::with_96_bit_security();

    let (output, proof) = miden_vm::prove(&program, stack_input, advice_provider, proof_options)
        .map_err(|err| format!("Failed to generate exection trace = {:?}", err))
        .unwrap();

    let program_hash = program.hash();
    let kernel = Kernel::default();
    let program_info = ProgramInfo::new(program_hash, kernel);

    let result = Outputs{
        stack_output: output.stack_truncated(output_count as usize).to_vec(), 
        trace_length: proof.stark_proof().trace_length(),
        program_info: Some(program_info.to_bytes()),
        overflow_addrs: Some(output.overflow_addrs().to_vec()),
        proof: Some(proof.to_bytes()),
    };

    result
}

/// Basic tests for the Rust part
/// Tests are run with `cargo test`
#[test]
fn test_run_program() {
    let output = run_program(
        "begin
            push.1 push.2 add
        end",
        "",
        1,
    );
    assert_eq!(output.stack_output, vec![3]);
    assert_eq!(output.trace_length, 1024);
}

#[test]
fn test_prove_program() {
    let output = prove_program(
        "begin
            push.1 push.2 add
        end",
        "",
        1,
    );
    // this is the result of the stack output, 3
    assert_eq!(output.stack_output, vec![3]);

    assert_eq!(output.trace_length, 1024);
    
   // for the proof we have [0, 1] as overflow_addrs
   assert_eq!(output.overflow_addrs.is_some(), true);
    assert_eq!(output.overflow_addrs, Some(vec![0, 1]));

    // we expect a proof of []
    assert_eq!(output.proof.is_some(), true);
    assert_eq!(output.proof, Some(expected_test_proof::EXPECTED_PROOF_BYTES.to_vec()));
}
