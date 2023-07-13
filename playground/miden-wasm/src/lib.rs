mod utils_debug;
mod utils_input;
mod utils_program;
use miden_objects::{
    notes::Note,
    transaction::{PreparedTransaction, ProvenTransaction},
};
use miden_tx::{mock::MockDataStore, TransactionExecutor, TransactionProver};
use miden_vm::{
    crypto::RpoDigest,
    math::{Felt, StarkField},
    ExecutionProof, ProofOptions, Word,
};
use serde::{Deserialize, Serialize};
use serde_wasm_bindgen::Serializer;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(getter_with_clone)]
#[derive(Deserialize, Serialize)]
pub struct Outputs {
    pub stack_output: Vec<u64>,
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

    let trace = miden_vm::execute(
        &program.program.unwrap(),
        inputs.stack_inputs,
        inputs.advice_provider,
    )
    .map_err(|err| format!("Failed to generate execution trace - {:?}", err))?;

    let result = Outputs {
        stack_output: trace.stack_outputs().stack().to_vec(),
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
    let proof_options = ProofOptions::default();

    let stack_input_cloned = inputs.stack_inputs.clone();
    let (output, proof) = miden_vm::prove(
        &program.program.unwrap(),
        stack_input_cloned,
        inputs.advice_provider,
        proof_options,
    )
    .map_err(|err| format!("Failed to prove execution - {:?}", err))?;

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

pub struct Digest(pub Vec<u64>);

impl From<RpoDigest> for Digest {
    fn from(digest: RpoDigest) -> Self {
        Digest(digest.into_iter().map(|n| n.as_int()).collect::<Vec<_>>())
    }
}

impl From<Digest> for Vec<u64> {
    fn from(digest: Digest) -> Self {
        digest.0
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct WasmPreparedTransaction {
    pub account_id: u64,
    pub block_hash: Vec<u64>,
    pub block_number: u32,
    pub consumed_notes: Vec<WasmNote>,
    pub tx_script_root: Option<Vec<u64>>,
    pub tx_program_root: Vec<u64>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct WasmNote {
    pub script_root: Vec<u64>,
    pub inputs_hash: Vec<u64>,
    pub vault_hash: Vec<u64>,
    pub assets: Vec<Vec<u64>>,
    pub serial_num: Vec<u64>,
    pub metadata: Vec<u64>,
}

impl From<&Note> for WasmNote {
    fn from(note: &Note) -> Self {
        let assets = note
            .vault()
            .iter()
            .map(|x| {
                Word::from(*x)
                    .iter()
                    .map(|x| x.as_int())
                    .collect::<Vec<u64>>()
            })
            .collect();
        Self {
            script_root: Into::<Digest>::into(note.script().hash()).into(),
            inputs_hash: Into::<Digest>::into(note.inputs().hash()).into(),
            vault_hash: Into::<Digest>::into(note.vault().hash()).into(),
            assets,
            serial_num: note.serial_num().into_iter().map(|x| x.as_int()).collect(),
            metadata: Into::<Word>::into(note.metadata())
                .into_iter()
                .map(|x| x.as_int())
                .collect(),
        }
    }
}

impl From<PreparedTransaction> for WasmPreparedTransaction {
    fn from(tx: PreparedTransaction) -> Self {
        Self {
            account_id: tx.account().id().into(),
            block_hash: Into::<Digest>::into(tx.block_header().hash()).into(),
            block_number: tx.block_header().block_num().as_int() as u32,
            consumed_notes: tx.consumed_notes().notes().iter().map(Into::into).collect(),
            tx_script_root: tx
                .tx_script_root()
                .and_then(|x| Some(Into::<Digest>::into(x).into())),
            tx_program_root: Into::<Digest>::into(tx.tx_program().root().hash()).into(),
        }
    }
}

#[wasm_bindgen]
pub fn prepare_transaction() -> Result<JsValue, JsValue> {
    let data_store = MockDataStore::new();
    let mut executor = TransactionExecutor::new(data_store.clone());

    let account_id = data_store.account.id();
    executor
        .load_account(account_id)
        .map_err(|err| format!("Failed to load account - {:?}", err))?;

    let block_ref = data_store.block_header.block_num().as_int() as u32;
    let note_origins = data_store
        .notes
        .iter()
        .map(|note| note.proof().as_ref().unwrap().origin().clone())
        .collect::<Vec<_>>();

    let result: WasmPreparedTransaction = executor
        .prepare_transaction(data_store.account.id(), block_ref, &note_origins, None)
        .map_err(|err| format!("Failed to prepare transaction - {:?}", err))?
        .into();

    let serializer = Serializer::new().serialize_large_number_types_as_bigints(true);
    Ok(result.serialize(&serializer)?)
}

#[derive(Serialize, Deserialize, Debug)]
pub struct WasmProvenTransaction {
    pub account_id: u64,
    pub initial_account_hash: Vec<u64>,
    pub final_account_hash: Vec<u64>,
    pub consumed_notes: Vec<Vec<u64>>,
    pub created_notes: Vec<Vec<u64>>,
    pub tx_script_root: Option<Vec<u64>>,
    pub proof: Vec<u8>,
}

impl From<ProvenTransaction> for WasmProvenTransaction {
    fn from(proven_transaction: ProvenTransaction) -> WasmProvenTransaction {
        let consumed_notes = proven_transaction
            .consumed_notes()
            .iter()
            .map(|x| {
                Into::<[Felt; 8]>::into(*x)
                    .iter()
                    .map(|x| x.as_int())
                    .collect::<Vec<_>>()
            })
            .collect::<Vec<_>>();
        let created_notes = proven_transaction
            .created_notes()
            .iter()
            .map(|x| {
                Into::<[Felt; 8]>::into(*x)
                    .iter()
                    .map(|x| x.as_int())
                    .collect::<Vec<_>>()
            })
            .collect::<Vec<_>>();

        WasmProvenTransaction {
            account_id: proven_transaction.account_id().into(),
            initial_account_hash: Into::<Digest>::into(proven_transaction.initial_account_hash())
                .into(),
            final_account_hash: Into::<Digest>::into(proven_transaction.final_account_hash())
                .into(),
            consumed_notes,
            created_notes,
            tx_script_root: proven_transaction
                .tx_script_root()
                .and_then(|x| Some(Into::<Digest>::into(x).into())),
            proof: proven_transaction.proof().to_bytes(),
        }
    }
}

#[wasm_bindgen]
pub fn prove_transaction() -> Result<JsValue, JsValue> {
    let data_store = MockDataStore::new();
    let mut executor = TransactionExecutor::new(data_store.clone());

    let account_id = data_store.account.id();
    executor
        .load_account(account_id)
        .map_err(|err| format!("Failed to load account - {:?}", err))?;

    let block_ref = data_store.block_header.block_num().as_int() as u32;
    let note_origins = data_store
        .notes
        .iter()
        .map(|note| note.proof().as_ref().unwrap().origin().clone())
        .collect::<Vec<_>>();

    let prepared_transaction = executor
        .prepare_transaction(data_store.account.id(), block_ref, &note_origins, None)
        .map_err(|err| format!("Failed to prepare transaction - {:?}", err))?;

    let prover = TransactionProver::new(ProofOptions::default());
    let proven_transaction: WasmProvenTransaction = prover
        .prove_prepared_transaction(prepared_transaction)
        .map_err(|e| format!("Failed to prove prepared transaction - {:?}", e))?
        .into();

    let serializer = Serializer::new().serialize_large_number_types_as_bigints(true);
    Ok(proven_transaction.serialize(&serializer)?)
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
            push.1.0
            push.2.0
            exec.u64::checked_add
        end",
        "",
    )
    .unwrap();
    assert_eq!(
        output.stack_output,
        vec![0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
    assert_eq!(output.op, Some("Push(BaseElement(8589934590))".to_string()));
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
