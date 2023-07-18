use miden_objects::{
    notes::Note,
    transaction::{PreparedTransaction, ProvenTransaction},
};
use miden_tx::{mock::MockDataStore, TransactionExecutor, TransactionProver};
use miden_vm::{
    crypto::RpoDigest,
    math::{Felt, StarkField},
    ProgramInfo, ProofOptions, Word,
};
use serde::{Deserialize, Serialize};
use serde_wasm_bindgen::Serializer;
use wasm_bindgen::prelude::*;

// PREPARE TRANSACTION TYPES
// ================================================================================================

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

// PREPARE TRANSACTION
// ================================================================================================

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
        .take(1)
        .map(|note| note.proof().as_ref().unwrap().origin().clone())
        .collect::<Vec<_>>();

    let result: WasmPreparedTransaction = executor
        .prepare_transaction(data_store.account.id(), block_ref, &note_origins, None)
        .map_err(|err| format!("Failed to prepare transaction - {:?}", err))?
        .into();

    let serializer = Serializer::new().serialize_large_number_types_as_bigints(true);
    Ok(result.serialize(&serializer)?)
}

// PROVE TRANSACTION TYPES
// ================================================================================================

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

// PROVE TRANSACTION
// ================================================================================================

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
        .take(1)
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

// VERIFY TRANSACTION TYPES
// ================================================================================================

#[wasm_bindgen(getter_with_clone)]
#[derive(Serialize, Deserialize, Debug)]
pub struct WasmVerifyTransactionResult {
    pub success: bool,
    pub proof: Vec<u8>,
}

// VERIFY TRANSACTION
// ================================================================================================

#[wasm_bindgen]
pub fn verify_transaction() -> Result<WasmVerifyTransactionResult, JsValue> {
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
        .take(1)
        .map(|note| note.proof().as_ref().unwrap().origin().clone())
        .collect::<Vec<_>>();

    let prepared_transaction = executor
        .prepare_transaction(data_store.account.id(), block_ref, &note_origins, None)
        .map_err(|err| format!("Failed to prepare transaction - {:?}", err))?;

    let program_hash = prepared_transaction.tx_program().hash();
    let kernel = prepared_transaction.tx_program().kernel().clone();

    let prover = TransactionProver::new(ProofOptions::default());
    let proven_transaction = prover
        .prove_prepared_transaction(prepared_transaction)
        .map_err(|e| format!("Failed to prove prepared transaction - {:?}", e))?;

    let stack_inputs = proven_transaction.stack_inputs();
    let stack_outputs = proven_transaction.stack_outputs();
    let program_info = ProgramInfo::new(program_hash, kernel);
    let _result: u32 = miden_vm::verify(
        program_info,
        stack_inputs,
        stack_outputs,
        proven_transaction.proof().clone(),
    )
    .map_err(|err| format!("Program failed verification! - {}", err))?;

    Ok(WasmVerifyTransactionResult {
        success: true,
        proof: proven_transaction.proof().to_bytes(),
    })
}

// TESTS
// ================================================================================================

#[test]
fn test_verify_transaction() {
    println!("{:?}", verify_transaction().unwrap());
}
