use crate::utils_input::Inputs;
use crate::utils_program::MidenProgram;
use miden_vm::{
    math::{Felt, StarkField},
    VmState, VmStateIterator,
};
use wasm_bindgen::prelude::*;

// Debugging the program
#[wasm_bindgen]
pub struct DebugExecutor {
    vm_state_iter: VmStateIterator,
    vm_state: VmState,
}

#[wasm_bindgen]
pub enum DebugCommand {
    PlayAll,
    Play,
    RewindAll,
    Rewind,
    PrintState,
    PrintStack,
    PrintMem,
    PrintMemAddress,
    Clock,
}

#[wasm_bindgen]
impl DebugExecutor {
    // CONSTRUCTOR
    // --------------------------------------------------------------------------------------------
    /// Returns a new DebugExecutor for the specified program, inputs and advice provider.
    ///
    /// # Errors
    /// Returns an error if the command cannot be parsed.
    #[wasm_bindgen(constructor)]
    pub fn new(code_frontend: &str, inputs_frontend: &str) -> Result<DebugExecutor, String> {
        // Parse inputs
        console_error_panic_hook::set_once();

        let mut program = MidenProgram::new(code_frontend, true);
        program.compile_program().unwrap();

        let mut inputs = Inputs::new();
        inputs.deserialize_inputs(inputs_frontend).unwrap();

        let mut vm_state_iter = miden_vm::execute_iter(
            &program.program.unwrap(),
            inputs.stack_inputs,
            inputs.advice_provider,
        );

        let vm_state = vm_state_iter
            .next()
            .ok_or(format!(
                "Failed to instantiate DebugExecutor - `VmStateIterator` is not yielding!"
            ))?
            .expect("initial state of vm must be healthy!");

        Ok(Self {
            vm_state_iter,
            vm_state,
        })
    }

    // MODIFIERS
    // --------------------------------------------------------------------------------------------

    /// executes a debug command against the vm in it's current state.
    pub fn execute(&mut self, command: DebugCommand, param: Option<u64>) -> String {
        match command {
            //DebugCommand::PlayAll
            DebugCommand::PlayAll => {
                while let Some(new_vm_state) = self.next_vm_state() {
                    self.vm_state = new_vm_state;
                }
                self.print_vm_state()
            }
            //DebugCommand::Play(cycles)
            DebugCommand::Play => {
                for _cycle in 0..param.unwrap() {
                    match self.next_vm_state() {
                        Some(next_vm_state) => {
                            self.vm_state = next_vm_state;
                        }
                        None => break,
                    }
                }
                self.print_vm_state()
            }
            //DebugCommand::RewindAll
            DebugCommand::RewindAll => {
                while let Some(new_vm_state) = self.prev_vm_state() {
                    self.vm_state = new_vm_state;
                }
                self.print_vm_state()
            }
            //DebugCommand::Rewind(cycles)
            DebugCommand::Rewind => {
                for _cycle in 0..param.unwrap() {
                    match self.prev_vm_state() {
                        Some(new_vm_state) => {
                            self.vm_state = new_vm_state;
                        }
                        None => break,
                    }
                }
                self.print_vm_state()
            }
            //DebugCommand::PrintState
            DebugCommand::PrintState => self.print_vm_state(),
            //DebugCommand::PrintStack
            DebugCommand::PrintStack => self.print_stack(),
            //DebugCommand::PrintMem
            DebugCommand::PrintMem => self.print_memory(),
            //DebugCommand::PrintMemAddress(address)
            DebugCommand::PrintMemAddress => self.print_memory_entry(param.unwrap()),
            //DebugCommand::Clock
            DebugCommand::Clock => format!("{}", self.vm_state.clk),
        }
    }

    /// iterates to the next clock cycle.
    fn next_vm_state(&mut self) -> Option<VmState> {
        match self.vm_state_iter.next() {
            Some(Ok(vm_state)) => Some(vm_state),
            Some(Err(err)) => {
                println!("Execution error: {err:?}");
                None
            }
            None => {
                println!("Program execution complete.");
                None
            }
        }
    }

    /// iterates to the previous clock cycle.
    fn prev_vm_state(&mut self) -> Option<VmState> {
        match self.vm_state_iter.next_back() {
            Some(prev_vm_state_result) => prev_vm_state_result.ok(),
            None => None,
        }
    }

    // ACCESSORS
    // --------------------------------------------------------------------------------------------

    /// print general VM state information.
    pub fn print_vm_state(&self) -> String {
        format!("{}", self.vm_state)
    }

    /// print all stack items.
    pub fn print_stack(&self) -> String {
        let mut res =
            self.vm_state
                .stack
                .iter()
                .enumerate()
                .fold(String::new(), |mut s, (i, f)| {
                    s.push_str(&format!("[{i}] {f}\n"));
                    s
                });
        res.pop(); // removes unnecessary line-break
        res
    }

    /// print all memory entries.
    pub fn print_memory(&self) -> String {
        let mem_result = String::new();
        for (address, mem) in self.vm_state.memory.iter() {
            format!("{}{}", mem_result, Self::print_memory_data(address, mem));
        }
        return mem_result;
    }

    /// print specified memory entry.
    pub fn print_memory_entry(&self, address: u64) -> String {
        let entry = self
            .vm_state
            .memory
            .iter()
            .find_map(|(addr, mem)| match address == *addr {
                true => Some(mem),
                false => None,
            });

        match entry {
            Some(mem) => Self::print_memory_data(&address, mem),
            None => format!("memory at address '{address}' not found"),
        }
    }

    // HELPERS
    // --------------------------------------------------------------------------------------------

    /// print memory data.
    fn print_memory_data(address: &u64, memory: &[Felt]) -> String {
        let mem_int = memory.iter().map(|&x| x.as_int()).collect::<Vec<_>>();
        return format!("{address} {mem_int:?}");
    }
}
