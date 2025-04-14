use crate::utils_input::Inputs;
use crate::utils_program::MidenProgram;
use crate::types::Outputs;

use miden_stdlib::StdLibrary;
use miden_vm::{DefaultHost, ProvingOptions, ExecutionProof};
use miden_processor::ExecutionOptions;
use alloc::string::String;
use alloc::vec::Vec;

const MAX_STACK_LENGTH: usize = 40;

pub fn run_program_native(code: &str, inputs_str: &str) -> Result<Outputs, String> {
    let mut program = MidenProgram::new(code, crate::utils_program::DEBUG_OFF);
    program.compile_program().map_err(|e| format!("{e:?}"))?;

    let mut input_data = Inputs::new();
    input_data.deserialize_inputs(inputs_str).map_err(|e| format!("{e:?}"))?;
    let stack_inputs = input_data.stack_inputs.clone();

    // fetch the stack and program inputs from the arguments
    let mut host = DefaultHost::new(input_data.advice_provider.clone());
    host.load_mast_forest(StdLibrary::default().mast_forest().clone()).unwrap();

    let exec_options = ExecutionOptions::default();

    let trace = miden_vm::execute(
        &program.program.unwrap(),
        stack_inputs,
        &mut host,
        exec_options,
    )
    .map_err(|e| format!("{e:?}"))?;

    Ok(Outputs {
        program_hash: trace.program_hash().to_string(),
        stack_output: trace.stack_outputs().iter().map(|f| f.as_int()).collect(),
        cycles: Some(trace.trace_len_summary().trace_len()),
        trace_len: Some(trace.get_trace_len()),
        proof: None,
    })
}

pub fn prove_program_native(code: &str, inputs_str: &str) -> Result<Outputs, String> {
    let mut program = MidenProgram::new(code, crate::utils_program::DEBUG_OFF);
    program.compile_program().map_err(|e| format!("{e:?}"))?;

    let mut inputs = Inputs::new();
    inputs.deserialize_inputs(inputs_str).map_err(|e| format!("{e:?}"))?;

    let proof_options = ProvingOptions::default();
    let mut host = DefaultHost::new(inputs.advice_provider.clone());

    let (output, proof) = miden_vm::prove(
        &program.program.unwrap(),
        inputs.stack_inputs.clone(),
        &mut host,
        proof_options,
    )
    .map_err(|e| format!("{e:?}"))?;

    miden_vm::verify(
        program.program_info.clone().unwrap(),
        inputs.stack_inputs,
        output.clone(),
        proof.clone(),
    )
    .map_err(|e| format!("Failed to verify proof: {e:?}"))?;

    Ok(Outputs {
        program_hash: program.program_info.unwrap().program_hash().to_string(),
        stack_output: output.stack_truncated(MAX_STACK_LENGTH).iter().map(|f| f.as_int()).collect(),
        cycles: None,
        trace_len: Some(proof.stark_proof().trace_info().length()),
        proof: Some(proof.to_bytes()),
    })
}

pub fn verify_program_native(
    code: &str,
    inputs_str: &str,
    outputs_str: &str,
    proof: Vec<u8>,
) -> Result<u32, String> {
    let mut program = MidenProgram::new(code, crate::utils_program::DEBUG_OFF);
    program.compile_program().map_err(|e| format!("{e:?}"))?;

    let mut inputs = Inputs::new();
    inputs.deserialize_inputs(inputs_str).map_err(|e| format!("{e:?}"))?;
    inputs.deserialize_outputs(outputs_str).map_err(|e| format!("{e:?}"))?;

    let proof = ExecutionProof::from_bytes(&proof).map_err(|e| format!("{e:?}"))?;

    miden_vm::verify(
        program.program_info.unwrap(),
        inputs.stack_inputs,
        inputs.stack_outputs,
        proof,
    )
    .map_err(|e| format!("Failed to verify: {e:?}"))
}

