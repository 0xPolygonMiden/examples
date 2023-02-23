use miden::{Assembler, ProgramInputs, ProofOptions};
use wasm_bindgen::prelude::*;

/// We derive Deserialize/Serialize so we can persist app state on shutdown.
#[derive(serde::Deserialize, serde::Serialize)]
pub struct InputFile {
    pub stack_init: Option<Vec<String>>,
    pub advice_tape: Option<Vec<String>>,
}

/// Creates a `ProgramInputs` struct for Miden VM from the specified inputs.
fn get_program_inputs(stack_init: &[u64], advice_tape: &[u64]) -> ProgramInputs {
    ProgramInputs::new(&stack_init, &advice_tape, Vec::new()).unwrap()
}

/// Parse stack_init vector of strings to a vector of u64
fn get_stack_init(inputs: &InputFile) -> Vec<u64> {
    inputs.stack_init
        .as_ref()
        .unwrap_or(&vec![])
        .iter()
        .map(|v| v.parse::<u64>().unwrap())
        .collect::<Vec<u64>>()
}

/// Parse advice_tape vector of strings to a vector of u64
fn get_advice_tape(inputs: &InputFile) -> Vec<u64> {
    inputs.advice_tape
        .as_ref()
        .unwrap_or(&vec![])
        .iter()
        .map(|v| v.parse::<u64>().unwrap())
        .collect::<Vec<u64>>()
}

/// Runs the Miden VM with the given inputs
#[wasm_bindgen]
pub fn run_program(asm: &str, inputs_frontend: &str, output_count: u16) -> Vec<u64> {

    let assembler = Assembler::new();
    let program = assembler.compile(&asm).expect("Could not compile source");
    
    let mut stack_init = <Vec<u64>>::new();
    let mut advice_tape = <Vec<u64>>::new();

    if inputs_frontend.trim().is_empty() == false {
        let inputs_des: InputFile = serde_json::from_str(&inputs_frontend)
        .map_err(|err| format!("Failed to deserialize input data - {}", err)).unwrap();
        
        stack_init = get_stack_init(&inputs_des);
        advice_tape = get_advice_tape(&inputs_des);
    } 

    let inputs = get_program_inputs(&stack_init, &advice_tape); 

    let trace = miden::execute(
        &program,
        &inputs,
    )
    .map_err(|err| format!("Failed to generate exection trace = {:?}, and advice_tape = {:?}", err, advice_tape)).unwrap();
    
    trace.program_outputs().stack_outputs(output_count as usize).to_vec()
}

/// Proves the program with the given inputs
#[wasm_bindgen]
pub fn prove_program(asm: &str, inputs_frontend: &str, output_count: u16) -> Vec<u64> {

    let assembler = Assembler::new();
    let program = assembler.compile(&asm).expect("Could not compile source");
    
    let mut stack_init = <Vec<u64>>::new();
    let mut advice_tape = <Vec<u64>>::new();

    // TODO: We must catch all cases of inputs. Input can be not a valid json,
    // input can be empty, stack_init can be empty, advice_tape can be empty. And all combinations.
    if inputs_frontend.trim().is_empty() == false {
        let inputs_des: InputFile = serde_json::from_str(&inputs_frontend)
        .map_err(|err| format!("Failed to deserialize input data - {}", err)).unwrap();
        
        stack_init = get_stack_init(&inputs_des);
        advice_tape = get_advice_tape(&inputs_des);
    } 

    let inputs = get_program_inputs(&stack_init, &advice_tape); 

    // default (96 bits of security)
    let proof_options = ProofOptions::with_96_bit_security();

    let (output, _proof) = miden::prove(
        &program,
        &inputs,
        &proof_options,
    )
    .map_err(|err| format!("Failed to generate exection trace = {:?}, and advice_tape = {:?}", err, advice_tape)).unwrap();
    
    // We convert the outputs into one Vector because we can't return tuples in wasm-bindgen.
    // So the first n elements are the stack_outputs and the last n elements are the overflow_addrs.
    // TODO: We can somehow refactor to return structures in wasm-bindgen. But I didn't find a way yet.
    // There might be a way to return the ProgramOutputs struct even.
    let mut stack_outputs = output.stack_outputs(output_count as usize).to_vec();
    let mut overflow_addrs = output.overflow_addrs().to_vec();
    stack_outputs.append(&mut overflow_addrs);
    
    // TODO: We must return trace_info as well, but we can not handle that yet in Miden v0.3.
    // TODO: We must return the proof as well. But we can not handle that yet in the frontend.

    stack_outputs

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
    assert_eq!(output[0], 3)
}

#[test]
fn test_prove_program() {
    let output = prove_program(
        "begin
            push.1 push.2 add
        end",
        "",
        16,
    );
    // this is the result of the stack output, 3
    assert_eq!(output[0], 3);

    // for the proof we have [0, 1] as overflow_addrs
    assert_eq!(output[16], 0);
    assert_eq!(output[17], 1);
}
