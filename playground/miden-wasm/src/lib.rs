extern crate alloc;
use alloc::string::{String, ToString};
use alloc::vec::Vec;

mod utils_debug;
mod utils_input;
mod utils_program;
use miden_air::ExecutionOptions;
use miden_vm::{ExecutionProof, MemAdviceProvider, DefaultHost, ProvingOptions};
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen(getter_with_clone)]
#[derive(Deserialize, Serialize)]
pub struct Outputs {
    pub program_hash: String,
    pub stack_output: Vec<u64>,
    pub cycles: Option<usize>,
    pub trace_len: Option<usize>,
    pub overflow_addrs: Option<Vec<u64>>,
    pub proof: Option<Vec<u8>>,
}

/// Runs the Miden VM with the given inputs
#[wasm_bindgen]
pub fn run_program(code_frontend: &str, inputs_frontend: &str) -> Result<Outputs, JsValue> {
    let mut program = utils_program::MidenProgram::new(code_frontend, utils_program::DEBUG_OFF);
    program
        .compile_program()
        .map_err(|err| format!("Failed to compile program - {:?}", err))?;

    let mut inputs = utils_input::Inputs::new();
    inputs
        .deserialize_inputs(inputs_frontend)
        .map_err(|err| format!("Failed to deserialize inputs - {:?}", err))?;

    let host = DefaultHost::new(MemAdviceProvider::from(inputs.advice_provider));

    let execution_options = ExecutionOptions::default();

    let trace = miden_vm::execute(
        &program.program.unwrap(),
        inputs.stack_inputs,
        host,
        execution_options,
    )
    .map_err(|err| format!("Failed to generate execution trace - {:?}", err))?;

    let stack_output = trace.stack_outputs().stack().iter().map(|felt| felt.as_int()).collect();

    let result = Outputs {
        program_hash: program.program_info.unwrap().program_hash().to_string(),
        stack_output: stack_output,
        cycles: Some(trace.trace_len_summary().trace_len()),
        trace_len: Some(trace.get_trace_len()),
        overflow_addrs: None,
        proof: None,
    };

    Ok(result)
}

/// Proves the program with the given inputs
#[wasm_bindgen]
pub fn prove_program(code_frontend: &str, inputs_frontend: &str) -> Result<Outputs, JsValue> {
    let mut program = utils_program::MidenProgram::new(code_frontend, utils_program::DEBUG_OFF);
    program
        .compile_program()
        .map_err(|err| format!("Failed to compile program - {:?}", err))?;

    let mut inputs = utils_input::Inputs::new();
    inputs
        .deserialize_inputs(inputs_frontend)
        .map_err(|err| format!("Failed to deserialize inputs - {:?}", err))?;

    // default (96 bits of security)
    let proof_options = ProvingOptions::default();

    let host = DefaultHost::new(MemAdviceProvider::from(inputs.advice_provider));

    let stack_input_cloned = inputs.stack_inputs.clone();
    let (output, proof) = miden_vm::prove(
        &program.program.unwrap(),
        stack_input_cloned,
        host,
        proof_options,
    )
    .map_err(|err| format!("Failed to prove execution - {:?}", err))?;

    let stack_output = output.stack().iter().map(|felt| felt.as_int()).collect();
    let overflow_addrs = output.overflow_addrs().iter().map(|felt| felt.as_int()).collect::<Vec<_>>();

    let result = Outputs {
        program_hash: program.program_info.clone().unwrap().program_hash().to_string(),
        stack_output: stack_output,
        cycles: None,
        trace_len: Some(proof.stark_proof().trace_length()),
        overflow_addrs: Some(overflow_addrs),
        proof: Some(proof.to_bytes()),
    };

    miden_vm::verify(
        program.program_info.unwrap(),
        inputs.stack_inputs,
        output,
        proof,
    )
    .map_err(|err| format!("Failed to verify proof - {:?}", err))?;

    Ok(result)
}

