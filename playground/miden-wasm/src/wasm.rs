extern crate alloc;
use alloc::vec::Vec;

use wasm_bindgen::prelude::*;
use crate::backend::{run_program_native, prove_program_native, verify_program_native};
use crate::types::Outputs;
use serde::{Deserialize, Serialize};

#[wasm_bindgen(getter_with_clone)]
#[derive(Deserialize, Serialize)]
pub struct WasmOutputs {
    pub program_hash: String,
    pub stack_output: Vec<u64>,
    pub cycles: Option<usize>,
    pub trace_len: Option<usize>,
    pub proof: Option<Vec<u8>>,
}

// optional: automatic conversion
impl From<Outputs> for WasmOutputs {
    fn from(out: Outputs) -> Self {
        WasmOutputs {
            program_hash: out.program_hash,
            stack_output: out.stack_output,
            cycles: out.cycles,
            trace_len: out.trace_len,
            proof: out.proof,
        }
    }
}

#[wasm_bindgen]
pub fn run_program(code: &str, inputs: &str) -> Result<WasmOutputs, JsValue> {
    run_program_native(code, inputs)
        .map(Into::into)
        .map_err(|err| JsValue::from_str(&format!("Failed to run program: {:?}", err)))
}

#[wasm_bindgen]
pub fn prove_program(code: &str, inputs: &str) -> Result<WasmOutputs, JsValue> {
    prove_program_native(code, inputs)
        .map(Into::into)
        .map_err(|err| JsValue::from_str(&format!("Failed to prove program: {:?}", err)))
}

#[wasm_bindgen]
pub fn verify_program(code: &str, inputs: &str, outputs: &str, proof: Vec<u8>) -> Result<u32, JsValue> {
    let result = verify_program_native(code, inputs, outputs, proof)
        .map_err(|err| format!("Failed to generate execution trace - {:?}", err))?;
    Ok(result.into())
}
