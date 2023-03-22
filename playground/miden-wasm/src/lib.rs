mod expected_test_proof;
mod utils_debug;
mod utils_input;
mod utils_program;
use miden_vm::{ExecutionProof, ProofOptions};
use wasm_bindgen::prelude::*;
extern crate console_error_panic_hook;

#[wasm_bindgen(getter_with_clone)]
#[derive(serde::Deserialize, serde::Serialize)]
pub struct Outputs {
    pub stack_output: Vec<u64>,
    pub trace_len: Option<usize>,
    pub overflow_addrs: Option<Vec<u64>>,
    pub proof: Option<Vec<u8>>,
}

/// Runs the Miden VM with the given inputs
#[wasm_bindgen]
pub fn run_program(code_frontend: &str, inputs_frontend: &str) -> Outputs {
    console_error_panic_hook::set_once();

    let mut program = utils_program::MidenProgram::new(code_frontend, utils_program::DEBUG_OFF);
    program.compile_program().unwrap();

    let mut inputs = utils_input::Inputs::new();
    inputs.deserialize_inputs(inputs_frontend).unwrap();

    let trace = miden_vm::execute(
        &program.program.unwrap(),
        inputs.stack_inputs,
        inputs.advice_provider,
    )
    .map_err(|err| format!("Failed to generate exection trace = {:?}", err))
    .unwrap();

    let result = Outputs {
        stack_output: trace.stack_outputs().stack().to_vec(),
        trace_len: Some(trace.get_trace_len()),
        overflow_addrs: None,
        proof: None,
    };

    result
}

/// Proves the program with the given inputs
#[wasm_bindgen]
pub fn prove_program(code_frontend: &str, inputs_frontend: &str) -> Outputs {
    console_error_panic_hook::set_once();

    let mut program = utils_program::MidenProgram::new(code_frontend, utils_program::DEBUG_OFF);
    program.compile_program().unwrap();

    let mut inputs = utils_input::Inputs::new();

    inputs.deserialize_inputs(inputs_frontend).unwrap();

    // default (96 bits of security)
    let proof_options = ProofOptions::with_96_bit_security();

    let stack_input_cloned = inputs.stack_inputs.clone();
    let (output, proof) = miden_vm::prove(
        &program.program.unwrap(),
        stack_input_cloned,
        inputs.advice_provider,
        proof_options,
    )
    .map_err(|err| format!("Failed to generate exection trace = {:?}", err))
    .unwrap();

    let result = Outputs {
        stack_output: output.stack().to_vec(),
        trace_len: Some(proof.stark_proof().trace_length()),
        overflow_addrs: Some(output.overflow_addrs().to_vec()),
        proof: Some(proof.to_bytes()),
    };

    miden_vm::verify(
        program.program_info.unwrap(),
        inputs.stack_inputs,
        output,
        proof,
    )
    .map_err(|err| format!("Failed to verify proof at test verification = {:?}", err))
    .unwrap();

    result
}

/// Verifies the proof with the given inputs
#[wasm_bindgen]
pub fn verify_program(
    code_frontend: &str,
    inputs_frontend: &str,
    outputs_frontend: &str,
    proof: Vec<u8>,
) -> u32 {
    console_error_panic_hook::set_once();

    // we need to get the program info from the program
    let mut program = utils_program::MidenProgram::new(code_frontend, utils_program::DEBUG_OFF);
    program.compile_program().unwrap();

    let proof = ExecutionProof::from_bytes(&proof)
        .map_err(|err| format!("Failed to deserialize proof - {}", err))
        .unwrap();

    let mut inputs = utils_input::Inputs::new();

    inputs.deserialize_inputs(inputs_frontend).unwrap();
    inputs.deserialize_outputs(outputs_frontend).unwrap();

    let result: u32 = miden_vm::verify(
        program.program_info.unwrap(),
        inputs.stack_inputs,
        inputs.stack_outputs,
        proof,
    )
    .map_err(|err| format!("Program failed verification! - {}", err))
    .unwrap();

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
    );
    assert_eq!(
        output.stack_output,
        vec![3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.trace_len, Some(1024));
}

