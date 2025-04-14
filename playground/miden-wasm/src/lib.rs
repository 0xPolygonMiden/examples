extern crate alloc;

mod utils_debug;
mod utils_input;
mod utils_program;
mod backend;
mod types;

#[cfg(target_arch = "wasm32")]
mod wasm;

pub use backend::*;