/// Basic tests for the Rust part
/// Tests are run with cargo test
#[test]
fn test_run_program() {
    let output = run_program_native(
        "begin
            push.1 push.2 add
            swap drop
        end",
        "",
    )
    .unwrap();
    assert_eq!(
        output.stack_output,
        vec![3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.trace_len, Some(64));
}

#[test]
fn test_run_program_with_std_lib() {
    let output = run_program_native(
        "use.std::math::u64

        begin
            push.1
            push.2
            exec.u64::max
            swap drop
        end",
        "",
    )
    .unwrap();
    assert_eq!(
        output.stack_output,
        vec![2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.trace_len, Some(64));
}

#[test]
fn test_prove_program() {
    let output = prove_program_native(
        "begin
            push.1 push.2 add
            swap drop
        end",
        "",
    )
    .unwrap();
    // this is the result of the stack output, 3
    assert_eq!(
        output.stack_output,
        vec![3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.trace_len, Some(64));

    // we expect a proof of []
    assert!(output.proof.is_some());
}

#[test]
fn test_verify_program() {
    let asm: &str = "begin
        push.1 push.2 add
        swap drop
    end";

    let input_str: &str = r#"
    {
        "operand_stack": ["0"],
        "advice_stack": ["0"]
    }"#;

    let output_str: &str = r#"
    {
        "stack_output": [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "trace_len": 1024
    }"#;

    let prove_result = prove_program_native(asm, input_str).unwrap();

    let result = verify_program_native(asm, input_str, output_str, prove_result.proof.unwrap()).unwrap();

    assert_eq!(result, 96);
}

#[test]
fn test_debug_program() {
    use crate::utils_debug::{DebugCommand, DebugExecutor};
    let mut debug_executor = DebugExecutor::new(
        "begin
            push.1
            push.2
            add
            push.1234567
            mem_store
        end",
        "",
    )
    .unwrap();
    let output = debug_executor.execute(DebugCommand::PlayAll, None);

    // we test if it plays all the way to the end
    assert_eq!(output.clk, 10);
    assert_eq!(output.op, Some("End".to_string()));
    assert_eq!(output.instruction, None);
    assert_eq!(output.num_of_operations, None);
    assert_eq!(output.operation_index, None);
    assert_eq!(
        output.stack,
        vec![0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.memory, vec![1234564, 0, 1234565, 0, 1234566, 0, 1234567, 3]);

    let mut debug_executor_2 = DebugExecutor::new(
        "begin
            push.1 push.2 add
            mem_store.1
        end",
        "",
    )
    .unwrap();

    // we test playing one more cycle
    let output = debug_executor_2.execute(DebugCommand::Play, Some(1));
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
    let output = debug_executor_2.execute(DebugCommand::Play, Some(1));
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
    let output = debug_executor_2.execute(DebugCommand::Play, Some(1));
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
    let output = debug_executor_2.execute(DebugCommand::Play, Some(1));
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
    let output = debug_executor_2.execute(DebugCommand::Play, Some(1));
    assert_eq!(output.clk, 5);
    assert_eq!(output.op, Some("Add".to_string()));
    assert_eq!(output.instruction, Some("\"add\"".to_string()));
    assert_eq!(output.num_of_operations, Some(1));
    assert_eq!(output.operation_index, Some(1));
    assert_eq!(
        output.stack,
        vec![3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.memory, Vec::<u64>::new());

    // we test playing one more cycle
    let output = debug_executor_2.execute(DebugCommand::Play, Some(1));
    assert_eq!(output.clk, 6);
    assert_eq!(output.op, Some("Pad".to_string()));
    assert_eq!(output.instruction, Some("\"mem_store.1\"".to_string()));
    assert_eq!(output.num_of_operations, Some(4));
    assert_eq!(output.operation_index, Some(1));
    assert_eq!(
        output.stack,
        vec![0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.memory, Vec::<u64>::new());

    // we test playing one more cycle
    let output = debug_executor_2.execute(DebugCommand::Play, Some(1));
    assert_eq!(output.clk, 7);
    assert_eq!(output.op, Some("Incr".to_string()));
    assert_eq!(output.instruction, Some("\"mem_store.1\"".to_string()));
    assert_eq!(output.num_of_operations, Some(4));
    assert_eq!(output.operation_index, Some(2));
    assert_eq!(
        output.stack,
        vec![1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.memory, Vec::<u64>::new());

    // we test playing one more cycle
    let output = debug_executor_2.execute(DebugCommand::Play, Some(1));
    assert_eq!(output.clk, 8);
    assert_eq!(output.op, Some("MStore".to_string()));
    assert_eq!(output.instruction, Some("\"mem_store.1\"".to_string()));
    assert_eq!(output.num_of_operations, Some(4));
    assert_eq!(output.operation_index, Some(3));
    assert_eq!(
        output.stack,
        vec![3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.memory, vec![0, 0, 1, 3, 2, 0, 3, 0]);

    // we test playing one more cycle
    let output = debug_executor_2.execute(DebugCommand::Play, Some(1));
    assert_eq!(output.clk, 9);
    assert_eq!(output.op, Some("Drop".to_string()));
    assert_eq!(output.instruction, Some("\"mem_store.1\"".to_string()));
    assert_eq!(output.num_of_operations, Some(4));
    assert_eq!(output.operation_index, Some(4));
    assert_eq!(
        output.stack,
        vec![0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.memory, vec![0, 0, 1, 3, 2, 0, 3, 0]);

    // we test playing one more cycle
    let output = debug_executor_2.execute(DebugCommand::Play, Some(1));
    assert_eq!(output.clk, 10);
    assert_eq!(output.op, Some("End".to_string()));
    assert_eq!(output.instruction, None);
    assert_eq!(output.num_of_operations, None);
    assert_eq!(output.operation_index, None);
    assert_eq!(
        output.stack,
        vec![0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.memory, vec![0, 0, 1, 3, 2, 0, 3, 0]);

    // it should not play more cycles
    let output = debug_executor_2.execute(DebugCommand::Play, Some(1));
    assert_eq!(output.clk, 10);
    assert_eq!(output.op, Some("End".to_string()));
    assert_eq!(output.instruction, None);
    assert_eq!(output.num_of_operations, None);
    assert_eq!(output.operation_index, None);
    assert_eq!(
        output.stack,
        vec![0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.memory, vec![0, 0, 1, 3, 2, 0, 3, 0]);

    // breakpoint doesn't work right now in the VM
    // let mut debug_executor_with_breakpoint = DebugExecutor::new(
    //     "begin
    //         push.1 push.2 breakpoint add
    //     end",
    //     "",
    // )
    // .unwrap();
    // let output = debug_executor_with_breakpoint.execute(DebugCommand::PlayAll, None);

    // // we test if it plays all the way to the end
    // assert_eq!(output.clk, 5);
    // assert_eq!(output.op, Some("Noop".to_string()));
    // assert_eq!(output.instruction, Some("\"breakpoint\"".to_string()));
    // assert_eq!(output.num_of_operations, Some(0));
    // assert_eq!(output.operation_index, Some(1));
    // assert_eq!(
    //     output.stack,
    //     vec![2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    // );
    // assert_eq!(output.memory, Vec::<u64>::new());
}