#[test]
fn test_run_program_with_std_lib() {
    let output = run_program(
        "use.std::math::u64

        begin
            push.1.0
            push.2.0
            exec.u64::checked_add
        end",
        "",
    );
    assert_eq!(
        output.stack_output,
        vec![0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.trace_len, Some(1024));
}

#[test]
fn test_debug_program() {
    let mut debug_executor = utils_debug::DebugExecutor::new(
        "begin
            push.1 push.2 add
        end",
        "",
    )
    .unwrap();
    let output = debug_executor.execute(utils_debug::DebugCommand::PlayAll, None);

    // we test if it plays all the way to the end
    assert_eq!(
        output,
        concat!(
            "clk=6, op=Some(End), asmop=None, fmp=1073741824, ",
            "stack=[3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], memory=[]"
        )
    );

    let mut debug_executor_2 = utils_debug::DebugExecutor::new(
        "begin
            push.1 push.2 add
        end",
        "",
    )
    .unwrap();

    // we test playing one more cycle
    let output = debug_executor_2.execute(utils_debug::DebugCommand::Play, Some(1));
    assert_eq!(
        output,
        concat!(
            "clk=1, op=Some(Span), asmop=None, fmp=1073741824, ",
            "stack=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], memory=[]"
        )
    );

    // we test playing one more cycle
    let output = debug_executor_2.execute(utils_debug::DebugCommand::Play, Some(1));
    assert_eq!(
        output,
        concat!(
            "clk=2, op=Some(Pad), ",
            "asmop=Some(AsmOpInfo { op: \"push.1\", num_cycles: 2, cycle_idx: 1 }), ",
            "fmp=1073741824, ",
            "stack=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], memory=[]"
        )
    );

    // we test playing one more cycle
    let output = debug_executor_2.execute(utils_debug::DebugCommand::Play, Some(1));
    assert_eq!(
        output,
        concat!(
            "clk=3, op=Some(Incr), ",
            "asmop=Some(AsmOpInfo { op: \"push.1\", num_cycles: 2, cycle_idx: 2 }), ", 
            "fmp=1073741824, ",
            "stack=[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], memory=[]"
        )
    );

    // we test playing one more cycle
    let output = debug_executor_2.execute(utils_debug::DebugCommand::Play, Some(1));
    assert_eq!(
        output,
        concat!(
            "clk=4, op=Some(Push(BaseElement(8589934590))), ", 
            "asmop=Some(AsmOpInfo { op: \"push.2\", num_cycles: 1, cycle_idx: 1 }), ",
            "fmp=1073741824, ",
            "stack=[2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], memory=[]"
        )
    );

    // we test playing one more cycle
    let output = debug_executor_2.execute(utils_debug::DebugCommand::Play, Some(1));
    assert_eq!(
        output,
        concat!(
            "clk=5, op=Some(Add), ",
            "asmop=Some(AsmOpInfo { op: \"add\", num_cycles: 1, cycle_idx: 1 }), ", 
            "fmp=1073741824, stack=[3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ", 
            "memory=[]"
        )
    );

    // we test playing one more cycle
    let output = debug_executor_2.execute(utils_debug::DebugCommand::Play, Some(1));
    assert_eq!(
        output,
        concat!(
            "clk=6, op=Some(End), asmop=None, fmp=1073741824, ",
            "stack=[3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], memory=[]"
        )
    );

    // it should not play more cycles
    let output = debug_executor_2.execute(utils_debug::DebugCommand::Play, Some(1));
    assert_eq!(
        output,
        concat!(
            "clk=6, op=Some(End), asmop=None, fmp=1073741824, ",
            "stack=[3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], memory=[]"
        )
    );
}

#[test]
fn test_prove_program() {
    let output = prove_program(
        "begin
            push.1 push.2 add
        end",
        "",
    );
    // this is the result of the stack output, 3
    assert_eq!(
        output.stack_output,
        vec![3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.trace_len, Some(1024));

    // for the proof we have [0, 1] as overflow_addrs
    assert_eq!(output.overflow_addrs.is_some(), true);
    assert_eq!(output.overflow_addrs, Some(vec![0, 1]));

    // we expect a proof of []
    assert_eq!(output.proof.is_some(), true);
    assert_eq!(
        output.proof,
        Some(expected_test_proof::EXPECTED_PROOF_BYTES.to_vec())
    );
}

#[test]
fn test_verify_program() {
    let asm: &str = "begin
        push.1 push.2 add
    end";

    let input_str: &str = r#"
    {
        "stack_init": ["0"],
        "advice_tape": ["0"]
    }"#;

    let output_str: &str = r#"
    {
        "stack_output": [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "overflow_addrs": [0, 1],
        "trace_len": 1024
    }"#;

    let proof = expected_test_proof::EXPECTED_PROOF_BYTES.to_vec();

    let result = verify_program(asm, input_str, output_str, proof);

    assert_eq!(result, 96);
}
