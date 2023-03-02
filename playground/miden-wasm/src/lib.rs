use miden_vm::math::{Felt, FieldElement};
use miden_vm::{
    AdviceInputs, Assembler, Kernel, MemAdviceProvider, ProgramInfo, ProofOptions, StackInputs,
};
use wasm_bindgen::prelude::*;
extern crate console_error_panic_hook;

/// We derive Deserialize/Serialize so we can persist app state on shutdown.
#[derive(serde::Deserialize, serde::Serialize)]
pub struct InputFile {
    pub stack_init: Option<Vec<String>>,
    pub advice_tape: Option<Vec<String>>,
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
pub fn run_program(asm: &str, inputs_frontend: &str, output_count: u16) -> Vec<u64> {
    console_error_panic_hook::set_once();

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

    trace
        .stack_outputs()
        .stack_truncated(output_count as usize)
        .to_vec()
}

/// Proves the program with the given inputs
#[wasm_bindgen]
pub fn prove_program(asm: &str, inputs_frontend: &str, output_count: u16) -> Vec<u64> {
    console_error_panic_hook::set_once();

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

    let (output, _proof) = miden_vm::prove(&program, stack_input, advice_provider, proof_options)
        .map_err(|err| format!("Failed to generate exection trace = {:?}", err))
        .unwrap();

    // We convert the outputs into one Vector because we can't return tuples in wasm-bindgen.
    // So the first n elements are the stack_outputs and the last n elements are the overflow_addrs.
    // TODO: We can somehow refactor to return structures in wasm-bindgen. But I didn't find a way yet.
    // There might be a way to return the ProgramOutputs struct even.
    let mut stack_outputs = output.stack_truncated(output_count as usize).to_vec();
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
