use alloc::vec::Vec;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Clone)]
pub struct Outputs {
    pub program_hash: String,
    pub stack_output: Vec<u64>,
    pub cycles: Option<usize>,
    pub trace_len: Option<usize>,
    pub proof: Option<Vec<u8>>,
}