/// Verifies the proof with the given inputs
#[wasm_bindgen]
pub fn verify_program(
    code_frontend: &str,
    inputs_frontend: &str,
    outputs_frontend: &str,
    proof: Vec<u8>,
) -> Result<u32, JsValue> {
    // we need to get the program info from the program
    let mut program = utils_program::MidenProgram::new(code_frontend, utils_program::DEBUG_OFF);
    program
        .compile_program()
        .map_err(|err| format!("Failed to compile program - {:?}", err))?;

    let proof = ExecutionProof::from_bytes(&proof)
        .map_err(|err| format!("Failed to deserialize proof - {}", err))?;

    let mut inputs = utils_input::Inputs::new();

    inputs
        .deserialize_inputs(inputs_frontend)
        .map_err(|err| format!("Failed to deserialize inputs - {}", err))?;
    inputs
        .deserialize_outputs(outputs_frontend)
        .map_err(|err| format!("Failed to deserialize outputs - {}", err))?;

    let result: u32 = miden_vm::verify(
        program.program_info.unwrap(),
        inputs.stack_inputs,
        inputs.stack_outputs,
        proof,
    )
    .map_err(|err| format!("Program failed verification! - {}", err))?;

    Ok(result)
}

// TESTS
// ================================================================================================

/// Basic tests for the Rust part
/// Tests are run with `cargo test`
#[test]
fn test_run_program() {
    let output = run_program(
        "begin
            push.1 push.2 add
        end",
        "",
    )
    .unwrap();
    assert_eq!(
        output.stack_output,
        vec![3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.trace_len, Some(64));
}

#[test]
fn test_run_program_with_std_lib() {
    let output = run_program(
        "use.std::math::u64

        begin
            push.1
            push.2
            exec.u64::max
        end",
        "",
    )
    .unwrap();
    assert_eq!(
        output.stack_output,
        vec![2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.trace_len, Some(64));
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
    assert_eq!(output.clk, 6);
    assert_eq!(output.op, Some("End".to_string()));
    assert_eq!(output.instruction, None);
    assert_eq!(output.num_of_operations, None);
    assert_eq!(output.operation_index, None);
    assert_eq!(
        output.stack,
        vec![3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.memory, Vec::<u64>::new());

    let mut debug_executor_2 = utils_debug::DebugExecutor::new(
        "begin
            push.1 push.2 add
        end",
        "",
    )
    .unwrap();

    // we test playing one more cycle
    let output = debug_executor_2.execute(utils_debug::DebugCommand::Play, Some(1));
    assert_eq!(output.clk, 1);
    assert_eq!(output.op, Some("Span".to_string()));
    assert_eq!(output.instruction, None);
    assert_eq!(output.num_of_operations, None);
    assert_eq!(output.operation_index, None);
    assert_eq!(
        output.stack,
        vec![0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.memory, Vec::<u64>::new());

    // we test playing one more cycle
    let output = debug_executor_2.execute(utils_debug::DebugCommand::Play, Some(1));
    assert_eq!(output.clk, 2);
    assert_eq!(output.op, Some("Pad".to_string()));
    assert_eq!(output.instruction, Some("\"push.1\"".to_string()));
    assert_eq!(output.num_of_operations, Some(2));
    assert_eq!(output.operation_index, Some(1));
    assert_eq!(
        output.stack,
        vec![0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.memory, Vec::<u64>::new());

    // we test playing one more cycle
    let output = debug_executor_2.execute(utils_debug::DebugCommand::Play, Some(1));
    assert_eq!(output.clk, 3);
    assert_eq!(output.op, Some("Incr".to_string()));
    assert_eq!(output.instruction, Some("\"push.1\"".to_string()));
    assert_eq!(output.num_of_operations, Some(2));
    assert_eq!(output.operation_index, Some(2));
    assert_eq!(
        output.stack,
        vec![1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.memory, Vec::<u64>::new());

    // we test playing one more cycle
    let output = debug_executor_2.execute(utils_debug::DebugCommand::Play, Some(1));
    assert_eq!(output.clk, 4);
    assert_eq!(output.op, Some("Push(2)".to_string()));
    assert_eq!(output.instruction, Some("\"push.2\"".to_string()));
    assert_eq!(output.num_of_operations, Some(1));
    assert_eq!(output.operation_index, Some(1));
    assert_eq!(
        output.stack,
        vec![2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.memory, Vec::<u64>::new());

    // we test playing one more cycle
    let output = debug_executor_2.execute(utils_debug::DebugCommand::Play, Some(1));
    assert_eq!(output.clk, 5);
    assert_eq!(output.op, Some("Add".to_string()));
    assert_eq!(output.instruction, Some("\"add\"".to_string()));
    assert_eq!(output.num_of_operations, Some(1));
    assert_eq!(output.operation_index, Some(1));
    assert_eq!(
        output.stack,
        vec![3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.memory, Vec::<u64>::new());

    // we test playing one more cycle
    let output = debug_executor_2.execute(utils_debug::DebugCommand::Play, Some(1));
    assert_eq!(output.clk, 6);
    assert_eq!(output.op, Some("End".to_string()));
    assert_eq!(output.instruction, None);
    assert_eq!(output.num_of_operations, None);
    assert_eq!(output.operation_index, None);
    assert_eq!(
        output.stack,
        vec![3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.memory, Vec::<u64>::new());

    // it should not play more cycles
    let output = debug_executor_2.execute(utils_debug::DebugCommand::Play, Some(1));
    assert_eq!(output.clk, 6);
    assert_eq!(output.op, Some("End".to_string()));
    assert_eq!(output.instruction, None);
    assert_eq!(output.num_of_operations, None);
    assert_eq!(output.operation_index, None);
    assert_eq!(
        output.stack,
        vec![3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.memory, Vec::<u64>::new());

    let mut debug_executor_with_breakpoint = utils_debug::DebugExecutor::new(
        "begin
            push.1 push.2 breakpoint add
        end",
        "",
    )
    .unwrap();
    let output = debug_executor_with_breakpoint.execute(utils_debug::DebugCommand::PlayAll, None);

    // we test if it plays all the way to the end
    assert_eq!(output.clk, 5);
    assert_eq!(output.op, Some("Noop".to_string()));
    assert_eq!(output.instruction, Some("\"breakpoint\"".to_string()));
    assert_eq!(output.num_of_operations, Some(0));
    assert_eq!(output.operation_index, Some(1));
    assert_eq!(
        output.stack,
        vec![2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.memory, Vec::<u64>::new());
}

#[test]
fn test_prove_program() {
    let output = prove_program(
        "begin
            push.1 push.2 add
        end",
        "",
    )
    .unwrap();
    // this is the result of the stack output, 3
    assert_eq!(
        output.stack_output,
        vec![3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.trace_len, Some(64));

    // for the proof we have [0, 1] as overflow_addrs
    assert!(output.overflow_addrs.is_some());
    assert_eq!(output.overflow_addrs, Some(vec![0, 1]));

    // we expect a proof of []
    assert!(output.proof.is_some());
}

#[test]
fn test_verify_program() {
    let asm: &str = "begin
        push.1 push.2 add
    end";

    let input_str: &str = r#"
    {
        "operand_stack": ["0"],
        "advice_stack": ["0"]
    }"#;

    let output_str: &str = r#"
    {
        "stack_output": [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "overflow_addrs": [0, 1],
        "trace_len": 1024
    }"#;

    let prove_result = prove_program(asm, input_str).unwrap();

    let result = verify_program(asm, input_str, output_str, prove_result.proof.unwrap()).unwrap();

    assert_eq!(result, 96);
}
